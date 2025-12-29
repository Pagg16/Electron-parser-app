import React, { useMemo } from "react";
import styles from "./ReviewCharWords.module.scss";
import { useSelector } from "react-redux";
import LineChart from "../LineChart/LineChart";
import LoaderForElement from "../LoaderForElement/LoaderForElement";
import { parseDate } from "../../utils/dateUtils";

function ReviewCharWords() {
  const wordsSearch = useSelector((state) => state.wordsSearch.wordsSearch);

  const { comments, isLoadingComments } = useSelector((state) => state.product);

  function prepareChartData(wordsSearch) {
    const lettersMap = {};
    const allDates = new Set();

    wordsSearch.forEach((entry) => {
      Object.entries(entry).forEach(([letter, { count, color, date }]) => {
        if (!lettersMap[letter]) {
          lettersMap[letter] = { counts: [], color, dates: new Map() };
        }
        lettersMap[letter].dates.set(date, count);
        allDates.add(date);
      });
    });

    const sortedDates = Array.from(allDates).sort(
      (a, b) => parseDate(a) - parseDate(b)
    );

    const datasets = Object.entries(lettersMap).map(
      ([letter, { dates, color }]) => ({
        label: letter,
        data: sortedDates.map((date) => dates.get(date) || 0),
        borderColor: color,
        pointBackgroundColor: color, // Цвет точек
      })
    ); 

    const maxValue = Math.max(...datasets.flatMap((dataset) => dataset.data));

    return { labels: sortedDates, datasets, maxValue };
  }

  // Мемоизация данных
  const { labels, datasets, maxValue } = useMemo(
    () => prepareChartData(wordsSearch),
    [wordsSearch]
  );

  return (
    <div className={styles.ReviewCharWords}>
      {isLoadingComments ? (
        <LoaderForElement />
      ) : comments && comments.length > 0 ? (
        <LineChart labels={labels} datasets={datasets} max={maxValue + 1} />
      ) : (
        <div className={styles.ReviewCharWordsCommentsNotFound}>
          Комментариев пока нет
        </div>
      )}
    </div>
  );
}

export default React.memo(ReviewCharWords);
