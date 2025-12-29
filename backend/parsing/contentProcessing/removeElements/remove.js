const searchDistributor = require("../searchDistributor");
const removeElemsList = require("./removeElemsList");

async function remove(page) {
  let isNotFound = false;
  for (const deleteElem of removeElemsList) {
    const foundElem = await searchDistributor({
      page,
      elem: deleteElem,
    });
    if (!foundElem) {
      isNotFound = true;
      break;
    }
  }

  return isNotFound;
}

module.exports = remove;
