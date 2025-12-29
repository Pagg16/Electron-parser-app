const { chromium } = require("playwright");
const path = require("path");
const checkAndRemoveFolders = require("./checkAndRemoveFolders");
const getResourcePath = require("../getResourcePath/getResourcePath");

const userDataDir = getResourcePath({
  developmentPath: path.join(__dirname, "../../../"),
  folder: "user-data-history",
});

const args = [
  "--no-sandbox",
  "--remote-debugging-port=9222",
  "--disable-setuid-sandbox",
  "--ignore-certificate-errors",
  "--disk-cache-size=1",
  "--disable-infobars",
  "--disable-blink-features=AutomationControlled",
  "--enable-unsafe-swiftshader",
  "--window-position=-9999,-9999", // Размещение окна за пределами экрана
  "--start-maximized",
  "--foreground",
];

async function createBrowser({ headless, isBaseClass = false }) {
  try {
    const { videoPath, baseClassGetVideoPath } = checkAndRemoveFolders();

    const browser = await chromium.launchPersistentContext(userDataDir, {
      headless: headless,
      bypassCSP: true,
      ignoreHTTPSErrors: true,
      args: args,
      recordVideo: {
        dir: isBaseClass ? baseClassGetVideoPath : videoPath, // Папка, где будет сохранено видео
        size: { width: 1280, height: 720 }, // Размер видео (опционально)
      },
    });

    return browser;
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

module.exports = createBrowser;
