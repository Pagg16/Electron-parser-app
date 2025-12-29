const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");
const { registerWindowHandlers } = require("../handlers/windowHandlers");
const { registerSearchHandlers } = require("../handlers/parsingHandlers");
const {
  registerCreateFileHandlers,
} = require("../handlers/createFileExelHandlers");
require("dotenv").config(); // Загружаем переменные окружения
// const port = process.env.VITE_PORT; // Получаем порт из .env
// const pathApp = `http://localhost:${port}`;
const pathAppBuild = `file://${path.join(
  __dirname,
  "../../src/dist",
  "index.html"
)}`;

let mainWindow;
let preloadWindow;

function createPreloadWindow() {
  preloadWindow = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    icon: path.join(__dirname, "../../public/assets/icon/IconApp.ico"),
    transparent: true,
    alwaysOnTop: true,
    title: "Parser",
  });

  preloadWindow.loadURL(
    `file://${path.join(__dirname, "../../public/load", "loader.html")}`
  );
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 600,
    minWidth: 1280,
    minHeight: 600,
    frame: false,
    show: false,
    title: "Parser",
    icon: path.join(__dirname, "../../public/assets/icon/IconApp.ico"),
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),

      nodeIntegration: true, // Отключает доступ к Node.js в рендерере
      contextIsolation: true, // Изолирует контекст выполнения
      enableRemoteModule: false, // Убирает доступ к устаревшему remote API
    },
  });

  mainWindow.loadURL(pathAppBuild);

  Menu.setApplicationMenu(null); // Убираем системное меню

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // globalShortcut.register("CmdOrCtrl+d", () => {
  //   mainWindow.webContents.toggleDevTools();
  // });

  mainWindow.once("ready-to-show", () => {
    registerWindowHandlers(mainWindow); // Регистрация обработчиков кнопок
    registerSearchHandlers(); //Регистрация обработчика поиска
    registerCreateFileHandlers(mainWindow); //Регистрация обработчика открытия окна сохранения

    setTimeout(() => {
      mainWindow.maximize();
      mainWindow.show(); // Показать основное окно
      preloadWindow.close(); // Закрыть окно прелоадера после загрузки приложения
      mainWindow.setAlwaysOnTop(true);
      mainWindow.focus();
      mainWindow.setAlwaysOnTop(false);
    }, 3000);
  });
}

app.whenReady().then(() => {
  createPreloadWindow();
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createPreloadWindow();
    createMainWindow();
  }
});
