const productSales = [
  //тип поска должен быть идентичен как и параметры провреки, в массиве допускаются только разные вариации родитель - ребенок
  {
    name: "productSales",
    searchType: { locator: "text=Premium-магазин" },
    cursorPositionInElem: "center",
    child: {
      positionRelative: { x: -64.7890625, y: 22 },
      contentCheck: ["innerText"],
    },
  },

  {
    name: "productSales",
    searchType: { locator: "text=/^Продавец$/" },
    cursorPositionInElem: "center",
    child: { positionRelative: { x: 0, y: 25 }, contentCheck: ["innerText"] },
  },
];

const productArticle = {
  name: "productArticle",
  searchType: { locator: "text=Артикул:" },
  getContent: ["classList", "innerText"],
};

const productPrice = {
  name: "productPrice",
  searchType: { locator: "text=Поделиться" },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: -300.09375, y: 74 },
    contentCheck: ["innerText"],
  },
};

const productName = {
  name: "productName",
  searchType: { locator: "text=Поделиться" },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: -761.3937377929688, y: 31 },
    contentCheck: ["innerText"],
  },
};

const productReviews = {
  name: "productReviews",
  searchType: { locator: "text=Поделиться" },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: -718.59375, y: 104 },
    contentCheck: ["innerText"],
  },
};

const productQuestions = {
  name: "productQuestions",
  searchType: { locator: "text=Поделиться" },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: -558.59375, y: 105 },
    contentCheck: ["innerText"],
  },
};

const productRating = {
  name: "productRating",
  searchType: {
    locator: "text=Рейтинг формируется на основе актуальных отзывов",
  },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: 149.984375, y: -65.40625 },
    contentCheck: ["innerText"],
  },
};

const productRatingStarFive = {
  name: "productRatingStarFive",
  searchType: {
    locator: "text=Рейтинг формируется на основе актуальных отзывов",
  },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: 204.984375, y: 55.59375 },
    contentCheck: ["innerText"],
  },
};

const productRatingStarFour = {
  name: "productRatingStarFour",
  searchType: {
    locator: "text=Рейтинг формируется на основе актуальных отзывов",
  },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: 203.984375, y: 74.59375 },
    contentCheck: ["innerText"],
  },
};

const productRatingStarThree = {
  name: "productRatingStarThree",
  searchType: {
    locator: "text=Рейтинг формируется на основе актуальных отзывов",
  },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: 204.984375, y: 102.59375 },
    contentCheck: ["innerText"],
  },
};

const productRatingStarTwo = {
  name: "productRatingStarTwo",
  searchType: {
    locator: "text=Рейтинг формируется на основе актуальных отзывов",
  },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: 203.984375, y: 122.59375 },
    contentCheck: ["innerText"],
  },
};

const productRatingStarOne = {
  name: "productRatingStarOne",
  searchType: {
    locator: "text=Рейтинг формируется на основе актуальных отзывов",
  },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: 203.984375, y: 148.59375 },
    contentCheck: "innerText",
  },
};

const productCardElemList = [
  productArticle,
  productPrice,
  productName,
  productReviews,
  productQuestions,
  productSales,
  productRating,
  productRatingStarFive,
  productRatingStarFour,
  productRatingStarThree,
  productRatingStarTwo,
  productRatingStarOne,
];

module.exports = productCardElemList;
