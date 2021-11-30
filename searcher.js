var dev_list = [];
ippower_list = dev_list;

let iputils = {
};

const os = require('os');
const { electron } = require('process');
const http=window.require("http");

//Listening on port 9999 for mtk device
function mtk_server() {
    var dgram = require("dgram");
    var server = dgram.createSocket("udp4");

    server.on("error", function (err) {
        //console.log("server error:\n" + err.stack);
        //const { dialog, BrowserWindow, MenuItem, webContents, BrowserWindow } = require('electron')
        var msg = "server error:\n" + err.stack;
        
        console.log(dialog.showErrorBox("Warning", msg));
        server.close();
    });

    server.on("message", function (msg, rinfo) {
        console.log("server got: " + msg + " from " +
            rinfo.address + ":" + rinfo.port);
        handleRecvData(msg.toString());
    });

    server.on("listening", function () {
        var address = server.address();
        console.log("server listening " +
            address.address + ":" + address.port);
    });

    server.bind(9999);

}

function send_brocast(msg) {
    
    global.ippower_list.length=0;
    send_brocast_mtk(msg);

}

function send_brocast_mtk(msg) {
    var port = 10000;
    var allhost = '255.255.255.255';
    var brocastAddrArray = getBrocastAddrArray();
    var brocast_addr;
   
    for(let i=0; i<brocastAddrArray.length; i++) {
        brocast_addr = brocastAddrArray[i];
        send_brocast_by_ip(brocast_addr, port, msg);
    }
    
    send_brocast_by_ip(allhost, port, msg);
}

function send_brocast_by_ip(brocast_addr, port, msg) {
    var brocast_dgram = require('dgram');
    var client = brocast_dgram.createSocket('udp4');
   
    client.bind(function(){
        client.setBroadcast(true);        
    });
    var sendMsg = Buffer.from(msg, "latin1");
    client.send(sendMsg, 0, sendMsg.length, port, brocast_addr, function(err, bytes){
        if(err) throw err;
        console.log('searching msg has been sent ' + bytes + ' bytes');
        client.close();
    });
}
  
  //IPREPLY,0,00-76-23-00-00-20,192.168.31.123:80,255.255.255.0,192.168.31.1,IP_POWER,ON,v1.27_663
function handleRecvData(data) {
    
    var result = data.split(",");
    if(result.length == 9 || result.length == 7 ) {
        if( result[0] == "IPREPLY" || result[0] == "IPREPLYW" || result[0] == "IMAGIAREPLY") {
        if( result[1] == "0" ) {	
            addInfo(result);		
            //console.log(result);	
        }
        }
    }else if(result.length == 10 || result.length == 8) {
        if( result[0] == "IPREPLY"  || result[0] == "IPREPLYW" || result[0] == "IMAGIAREPLY") {
        checkInfo(result);		
        console.log(result);			
        }
    }else{
        console.log("Error reply message!");	
    }

}


function addInfo(data) {
    
    var dev = {
        name:"ippower",
        mac:"007688006666",
        ip:"0.0.0.0",
        httpPort:80,
        netmask:"",
        gateway:"",
        dhcp:"",
        version:"",
        bWifi:false
    
    }
  
    if(data.length != 7 && data.length != 9) {
        return;
    }
    dev.name = data[6];
    // dev.mac = data[2].replace(/-/g, "");
    // var tmp = dev.mac;
    // dev.mac = tmp.replace(/\s+/g,"0");
    dev.mac = data[2];
  //  dev.ip = data[3];
    dev.ip = data[3].substring(0, data[3].indexOf(':'));  
    dev.netmask = data[4];
	dev.gateway = data[5];
    if(data.length == 9) {
        dev.dhcp =  data[7];
        if(dev.dhcp == "1") {
            dev.dhcp = "ON";
        }else if(dev.dhcp == "0"){
            dev.dhcp = "OFF";
        }
        dev.version = data[8];
    }else {
        dev.dhcp = "";
        dev.version = "";
    }
    if( data[0] == "IPREPLY" ) {
        dev.bWifi = false;
    }else if(data[0] == "IPREPLYW") {
        dev.bWifi = true;
    }
    
    var tempt = data[3].substring(data[3].indexOf(':')+1, data[3].length);
    try{
        tempt = tempt.trim();
        dev.httpPort =  parseInt(tempt);
    }catch(err) {
        dev.httpPort = 8080;
    }
    var exist = false;
    for(var i=0; i<ippower_list.length; i++) {
        if(ippower_list[i].mac == dev.mac && ippower_list[i].bWifi == dev.bWifi) {
            exist = true;
        }
    }
    if(!exist) {
        global.ippower_list.push(dev);
    }
    console.log(global.ippower_list);    
    refresh_lan_table();
}

