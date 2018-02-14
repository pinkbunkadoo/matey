const { ipcRenderer } = require('electron')
const { app, Menu } = require('electron').remote

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New...',
        accelerator: 'CommandOrControl+N',
        click: () => {
          ipcRenderer.send('new')
        }
      },
      {
        label: 'Open...',
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
        label: 'Export GIF...',
        accelerator: 'CommandOrControl+E',
        click: () => {
          ipcRenderer.send('export-gif')
        }
      },
      {
        label: 'Export SVG...',
        accelerator: 'Shift+CommandOrControl+E',
        click: () => {
          ipcRenderer.send('export-svg')
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C',
        click: () => {
          ipcRenderer.send('copy')
        }
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        click: () => {
          ipcRenderer.send('paste')
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

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })
} else {
  template[0].submenu.push(
    { type: 'separator' },
    {
      label: 'Quit',
      accelerator: 'CommandOrControl+Q',
      click: () => {
        ipcRenderer.send('quit')
      }
    }
  )
}

module.exports = {
  show: () => {
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  },
  hide: () => {

  }
}
