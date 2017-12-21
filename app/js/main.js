// const electron = require('electron')
// Module to control application life.
const {ipcMain, app, globalShortcut, BrowserWindow, Menu, dialog} = require('electron')
// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow
// const Menu = electron.Menu
// const GIFEncoder = require('gifencoder');

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Export',
          accelerator: 'CommandOrControl+E',
          click: () => {
            // console.log('menu-export')
            showExportDialog()
          }
        },
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          role: 'quit',
          click: () => {
            // console.log('menu-export')
            // showExportDialog()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          role: 'reload',
          accelerator: 'CommandOrControl+R',
          click: () => {
            // console.log('menu-refresh');
            mainWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          // role: 'reload',
          accelerator: (() => app.platform==='darwin' ? 'CommandOrControl+Alt+I' : 'CommandOrControl+Shift+I')(),
          click: () => {
            // console.log('menu-refresh');
            mainWindow.toggleDevTools()
          }
        }
      ]
    }
  ];
  // globalShortcut.register('CommandOrControl+R', () => {
  //   mainWindow.reload()
  // })

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 1024 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }))

  menu = Menu.buildFromTemplate(template)

  // mainWindow.menu = null;
  Menu.setApplicationMenu(menu)
  // Menu.setApplicationMenu(null)

  // mainWindow.webContents.setVisualZoomLevelLimits(0, 0)
  // mainWindow.webContents.setLayoutZoomLevelLimits(0, 0)

  mainWindow.setMenuBarVisibility(false)

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'bottom' })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function showExportDialog() {
  if (mainWindow) {
    dialog.showSaveDialog(mainWindow, {
      title: "Export animation...",
      message: "Hello Mr. Export",
      buttonLabel: "Export",
      filters: [
        { name: 'Animated GIF', extensions: [ 'gif' ] },
        { name: 'SVG (SMIL)', extensions: [ 'svg' ] },
        { name: 'PNG Sequence', extensions: [ 'png' ] }
      ]
      },
      filename => {
        console.log(filename);
        if (filename) {
          mainWindow.send('export', filename);
        }
      })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('export', (event, arg) => {
  console.log('export')
  showExportDialog()
})
