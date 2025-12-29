import React, { useState } from "react";
import styles from "./CreateExelFile.module.scss";
import { useSelector } from "react-redux";

const baseText = "Создать документ ";

function CreateExelFile({ productRating }) {
  const { productInfo } = useSelector((state) => state.product);
  const { url } = useSelector((state) => state.saveUrl);

  const [isSavedText, setIsSavedText] = useState(baseText);

  function showSaveDialog() {
    if (isSavedText !== baseText) return;

    setIsSavedText("Сохранение...");

    const headers = [
      "Ссылка на товар",
      "Артикул",
      "Цена",
      "Название",
      "Отзывы",
      "Вопросы",
      "Продавец",
      "Рейтинг",
      "5 звезд",
      "4 звезды",
      "3 звезды",
      "2 звезды",
      "1 звезда",
    ];

    const {
      productArticle = "",
      productPrice = "",
      productName = "",
      productReviews = "",
      productQuestions = "",
      productSales = "",
      productRating = "",
      productRatingStarFive = "",
      productRatingStarFour = "",
      productRatingStarThree = "",
      productRatingStarTwo = "",
      productRatingStarOne = "",
    } = productInfo || {};

    const data = [
      [
        url,
        productArticle,
        productPrice,
        productName,
        productReviews,
        productQuestions,
        productSales,
        productRating,
        productRatingStarFive,
        productRatingStarFour,
        productRatingStarThree,
        productRatingStarTwo,
        productRatingStarOne,
      ],
    ];

    window.electron
      .createExel([headers, ...data]) // вызываем функцию для создания и сохранения файла
      .then((resulr) => {
        setIsSavedText("Сохранено");
        if (resulr === "successfully") {
          setTimeout(() => {
            setIsSavedText(baseText);
          }, 1000);
        } else if (resulr === "cancellation") {
          setIsSavedText("Отменено");
          setTimeout(() => {
            setIsSavedText(baseText);
          }, 1000);
        } else if (resulr === "errorSaved") {
          setIsSavedText("Ошибка");
          setTimeout(() => {
            setIsSavedText(baseText);
          }, 1000);
        } else {
          if (resulr === "successfully") {
            setTimeout(() => {
              setIsSavedText(baseText);
            }, 1000);
          }
        }
      })
      .catch((error) => {
        setIsSavedText("Ошибка");
        setTimeout(() => {
          setIsSavedText(baseText);
        }, 1000);
      });
  }

  return (
    <button
      onClick={showSaveDialog}
      disabled={!productRating || isSavedText !== baseText}
      className={`${styles.starRatingBtnExport} ${
        !productRating && styles.starRatingBtnExport_disable
      }`}
    >
      {isSavedText}
      <span className={styles.starRatingBtnExportText}>Exel</span>
    </button>
  );
}

export default CreateExelFile;
