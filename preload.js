const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld("axios", {
  openAI: (create) => ipcRenderer.invoke('axios.openAI', create),
  backendLaravel: (method, path, data, token) => ipcRenderer.invoke('axios.backendLaravel',method, path, data, token),
  destroy: (method, path, data, token) => ipcRenderer.invoke('axios.destroy', method, path, data, token),
  store: (method, path, data, token) => ipcRenderer.invoke('axios.store', method, path, data, token),
});

contextBridge.exposeInMainWorld("Toastify", {
  showToast: (options) => Toastify(options).showToast()
});