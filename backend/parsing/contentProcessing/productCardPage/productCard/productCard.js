const acceptCookies = require("../../../acceptCookies");
const antibotPopupClosing = require("../../../antibotPopupClosing");
const createPage = require("../../../createPage");
const checkVisibleDomByLocator = require("../../checkVisibleDomByLocator");
const {
  checkVisibleAndScroll,
} = require("../../getBaseClassComment/productCommentsList");
const remove = require("../../removeElements/remove");
const searchDistributor = require("../../searchDistributor");
const productCardElemList = require("./productCardElemList");

function numberReviews(str) {
  try {
    // Разделяем строку по символу "•"
    const parts = str.split("•");

    if (parts.length > 1) {
      // Извлекаем вторую часть, которая после "•"
      const reviewText = parts[1].trim();

      // Убираем все пробелы между цифрами
      const reviewCount = reviewText.replace(/\s+/g, "").split(" ")[0];

      // Возвращаем только цифры (удаляем слово "отзывов")
      return onlyNumberStr(reviewCount); // Убираем все символы, кроме цифр
    }

    return "Ошибка извлечения количества отзывов"; // Если символ "•" не найден
  } catch (error) {
    console.log(
      `Ошибка в функции numberReviews,при обработке данных ${str}`,
      error
    );
    return "Ошибка извлечения данных";
  }
}

function onlyNumberStr(str) {
  try {
    return str.replace(/[^\d]/g, ""); // Убираем все символы, кроме цифр
  } catch (error) {
    console.log(
      `Ошибка в функции onlyNumberStr,при обработке данных ${str}`,
      error
    );
    return "Ошибка извлечения данных";
  }
}

async function productCard(browser, url) {
  try {
    const page = await createPage(browser);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.bringToFront();

    await antibotPopupClosing(page);

    await acceptCookies(page);

    await remove(page);

    const checkVisibleAndScrollElem = await checkVisibleDomByLocator({
      page,
      elem: checkVisibleAndScroll,
      timeout: 30000,
    });

    if (!checkVisibleAndScrollElem) {
      console.log("Ошибка поиска checkVisibleAndScroll");
      return null;
    }

    await checkVisibleAndScrollElem.scrollIntoViewIfNeeded();

    const productCardInform = {};

    for (const elem of productCardElemList) {
      const searchResult = await searchDistributor({
        page,
        elem,
      });

      const foundName = searchResult.name;
      const foundText = searchResult?.innerText;

      if (!foundText) {
        productCardInform[foundName] = "не найдено";
        continue;
      }

      let isProcessed = false;

      if (foundName === "productArticle") {
        isProcessed = true;
        productCardInform[foundName] = onlyNumberStr(foundText);
      }

      if (foundName === "productPrice") {
        isProcessed = true;
        productCardInform[foundName] = onlyNumberStr(foundText);
      }

      if (foundName === "productReviews") {
        isProcessed = true;
        productCardInform[foundName] = numberReviews(foundText);
      }

      if (foundName === "productQuestions") {
        isProcessed = true;
        productCardInform[foundName] = onlyNumberStr(foundText);
      }

      if (!isProcessed) productCardInform[foundName] = foundText;
    }

    return productCardInform;
  } catch (error) {
    console.error("Ошибка при обработке карточки продукта:", error);
    return null;
  }
}

module.exports = { productCard };
