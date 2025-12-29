import React, { useEffect, useState } from "react";
import LineChart from "../LineChart/LineChart";
import { useSelector } from "react-redux";
import styles from "./ReviewChartRating.module.scss";
import { parseDate } from "../../utils/dateUtils";
import LoaderForElement from "../LoaderForElement/LoaderForElement";

function ReviewChartRating() {
  const { comments, isLoadingComments } = useSelector((state) => state.product);

  const [viewType, setViewType] = useState("day"); // Режим отображения: "day" или "month"
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
    max: 0,
  });

  console.log(comments);

  const isDisabled = !comments || comments.length < 1;

  // Функция для группировки по дням
  const groupRatingByDay = (comments) => {
    return comments.reduce((acc, { commentStarRating, commetnDate }) => {
      console.log(commetnDate);

      const date = parseDate(commetnDate).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Если для этого дня ещё нет записи, создаём её
      if (!acc[date]) {
        acc[date] = { totalRating: 0, count: 0 };
      }

      // Добавляем рейтинг и увеличиваем счетчик
      acc[date].totalRating += commentStarRating;
      acc[date].count += 1;

      return acc;
    }, {});
  };

  // Функция для группировки по месяцам
  const groupRatingByMonth = (comments) => {
    return comments.reduce((acc, { commentStarRating, commetnDate }) => {
      // Преобразуем дату в формат месяц-год
      const date = parseDate(commetnDate).toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      });

      // Если для этого месяца ещё нет записи, создаём её
      if (!acc[date]) {
        acc[date] = { totalRating: 0, count: 0 };
      }

      // Добавляем рейтинг и увеличиваем счётчик
      acc[date].totalRating += commentStarRating;
      acc[date].count += 1;

      return acc;
    }, {});
  };

  // Обновление данных для графика при смене режима
  useEffect(() => {
    if (isDisabled) return;

    const sortedComments = [...comments].sort((a, b) => {
      const dateA = parseDate(a.commetnDate);
      const dateB = parseDate(b.commetnDate);
      return dateA - dateB;
    });

    // Группировка данных в зависимости от типа просмотра
    const groupedData =
      viewType === "day"
        ? groupRatingByDay(sortedComments)
        : groupRatingByMonth(sortedComments);

    // Создаем метки на основе сгруппированных данных
    const labels = Object.keys(groupedData);

    // Получаем значения для графика
    const values = labels.map((label) => {
      const { totalRating, count } = groupedData[label];
      return totalRating / count; // Средний рейтинг
    });

    // Находим максимальное значение для оси Y
    const max = Math.max(...values, 0) + 1;

    // Устанавливаем данные для графика
    setChartData({ labels, values, max });
  }, [viewType, comments]);

  return (
    <div className={styles.ReviewChartRating}>
      {!isLoadingComments && (
        <div className={styles.ReviewChartRatingBths}>
          <button
            disabled={isDisabled}
            className={`${styles.ReviewChartRatingBth} ${
              viewType === "day" ? styles.ReviewChartRatingBth_active : ""
            } ${isDisabled && styles.ReviewChartRatingQuantityBth_disabled}`}
            onClick={() => setViewType("day")}
          >
            По дням
          </button>

          <button
            disabled={isDisabled}
            className={`${styles.ReviewChartRatingBth} ${
              viewType === "month" ? styles.ReviewChartRatingBth_active : ""
            } ${isDisabled && styles.ReviewChartRatingQuantityBth_disabled}`}
            onClick={() => setViewType("month")}
          >
            По месяцам
          </button>
        </div>
      )}

      {isLoadingComments ? (
        <LoaderForElement />
      ) : comments && comments.length > 0 ? (
        <LineChart
          max={chartData.max}
          labels={chartData.labels}
          data={chartData.values}
          text="Средний рейтинг отзывов за период"
        />
      ) : (
        <div className={styles.commentsNotFound}>Комментариев пока нет</div>
      )}
    </div>
  );
}

export default ReviewChartRating;
