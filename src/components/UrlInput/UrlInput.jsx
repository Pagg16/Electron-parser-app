import React from "react";
import styles from "./UrlInput.module.scss";
import classNames from "classnames";
import { useSelector } from "react-redux";

const UrlInput = ({ url, handleInputChange, handleSubmit, clearInput }) => {
  const { isLoadingComments } = useSelector((state) => state.product);

  const { isLoadingProductInfo } = useSelector((state) => state.product);

  const { isLoadingBaseClass } = useSelector((state) => state.getBaseClass);

  return (
    <div
      className={`${styles.UrlInputContainer} ${
        (isLoadingProductInfo || isLoadingComments || isLoadingBaseClass) &&
        styles.UrlInputContaineUnactive
      }`}
    >
      <button
        className={classNames(
          styles.UrlInputContainer__btn,
          styles.UrlInputContainer__btn_clear
        )}
        onClick={clearInput}
      >
        Очистить
      </button>
      <input
        className={styles.UrlInputContainer__input}
        type="url"
        value={url}
        onChange={handleInputChange}
        placeholder="Введите ссылку на карточку товара с OZON:"
        required
      />
      <button className={styles.UrlInputContainer__btn} onClick={handleSubmit}>
        Поиск
      </button>
    </div>
  );
};

export default UrlInput;
