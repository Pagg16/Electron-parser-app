const { ipcRenderer } = require("electron");

module.exports = {
  parseStart: (url) => ipcRenderer.invoke("parseStart", url),

  getProductInform: (callback) => {
    ipcRenderer.removeAllListeners("getProductInform"); // Удаляем старые слушатели
    ipcRenderer.on("getProductInform", (event, data) => {
      callback(data);
    });
  },

  getProductComment: (callback) => {
    ipcRenderer.removeAllListeners("getProductComment"); // Удаляем старые слушатели
    ipcRenderer.on("getProductComment", (event, data) => {
      callback(data);
    });
  },

  getBaseClassCommentStart: () =>
    ipcRenderer.invoke("getBaseClassCommentStart"),

  getBaseClassComment: (callback) => {
    ipcRenderer.removeAllListeners("getBaseClassComment"); // Удаляем старые слушатели
    ipcRenderer.on("getBaseClassComment", (event, data) => {
      callback(data);
    });
  },
};
