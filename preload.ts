import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('csv', {
    parseFile: (path: string, delimiter: string) => ipcRenderer.invoke('csv:parse-file', path, delimiter),
    getPage: (page: number, limit: number) => ipcRenderer.invoke('csv:get-page', page, limit),
    search: (query: string, column: string) => ipcRenderer.invoke('csv:search', query, column),
    getPathForFile: (file: File) => webUtils.getPathForFile(file),
});
