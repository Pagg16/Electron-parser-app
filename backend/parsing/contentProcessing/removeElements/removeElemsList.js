const removeElemsList = [
  // {
  //   name: "delete",
  //   searchType: { locator: "text=Этот вариант товара" },
  //   cursorPositionInElem: "center",
  //   child: {
  //     positionRelative: { x: 465.953125, y: -1.390625 },
  //     actions: "remove",
  //   },
  // },
  {
    name: "delete",
    searchType: { locator: "text=Поделиться" },
    cursorPositionInElem: "center",
    child: {
      positionRelative: { x: -330.6937255859375, y: 57 },
      actions: "remove",
      contentCheck: ["innerText"],
      comparison: { innerText: ["Распродажа", "Топ-выгода"] },
    },
  },
];

module.exports = removeElemsList;
