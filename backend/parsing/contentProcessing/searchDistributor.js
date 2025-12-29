const gettingElementUnderCursor = require("../cursor/gettingElementUnderCursor");
const searchLocatorElem = require("./searchLocatorElem");

async function comparison(foundInArrElem, foundElemsBoundingBox) {
  if (foundInArrElem?.comparison?.size) {
    const { width, height } = foundInArrElem.comparison.size;

    const matchesSize =
      Math.abs(foundElemsBoundingBox.width - width) < 2 &&
      Math.abs(foundElemsBoundingBox.height - height) < 2; // Допустимая разница

    if (!matchesSize) {
      return false;
    }

    return true;
  }

  return false;
}

async function childElementSearch({
  page,
  foundInArrElem,
  foundElemsBoundingBox,
  cursorPositionInElem,
  actions = false,
}) {
  const { x, y, width, height } = foundElemsBoundingBox;

  const { scrollX, scrollY } = await page.evaluate(() => {
    return { scrollX: window.scrollX, scrollY: window.scrollY };
  });

  let cursorStartX;
  let cursorStartY;

  let cursorPositionX;
  let cursorPositionY;

  if (cursorPositionInElem === "center") {
    cursorStartX = x + width / 2 + scrollX;
    cursorStartY = y + height / 2 + scrollY;

    cursorPositionX = cursorStartX + foundInArrElem.child.positionRelative.x;
    cursorPositionY = cursorStartY + foundInArrElem.child.positionRelative.y;
  }

  if (cursorPositionInElem === "start" && foundInArrElem.startCorrection) {
    cursorStartX = x + foundInArrElem.startCorrection + scrollX;
    cursorStartY = y + foundInArrElem.startCorrection + scrollY;

    cursorPositionX = cursorStartX - foundInArrElem.child.positionRelative.x;
    cursorPositionY = cursorStartY - foundInArrElem.child.positionRelative.y;
  }

  const child = await gettingElementUnderCursor({
    page,
    x: cursorPositionX,
    y: cursorPositionY,
    elemName: foundInArrElem.name,
    parentPosition: { parentX: cursorStartX, parentY: cursorStartY },
    actions,
    searchType: foundInArrElem?.child?.contentCheck,
    exactText: foundInArrElem?.child?.comparison?.innerText,
  });

  return child;
}

async function searchDistributor({ page, elem }) {
  if (!Array.isArray(elem)) {
    elem = [elem];
  }

  if (elem[0]?.searchType?.locator) {
    const { foundElems, index } = await searchLocatorElem({
      page,
      searchVariations: elem,
      onlyOne: true,
    });

    if (!foundElems) {
      console.log(`элемент с ${elem[0].name} именем не найден`);
      return { name: [elem[0].name] };
    }

    const foundInArrElem = elem[index];
    const name = elem[index].name;
    const foundElemsBoundingBox = await foundElems.boundingBox();

    if (foundInArrElem?.comparison) {
      const resultComparison = await comparison(
        foundInArrElem,
        foundElemsBoundingBox
      );

      if (!resultComparison) {
        console.log(`Ошибка сравнения при поиске на элементе ${elem[0].name}`);
        return { name: [elem[0].name] };
      }
    }

    if (foundInArrElem?.child) {
      const child = await childElementSearch({
        page,
        foundInArrElem,
        foundElemsBoundingBox,
        cursorPositionInElem: foundInArrElem.cursorPositionInElem,
        actions: foundInArrElem.child?.actions,
      });

      child.name = name;

      return child;
    } else {
      if (foundInArrElem?.getContent) {
        const dataResult = {};

        for (const dataType of foundInArrElem.getContent) {
          try {
            if (dataType === "innerText") {
              const text = await foundElems.innerText();
              dataResult.innerText = text;
            }

            if (dataType === "classList") {
              const classList = await foundElems.getAttribute("class");
              dataResult.classList = classList
                .split(" ") // Разделяем строку на массив классов
                .map((cls) => `.${cls}`) // Добавляем точку перед каждым классом
                .join(""); // Объединяем обратно в строку
            }
          } catch (error) {
            console.error(
              `Ошибка при получении данных типа "${dataType}":`,
              error
            );
          }
        }

        dataResult.name = name;

        return dataResult;
      }

      foundElems.name = name;

      return foundElems;
    }
  }

  return { name: [elem[0].name] };
}

module.exports = searchDistributor;
