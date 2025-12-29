const fs = require("fs");
const path = require("path");
const {
  checkVisibleAndScroll,
} = require("../../getBaseClassComment/productCommentsList");
const gettingAllElements = require("../../gettingAllElements");
const checkVisibleDomByLocator = require("../../checkVisibleDomByLocator");
const createPage = require("../../../createPage");
const searchLocatorElem = require("../../searchLocatorElem");
const antibotPopupClosing = require("../../../antibotPopupClosing");
const acceptCookies = require("../../../acceptCookies");
const getResourcePath = require("../../../../getResourcePath/getResourcePath");

const filePath = getResourcePath({
  developmentPath: path.join(__dirname, "../../../"),
  folder: "baseClass",
  filePath: "baseClassComment.json",
});

function readJsonFileSync() {
  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);
    return jsonData;
  } catch (error) {
    console.error("Ошибка при чтении файла:", error);
    return null;
  }
}

async function starRatingGet(elem) {
  const baseFullColor = "rgb(255, 168, 0)";
  const svgAllRating = await elem.locator("svg");

  let ratingNum = 0;

  for (let i = 0, length = await svgAllRating.count(); i < length; i++) {
    const svgElem = svgAllRating.nth(i);

    const color = await svgElem.evaluate((el) => getComputedStyle(el).color);

    if (color === baseFullColor) {
      ratingNum++;
    }
  }

  return ratingNum;
}

function dateFilter(dateStr) {
  return dateStr.match(/(\d{1,2})\s+([а-яА-Я]+)\s+(\d{4})/)[0];
}

async function productComment(browser, url) {
  try {
    const page = await createPage(browser);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const checkVisibleAndScrollElem = await checkVisibleDomByLocator({
      page,
      elem: checkVisibleAndScroll,
      timeout: 70000,
    });

    await antibotPopupClosing(page);

    await acceptCookies(page);

    if (!checkVisibleAndScrollElem) {
      console.log("Ошибка поиска commentElemShowFirst");
      return null;
    }

    const baseCommentsClass = readJsonFileSync();

    // Извлечение значения ключа
    const { baseCommentsContainer } = baseCommentsClass;

    // Удаление ключа из объекта
    delete baseCommentsClass.baseCommentsContainer;

    await checkVisibleAndScrollElem.scrollIntoViewIfNeeded();

    await gettingAllElements({ page, locator: "*", name: "*", timeout: 2000 });

    const allContainersComment = await gettingAllElements({
      page,
      locator: baseCommentsContainer,
      name: "baseCommentsContainer",
      actionsFun: async (foundElems, count) => {
        const lastElem = await foundElems.nth(count - 1);
        await lastElem.scrollIntoViewIfNeeded();
      },
    });

    if (!allContainersComment) {
      console.log("ошибка в поиске контейнеров комментариев");
      return;
    }

    const commentsDataResult = [];

    for (
      let i = 0, length = await allContainersComment.count();
      i < length;
      i++
    ) {
      const commentContainer = await allContainersComment.nth(i);

      const searchDataComment = {};

      for (const keyNameClass in baseCommentsClass) {
        const classSearch = baseCommentsClass[keyNameClass];

        const { foundElems } = await searchLocatorElem({
          page,
          searchVariations: [
            { name: [keyNameClass], searchType: { locator: classSearch } },
          ],
          onlyOne: true,
          searchByElement: commentContainer,
        });

        if (!foundElems) {
          searchDataComment[keyNameClass] = foundElems;
          continue;
        }

        if (keyNameClass === "commetnDate") {
          searchDataComment[keyNameClass] = dateFilter(
            await foundElems.textContent()
          );
          continue;
        }

        if (keyNameClass === "commentStarRating") {
          searchDataComment[keyNameClass] = await starRatingGet(foundElems);
          continue;
        }

        const textContent = await foundElems.textContent();

        searchDataComment[keyNameClass] = textContent.trim();
      }

      commentsDataResult.push(searchDataComment);
    }

    return commentsDataResult;
  } catch (error) {
    console.error("Ошибка при обработке комментариев продукта:", error);
    return null;
  }
}

module.exports = productComment;