function checkInfo(data) {
    var dev = {
        devMac:"",
        devIp:"",
        devNetMask:"",
        devGateWay:"",
        devName:"",
        devReply:"",
        dhcpState:"",
        bWifi:false,
        httpPort:8080,
    };
    if(data.length != 8 && data.length != 10) {
        return;
    }
    var replyTypeStr;	       
    replyTypeStr = data[1];
    var reply;
    try{
        replyTypeStr = replyTypeStr.trim();
        reply = parseInt(replyTypeStr);
    }catch(e) {
        reply = 0;
    }
    
    dev.devMac = data[2].replace("-", "");
    var tmp = dev.devMac;
    dev.devMac = tmp.replace(" ", "0");
    
    dev.devIp = data[3];
    dev.devNetMask = data[4];
    dev.devGateWay = data[5];
    dev.devName = data[6];
    dev.devReply = data[7];
    if(data.length == 10) {
        dev.dhcpState =  data[8];
    }else {
        dev.dhcpState = "";
    }
    if( data[0] == "IPREPLY") {
        dev.bWifi = false;
    }else if(data[0] == "IPREPLYW") {
        dev.bWifi = true;
    }
    var tempt = data[3].substring(data[3].indexOf(':')+1, data[3].length);
    try{
        tempt = tempt.trim();
        dev.httpPort =  parseInt(tempt);
    }catch(e) {
        dev.httpPort = 8080;
    }
    
    var msg = dev.devName;
    var myDate = new Date();
    msg = myDate.toLocaleString( ) + " " + msg; 
    switch(reply) {
    case 1:
        msg += " IP/Netmask/Gateway ";
        break;
    case 3:
        msg += " " + "device name" + " "; 
        break;
    case 4:
        msg += " " + "port" + " ";
        break;
    case 5:
        msg += " DHCP ";
        break;
    default:
        msg += " " + "network settings" + " ";
        break;	
    }

    dev.devReply = dev.devReply.toLowerCase();
    var status = document.getElementById("status");    
   
    if(dev.devReply == "success") {
        msg += "update successfully. Device is performing the operation, later will update the device list, please wait..." + "\r\n";
        //alert(msg);    
        console.log(msg);
        status.value += msg;
        //reflesh table   
        send_brocast('IPQUERY,0');
    }else {
        msg += " update Failed" + "\r\n";
        //alert(msg);
        status.value += msg;
    } 
    const { ipcRenderer, dialog } = require('electron');
    ipcRenderer.send('close_edit_window', "please close editor window");    
}

