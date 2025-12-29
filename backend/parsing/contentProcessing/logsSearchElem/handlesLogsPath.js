const fs = require("fs");
const path = require("path");
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

function getLogsSearchElem() {
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

function availabilityCheckLogs(logs, elemName, locator) {
  return logs.some((log) => {
    if (!log.elemName) return false;
    return (
      log.elemName === elemName &&
      JSON.stringify(log.locator) === JSON.stringify(locator)
    );
  });
}

function removeLogsSearchElem(elemName, locator) {
  const logs = getLogsSearchElem();

  const updatedLogs = logs.filter((log) => {
    if (!log.elemName) return true;
    return !(
      log.elemName === elemName &&
      JSON.stringify(log.locator) === JSON.stringify(locator)
    );
  });

  saveFileLogs(updatedLogs);
}

function saveFileLogs(logs) {
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), "utf8");
}

function addNewlogsSearchElem({
  page,
  searchByelement,
  elemName,
  locator,
  onlyOne,
}) {
  // Чтение существующих логов
  const logs = getLogsSearchElem();

  // Получение URL текущей страницы
  const currentUrl = page.url();

  // Лог, который нужно добавить
  const logsData = {
    url: currentUrl,
    elemName: elemName,
    locator: locator,
    timestamp: getCurrentDateTime(), // Добавляем текущую дату и время
    ...(searchByelement && { locator: searchByelement }), // Добавляем свойство только если searchByelement существует
    ...(onlyOne && { onlyOne: "найдено больше элементов, чем ожидалось" }),
  };

  // Проверяем, существует ли такой же лог в массиве
  const isLogExists = availabilityCheckLogs(logs, elemName, locator);

  // Если такого лога нет, добавляем его в массив
  if (!isLogExists) {
    logs.push(logsData);
    saveFileLogs(logs);
    // console.log("Новый лог добавлен");
  } else {
    // console.log("Этот лог уже существует, добавление не требуется");
  }
}

module.exports = {
  addNewlogsSearchElem,
  availabilityCheckLogs,
  removeLogsSearchElem,
  getLogsSearchElem,
};
