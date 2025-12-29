const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const getResourcePath = require("../../../getResourcePath/getResourcePath");

const filePath = getResourcePath({
  developmentPath: path.join(__dirname, "../../../"),
  folder: "json",
  filePath: "logs.json",
});

// Функция для форматирования текущей даты и времени
function getCurrentDateTime() {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

function getLogsSearchElemCoordinates() {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Файл по пути ${filePath} не найден.`);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error("Ошибка при чтении файла:", error);
    return [];
  }
}

function availabilityCheckLogsCoordinates({ logs, elemName, position }) {
  return logs.some((log) => {
    if (!log.position) return false; // Пропускаем элементы без позиции
    return (
      log.elemName === elemName &&
      log.position.x === position.x &&
      log.position.y === position.y
    );
  });
}

function removeLogsSearchElemCoordinates({ elemName }) {
  const logs = getLogsSearchElemCoordinates();
  const updatedLogs = logs.filter((log) => {
    if (!log.position) return true; // Пропускаем логи без позиции
    return !(log.elemName === elemName);
  });

  saveFileLogs(updatedLogs);
}

function saveFileLogs(logs) {
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), "utf8");
}

async function addNewlogsSearchElemCoordinates({
  page,
  elemName,
  position,
  searchType = false,
  screenshot = false,
}) {
  const uniqueNameScrenshot = screenshot
    ? await takeCompressedScreenshot(page)
    : screenshot;

  console.log(searchType);
  // Чтение существующих логов
  const logs = getLogsSearchElemCoordinates();

  // Получение URL текущей страницы
  const currentUrl = await page.url();

  // Лог, который нужно добавить
  const logsData = {
    url: currentUrl,
    elemName,
    position,
    timestamp: getCurrentDateTime(), // Добавляем текущую дату и время
    ...(searchType && { searchType }),
  };

  // Проверяем, существует ли такой же лог в массиве
  const isLogExists = availabilityCheckLogsCoordinates({
    logs,
    elemName,
    position,
  });

  // Если такого лога нет, добавляем его в массив
  if (!isLogExists) {
    logs.push(logsData);
    saveFileLogs(logs);
    // console.log("Новый лог добавлен");
  } else {
    // console.log("Этот лог уже существует, добавление не требуется");
  }
}

function generateUniqueName(prefix = "screenshot") {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
  return `${prefix}_${timestamp}`;
}

async function takeCompressedScreenshot(page) {
  const folderPath = path.join(__dirname, "./screenshotsLogs");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const uniqueName = generateUniqueName();
  const originalPath = `${folderPath}/${uniqueName}.png`;
  const compressedPath = `${folderPath}/${uniqueName}.webp`;

  // Сохраняем оригинальный скриншот
  await page.screenshot({ path: originalPath });

  // Сжимаем и сохраняем в формате WebP
  await sharp(originalPath)
    .webp({ quality: 80 }) // Настройка степени сжатия
    .toFile(compressedPath);

  // Удаляем исходный файл
  fs.unlinkSync(originalPath);

  return uniqueName;
}

module.exports = {
  addNewlogsSearchElemCoordinates,
  availabilityCheckLogsCoordinates,
  removeLogsSearchElemCoordinates,
  getLogsSearchElemCoordinates,
};
