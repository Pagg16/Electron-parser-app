import React from "react";
import styles from "./StarRating.module.scss";
import classNames from "classnames";

const StarRating = ({ externalStyles = null, rating = 5 }) => {
  const ratingLength = 5; // Общее количество звезд
  // Рассчитываем заполнение для каждой звезды
  const stars = Array.from({ length: ratingLength }, (_, index) => {
    const fillPercentage = Math.min(100, Math.max(0, (rating - index) * 100));
    return fillPercentage;
  });

  // Генерируем уникальный идентификатор для градиента
  const uniqueId = Math.random().toString(36).substring(2, 9);

  return (
    <div className={styles.starRatingContainer}>
      <div className={styles.starWrapper}>
        {stars.map((fill, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={externalStyles?.starIcon || styles.starIcon}
          >
            <defs>
              <linearGradient
                id={`gradient-${uniqueId}-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset={`${fill}%`} stopColor="#ffd700" />
                <stop offset={`${fill}%`} stopColor="#ddd" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#gradient-${uniqueId}-${index})`}
              stroke="#000"
              strokeWidth="0.5"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        ))}
      </div>
      <div
        className={classNames(styles.ratingText, externalStyles?.ratingText)}
      >{`${rating} / ${ratingLength}`}</div>
    </div>
  );
};

export default StarRating;