function refresh_lan_table() {
    
    var tbody=document.getElementById("lan_tbody");
    var childs = tbody.childNodes; 
    for(let i = childs.length - 1; i >= 0; i--) { 
        //alert(childs[i].nodeName); 
        tbody.removeChild(childs[i]); 
    } 

    for(let i=0;i<ippower_list.length;i++)  {
        var tr=document.createElement("tr");
        tbody.appendChild(tr);
       
        for(var k in ippower_list[i])   
        {
            if(k == "httpPort"){
                continue;
            }
            var td=document.createElement("td");  
            tr.appendChild(td);
            
            if(k == "ip") {//ip
                td.innerHTML="<a class='dev_url' href='http://" + ippower_list[i][k] + ":" + ippower_list[i]['httpPort'] + "'>" + ippower_list[i][k] + ":"+ippower_list[i]['httpPort'] + "</a>";
            }else {
                td.innerHTML=ippower_list[i][k]; 
            }
        }
      
        var td=document.createElement("td");
        tr.appendChild(td);
        td.innerHTML="<a class='edit' id=" + i + " href='javascript:;'>Edit</a>";//bind id
        var td=document.createElement("td");
        tr.appendChild(td);
        td.innerHTML="<a class='download' id=" + i + " href='javascript:;'>DL</a>";
        var td=document.createElement("td");
        tr.appendChild(td);
        td.innerHTML="<a class='upload' id=" + i + " href='javascript:;'>UL</a>";        
    }
    var as=document.querySelectorAll(".edit");    
    for(let i=0; i<as.length;i++) {
        as[i].onclick=function(i)
        {
            var index = this.id;
            createEditWindow(ippower_list[index]);
            //alert(this.parentNode.parentNode.getElementsByTagName("td")[2].innerHTML);            
            // var exec = require('child_process').exec; 
            // var cmdStr = 'rundll32 url.dll,FileProtocolHandler http://'+ this.parentNode.parentNode.getElementsByTagName("td")[2].innerHTML;      
            // exec(cmdStr, function(err,stdout,stderr){
            //     if(err) {
            //         console.log('open browser error:'+stderr);
            //     } else {
            //     }
            // });
        }
    } 

    var dl=document.querySelectorAll(".download");
    for(let i=0; i<dl.length; i++) {
        dl[i].onclick=function(i) {
            var index = this.id; 
            ResponseDevice_dl(ippower_list[index].ip,ippower_list[index].mac);           
            //shell.openExternal('http://admin:1234@'+ ippower_list[index].ip +'/cgi-bin/ExportSettings.sh');        
        }        
    }

    var ul=document.querySelectorAll(".upload");
    for(let i=0; i<ul.length; i++) {
        ul[i].onclick=function(i) {
            var index = this.id;        
             ResponseDevice_ul(ippower_list[index].ip,ippower_list[index].mac,ippower_list[index].version);
        }
    }    
    const { shell } = require('electron');
  
    const links = document.querySelectorAll('.dev_url');    
    links.forEach(link => {
        link.addEventListener('click', e => {
            const url = link.getAttribute('href');
            e.preventDefault();
            shell.openExternal(url);
        });
    });

}

function createEditWindow(dev) {
    const { ipcRenderer } = require('electron');
    ipcRenderer.on('open_edit_window', (event, arg) => {
        console.log(arg);
    });
    ipcRenderer.send('open_edit_window', dev);

}

//Albert 2021/11/12 DownLoad Configuration
function ResponseDevice_dl(devip,devmac) {
    const { ipcRenderer } = require('electron');  
    var configpass=document.getElementById('Comuser').value+':'+document.getElementById('Compass').value;
    var status = document.getElementById("status");
    var msg1 = "[ "+devip+" ]";
    var myDate1 = new Date();
    msg1 = myDate1.toLocaleString( ) + " " + msg1;     
    ipcRenderer.on('DownLoad_Configuration', (event, arg) => {
        msg1 += " download Configuration file to "+ arg +" OK...\r\n";
        status.value += msg1; 
        console.log(arg);
    });  
    let cmdstat='http://'+configpass+'@'+devip+'/GetPower.cgi?';
    let res=http.get(cmdstat,(response) => {
        console.log("response:"+response.statusCode);
        if(response.statusCode==200) {                   
            ipcRenderer.send('DownLoad_Configuration',devip,devmac,configpass);
        } else {  
            msg1 += " UserName or Password error !!" + "\r\n";
            status.value += msg1;        
        }
    })    
}
//Albert 2021/11/15 UpLoad Configuration
function ResponseDevice_ul(devip,devmac,devversion) {
    const { ipcRenderer } = require('electron');
    var configpass=document.getElementById('Comuser').value+':'+document.getElementById('Compass').value;
    ipcRenderer.on('UpLoad_Configuration', (event, arg) => {
        console.log(arg);
    });
    ipcRenderer.send('UpLoad_Configuration',devip,devmac,configpass);
    var status = document.getElementById("status");    
    ipcRenderer.once('UpLoad_path', (event, filepath) => {
        console.log(filepath);  
        var msg1 = "[ "+devip+" ]";        
        var myDate1 = new Date();
        msg1 = myDate1.toLocaleString( ) + " " + msg1;         
        if(filepath==undefined) {            
            msg1 += " No file selected !!" + "\r\n";        
            status.value += msg1; 
        } else {
            let cmdstat='http://'+configpass+'@'+devip+'/GetPower.cgi?';
            let res=http.get(cmdstat,(response) => {
                console.log("response:"+response.statusCode);                
                if(response.statusCode==200) {    
                    var iend=devversion.toString().search("\\["); 
                    if(iend!=-1) devversion=devversion.toString().substr(0,iend-1);  
                    ipcRenderer.send('Exec_Config',devip,devmac,window.btoa(configpass),filepath,devversion);
                    //msg1 += " Upload Configuration file "+ __dirname+"\\Config\\"+devmac+"\\IPPower_Settings.dat OK..." + "\r\n";
                    msg1 += " Upload Configuration file "+ filepath + " OK...\r\n";
                    status.value += msg1;                    
                } else {  
                    msg1 += " UserName or Password error !!" + "\r\n";
                    status.value += msg1;        
                }
            })      
        }
    }); 
}

