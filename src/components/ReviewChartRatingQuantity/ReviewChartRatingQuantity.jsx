import React, { useEffect, useState } from "react";
import LineChart from "../LineChart/LineChart";
import { useSelector } from "react-redux";
import styles from "./ReviewChartRatingQuantity.module.scss";
import { parseDate } from "../../utils/dateUtils";
import LoaderForElement from "../LoaderForElement/LoaderForElement";

function ReviewChartRatingQuantity() {
  const { comments, isLoadingComments } = useSelector((state) => state.product);

  const [viewType, setViewType] = useState("day"); // Режим отображения: "day" или "month"
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
    max: 0,
  });

  const isDisabled = !comments || comments.length < 1;

  // Функция для группировки по дням
  const groupByDay = (comments) => {
    return comments.reduce((acc, { commetnDate }) => {
      const date = parseDate(commetnDate).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  };

  // Функция для группировки по месяцам
  const groupByMonth = (comments) => {
    return comments.reduce((acc, { commetnDate }) => {
      const date = parseDate(commetnDate).toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      });
      acc[date] = (acc[date] || 0) + 1;
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

    const groupedData =
      viewType === "day"
        ? groupByDay(sortedComments)
        : groupByMonth(sortedComments);

    const labels = Object.keys(groupedData);
    const values = labels.map((label) => groupedData[label]);
    const max = Math.max(...values, 0) + 1;

    setChartData({ labels, values, max });
  }, [viewType, comments]);

  return (
    <div className={styles.ReviewChartRatingQuantity}>
      {!isLoadingComments && (
        <div className={styles.ReviewChartRatingQuantityBths}>
          <button
            disabled={isDisabled}
            className={`${styles.ReviewChartRatingQuantityBth} ${
              viewType === "day"
                ? styles.ReviewChartRatingQuantityBth_active
                : ""
            } ${isDisabled && styles.ReviewChartRatingQuantityBth_disabled}`}
            onClick={() => setViewType("day")}
          >
            По дням
          </button>

          <button
            disabled={isDisabled}
            className={`${styles.ReviewChartRatingQuantityBth} ${
              viewType === "month"
                ? styles.ReviewChartRatingQuantityBth_active
                : ""
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
          text="Количество отзывов за период"
        />
      ) : (
        <div className={styles.commentsNotFound}>Комментариев пока нет</div>
      )}
    </div>
  );
}

export default ReviewChartRatingQuantity;
