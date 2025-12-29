const disablingResourceLoading = require("./contentProcessing/disablingResourceLoading");

async function createPage(browser, resourceLoading = true) {
  try {
    let page = await browser.newPage();

    // Отключение загрузки изображений
    if (resourceLoading) await disablingResourceLoading(page);

    await page.setViewportSize({
      width: 1920,
      height: 1080,
    });

    await page.addInitScript(() => {
      // Маскировка автоматизации и настроек
      Object.defineProperty(navigator, "mediaDevices", {
        get: () => ({
          enumerateDevices: () => Promise.resolve([]),
          getUserMedia: () => Promise.resolve(),
        }),
      });

      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
      Object.defineProperty(navigator, "permissions", {
        get: () => ({
          query: (parameters) =>
            parameters.name === "notifications"
              ? Promise.resolve({ state: "denied" })
              : Promise.resolve({ state: "granted" }),
        }),
      });
      Object.defineProperty(navigator, "plugins", {
        get: () => [
          { name: "Chrome PDF Viewer" },
          { name: "Native Client" },
          { name: "Portable Document Format" },
        ],
      });
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
      Object.defineProperty(window, "outerWidth", {
        get: () => window.innerWidth,
      });
      Object.defineProperty(window, "outerHeight", {
        get: () => window.innerHeight,
      });

      const originalGetImageData = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (...args) {
        if (args[0] === "2d") {
          const context = originalGetImageData.apply(this, args);
          const originalGetImageData = context.getImageData;
          context.getImageData = function (...args) {
            const data = originalGetImageData.apply(this, args);
            for (let i = 0; i < data.data.length; i += 4) {
              data.data[i] = data.data[i] ^ 0xff; // XOR
            }
            return data;
          };
          return context;
        }
        return originalGetImageData.apply(this, args);
      };
    });

    return page;
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

module.exports = createPage;
