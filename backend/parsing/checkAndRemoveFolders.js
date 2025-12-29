const fs = require("fs");
const path = require("path");
const getResourcePath = require("../getResourcePath/getResourcePath");

const videoPath = getResourcePath({
  developmentPath: path.join(__dirname, "../../../"),
  folder: "json",
  filePath: "dataLogs",
});

const baseClassGetVideoPath = getResourcePath({
  developmentPath: path.join(__dirname, "../../../"),
  folder: "json",
  filePath: "baseClassLogs",
});

function checkAndRemoveFolders() {
  const paths = [videoPath, baseClassGetVideoPath];

  paths.forEach((folderPath) => {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath); // Получаем список всех файлов и папок внутри

      files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // Проверяем, является ли это папкой или файлом и удаляем содержимое
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true }); // Удаляем папку и её содержимое
          console.log(`Папка ${filePath} и её содержимое удалены.`);
        } else {
          fs.unlinkSync(filePath); // Удаляем файл
          console.log(`Файл ${filePath} удалён.`);
        }
      });

      console.log(`Содержимое папки ${folderPath} успешно удалено.`);
    } else {
      console.log(`Папка ${folderPath} не найдена.`);
    }
  });

  return {
    videoPath,
    baseClassGetVideoPath,
  };
}

module.exports = checkAndRemoveFolders;
