const { ipcMain, dialog } = require("electron");
const path = require("path");
const XLSX = require("xlsx");

function saveExcelFile(filePath, data) {
  try {
    // Преобразуем данные в рабочий лист Excel
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product Data");

    // Записываем Excel файл
    XLSX.writeFile(wb, filePath);
    return "successfully"; // Возвращаем успешный результат
  } catch (error) {
    return "errorSaved"; // Возвращаем ошибку
  }
}

function registerCreateFileHandlers(mainWindow) {
  ipcMain.handle("createExel", async (event, data) => {
    let result;

    // Ожидаем пользовательского выбора пути для сохранения файла
    result = await dialog.showSaveDialog(mainWindow, {
      title: "Сохранить файл",
      filters: [
        { name: "Excel Files", extensions: ["xls", "xlsx"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    // Если пользователь отменил диалог, возвращаем "cancellation"
    if (result.canceled) {
      return "cancellation";
    }

    const filePath = result.filePath;
    const fileName = path.basename(filePath);

    // Проверяем, что файл имеет корректное имя
    if (!fileName || fileName === ".xlsx" || !fileName.includes(".")) {
      await dialog.showMessageBox(mainWindow, {
        type: "error",
        title: "Ошибка",
        message: "Необходимо указать имя файла.",
      });
      return null; // Возвращаем null, если имя файла некорректно
    }

    // Вызываем функцию для сохранения Excel файла
    const saveResult = saveExcelFile(filePath, data);

    return saveResult; // Возвращаем результат операции
  });
}

module.exports = { registerCreateFileHandlers };
