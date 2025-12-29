const { ipcRenderer } = require("electron");

module.exports = {
  createExel: (data) => ipcRenderer.invoke("createExel", data),
};
