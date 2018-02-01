const { ipcRenderer } = require('electron')
const { app, Menu } = require('electron').remote

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CommandOrControl+N',
        click: () => {
          ipcRenderer.send('new')
        }
      },
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
        click: () => {
          ipcRenderer.send('open')
        }
      },
      { type: 'separator' },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => {
          ipcRenderer.send('save')
        }
      },
      {
        label: 'Save As...',
        accelerator: 'Shift+CommandOrControl+S',
        click: () => {
          ipcRenderer.send('save-as')
        }
      },
      { type: 'separator' },
      {
        label: 'Export',
        accelerator: 'CommandOrControl+E',
        click: () => {
          ipcRenderer.send('export')
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click: () => {
          ipcRenderer.send('quit')
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
          // mainWindow.reload()
          ipcRenderer.send('reload')
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (() => app.platform==='darwin' ? 'CommandOrControl+Alt+I' : 'CommandOrControl+Shift+I')(),
        click: () => {
          ipcRenderer.send('dev-tools')
          // mainWindow.toggleDevTools()
        }
      }
    ]
  }
]

module.exports = {
  show: () => {
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  },
  hide: () => {

  }
}
