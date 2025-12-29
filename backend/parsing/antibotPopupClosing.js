const checkVisibleDomByLocator = require("./contentProcessing/checkVisibleDomByLocator");

async function searchButton(page) {
  const elem = {
    name: "antibotButton",
    searchType: { locator: 'button:has-text("Обновить")' },
  };

  try {
    // Пытаемся получить видимый элемент по локатору
    const antibotButton = await checkVisibleDomByLocator({
      page,
      elem,
      timeout: 5000,
    });

    if (!antibotButton) return { antibotButton, count: 0 };

    // Получаем количество найденных элементов
    const count = await antibotButton.count();

    return { antibotButton, count };
  } catch (err) {
    // Обрабатываем ошибку поиска кнопки
    console.error("Ошибка при поиске кнопки:", err);
  }
}

async function antibotPopupClosing(page, actionsFun) {
  for (let i = 0; i < 2; i++) {
    try {
      // Пытаемся найти кнопку и получить ее количество
      const { antibotButton, count } = await searchButton(page);

      if (!antibotButton) break;

      // Если кнопка найдена и это не первый цикл, выполняем action
      if (i === 1 && count > 0) {
        await actionsFun();
      }

      // Если кнопка существует, кликаем по ней
      if (count > 0) {
        await antibotButton.click();
      }
    } catch (err) {
      // Обработка ошибок при работе с кнопкой
      console.error("Ошибка при обработке антибота:", err);
    }
  }
}

module.exports = antibotPopupClosing;
