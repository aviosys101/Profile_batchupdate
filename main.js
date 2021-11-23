//const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app
const {download} = require("electron-dl");
const {screen,dialog,shell,net,autoUpdater } = require('electron')
const FormData = require('form-data')
const fs = require('fs')

//var searcher = require('./searcher');
let win = null;
 
function createWindow () {
   win = new BrowserWindow({
    width: 1100,//850,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }    
  })

   // Set menu to window
   const menu = Menu.buildFromTemplate(template)
   Menu.setApplicationMenu(menu)

  //win.webContents.openDevTools() //Debug Tools
  win.loadFile('index.html')
  //searcher.send_brocast_mtk();
}

var template = [{
  label: 'Search',
  submenu: [{
    label: 'Lan Search',
    accelerator: 'CmdOrCtrl+L',
//    click:()=>searcher.send_brocast()
      click:()=>win.webContents.send('lan_search', "searching from menu")      
/*  },{
      type: 'separator'
    },{
    label: 'Internet Search',
    accelerator: 'CmdOrCtrl+I',
*/    
  }]
}, {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Help',
    click: function () {
      electron.shell.openExternal('http://www.aviosys.com')
    }},
    { type: 'separator' },
    {label:'🔧Debug' ,  role:'toggleDevTools' }    
  ]
}];


app.whenReady().then(() => {

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()      
    }
  })

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('lan_search', "searchering from main star");    
  })
  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const { ipcMain } = require('electron')
let edit_win = null;
ipcMain.on('open_edit_window', (event, arg) => {
  console.log(arg);
  event.reply('open_edit_window', 'open edit window ok');

  //const { BrowserWindow } = require('electron');
  edit_win = new BrowserWindow({ 
    width: 500,
    height: 600,
    show: false ,
    webPreferences: {
      //preload: path.join(__dirname, 'edit_preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  edit_win.removeMenu();
  //edit_win.webContents.openDevTools()
  edit_win.loadFile('editor_mtk.html');
  edit_win.once('ready-to-show', () => {
    edit_win.webContents.send('load_data', arg); 
    edit_win.show();    
  })

})

ipcMain.on('close_edit_window', (event, arg) => {
  console.log(arg); 
  //Albert 2021/06/01 begin
   try {
    edit_win.close();
  }catch(err) {
  }
   //Albert 2021/06/01 end
})
//Albert 2021/11/12 begin 
ipcMain.on('DownLoad_Configuration', (event,argip,argmac,argpass) => {  
  //download();
  //download(BrowserWindow.getFocusedWindow(), 'http://'+argpass+'@'+argip+'/cgi-bin/ExportSettings.sh', {directory: __dirname+"\\Config\\"+argmac});
  download(BrowserWindow.getFocusedWindow(), 'http://'+argpass+'@'+argip+'/cgi-bin/ExportSettings.sh', {directory: "C:\\Config\\"+argmac});
  event.reply('DownLoad_Configuration', 'DownLoad ok');
})

ipcMain.on('UpLoad_Configuration', (event,argip,argmac,argpass) => {  
  var filepath="";
  dialog.showOpenDialog({
      filters: [{name: 'All Files',extensions: ['*']}],
      //defaultPath: __dirname+"\\Config\\"+argmac+"\\IPPower_Settings.dat",
      defaultPath: "C:\\Config\\"+argmac+"\\IPPower_Settings.dat",  
      properties: ['openFile']}).then(result => {
          filepath=result.filePaths[0];
          console.log(filepath);
          event.reply('UpLoad_path', filepath);
      })      
  event.reply('UpLoad_Configuration', 'UpLoad ok');
})

ipcMain.on('Exec_Config', (event,argip,argmac,argpass,argfilepath) => {
  //Albert 2021/11/15 Upload Configuration begin
  const boundaryKey = '----WebKitFormBoundaryq5TPfSCXuGeAhyLM';
  const form=new FormData();
  //form.append('lan_ipaddr','10.33.122.3');
  form.append('filename', fs.createReadStream(argfilepath));
  const requestApi = {
    method: 'POST',
    protocol: 'http:',
    hostname: argip,
    path:'/cgi-bin/upload_settings.cgi'
  };
  var request = net.request(requestApi);
  request.setHeader("Content-Type",'multipart/form-data; boundary=' + boundaryKey);
  request.setHeader("Connection","keep-alive");
  request.setHeader("Authorization","Basic "+argpass);
  request.setHeader("Referer",'http://'+argip+'/System/management.shtml');
            
  form.pipe(request, { end: false });
  form.on('end', function () {
    console.log("end");  
    request.end('\r\n--' + boundaryKey + '--\r\n');        
  });        
  request.on('response',(response) => {    
    console.log(`STATUS: ${response.statusCode}`);
  })    
  //Albert 2021/11/15 Upload Configuration end  
})
//Albert 2021/11/12 end

//Albert 2021/05/27 begin
/*
ipcMain.on('open_tf_edit_window', (event, arg) => {
  console.log(arg);
  event.reply('open_tf_edit_window', 'open tf edit window ok');

  edit_win = new BrowserWindow({ 
    width: 500,
    height: 600,
    show: false ,
    webPreferences: {
      //preload: path.join(__dirname, 'edit_preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  edit_win.removeMenu();
  //edit_win.webContents.openDevTools()
  edit_win.loadFile('editor_tf.html');
  edit_win.once('ready-to-show', () => {
    edit_win.webContents.send('load_tf_data', arg);
    edit_win.show()  
  })

})
*/
//Albert 2021/05/27 end


// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })
