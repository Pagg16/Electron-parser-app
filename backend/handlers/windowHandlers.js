const { ipcMain } = require("electron");

function registerWindowHandlers(mainWindow) {
  ipcMain.handle("minimize-window", () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle("maximize-window", () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle("close-window", () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.on("closeApp", () => {
    if (mainWindow) mainWindow.close();
  });
}

module.exports = { registerWindowHandlers };
