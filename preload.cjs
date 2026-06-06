const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  chat: (message, history) => ipcRenderer.invoke('api:chat', { message, history }),
  analyzeImage: (imageBase64, mimeType, fileName) => ipcRenderer.invoke('api:analyze-image', { imageBase64, mimeType, fileName }),
  changeUrl: (url) => ipcRenderer.send('url:change', url),
  sendPrompt: (text) => ipcRenderer.send('prompt:send', text),
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close')
});
