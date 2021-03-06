const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

global.dashboardConfigs = {
    connectionString: '',
    year: '',
    root: __dirname
};

function createWindow () {
    win = new BrowserWindow({width: 800, height: 600});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'view', 'login', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
