const { app } = require("electron");
const path = require("path");

function getResourcePath({ developmentPath = "", folder = "", filePath = "" }) {
  // В режиме разработки проверяем, если путь указан явно

  const basePath =
    app && app.getPath
      ? app.getPath("userData") // После сборки - путь внутри userData
      : developmentPath; // В режиме разработки, если developmentPath указан, то используем его, иначе __dirname

  // Собираем итоговый путь
  return path.join(basePath, folder, filePath);
}

module.exports = getResourcePath;
