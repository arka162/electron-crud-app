const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const url = require("url");
const developmentMode = false; //true | false
let win;
const appIcon = path.join(__dirname, '/dist/assets/icons/512x512.png');

function createWindow() {
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        title: 'Electron CRUD App',
        icon: appIcon,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        transparent: false,
        show: false,
        width: 1024,
        height: 768,
    });

    // load the dist folder from Angular
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    // win.maximize();
    win.show();

    if (developmentMode) {
        // The following is optional and will open the DevTools:
        win.webContents.openDevTools({
            mode: 'docked',
            activate: false,
        });
    }
    else {
        // The following is to prevent opening the DevTools:
        win.webContents.on("devtools-opened", () => { win.webContents.closeDevTools(); });
    }

    win.on("closed", () => {
        win = null;
    });
}
app.disableHardwareAcceleration();
app.on("ready", () => {
    createWindow();
});

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// initialize the app's main window
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});