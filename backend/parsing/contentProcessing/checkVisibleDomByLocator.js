const searchLocatorElem = require("./searchLocatorElem");

async function checkVisibleDomByLocator({
  page,
  searchByelement = false,
  elem,
  timeout = 5000,
}) {
  try {
    if (!Array.isArray(elem)) {
      elem = [elem];
    }

    const interval = 100; // Интервал между проверками (100 миллисекунд)

    const endTime = Date.now() + timeout;

    while (Date.now() < endTime) {
      const { foundElems, index } = await searchLocatorElem({
        page,
        searchVariations: elem,
        searchByelement,
      });

      if (foundElems) {
        return foundElems;
      }

      await page.waitForTimeout(interval);
    }

    return false;
  } catch (error) {
    console.error(
      `Ошибка при проверке видимости элемента по локаторам "${elem}": ${error.message}`
    );
    return null;
  }
}

module.exports = checkVisibleDomByLocator;
