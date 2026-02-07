import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
// Using __dirname and __filename in ESM for Node.js (if module: ESNext)
// However, since we are targeting CommonJS in tsconfig.main.json, we might not need this if we were using require.
// But since we are using 'import', TypeScript handles it.
// Let's stick to the existing logic but ensure it compiles correctly.
// Actually, simple __dirname in CommonJS context (which Electron main usually is) is fine.
// But our package.json says "type": "module".
// The tsconfig.main.json has "module": "CommonJS".
// So tsc will convert import to require.
// When "module": "CommonJS", __dirname is available globally.
// BUT, since the input is .ts, we can just use standard imports.
// Let's keep the ESM-style logic if we want to support ESM in development, but for Electron main process,
// it's often easier to stick to CommonJS output.
// The invalid 'import.meta' error might occur if we target CommonJS but use import.meta.
// Let's adjust for better compatibility.
const __dirname = path.join(path.dirname(url.fileURLToPath(import.meta.url)));
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        //resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            sandbox: true,
        },
        autoHideMenuBar: true,
        title: "CSV Data Visualizer",
    });
    if (!app.isPackaged) {
        // In development, load from the Vite dev server
        mainWindow.loadURL('http://localhost:5173');
        //mainWindow.webContents.openDevTools();
    }
    else {
        // In production, load the built index.html file
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../dist/index.html'), // Adjusted path since main.js will be in dist-electron/
            protocol: 'file:',
            slashes: true,
        }));
    }
}
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
