import { contextBridge, ipcRenderer, webUtils } from 'electron';
contextBridge.exposeInMainWorld('csv', {
    parseFile: (path, delimiter) => ipcRenderer.invoke('csv:parse-file', path, delimiter),
    getPage: (page, limit) => ipcRenderer.invoke('csv:get-page', page, limit),
    search: (query, column) => ipcRenderer.invoke('csv:search', query, column),
    getPathForFile: (file) => webUtils.getPathForFile(file),
});
