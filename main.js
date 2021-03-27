const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const url = require("url");
const developmentMode = true; //true | false
let win;

function createWindow() {
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        transparent: false
    });

    // load the dist folder from Angular
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    win.maximize();

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
app.on("ready", createWindow);

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