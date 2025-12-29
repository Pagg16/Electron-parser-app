import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./LineChart.module.scss";

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({
  labels = [],
  data = [],
  datasets = [],
  text = "",
  max = 0,
}) {
  function addBasicKeys(baseDataSets) {
    if (!Array.isArray(baseDataSets)) return [];

    const defaultKeys = {
      fill: false, // Заполнение графика
      borderColor: "#007bff", // Цвет линии
      borderWidth: 2, // Уменьшаем толщину линии
      tension: 0.1, // Тугоподвижность линии
      pointRadius: 3, // Радиус точек на линии
      pointBackgroundColor: "#007bff", // Цвет точек
      pointHoverRadius: 4, // Радиус точек при наведении
    };

    if (typeof baseDataSets[0] === "number") {
      return [{ ...defaultKeys, data: baseDataSets }];
    }

    return baseDataSets.map((dataObj) => mergeObjects(dataObj, defaultKeys));
  }

  function mergeObjects(parent, child) {
    const result = { ...parent }; // Копируем родительский объект

    for (const key in child) {
      if (!(key in parent)) {
        // Добавляем ключи, которые отсутствуют в родителе
        result[key] = child[key];
      } else if (
        typeof parent[key] === "object" &&
        typeof child[key] === "object"
      ) {
        // Если значения — объекты, рекурсивно сливаем их
        result[key] = mergeObjects(parent[key], child[key]);
      }
      // Если ключ есть в родителе, сохраняем его без изменений
    }

    return result;
  }

  const chartData = {
    labels,
    datasets: datasets.length > 0 ? addBasicKeys(datasets) : addBasicKeys(data),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text,
      },
      legend: {
        display: false, // Отключаем легенду
      },
    },
    scales: {
      x: {
        title: {
          display: false, // Отключаем название оси X
          text: "",
        },
        ticks: {
          autoSkip: true, // Пропускать метки для избежания перегрузки
          maxRotation: 45, // Максимальный угол наклона меток
        },
      },
      y: {
        title: {
          display: false, // Отключаем название оси Y
          text: "",
        },
        min: 0, // Минимальное значение по оси Y
        max, // Максимальное значение по оси Y
        ticks: {
          stepSize: 1, // Шаг между делениями оси Y
        },
      },
    },
  };

  return (
    <Line className={styles.lineChart} data={chartData} options={options} />
  );
}

export default LineChart;
