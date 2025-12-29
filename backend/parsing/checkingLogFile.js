const fs = require("fs");
const path = require("path");
const getResourcePath = require("../getResourcePath/getResourcePath");

const folderPathLogs = getResourcePath({
  developmentPath: path.join(__dirname),
  folder: "json",
});

const videoLogsFolderBaseClassPath = getResourcePath({
  developmentPath: path.join(__dirname),
  folder: "json",
  filePath: "baseClassLogs",
});

const videoLogsFolderDataPath = getResourcePath({
  developmentPath: path.join(__dirname),
  folder: "json",
  filePath: "dataLogs",
});

const baseClassesCommentFolderPath = getResourcePath({
  developmentPath: path.join(__dirname),
  folder: "baseClass",
});

const foldersCheck = [
  folderPathLogs,
  videoLogsFolderBaseClassPath,
  videoLogsFolderDataPath,
  baseClassesCommentFolderPath,
];

const jsonLogsFilePath = getResourcePath({
  developmentPath: path.join(__dirname),
  folder: "json",
  filePath: "logs.json",
});

const baseClassesCommentFilePath = getResourcePath({
  developmentPath: path.join(__dirname),
  folder: "baseClass",
  filePath: "baseClassComment.json",
});

const filesCheck = [
  { filePath: jsonLogsFilePath, type: "array" },
  { filePath: baseClassesCommentFilePath, type: "object" },
];



function checkingLogFile() {
  // Проверка и создание папок
  for (const folderCheck of foldersCheck) {
    try {
      // Проверяем, существует ли папка
      if (!fs.existsSync(folderCheck)) {
        // Если папка не существует, создаем её
        console.log(`Папка ${folderCheck} не существует, создаем...`);
        fs.mkdirSync(folderCheck, { recursive: true });
      }
    } catch (error) {
      console.error(`Ошибка при создании папки ${folderCheck}:`, error.message);
    }
  }

  // Проверка и создание файлов
  for (const fileCheck of filesCheck) {
    try {
      // Проверяем, существует ли файл
      if (!fs.existsSync(fileCheck.filePath)) {
        // Если файл не существует, создаем его в зависимости от типа
        console.log(`Файл ${fileCheck.filePath} не существует, создаем...`);

        let initialContent;
        // В зависимости от типа создаем начальное содержимое
        if (fileCheck.type === "array") {
          initialContent = JSON.stringify([]);
        } else if (fileCheck.type === "object") {
          initialContent = JSON.stringify({});
        } else {
          console.log(
            `Неизвестный тип: ${fileCheck.type}. Создаю пустой объект.`
          );
          initialContent = JSON.stringify({});
        }

        fs.writeFileSync(fileCheck.filePath, initialContent, "utf8");
      } else {
        const fileContent = fs.readFileSync(fileCheck.filePath, "utf8");

        // Проверяем, не является ли содержимое пустым
        if (fileContent.trim() === "") {
          console.log(`Файл ${fileCheck.filePath} пуст. Перезаписываем файл.`);
          let initialContent;
          // В зависимости от типа создаем начальное содержимое
          if (fileCheck.type === "array") {
            initialContent = JSON.stringify([]);
          } else if (fileCheck.type === "object") {
            initialContent = JSON.stringify({});
          } else {
            console.log(
              `Неизвестный тип: ${fileCheck.type}. Создаю пустой объект.`
            );
            initialContent = JSON.stringify({});
          }

          fs.writeFileSync(fileCheck.filePath, initialContent, "utf8");
        } else {
          const parsedContent = JSON.parse(fileContent);

          // Проверяем тип содержимого в зависимости от ожидаемого
          if (fileCheck.type === "array" && !Array.isArray(parsedContent)) {
            console.log(
              `Содержимое файла ${fileCheck.filePath} не является массивом. Перезаписываем файл.`
            );
            fs.writeFileSync(fileCheck.filePath, JSON.stringify([]), "utf8");
          } else if (
            fileCheck.type === "object" &&
            typeof parsedContent !== "object"
          ) {
            console.log(
              `Содержимое файла ${fileCheck.filePath} не является объектом. Перезаписываем файл.`
            );
            fs.writeFileSync(fileCheck.filePath, JSON.stringify({}), "utf8");
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при чтении/записи файла:", error.message);
      let initialContent;
      // Если возникла ошибка, создаем файл с начальным содержимым
      if (fileCheck.type === "array") {
        initialContent = JSON.stringify([]);
      } else if (fileCheck.type === "object") {
        initialContent = JSON.stringify({});
      } else {
        console.log(
          `Неизвестный тип: ${fileCheck.type}. Создаю пустой объект.`
        );
        initialContent = JSON.stringify({});
      }

      fs.writeFileSync(fileCheck.filePath, initialContent, "utf8");
    }
  }
}

module.exports = checkingLogFile;
