const {app, BrowserWindow, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
  win = new BrowserWindow({width: 1200, height: 800});

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools();

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require('electron-devtools-installer');

    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(
      tool => {
        installExtension(tool)
          .then(name => { console.log(`Added Extension: ${name}`) })
          .catch(err => { console.log('Error Installing Extension', err) });
      }
    );
  }

  win.on('closed', () => {
    win = null;
  });

  ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
      file: filePath,
      icon: path.join(__dirname, 'test-icon.png')
    });
  });
}

app.on('ready', createWindow);
