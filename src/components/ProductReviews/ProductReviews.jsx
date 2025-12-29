import React, { useEffect, useState } from "react";
import styles from "./ProductReviews.module.scss";
import StarRating from "../StarRating/StarRating";
import classNames from "classnames";
import { useSelector } from "react-redux";
import LoaderForElement from "../LoaderForElement/LoaderForElement";
import { parseDate } from "../../utils/dateUtils";

const ProductReviews = () => {
  const { comments, isLoadingComments, error } = useSelector(
    (state) => state.product
  );

  const [commentsDate, setCommentsDate] = useState(comments);
  const [isOpen, setIsOpen] = useState(false); // Управляет открытием меню
  const [selectedOption, setSelectedOption] = useState("По дате"); // Выбранная сортировка
  const [visibleOptions, setVisibleOptions] = useState([]);

  const options = ["По дате", "По рейтингу"]; // Варианты сортировки

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionSelect = (option) => {
    setSelectedOption(option); // Устанавливаем выбранный вариант
    setIsOpen(false); // Закрываем меню
  };

  useEffect(() => {
    if (isOpen) {
      options.forEach((option, index) => {
        setTimeout(() => {
          setVisibleOptions((prev) => [...prev, option]);
        }, index * 10); // 100ms задержка между элементами
      });
    } else {
      setVisibleOptions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!comments) return setCommentsDate([]);

    if (selectedOption === "По дате") {
      const sortedComments = [...comments].sort((a, b) => {
        const dateA = parseDate(a.commetnDate);
        const dateB = parseDate(b.commetnDate);
        return dateA - dateB; // Сортировка по убыванию
      });

      return setCommentsDate(sortedComments);
    }

    if (selectedOption === "По рейтингу") {
      const sortedByRating = [...comments].sort(
        (a, b) => b.commentStarRating - a.commentStarRating
      );
      return setCommentsDate(sortedByRating);
    }
  }, [selectedOption, comments]);

  return (
    <div className={styles.productReviews}>
      <div className={styles.productReviewsContainer}>
        <div className={styles.productReviewsControlPanelContainer}>
          <div className={styles.productReviewsControlPanel}>
            <div className={styles.productReviewsInform}>Отзывы</div>
            <div className={styles.productReviewsInformControlBar}>
              <p className={styles.sortTitle}>Сортировка:</p>
              <p className={styles.sortType}>{selectedOption}</p>
              <button
                onClick={toggleDropdown}
                className={classNames(
                  styles.sortButton,
                  isOpen && styles.sortButton_active
                )}
              >
                ᨆ
              </button>
            </div>
            <div
              className={classNames(
                styles.sortListType,
                isOpen && styles.sortListType_active
              )}
            >
              {visibleOptions.map((elem) => (
                <div
                  onClick={() => handleOptionSelect(elem)}
                  key={elem}
                  className={classNames(
                    styles.sortTypeElem,
                    elem === selectedOption && styles.sortTypeElem_select
                  )}
                >
                  {elem}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.reviewListContainer}>
          {isLoadingComments ? (
            <LoaderForElement />
          ) : commentsDate && commentsDate.length > 0 ? (
            commentsDate.map(
              (
                {
                  commentMessage,
                  commentStarRating,
                  commentTypeProduct,
                  commetnDate,
                  commetnName,
                },
                index
              ) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.generalInfoReview}>
                    <h3 className={styles.userName} data-tooltip={commetnName}>
                      {commetnName}
                    </h3>
                    <div className={styles.reviewDateStarContainer}>
                      <p className={styles.date}>{commetnDate}</p>
                      <div className={styles.starRatingContainer}>
                        <StarRating
                          externalStyles={{
                            starIcon: styles.starIcon,
                            ratingText: styles.ratingText,
                          }}
                          rating={commentStarRating}
                        />
                      </div>
                    </div>
                  </div>

                  {commentTypeProduct && (
                    <p
                      className={styles.productCharacteristics}
                      data-tooltip={commentTypeProduct}
                    >
                      {commentTypeProduct}
                    </p>
                  )}

                  {commentMessage && (
                    <details className={styles.commentDetails}>
                      <summary className={styles.commentSummary}>
                        Комментарий
                      </summary>
                      <p className={styles.reviewText}>{commentMessage}</p>
                    </details>
                  )}
                </div>
              )
            )
          ) : (
            <div className={styles.noFoundComments}>Комментариев пока нет</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
