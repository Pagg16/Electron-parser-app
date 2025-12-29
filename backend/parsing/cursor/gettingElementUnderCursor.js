const {
  addNewlogsSearchElemCoordinates,
  removeLogsSearchElemCoordinates,
} = require("../contentProcessing/logsSearchElem/handlesLogsCoordinates");

async function gettingElementUnderCursor({
  page,
  x,
  y,
  elemName,
  parentPosition,
  isOnlyType = "",
  searchType = [],
  cursorVisible = true,
  actions,
  exactText = [],
}) {
  const searchElem = await page.evaluate(
    ({ x, y, cursorVisible, parentPosition, actions, exactText }) => {
      function linePointer() {
        const { parentX, parentY } = parentPosition;
        const sizeLine = 2;
        const color = "black";

        // Создаем новую линию
        const lineOne = document.createElement("div");
        const deltaX = x - parentX;
        const deltaY = y - parentY;
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        lineOne.style.position = "absolute";
        lineOne.style.width = `${length}px`;
        lineOne.style.height = `${sizeLine}px`;
        lineOne.style.backgroundColor = color;
        lineOne.style.top = `${parentY}px`;
        lineOne.style.left = `${parentX}px`;
        lineOne.style.transform = `rotate(${Math.atan2(deltaY, deltaX)}rad)`;
        lineOne.style.transformOrigin = "0 50%";
        lineOne.style.pointerEvents = "none";

        document.body.appendChild(lineOne);
      }

      async function visualizationCursorPositionsPoint(x, y, color = "red") {
        // Рисуем крестик

        const crossSize = 20; // Размер крестика в пикселях

        // Вертикальная линия
        const verticalLine = document.createElement("div");
        verticalLine.style.position = "absolute";
        verticalLine.style.width = "2px";
        verticalLine.style.height = `${crossSize * 2}px`;
        verticalLine.style.backgroundColor = color;
        verticalLine.style.top = `${y - crossSize}px`;
        verticalLine.style.left = `${x}px`;
        verticalLine.style.transform = "translate(-50%, 0)";
        verticalLine.style.pointerEvents = "none";

        // Горизонтальная линия
        const horizontalLine = document.createElement("div");
        horizontalLine.style.position = "absolute";
        horizontalLine.style.width = `${crossSize * 2}px`;
        horizontalLine.style.height = "2px";
        horizontalLine.style.backgroundColor = color;
        horizontalLine.style.top = `${y}px`;
        horizontalLine.style.left = `${x - crossSize}px`;
        horizontalLine.style.transform = "translate(0, -50%)";
        horizontalLine.style.pointerEvents = "none";

        // Добавляем линии в документ
        document.body.appendChild(verticalLine);
        document.body.appendChild(horizontalLine);
      }

      function searchElementUnderCursor() {
        if (cursorVisible) visualizationCursorPositionsPoint(x, y, "#000000");

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const correctionY = 0; // Коррекция для смещения
        const correctionX = 0;

        const scrollByTop = Math.max(y - viewportHeight / 2 + correctionY, 0);
        const scrollByLeft = Math.max(x - viewportWidth / 2 + correctionX, 0);

        // Прокрутка страницы
        window.scrollTo({
          left: scrollByLeft,
          top: scrollByTop,
        });

        // Поиск элемента по координатам
        const element = document.elementFromPoint(
          x - window.scrollX,
          y - window.scrollY
        );

        if (element) {
          const elemDate = {
            tagName: element.tagName,
            classList: Array.from(element.classList)
              .map((cls) => `.${cls}`)
              .join(""),
            innerText: element.innerText,
          };
          let isFoundText = false;

          if (exactText.length > 0) {
            for (const text of exactText) {
              if (elemDate.innerText.includes(text)) {
                isFoundText = true;
                break;
              }
            }

            if (!isFoundText) {
              elemDate.innerText = "";
            }
          }

          if (isFoundText && actions && actions === "remove") {
            element.remove();
          }
          return elemDate;
        }

        return null; // Если элемент не найден
      }

      return searchElementUnderCursor();
    },

    { x, y, cursorVisible, parentPosition, actions, exactText }
  );

  if (searchElem) {
    const conditions = [
      {
        condition: searchType.includes("tagName") && !searchElem.tagName,
        field: "tagName",
      },
      {
        condition: searchType.includes("innerText") && !searchElem.innerText,
        field: "innerText",
      },
      {
        condition: searchType.includes("classList") && !searchElem.classList,
        field: "classList",
      },
    ];

    let logFields = []; // Массив для сбора несоответствий

    if (actions !== "remove") {
      for (const { condition, field } of conditions) {
        if (condition) {
          logFields.push(field); // Добавляем поле, которое не соответствует
        }
      }
    }

    if (logFields.length > 0) {
      // Если есть несоответствия, отправляем их все за один раз
      await addNewlogsSearchElemCoordinates({
        page,
        elemName,
        position: { x, y },
        searchType: logFields, // Передаем все несоответствия
      });
    } else {
      removeLogsSearchElemCoordinates({ elemName, position: { x, y } });
    }
  } else if (actions !== "remove") {
    await addNewlogsSearchElemCoordinates({
      page,
      elemName,
      position: { x, y },
    });
  }

  if (isOnlyType) {
    return searchElem[isOnlyType];
  }
  return searchElem;
}

module.exports = gettingElementUnderCursor;

// function getAbsoluteXPath(element) {
//   let xpath = "";
//   while (element && element.nodeType === Node.ELEMENT_NODE) {
//     let index = 1;
//     let sibling = element.previousElementSibling;

//     // Проверяем наличие предыдущих братьев с тем же тегом
//     while (sibling) {
//       if (
//         sibling.nodeType === Node.ELEMENT_NODE &&
//         sibling.tagName === element.tagName
//       ) {
//         index++;
//       }
//       sibling = sibling.previousElementSibling;
//     }

//     const tagName = element.tagName.toLowerCase();
//     xpath = `/${tagName}[${index}]` + xpath;
//     element = element.parentNode;
//   }

//   return "/" + xpath;
// }
