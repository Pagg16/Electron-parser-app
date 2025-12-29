const commetnDate = {
  name: "commetnDate",
  searchType: { locator: "text=/^\\s*3 декабря 2024\\s*$/" },
  getContent: ["classList", "innerText"],
};

const baseCommentsContainer = {
  name: "baseCommentsContainer",
  searchType: { locator: "text=/^\\s*3 декабря 2024\\s*$/" },
  comparison: { size: { width: 100.125, height: 18 }, indexText: 0 },
  cursorPositionInElem: "center",
  child: { positionRelative: { x: -631.421875, y: 375.984375 } },
};

const commetnName = {
  name: "commetnName",
  searchType: { locator: "text=/^\\s*3 декабря 2024\\s*$/" },
  comparison: { size: { width: 100.125, height: 18 }, indexText: 0 },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: -578.421875, y: -0.015625 },
    contentCheck: ["classList", "innerText"],
  },
};

const commentStarRating = {
  name: "commentStarRating",
  searchType: { locator: "text=/^\\s*3 декабря 2024\\s*$/" },
  comparison: { size: { width: 100.125, height: 18 }, indexText: 0 },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: 110.578125, y: -1.015625 },
    contentCheck: ["classList"],
  },
};

const commentTypeProduct = {
  name: "commentTypeProduct",
  searchType: { locator: "text=/^\\s*3 декабря 2024\\s*$/" },
  comparison: { size: { width: 100.125, height: 18 }, indexText: 0 },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: -579.421875, y: 30.984375 },
    contentCheck: ["classList", "innerText"],
  },
};

const commentMessage = {
  name: "commentMessage",
  searchType: { locator: "text=/^\\s*3 декабря 2024\\s*$/" },
  comparison: { size: { width: 100.125, height: 18 }, indexText: 0 },
  cursorPositionInElem: "center",
  child: {
    positionRelative: { x: -581.421875, y: 63.984375 },
    contentCheck: ["classList", "innerText"],
  },
};

const commentBlockForScroll = {
  name: "commentBlockForScroll",
  searchType: { locator: "text=Показать сначала:" },
  comparison: { size: { width: 142.203125, height: 17 }, indexText: -1 },
  cursorPositionInElem: "center",
  child: { positionRelative: { x: -65.6015625, y: 102.484375 } },
};

const checkVisibleAndScroll = {
  name: "checkVisibleAndScroll",
  searchType: {
    locator: "text=Рейтинг формируется на основе актуальных отзывов",
  },
  comparison: {
    size: { width: 329.0625, height: 42 },
  },
};

const productCommentsList = [
  commetnDate,
  commentMessage,
  commentTypeProduct,
  commentStarRating,
  commetnName,
  baseCommentsContainer,
];

module.exports = {
  productCommentsList,
  checkVisibleAndScroll,
  commetnDate,
  commentBlockForScroll,
};
