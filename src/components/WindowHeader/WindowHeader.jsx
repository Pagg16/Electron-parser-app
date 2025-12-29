import React, { useEffect, useRef, useState } from "react";
import styles from "./WindowHeader.module.scss";
import UrlInput from "../UrlInput/UrlInput";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../store/product/productThunks";
import { addWords } from "../../store/search/wordsSearchSlise";
import ReportIssueButton from "./ReportIssueButton/ReportIssueButton";
import { fetchGetBaseClass } from "../../store/getBaseClass/getBaseClassThunks";
import { setLoadBaseClass } from "../../store/getBaseClass/getBaseClassSlise";
import { saveUrl } from "../../store/url/urlsSlice";
import { clearProductData } from "../../store/product/productSlice";

function WindowHeader() {
  const { isSuccessfully, isLoadingBaseClass } = useSelector(
    (state) => state.getBaseClass
  );

  const { isLoadingComments } = useSelector((state) => state.product);

  const { isLoadingProductInfo } = useSelector((state) => state.product);

  const isTimer = useRef(false);

  const isStartedUpdate = useRef(false);

  const [url, setUrl] = useState("");
  const [isNotUrlPopup, setIsNotUrlPopup] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isStartedUpdate.current) {
      isStartedUpdate.current = true;
      dispatch(fetchGetBaseClass());
    }
  }, []);

  const minimizeWindow = () => {
    window.electron.minimizeWindow();
  };

  const maximizeWindow = () => {
    window.electron.maximizeWindow();
  };

  const closeWindow = () => {
    window.electron.closeWindow();
  };

  function isOzonUrl(url) {
    const regex = /^https:\/\/www\.ozon\.ru\/product\//;

    if (regex.test(url)) {
      return true;
    }

    return false;
  }

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(saveUrl(url));
    dispatch(addWords([]));

    if (isOzonUrl(url)) {
      parsingPage();
    } else {
      setIsNotUrlPopup(true);
    }
  };

  function continueSearch() {
    setIsNotUrlPopup(false);
    parsingPage();
  }

  function stopSearch() {
    setIsNotUrlPopup(false);
  }

  function clearInput() {
    setUrl("");
    dispatch(saveUrl(""));
    dispatch(clearProductData());
    dispatch(addWords([]));
  }

  function parsingPage() {
    //функция запуска поиска
    dispatch(fetchProductData(url));
  }

  function updateBaseClasses() {
    dispatch(fetchGetBaseClass());
  }

  function isUpdatedText() {
    if (isSuccessfully && !isTimer.current) {
      isTimer.current = true;
      setTimeout(() => {
        isTimer.current = false;
        dispatch(setLoadBaseClass(false));
      }, 5000);
    }

    if (isTimer.current) {
      return "Обновлено";
    }

    if (isLoadingBaseClass) {
      return "Обновление";
    }

    return "Обновить";
  }

  const notUrlPopup = (
    <div
      className={classNames(
        styles.notUrlPopup,
        isNotUrlPopup && styles.notUrlPopup_open
      )}
    >
      <p className={styles.notUrlPopupTitle}>
        Вы уверены, что эта ссылка ведет на карточку товара с OZON?
      </p>
      <small className={styles.notUrlPopupSmall}>
        Обратите внимание: ссылки с других сайтов могут не работать.
      </small>
      <div className={styles.notUrlPopupBtnContainer}>
        <button className={styles.notUrlPopupBtn} onClick={continueSearch}>
          Продолжить поиск
        </button>
        <button onClick={stopSearch} className={styles.notUrlPopupBtn}>
          Остановить поиск
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.WindowHeader}>
      <UrlInput
        url={url}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        clearInput={clearInput}
      />

      <div className={styles.WindowHeaderControlsBlock}>
        <button
          disabled={
            isLoadingProductInfo || isLoadingComments || isLoadingBaseClass
          }
          onClick={updateBaseClasses}
          className={`${styles.WindowHeaderReloadData} ${
            (isLoadingProductInfo || isLoadingComments || isLoadingBaseClass) &&
            styles.WindowHeaderReloadDataUnactive
          }`}
          data-tooltip="Рекомендуется обновлять данные раз в несколько часов или при ошибках поиска"
        >
          {isUpdatedText()}
        </button>

        <ReportIssueButton />

        <div className={styles.Controls}>
          <div className={styles.ControlBtn} onClick={minimizeWindow}>
            <div className={styles.iconCollapse}></div>
          </div>
          <div className={styles.ControlBtn} onClick={maximizeWindow}>
            <div className={styles.iconExpand}></div>
          </div>
          <div className={styles.ControlBtn} onClick={closeWindow}>
            <div className={styles.iconClose}></div>
          </div>
        </div>
      </div>

      {notUrlPopup}
    </div>
  );
}

export default WindowHeader;
