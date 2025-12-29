import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./ProductReviewsSorted.module.scss";
import getReadableRandomColor from "../../utils/getReadableRandomColor";
import { useDispatch, useSelector } from "react-redux";
import { parseDate } from "../../utils/dateUtils";
import { addWords, removeWords } from "../../store/search/wordsSearchSlise";
import LoaderForElement from "../LoaderForElement/LoaderForElement";

const ProductReviewsSorted = () => {
  const dispatch = useDispatch();

  const { comments, isLoadingComments, error } = useSelector(
    (state) => state.product
  );

  const [commentsList, setCommentsList] = useState([]);
  const [inputText, setInputText] = useState("");

  const [sortedWords, setSortedWords] = useState([]);

  const inputRefContainer = useRef();
  const inputBlockRefHeight = useRef();

  function handleInput(event) {
    setInputText(event.target.value);
  }

  function applyBaseheight() {
    if (!inputRefContainer.current) return;

    inputRefContainer.current.style = inputBlockRefHeight.current;
  }

  function handleKeyDown(event) {
    const inputTextTrim = inputText.trim();

    if (
      !inputTextTrim ||
      event.key !== "Enter" ||
      sortedWords.find(({ inputText }) => inputTextTrim === inputText)
    )
      return;

    setSortedWords((prev) => {
      const existingColors = prev.map((elem) => elem.color);
      const color = getReadableRandomColor("black", existingColors);
      return [{ inputText: inputTextTrim, color }, ...prev];
    });

    setInputText("");
  }

  function deleteElem(colorElem) {
    dispatch(removeWords(colorElem));
    setSortedWords((prev) => prev.filter(({ color }) => colorElem !== color));
  }

  function searchWordByComment(commentMessage, commetnDate) {
    if (!commentMessage) return;

    // Массив слов и их цветов
    const searchWordsColor = sortedWords.filter(({ inputText }) =>
      commentMessage.includes(inputText)
    );

    // Если нет совпадений, вернуть исходный текст
    if (searchWordsColor.length === 0) return;

    // Функция для оборачивания найденных слов
    const wordCount = {}; // Счетчик слов
    const highlightWords = (text) => {
      let result = [];
      let remainingText = text;

      while (remainingText) {
        let match = null;

        for (const { inputText, color } of searchWordsColor) {
          const index = remainingText.indexOf(inputText);
          if (index !== -1 && (!match || index < match.index)) {
            match = { inputText, color, index };
          }
        }

        if (!match) {
          result.push(remainingText);
          break;
        }

        if (match.index > 0) {
          result.push(remainingText.slice(0, match.index));
        }

        // Добавляем слово в счетчик
        if (wordCount[match.inputText]) {
          wordCount[match.inputText].count += 1;
        } else {
          wordCount[match.inputText] = {
            count: 1,
            color: match.color,
            date: commetnDate,
          };
        }

        result.push(
          <span
            className={styles.ProductReviewsSortedFoundText}
            style={{ backgroundColor: match.color }}
            key={uuidv4() + match.color}
          >
            {match.inputText}
          </span>
        );

        remainingText = remainingText.slice(
          match.index + match.inputText.length
        );
      }

      return result;
    };

    // Обернуть текст

    return { highlightedText: highlightWords(commentMessage), wordCount };
  }

  function createSearchWordsByComment(comments) {
    if (isLoadingComments) return <LoaderForElement />;

    if (!comments || comments.length < 1) {
      return (
        <span className={styles.commentMessageNotFound}>
          Комментариев пока нет
        </span>
      );
    }

    const wordsCountArr = [];

    const sortedComments = [...comments].sort((a, b) => {
      const dateA = parseDate(a.commetnDate);
      const dateB = parseDate(b.commetnDate);
      return dateA - dateB; // Сортировка по убыванию
    });

    const searchResults = sortedComments
      .map(({ commentMessage, commetnDate }, index) => {
        const result = searchWordByComment(commentMessage, commetnDate);
        const highlightedText = result?.highlightedText;
        const wordCount = result?.wordCount;

        if (wordCount) {
          wordsCountArr.push(wordCount);
        }

        if (!highlightedText) return null;

        return (
          <div key={index} className={styles.commentMessage}>
            {highlightedText}
          </div>
        );
      })
      .filter(Boolean); // Убираем `null` значения

    if (searchResults.length === 0) {
      return (
        <span className={styles.commentMessageNotFound}>
          Комментарии по ключевым словам не найдены
        </span>
      );
    }
    dispatch(addWords(wordsCountArr));
    return searchResults;
  }

  useEffect(() => {
    setCommentsList(createSearchWordsByComment(comments));
  }, [comments, isLoadingComments, sortedWords]);

  useEffect(() => {
    const colorOne = getReadableRandomColor("black");
    const colorTwo = getReadableRandomColor("black", [colorOne]);
    const colorFree = getReadableRandomColor("black", [colorOne, colorTwo]);

    setSortedWords([
      {
        inputText: "Отличный товар",
        color: colorOne,
      },
      {
        inputText: "Мне понравилось",
        color: colorTwo,
      },
      {
        inputText: "Спасибо продавцу",
        color: colorFree,
      },
    ]);
  }, []);

  return (
    <div className={styles.ProductReviewsSorted}>
      <div className={styles.ProductReviewsSortedList}>
        <div className={styles.ProductReviewsSortedWordsInputContainer}>
          <p className={styles.ProductReviewsSortedTitle}>Фильтр слов:</p>

          <div
            ref={(e) => {
              if (e) inputBlockRefHeight.current = e.clientHeight;
            }}
            className={styles.ProductReviewsSortedInputBlock}
          >
            <div
              ref={inputRefContainer}
              className={styles.ProductReviewsSortedInputContainer}
              onDoubleClick={applyBaseheight}
            >
              <input
                onKeyDown={handleKeyDown}
                onChange={handleInput}
                value={inputText}
                className={styles.sortedInput}
                wrap="hard"
                placeholder="Введите ключевое слово и нажмине enter"
              />

              <div className={styles.ProductReviewsSortedElements}>
                {sortedWords.map(({ inputText, color }) => {
                  return (
                    <span
                      key={color}
                      style={{ backgroundColor: color }}
                      className={styles.ProductReviewsSortedElement}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElem(color);
                        }}
                        className={styles.ProductReviewsSortedElementRemove}
                      ></button>
                      {inputText}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ProductReviewsSortedComments}>
          {commentsList}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewsSorted;
