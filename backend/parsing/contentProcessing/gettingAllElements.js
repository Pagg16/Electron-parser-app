const searchLocatorElem = require("./searchLocatorElem");

async function gettingAllElements({
  page,
  locator,
  name,
  searchByelement = false,
  actionsFun = false,
  timeout = 10000,
}) {
  let previousCount = 0;
  let count = 0;
  const interval = 100; // Интервал между проверками (100 миллисекунд)
  let endTime = Date.now() + timeout;
  let resultAllElems = null;

  while (Date.now() < endTime) {
    const { foundElems } = await searchLocatorElem({
      page,
      searchVariations: [{ name, searchType: { locator } }],
      searchByelement,
    });

    if (foundElems) {
      count = await foundElems.count();
      if (count > previousCount) {
        endTime = Date.now() + timeout;
        previousCount = count;

        if (actionsFun && typeof actionsFun === "function") {
          const ifBreak = await actionsFun(foundElems, count);
          if (ifBreak) break;
        }

        resultAllElems = foundElems;
      }
    }

    await page.waitForTimeout(interval);
  }

  return resultAllElems;
}

module.exports = gettingAllElements;
