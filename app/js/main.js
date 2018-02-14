
const {ipcMain, app, globalShortcut, BrowserWindow, Menu, dialog} = require('electron')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // globalShortcut.register('CommandOrControl+R', () => {
  //   mainWindow.reload()
  // })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    minWidth: 640,
    minHeight: 480,
    disableAutoHideCursor: true,
    show: false
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // and load the index.html of the App.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // menu = Menu.buildFromTemplate(template)
  // Menu.setApplicationMenu(menu)

  mainWindow.setMenuBarVisibility(false)

  mainWindow.on('close', () => {
    app.quit()
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools({ mode: 'right' })

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function showOpenDialog(filepath) {
  if (mainWindow) {
    dialog.showOpenDialog(mainWindow, {
        title: "Open",
        defaultPath: filepath,
        buttonLabel: "Open",
        filters: [ { name: 'Matey sequence', extensions: [ 'matey' ] } ],
        properties: [ 'openFile' ]
      },
      filename => {
        if (filename instanceof Array) {
          mainWindow.send('open', filename[0]);
        }
      }
    )
  }
}

function showSaveDialog(filepath) {
  if (mainWindow) {
    dialog.showSaveDialog(mainWindow, {
        title: "Save As",
        defaultPath: filepath,
        buttonLabel: "Save",
        filters: [
          { name: 'Matey sequence', extensions: [ 'matey' ] }
        ]
      },
      filename => {
        if (filename) {
          mainWindow.send('save', filename);
        }
      }
    )
  }
}

function showExportDialog(filepath) {
  if (mainWindow) {
    dialog.showSaveDialog(mainWindow, {
      title: "Export GIF",
      buttonLabel: "Export",
      defaultPath: filepath,
      filters: [
        { name: 'Animated GIF', extensions: [ 'gif' ] }
      ]
      },
      filename => {
        if (filename) {
          mainWindow.send('export', filename);
        }
      })
  }
}

function showSaveChangesDialog(filepath) {
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No', 'Cancel' ],
        title: 'Matey',
        message: 'Save changes to \'' + path.basename(filepath) + '\' before closing?'

    },
    response => {
      console.log(response);
    });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('before-quit', () => {
  console.log('before-quit')
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('new', (event) => {
  mainWindow.send('new')
  // console.log('new', mainWindow.webContents.App.path);
})

ipcMain.on('dev-tools', (event) => {
  mainWindow.webContents.toggleDevTools()
})

ipcMain.on('open', (event) => {
  mainWindow.send('open')
})

ipcMain.on('save', (event) => {
  mainWindow.send('save')
})

ipcMain.on('save-as', (event) => {
  mainWindow.send('save-as')
})

ipcMain.on('export', (event) => {
  mainWindow.send('export')
})

ipcMain.on('quit', (event) => {
  mainWindow.send('quit')
})

ipcMain.on('save-changes-dialog', (event, filepath) => {
  showSaveChangesDialog(filepath)
})

ipcMain.on('save-dialog', (event, filepath) => {
  showSaveDialog(filepath)
})

ipcMain.on('open-dialog', (event, filepath) => {
  showOpenDialog(filepath)
})

ipcMain.on('export-dialog', (event, filepath) => {
  showExportDialog(filepath)
})
