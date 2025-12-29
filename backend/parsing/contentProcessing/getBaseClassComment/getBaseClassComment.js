const checkingLogFile = require("../../checkingLogFile");
const getResourcePath = require("../../../getResourcePath/getResourcePath");
const acceptCookies = require("../../acceptCookies");
const antibotPopupClosing = require("../../antibotPopupClosing");
const createBrowser = require("../../createBrowser");
const createPage = require("../../createPage");
const checkVisibleDomByLocator = require("../checkVisibleDomByLocator");
const gettingAllElements = require("../gettingAllElements");
const searchDistributor = require("../searchDistributor");
const {
  productCommentsList,
  checkVisibleAndScroll,
  commetnDate,
  commentBlockForScroll,
} = require("./productCommentsList");
const fs = require("fs");
const path = require("path");

const filePath = getResourcePath({
  developmentPath: path.join(__dirname, "../../../"),
  folder: "baseClass",
  filePath: "baseClassComment.json",
});

const urlBaseClassesGet =
  "https://www.ozon.ru/product/shorty-adidas-sportswear-j-tr-es-short-1586484071/?advert=AA4BzlqyRKqsnCZwEAfGx-0XrjBvCZQb03EUJwa1pSi8IhNFO-YOxqRf9dfyN4l3UFFAlBPi4qzm3qP5AbQ9mHGWBR7gCwZCT9lqpDTmIZRvrMcZsc29OM2mgY-6MlliM2bt3fBQheKI5Gj1tRLNRMjo2N5-UHHeRTchEoFcj5cMBlIBHKKan9rUK2TVz20iG7Tyw8AdD7Uv14OD_u2MlWrQISRNAvuu1yyp9LyNdxCDCA59YU8uODekKLXlPkHjTusZB1bv-6lGs5k-jI2y1koAoV-cPyU9jLtO51-LUSgMBo8XnjyelKzPPQDno4Z6hMHiRO643WD-jEKYbKKsxVCwbHgqOq5FRM_LABVG1QkZaLh_hYpXfAlekEGws3IVPLrSPC5GPepSuPJYMscxKVyYfbDOVp5qNTAG-OjyGx7YhbyMkmUUnxTSQl4DQtcAqstS4DzgPB5taDLamLvOjuV_Dp4&avtc=1&avte=4&avts=1734255553&keywords=%D1%88%D0%BE%D1%80%D1%82%D1%8B";

async function getBaseClassComment() {
  checkingLogFile();

  const browser = await createBrowser({ headless: false, isBaseClass: true });
  try {
    
    let page;

    async function buildPage() {

      if (page) {
        await page.close();
      }

      page = await createPage(browser);

      try {
        // Переходим на URL с заданными настройками
        await page.goto(urlBaseClassesGet, {
          waitUntil: "domcontentloaded",
          timeout: 60000, // Увеличиваем время ожидания, если нужно
        });
      } catch (err) {
        console.error("Ошибка при переходе на страницу:", err);
      }

      await gettingAllElements({
        page,
        locator: "*",
        name: "*",
        timeout: 5000,
      });
    }

    await buildPage();

    await antibotPopupClosing(page, async () => {
      await buildPage();
    });

    await acceptCookies(page);

    const checkVisibleAndScrollElem = await checkVisibleDomByLocator({
      page,
      elem: checkVisibleAndScroll,
      timeout: 10000,
    });

    if (!checkVisibleAndScrollElem) {
      console.log("Ошибка поиска checkVisibleAndScroll");
      return null;
    }

    await checkVisibleAndScrollElem.scrollIntoViewIfNeeded();

    const checkVisibleCommentText = await checkVisibleDomByLocator({
      page,
      elem: commentBlockForScroll,
      timeout: 10000,
    });

    if (!checkVisibleCommentText) {
      console.log("Элемент поиска checkVisibleCommentText");
    }

    const commentBlockForScrollElem = await searchDistributor({
      page,
      elem: commentBlockForScroll,
    });

    console.log(commentBlockForScrollElem);

    if (!commentBlockForScrollElem.classList) {
      console.log("Ошибка поиска commentBlockForScrollElem");
      return null;
    }

    await gettingAllElements({
      page,
      locator: commentBlockForScrollElem.classList,
      name: "scroll",
      timeout: 5000,
      actionsFun: async (foundElems, count) => {
        const lastElem = await foundElems.nth(count - 1);
        await lastElem.scrollIntoViewIfNeeded();

        const commetnDateElem = await checkVisibleDomByLocator({
          page,
          elem: commetnDate,
          timeout: 5000,
        });

        if (commetnDateElem) {
          console.log("Элемент commetnDateElem найден", count - 1);
          return true;
        }
      },
    });

    const rsultNameClasses = {};

    for (const elem of productCommentsList) {
      const searchResult = await searchDistributor({
        page,
        elem,
      });

      rsultNameClasses[searchResult.name] = searchResult.classList;
    }

    const values = Object.values(rsultNameClasses);

    // Сортируем значения
    values.sort();

    // Проверяем на дубли
    const hasDuplicates = values.some(
      (value, index) => value === values[index + 1]
    );

    if (hasDuplicates) {
      console.log("найденны дубликаты в поиске классов коменнтариев");
      return null;
    }

    writeToJsonFile(rsultNameClasses);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    await browser.close();
  }
}

function writeToJsonFile(data) {
  // Проверяем, существует ли файл
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Если файл не существует, создаем его с данными
      const initialData = typeof data === "object" && data !== null ? data : {};
      fs.writeFile(filePath, JSON.stringify(initialData, null, 2), (err) => {
        if (err) {
          console.error("Ошибка при создании файла:", err);
        } else {
          console.log("Файл успешно создан и данные записаны!");
        }
      });
    } else {
      // Если файл существует, читаем его
      fs.readFile(filePath, "utf8", (err, fileData) => {
        if (err) {
          console.error("Ошибка при чтении файла:", err);
        } else {
          let parsedData;
          try {
            // Пытаемся парсить JSON
            parsedData = JSON.parse(fileData);

            // Если данные являются объектом, обновляем его
            if (typeof parsedData === "object" && parsedData !== null) {
              // Обновляем значения в объекте
              parsedData = { ...parsedData, ...data };
            } else {
              console.warn(
                "Содержимое файла не является объектом, создаём новый..."
              );
              parsedData = { ...data };
            }
          } catch (parseError) {
            console.warn("Некорректный JSON, перезаписываем файл...");
            parsedData = { ...data }; // В случае ошибки чтения, записываем новые данные
          }

          // Перезаписываем файл с новыми данными
          fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), (err) => {
            if (err) {
              console.error("Ошибка при записи данных в файл:", err);
            } else {
              console.log("Данные успешно обновлены!");
            }
          });
        }
      });
    }
  });
}

module.exports = { getBaseClassComment, urlBaseClassesGet };
