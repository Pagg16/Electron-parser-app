const { contextBridge } = require("electron");
const windowControls = require("./windowСontrols"); // Импортируем логику
const {
  parseStart,
  getProductInform,
  getProductComment,
  getBaseClassComment,
  getBaseClassCommentStart,
} = require("./parseMain");
const { createExel } = require("./createExel");

contextBridge.exposeInMainWorld("electron", {
  minimizeWindow: windowControls.minimizeWindow,
  maximizeWindow: windowControls.maximizeWindow,
  closeWindow: windowControls.closeWindow,

  parseStart: parseStart,
  getProductInform: getProductInform,
  getProductComment: getProductComment,

  getBaseClassCommentStart: getBaseClassCommentStart,
  getBaseClassComment: getBaseClassComment,

  createExel: createExel,
});
