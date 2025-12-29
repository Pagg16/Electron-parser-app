const {
  getLogsSearchElem,
  removeLogsSearchElem,
  availabilityCheckLogs,
  addNewlogsSearchElem,
} = require("./logsSearchElem/handlesLogsPath");

async function searchLocatorElem({
  page,
  searchVariations,
  onlyOne = false,
  searchByElement = null,
}) {
  try {
    let foundElems = null;
    const logs = getLogsSearchElem();
    const arrLength = searchVariations.length - 1;
    let index = 0;

    for (const {
      searchType: { locator },
      name: elemName,
    } of searchVariations) {
      foundElems = await findElements({ page, searchByElement, locator });

      if (foundElems && onlyOne && (await foundElems.count()) > 1) {
        addNewlogsSearchElem({
          page,
          searchByElement,
          elemName,
          locator,
          onlyOne,
        });
        foundElems = null;
        break;
      }

      if (foundElems) {
        if (availabilityCheckLogs(logs, elemName, locator)) {
          removeLogsSearchElem(elemName, locator);
        }
        break;
      } else if (arrLength === index) {
        addNewlogsSearchElem({ page, searchByElement, elemName, locator });
      }

      index++;
    }

    return { foundElems, index };
  } catch (error) {
    console.error("Ошибка при обработке поиска:", error);
    return null;
  }
}

async function findElements({ page, searchByElement, locator }) {
  try {
    const searchType = searchByElement
      ? await searchByElement.locator(locator)
      : await page.locator(locator);

    return (await searchType.count()) > 0 ? searchType : null;
  } catch (err) {
    console.error(`Ошибка при обработке Locator "${locator}":`, err);
    throw err; // Пробрасываем ошибку для обработки в основном коде
  }
}

module.exports = searchLocatorElem;
