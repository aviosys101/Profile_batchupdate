var dev_list_tf = [];
ippower_list_tf = dev_list_tf;
/*
let iputils = {
};

const os = require('os');
*/

let iputils_tf = {
};

//Listening on port 4000 for TF device
function tf_server() {
    var dgram = require("dgram");
    var server = dgram.createSocket("udp4");

    server.on("error", function (err) {
        //console.log("server error:\n" + err.stack);
        const { dialog } = require('electron')
        var msg = "server error:\n" + err.stack;
        
        console.log(dialog.showErrorBox("Warning", msg));
        server1.close();
    });

    server.on("message", function (msg, rinfo) {
        console.log("server TF got: " + msg + " from " +
            rinfo.address + ":" + rinfo.port);
        handleRecvData_tf(Buffer.from(msg));
    });

    server.on("listening", function () {
        var address = server.address();
        console.log("server listening " +
            address.address + ":" + address.port);
    });

    server.bind(4000);

}

function send_brocast_main_tf(msg) {

    global.ippower_list_tf.length=0;
    send_brocast_tf(msg);

}

function send_brocast_tf(msg) {
    var port = 4000;
    var allhost = '255.255.255.255';
    var brocastAddrArray = getBrocastAddrArray();
    var brocast_addr;
   
    for(let i=0; i<brocastAddrArray.length; i++) {
        brocast_addr = brocastAddrArray[i];
        send_brocast_tf_by_ip(brocast_addr, port, msg);
    }
   
    send_brocast_tf_by_ip(allhost, port, msg);
}
//
function send_brocast_tf_by_ip(brocast_addr, port, msg) {
    var brocast_dgram = require('dgram');
    var client = brocast_dgram.createSocket('udp4');
   
    client.bind(function(){
        client.setBroadcast(true);        
    });
    var sendMsg = Buffer.from(msg, "latin1");
    client.send(sendMsg, 0, sendMsg.length, port, brocast_addr, function(err, bytes){
        if(err) throw err;
        console.log('searching tf msg has been sent ' + bytes + ' bytes');
        client.close();
    });
}
//    
function handleRecvData_tf(data) {

    //console.log(data);
    var Compare_data=data;
    if(data.length > 50) {        
        if(Compare_data.indexOf("IPCam")==0) { //TF331系列
            addInfo_tf(data);	   
        } 
        if(Compare_data.indexOf("IPCamReply")==0) { //帳密錯誤
            checkInfo_tf(data);     
        }
        if(Compare_data.indexOf("PCEdit")==0) { //editor_tf執行正確
            checkInfo_tf(data);
        }
    }
}

function addInfo_tf(data) {
    
    var dev = {
        name:"",
        mac:"007688006666",
        ip:"0.0.0.0",
        httpPort:"",
        netmask:"",
        gateway:"",
        dhcp:"",
        version:"",
        bWifi:false
    }

    var Compare_data=data;
    var Compare_str="eth1";
    var str_len=Compare_str.length;
    var index=Compare_data.indexOf(Compare_str);
    dev.ip=data[index+str_len]+'.'+data[index+str_len+1]+'.'+data[index+str_len+2]+'.'+data[index+str_len+3];
    //console.log('IP:'+dev.ip);

    index+=(str_len+4);
    dev.mac=iputils_tf.DecimalToHex(data[index])+'-'+iputils_tf.DecimalToHex(data[index+1])+'-'+iputils_tf.DecimalToHex(data[index+2])+'-'+iputils_tf.DecimalToHex(data[index+3])+'-'+iputils_tf.DecimalToHex(data[index+4])+'-'+iputils_tf.DecimalToHex(data[index+5]);
    //console.log('MAC:'+dev.mac);

    index+=6;
    dev.netmask=data[index]+'.'+data[index+1]+'.'+data[index+2]+'.'+data[index+3];
    //console.log('Mask:'+dev.netmask);

    Compare_str="gw";
    str_len=Compare_str.length;
    index=Compare_data.indexOf(Compare_str);
    dev.gateway=data[index+str_len]+'.'+data[index+str_len+1]+'.'+data[index+str_len+2]+'.'+data[index+str_len+3];
    //console.log('GatWay:'+dev.gateway);

    index+=(str_len+4+1);
       for(i=0;i<18;i++) {        
        if((data[index+i]==0x00) || (data[index+i]==0xff)) {
            break; 
        } else {
            dev.name+=String.fromCharCode(data[index+i]);
        }        
    }
    //console.log('Name:'+dev.name);

    index+=18;    
    var tempt=String.fromCharCode(data[index])+String.fromCharCode(data[index+1])+String.fromCharCode(data[index+2])+String.fromCharCode(data[index+3])+String.fromCharCode(data[index+4]);
    dev.httpPort=parseInt(tempt);
    //console.log('httpPort :'+dev.httpPort);
    
    index+=5;
    dev.version=String.fromCharCode(data[index])+String.fromCharCode(data[index+1])+String.fromCharCode(data[index+2])+String.fromCharCode(data[index+3])+String.fromCharCode(data[index+4]);
    //console.log('Ver:'+dev.version);

    index+=6;
    //dev.dhcp=String.fromCharCode(data[index])+String.fromCharCode(data[index+1])+String.fromCharCode(data[index+2]);
    for(i=0;i<3;i++) {        
        if((data[index+i]==0x00) || (data[index+i]==0xff)) {
            break; 
        } else {
            dev.dhcp+=String.fromCharCode(data[index+i]);
        } 
    }
    //console.log('dhcp:'+dev.dhcp);

    var exist = false;
    for(var i=0; i<ippower_list_tf.length; i++) {
        if(ippower_list_tf[i].mac == dev.mac && ippower_list_tf[i].bWifi == dev.bWifi) {
            exist = true;
        }
    }
    
    if(!exist) {
        global.ippower_list_tf.push(dev);
    }
    console.log(global.ippower_list_tf);
    refresh_tf_lan_table();
}

