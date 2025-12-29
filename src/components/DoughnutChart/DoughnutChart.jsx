import React, { useMemo } from "react";
import { ArcElement, Tooltip, Legend, Chart as ChartJS } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./DoughnutChart.module.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = React.memo(
  ({
    externalStyles = null,
    islegend = true,
    ratingInfo,
    productRating = false,
  }) => {
    const {
      productRatingStarFive = 0,
      productRatingStarFour = 0,
      productRatingStarThree = 0,
      productRatingStarTwo = 0,
      productRatingStarOne = 0,
    } = ratingInfo || {};

    const ratings = [
      {
        label: "1⭐",
        value: productRatingStarOne,
        color: "rgba(52, 68, 79, 0.2)",
      },
      {
        label: "2⭐",
        value: productRatingStarTwo,
        color: "rgba(52, 68, 79, 0.4)",
      },
      {
        label: "3⭐",
        value: productRatingStarThree,
        color: "rgba(52, 68, 79, 0.6)",
      },
      {
        label: "4⭐",
        value: productRatingStarFour,
        color: "rgba(52, 68, 79, 0.8)",
      },
      {
        label: "5⭐",
        value: productRatingStarFive,
        color: "rgba(52, 68, 79, 1)",
      },
    ];

    // Фильтруем метки только для тех категорий, у которых есть звезды
    const filteredLabels = ratings
      .filter(({ value }) => value > 0) // Оставляем только те категории, у которых есть звезды
      .map(({ label }) => label);

    const filteredData = ratings
      .filter(({ value }) => value > 0) // Аналогично фильтруем данные
      .map(({ value }) => value);

    const filterColors = ratings
      .filter(({ value }) => value > 0)
      .map(({ color }) => color);

    const data = {
      labels: productRating ? filteredLabels : false, // Метки категорий
      datasets: [
        {
          productRatingStarThree,
          data: productRating ? filteredData : [1], // Значения
          backgroundColor: productRating
            ? filterColors
            : ["rgba(52, 68, 79, 0.4)"],
          borderColor: "rgba(52, 68, 79, 1)", // Границы одного цвета
          borderWidth: 1, // Толщина границы
        },
      ],
    };

    const options = useMemo(
      () => ({
        responsive: true,
        plugins: {
          legend: {
            display: islegend, // Динамическое управление отображением легенды
            position: "top",
            labels: {
              boxWidth: 12,
              padding: 5,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        cutout: "60%",
      }),
      [islegend]
    );

    return (
      <div className={externalStyles?.doughnutChart || styles.doughnutChart}>
        <Doughnut data={data} options={options} />
      </div>
    );
  }
);

export default DoughnutChart;
