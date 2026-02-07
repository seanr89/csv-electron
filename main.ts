import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import fs from 'fs';
import csv from 'csv-parser';
import Fuse from 'fuse.js';

// Determine __dirname for ESM
const __dirname = path.join(path.dirname(url.fileURLToPath(import.meta.url)));

let mainWindow: BrowserWindow | null = null;
let csvData: any[] = [];
let csvHeaders: string[] = [];
let filteredData: any[] = [];

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            sandbox: false, // Disabling sandbox for simpler IPC/Node access during dev
        },
        autoHideMenuBar: true,
        title: "CSV Data Visualizer",
    });

    if (!app.isPackaged) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../dist/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }
}

app.whenReady().then(() => {
    createWindow();

    // IPC Handler: Parse CSV File
    ipcMain.handle('csv:parse-file', async (_event, filePath: string, delimiter: string) => {
        console.log(`Parsing file: ${filePath} with delimiter: ${delimiter}`);
        return new Promise((resolve, reject) => {
            // Reset State
            csvData = [];
            csvHeaders = [];
            filteredData = [];

            const results: any[] = [];

            fs.createReadStream(filePath)
                .pipe(csv({ separator: delimiter }))
                .on('headers', (headers: string[]) => {
                    csvHeaders = headers;
                })
                .on('data', (data: any) => {
                    results.push(data);
                })
                .on('end', () => {
                    csvData = results;
                    filteredData = results; // Initially, all data is "filtered" data
                    console.log(`Parsed ${results.length} rows.`);
                    resolve({ totalRows: results.length, headers: csvHeaders });
                })
                .on('error', (err: Error) => {
                    console.error('CSV Parse Error:', err);
                    reject(err);
                });
        });
    });

    // IPC Handler: Get Page
    ipcMain.handle('csv:get-page', (_event, page: number, limit: number) => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredData.slice(start, end);
    });

    // IPC Handler: Search
    ipcMain.handle('csv:search', (_event, query: string, column: string) => {
        if (!query) {
            filteredData = csvData;
        } else {
            const fuse = new Fuse(csvData, {
                keys: [column],
                threshold: 0.3,
            });
            filteredData = fuse.search(query).map(result => result.item);
        }

        return {
            totalCount: filteredData.length,
            // Frontend should request page 1 after search
        };
    });

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
