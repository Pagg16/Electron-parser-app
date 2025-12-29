const {
  productCard,
} = require("./contentProcessing/productCardPage/productCard/productCard");
const productComment = require("./contentProcessing/productCardPage/productComments/productComments");
const createBrowser = require("./createBrowser");

// const fs = require("fs");
// const path = require("path");
// function getDataFromJson() {
//   try {
//     // Указываем путь к файлу
//     const filePath = path.join(__dirname, "productData.json");

//     // Читаем содержимое файла синхронно
//     const data = fs.readFileSync(filePath, "utf8");

//     // Парсим данные из JSON
//     const parsedData = JSON.parse(data);

//     // Возвращаем данные
//     return parsedData;
//   } catch (error) {
//     console.error("Ошибка при чтении или парсинге файла JSON:", error);
//     return null;
//   }
// }
// async function saveDataToJson(productData, commentData) {
//   try {
//     // Формируем путь для файла
//     const filePath = path.join(__dirname, "productData.json");

//     // Собираем все данные в один объект
//     const dataToSave = {
//       productCardInform: productData,
//       commentsDataResult: commentData,
//     };

//     // Записываем данные в файл
//     fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), "utf8");
//     console.log("Данные успешно сохранены в файл productData.json");
//   } catch (error) {
//     console.error("Ошибка при записи данных в JSON:", error);
//   }
// }

// const url =
//   "https://www.ozon.ru/product/shorty-adidas-sportswear-j-tr-es-short-1586484071/?advert=AA4BzlqyRKqsnCZwEAfGx-0XrjBvCZQb03EUJwa1pSi8IhNFO-YOxqRf9dfyN4l3UFFAlBPi4qzm3qP5AbQ9mHGWBR7gCwZCT9lqpDTmIZRvrMcZsc29OM2mgY-6MlliM2bt3fBQheKI5Gj1tRLNRMjo2N5-UHHeRTchEoFcj5cMBlIBHKKan9rUK2TVz20iG7Tyw8AdD7Uv14OD_u2MlWrQISRNAvuu1yyp9LyNdxCDCA59YU8uODekKLXlPkHjTusZB1bv-6lGs5k-jI2y1koAoV-cPyU9jLtO51-LUSgMBo8XnjyelKzPPQDno4Z6hMHiRO643WD-jEKYbKKsxVCwbHgqOq5FRM_LABVG1QkZaLh_hYpXfAlekEGws3IVPLrSPC5GPepSuPJYMscxKVyYfbDOVp5qNTAG-OjyGx7YhbyMkmUUnxTSQl4DQtcAqstS4DzgPB5taDLamLvOjuV_Dp4&avtc=1&avte=4&avts=1734255553&keywords=%D1%88%D0%BE%D1%80%D1%82%D1%8B";

async function mainParsing({ headless = false, url }) {
  const browser = await createBrowser({ headless });

  // const { productCardInform, commentsDataResult } = getDataFromJson();

  // // Возвращаем первый объект сразу
  // const firstData = new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(productCardInform);
  //   }, 3000);
  // });

  // // Задерживаем отдачу второго объекта
  // const secondData = new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(commentsDataResult); // Задержка в 2 секунды, можно изменить
  //   }, 2000); // 2000 миллисекунд (2 секунды)
  // });

  // return {
  //   firstData,
  //   secondData,
  // };

  const productCardInform = productCard(browser, url);
  const commentsDataResult = productComment(browser, url);

  // Ожидание выполнения обоих промисов перед закрытием браузера
  // Закрытие браузера после выполнения всех промисов
  Promise.allSettled([productCardInform, commentsDataResult]).finally(() =>
    browser.close()
  );

  return {
    productCardInform,
    commentsDataResult,
    browser,
  };
  // await saveDataToJson(productCardInform, commentsDataResult);
}
module.exports = mainParsing;

// mainParsing({ headless: false, itemSearchDisplay: false }, url);