function getBrocastAddrArray() {
    var brocastIP;
    var brocastAddrArray = [];
    var ifaces=os.networkInterfaces();
    //console.log(ifaces);

    for (var dev in ifaces) {
        let iface = ifaces[dev];

        for (let i = 0; i < iface.length; i++) {
            let {family, address, netmask, internal} = iface[i];

            if (family === 'IPv4' && address !== '127.0.0.1' && address !== '0.0.0.0' && !internal) {
        
                var netAddr = iputils.getNetAddress(address,netmask);
                var localNum = iputils.getLocalNumber(netmask);
                var brocastIP = iputils.getBroadcastAddress(netAddr, localNum);
                brocastAddrArray.push(brocastIP);
            }
        } 
    }
    return brocastAddrArray;
}


iputils.getNetAddress = function(ip, subnetMask) {
    var ip_str = '';
    var ip_arr = ip.split(".");
    var mask_arr = subnetMask.split(".");

    var ip2 = Number(ip_arr[2]);
    var ip3 = Number(ip_arr[3]);
    var mask2 = Number(mask_arr[2]);
    var mask3 = Number(mask_arr[3]);
 
    ip_str=(ip2&mask2)+"."+(ip3&mask3);
    ip_str = ip_arr[0]+"."+ip_arr[1]+"."+ip_str;
    return ip_str;
}

//获取广播地址
iputils.getBroadcastAddress = function(netAddress, localNumber){
	var netArr = netAddress.split(".");
	var length = netArr.length;
	var more = localNumber%8;
	var except = parseInt(localNumber/8);
	if(more!=0)
		++except;
	except = length - except;
	for(var i=except;i<length;i++) {
		var netPart = Number(netArr[i]);
		var temp = iputils.convertBinary(netPart);
		if(""==temp) {
			temp="00000000";
		}
		if(i==except) {
			if(more==0) {
				temp="11111111";
			}else {
				temp = temp.substring(0,8-more)+iputils.getNumber(more);
			}
			var result = Number(temp);
			result = iputils.binaryToDecimal(result);
			netArr[i]=result+"";
		}else {
			netArr[i]="255";
		}
	}
	return netArr.join(".");
}

//获取主机位0的个数
iputils.getLocalNumber = function(subnetMask){
    var maskArr = subnetMask.split(".");
    var length = maskArr.length;
    for(var i=0;i<length;i++) {
        var maskPart = Number(maskArr[i]);
        var temp = iputils.convertBinary(maskPart);
        if("11111111"!=temp) {
            var index = temp.lastIndexOf("1")+1;
            var result = (8-index)+(length-i-1)*8;
	    return result;
	}
    }
    return 0;
}
//转成二进制
iputils.convertBinary = function(sum){
    var binary = "";
    while (sum != 0 && sum != 1) {
	    binary=binary.slice(0,1)+(sum % 2)+binary.slice(1)
        sum = parseInt(sum / 2);
        if (sum == 0 || sum == 1) {
        	binary=binary.slice(0,1)+(sum % 2)+binary.slice(1)
        }
    }
    return binary.toString();
}
//获取1的字符串
iputils.getNumber = function(number){
	var result = "";
	for(var i=0;i<number;i++) {
		result="1"+result;
	}
	return result;
}

//二进制转十进制
iputils.binaryToDecimal = function(binaryNumber){
    var decimal = 0;
    var p = 0;
    while(true){
      if(binaryNumber == 0){
	    break;
      }else {
	    var temp = binaryNumber%10;
	    decimal += temp*Math.pow(2, p);
	    binaryNumber = parseInt(binaryNumber/10);
	    p++;
       }
    }
    return decimal;
}




function test_network() {
   
}

// module.exports = {
//     send_brocast,
//     mtk_server
// }