function checkInfo_tf(data) {
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
    var index=6;
    var Compare_data=data;
    var Compare_str="eth1";  
    var index= Compare_data.indexOf(Compare_str);
    if(index==7) { // PCEdit eth1
        console.log("upload success");
    } else {
        index=11;
        dev.mac=iputils_tf.DecimalToHex(data[index])+'-'+iputils_tf.DecimalToHex(data[index+1])+'-'+iputils_tf.DecimalToHex(data[index+2])+'-'+iputils_tf.DecimalToHex(data[index+3])+'-'+iputils_tf.DecimalToHex(data[index+4])+'-'+iputils_tf.DecimalToHex(data[index+5]);
        var msg = dev.mac;
        var myDate = new Date();
        msg = myDate.toLocaleString( ) + " " + msg;     
        var status = document.getElementById("status");  
        msg += " User Name or Password error" + "\r\n";
        //alert(msg);
        status.value += msg;  
    }
    send_brocast_main_tf('PCEdit\2');  
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('close_edit_window', "please close editor window");      
}

function refresh_tf_lan_table() {
    var tbody=document.getElementById("lan_tbody_tf");
    var childs = tbody.childNodes; 
    for(let i = childs.length - 1; i >= 0; i--) { 
        //alert(childs[i].nodeName); 
        tbody.removeChild(childs[i]); 
    } 

    for(let i=0;i<ippower_list_tf.length;i++)  {
        var tr=document.createElement("tr");
        tbody.appendChild(tr);
       
        for(var k in ippower_list_tf[i])   
        {
            if(k == "httpPort"){
                continue;
            }
            var td=document.createElement("td");  
            tr.appendChild(td);
            
            if(k == "ip") {//ip
                td.innerHTML="<a class='dev_tf_url' href='http://" + ippower_list_tf[i][k] + ":" + ippower_list_tf[i]['httpPort'] + "'>" + ippower_list_tf[i][k] + ":"+ippower_list_tf[i]['httpPort'] + "</a>";
            }else {
                td.innerHTML=ippower_list_tf[i][k]; 
            }
        }
      
        var td=document.createElement("td");
        tr.appendChild(td);
        td.innerHTML="<a class='edit_tf' id=" + i + " href='javascript:;'>Edit</a>";//bind id
    }
    var as=document.querySelectorAll(".edit_tf");
    for(let i=0; i<as.length;i++) {
        as[i].onclick=function(i)
        {
            var index = this.id;
            createEditWindow_tf(ippower_list_tf[index]);
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
    const { shell } = require('electron');
  
    const links = document.querySelectorAll('.dev_tf_url');    
    links.forEach(link => {
        link.addEventListener('click', e => {
            const url = link.getAttribute('href');
            e.preventDefault();
            shell.openExternal(url);
        });
    });    
    
}

function createEditWindow_tf(dev) {    
    const { ipcRenderer } = require('electron');
    ipcRenderer.on('open_tf_edit_window', (event, arg) => {
        console.log(arg);
    });
    ipcRenderer.send('open_tf_edit_window', dev);

}

//十進制轉十六進制
iputils_tf.DecimalToHex = function(DecimalNumber){
    var Hexspace=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    var HexNumber=Hexspace[Math.floor(DecimalNumber/16)]+Hexspace[Math.floor(DecimalNumber%16)];
    return HexNumber;
}

function test_network() {
   
}

// module.exports = {
//     send_brocast,
//     tf_server
// }