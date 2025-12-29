import React, { useState } from "react";
import styles from "./ReportIssueButton.module.scss";

const gmail = "pagg16pagg@gmail.com";

function ReportIssueButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [isCopyGmai, setIsCopyGmail] = useState(false);

  const handleClick = (e) => {
    e.preventDefault(); // Предотвращаем переход по ссылке сразу
    setShowPopup((prev) => !prev); // Показываем попап
  };

  const handlePopupClose = () => {
    setShowPopup(false); // Закрываем попап
    window.location.href = `mailto:${gmail}?subject=Сообщить о проблеме&body=Опишите вашу проблему здесь`; // Переходим по ссылке
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(gmail); // Копирование почты в буфер обмена

    if (isCopyGmai) return;

    setIsCopyGmail(true); // Отображение подтверждения

    // Сброс состояния через 5 секунд
    setTimeout(() => {
      setIsCopyGmail(false);
    }, 800);
  };

  return (
    <div className={styles.ReportIssue}>
      <button className={styles.ReportIssueButton} onClick={handleClick}>
        Сообщить о проблеме
      </button>

      <div
        className={`${styles.ReportIssueButtonPopup} ${
          showPopup && styles.ReportIssueButtonPopup_open
        }`}
      >
        <div className={styles.emailCopyContainer}>
          {gmail}
          <button className={styles.copyButton} onClick={handleCopy}>
            {isCopyGmai ? "Скопировано" : "Копировать"}
          </button>
        </div>

        <div className={styles.ReportIssueButtons}>
          <button
            className={styles.ReportIssueButtonControl}
            onClick={handlePopupClose}
          >
            Открыть почту
          </button>
          <button
            className={styles.ReportIssueButtonControl}
            onClick={() => setShowPopup(false)}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportIssueButton;
