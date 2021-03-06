/**
 * Created by Rohail on 6/17/2017.
 */

const handleSquirrelEvent = require('./dev-scripts/squirrelEvents');
const {app, BrowserWindow} = require('electron');
if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

const path = require('path');
const url = require('url');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1200, height: 1000});
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.webContents.on('did-finish-load', () => {
    win.maximize();
  });

  // / Open the DevTools.
  //  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});


let options = {
  filters : [{name :'CVS file',extensions:['csv']}],
  properties: ['openFile']
};

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog(options,function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
});
ipc.on('home-screen', function (event) {
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
});
ipc.on('refresh-screen', function (event,data) {
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/app/views/graph.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('graphData',data)
  })
});
ipc.on('csvParsed', function (event,data) {
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/app/views/graph.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('graphData',data)
  })
});
ipc.on('exportdata', function (event,xls) {
  const options = {
    title: 'Export data to',
    filters: [
      { name: 'xlsx file', extensions: ['xlsx'] }
    ]
  };
  dialog.showSaveDialog(options, function (filename) {
    event.sender.send('saved-file', {filename,xls})
  })
});

