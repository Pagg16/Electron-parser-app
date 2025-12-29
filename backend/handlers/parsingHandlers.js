const { ipcMain } = require("electron");
const mainParsing = require("../parsing/mainParsing");
const {
  getBaseClassComment,
} = require("../parsing/contentProcessing/getBaseClassComment/getBaseClassComment");

function registerSearchHandlers() {
  ipcMain.handle("parseStart", async (event, url) => {
    const { productCardInform, commentsDataResult, browser } =
      await mainParsing({ url });

    productCardInform.then((data) =>
      event.sender.send("getProductInform", data)
    );

    commentsDataResult.then((data) =>
      event.sender.send("getProductComment", data)
    );
  });

  ipcMain.handle("getBaseClassCommentStart", async (event) => {
    try {
      const isSuccessfully = await getBaseClassComment();

      event.sender.send("getBaseClassComment", isSuccessfully);
    } catch (error) {
      event.sender.send("getBaseClassComment", false);
    }
  });
}

module.exports = { registerSearchHandlers };
