import React, { useEffect, useRef, useState } from "react";
import styles from "./ProductInformation.module.scss";
import StarRating from "../StarRating/StarRating";
import classNames from "classnames";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import { useSelector } from "react-redux";
import LoaderForText from "../LoaderForText/LoaderForText";
import CreateExelFile from "../CreateExelFile/CreateExelFile";

function ProductInformation() {
  const { productInfo, isLoadingProductInfo, error } = useSelector(
    (state) => state.product
  );

  const notFoundText = "";

  const {
    productArticle = null,
    productPrice = null,
    productName = null,
    productReviews = null,
    productQuestions = null,
    productSales = null,
    productRating = null,
    productRatingStarFive,
    productRatingStarFour,
    productRatingStarThree,
    productRatingStarTwo,
    productRatingStarOne,
  } = productInfo || {};

  const textRef = useRef(null); // реф для текстового контейнера
  const [isOverflowing, setIsOverflowing] = useState(false); // состояние для переполнения
  const [isExpanded, setIsExpanded] = useState(false); // состояние для отображения полного текста

  function getRating(str) {
    if (!str) {
      return null;
    }

    return str.split("/")[0].trim();
  }

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const isOverflow = element.scrollWidth > element.clientWidth; // проверяем переполнение
      setIsOverflowing(isOverflow); // обновляем состояние переполнения
    }
  }, [productInfo, isLoadingProductInfo]); // Проверяем при изменении текста

  // Функция для переключения состояния текста
  const toggleText = () => setIsExpanded(!isExpanded);

  return (
    <div className={styles.productInformationContainer}>
      <DoughnutChart
        ratingInfo={{
          productRatingStarFive,
          productRatingStarFour,
          productRatingStarThree,
          productRatingStarTwo,
          productRatingStarOne,
        }}
        productRating={productRating}
      />

      <div className={styles.starRating}>
        <CreateExelFile productRating={productRating} />

        <StarRating rating={getRating(productRating) || 0} />

        <div
          className={classNames(styles.productNameContainer, {
            [styles.productNameContainer_loading]: isLoadingProductInfo,
          })}
        >
          <span className={styles.label}>
            Название товара:
            {!isLoadingProductInfo && isOverflowing && (
              <button onClick={toggleText} className={styles.toggleButton}>
                {isExpanded ? "Скрыть" : "Развернуть"}
              </button>
            )}
          </span>

          {!isLoadingProductInfo ? (
            <div className={styles.productNameBlock}>
              <span
                ref={textRef}
                className={classNames(styles.productName, {
                  [styles.productName_visibleText]: isExpanded,
                })}
              >
                {productName || notFoundText}
              </span>
            </div>
          ) : (
            <span className={styles.value}>
              <LoaderForText />
            </span>
          )}
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Артикул:</span>
          <span className={styles.value}>
            {!isLoadingProductInfo ? (
              productArticle || notFoundText
            ) : (
              <LoaderForText />
            )}
          </span>
        </div>
        <div className={styles.basicInformation}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Количество отзывов:</span>
            <span className={styles.value}>
              {!isLoadingProductInfo ? (
                productReviews || notFoundText
              ) : (
                <LoaderForText />
              )}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Количество вопросов:</span>
            <span className={styles.value}>
              {!isLoadingProductInfo ? (
                productQuestions || notFoundText
              ) : (
                <LoaderForText />
              )}
            </span>
          </div>
          {/* <div className={styles.infoRow}>
            <span className={styles.label}>Количество возвратов:</span>
            <span className={styles.value}>{productData.numberReturns}</span>
          </div> */}
          <div className={styles.infoRow}>
            <span className={styles.label}>Цена р:</span>
            <span className={styles.value}>
              {" "}
              {!isLoadingProductInfo ? (
                productPrice || notFoundText
              ) : (
                <LoaderForText />
              )}
            </span>
          </div>
          {/* <div className={styles.infoRow}>
            <span className={styles.label}>
              Доступность:{productData.quantityGoods > 0 ? "✔️" : "❌"}
            </span>
            <span className={styles.value}>
              {productData.quantityGoods > 0 ? "в наличии" : "нет в наличии"}
            </span>
          </div> */}
          {/* <div className={styles.infoRow}>
            <span className={styles.label}>Производитель:</span>
            <span className={styles.value}>{productData.brand}</span>
          </div> */}
          <div className={styles.infoRow}>
            <span className={styles.label}>Продавец:</span>
            <span className={styles.value}>
              {" "}
              {!isLoadingProductInfo ? (
                productSales || notFoundText
              ) : (
                <LoaderForText />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInformation;
