const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("axios", {
  openAI: (create) => ipcRenderer.invoke('axios.openAI', create)
});
