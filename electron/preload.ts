import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  db: {
    getProfile: () => ipcRenderer.invoke('db:getProfile'),
    saveProfile: (profile: any) => ipcRenderer.invoke('db:saveProfile', profile),
  },
  dialog: {
    selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
    selectFile: (filters: any) => ipcRenderer.invoke('dialog:selectFile', filters),
  },
  pdf: {
    openExternal: (filePath: string) => ipcRenderer.invoke('pdf:openExternal', filePath),
  },
  app: {
    getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
    getHelpPath: () => ipcRenderer.invoke('app:getHelpPath'),
  },
  ocr: {
    processFile: (filePath: string) => ipcRenderer.invoke('ocr:processFile', filePath),
    ocrImageBuffer: (base64DataUrl: string) => ipcRenderer.invoke('ocr:ocrImageBuffer', base64DataUrl),
  },
});
