// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain ,dialog } = require('electron')
// const { remote } = require('electron').remote;
const path = require('path');
const child_process = require('child_process');


const fs = require("fs");

try {
	require('electron-reloader')(module);
} catch {}
let mainWindow ;
let openfilePath ;
const createWindow = () => {
  // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1000 ,
      height: 1024,
      minWidth : 600 ,
      minHeight : 400 ,
        frame : false ,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: false,
    }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    // change the icons when the window is maximized 
    mainWindow.on("maximize" ,()=>{
    mainWindow.webContents.send("isMaximized")
    })
  
    mainWindow.on("unmaximize", ()=>{
      mainWindow.webContents.send("isRestored")
    });
  }
function run_script(command, args, callback) {
  var child = child_process.spawn(command, args, {
      encoding: 'utf8',
      shell: true
  });
  child.on('error', (error) => {
    dialog.showMessageBox({
        title: 'Title',
        type: 'warning',
        message: 'Error occured.\r\n' + error
    });
});
child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        //Here is the output
        data=data.toString();   
        console.log("data"+data);   
        mainWindow.webContents.send("outputcmd" , data);
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        // Return some data to the renderer process with the mainprocess-response ID
        // mainWindow.webContents.send('mainprocess-response', data);
        mainWindow.webContents.send("outputcmd" , data);
        //Here is the output from the command
        console.log(data);  
    });
    child.on('close', (code) => {
      //Here you can get the exit code of the script  
      switch (code) {
          case 0:
              dialog.showMessageBox({
                  title: 'Title',
                  type: 'info',
                  message: 'End process.\r\n'
              });
              break;
      }

  });
  if (typeof callback === 'function')
      callback();
}
ipcMain.on("runcommand",(_ ,filepath)=>{
  // console.log(filepath);
  // run_script(" ",["C:\\Users\\ILYES\\CompilTp\\lexANDyacc\\out.exe<C:\\Users\\ILYES\\CompilTp\\lexANDyacc\\Examples\\Cinput1.txt"],null);
  // 
  // run_script("gcc C:\\Users\\ILYES\\CompilTp\\lexANDyacc\\lex.yy.c  C:\\Users\\ILYES\\CompilTp\\lexANDyacc\\syn.tab.c -o out",[" "],null);
  run_script(".\\Parser\\out.exe<",[""+filepath+""],null);
});
  //minimize, maximize and close the window 
  ipcMain.on("minimize", ()=>{
    mainWindow.minimize();
  });
  ipcMain.on("close",()=>{
    mainWindow.close();
  });
  ipcMain.on("maximize", ()=>{
    if(mainWindow.isMaximized()){
      mainWindow.restore()
    }
    else{
      mainWindow.maximize();
    }
  });
  ipcMain.on("outputResult",()=>{
    console.log("hahahah")
    // mainWindow.webContents.
  });

ipcMain.on("open-document" , ()=>{
    dialog.showOpenDialog({
      properties: ["openFile"],filters:[{ name: "Compil test files" , extensions: ["CT"]}],
    }).then(({ filePaths }) => {
      const filePath = filePaths[0];

      fs.readFile(filePath , "utf8" , (error , content) => {
        if(error){
          console.log("error")
        }
        else{
          openfilePath = filePath;
          mainWindow.webContents.send("document-opened" , { filePath, content});
        }
      })
    });
});



ipcMain.on("create-file", ()=>{
  dialog.showSaveDialog(mainWindow ,{
    filters: [{ name: "CT Files", extensions:["CT"]}]
  }).then(({filePath}) => {
    console.log('file path', filePath);
    // console.log(codecontent);
    fs.writeFile(filePath, "", (error) =>{
      if(error){
         console.log("error");
      }
      else{
        console.log("worked");
        openfilePath = filePath;
        mainWindow.webContents.send("file-created", filePath);
      }
    })
  });
});

ipcMain.on("update-file-content" , (_ , textareacontent)=>{
  fs.writeFile(openfilePath , textareacontent , (error) => {
    if(error){
      console.log("error");
    }
  })
});



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
