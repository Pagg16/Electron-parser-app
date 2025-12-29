async function acceptCookies(page) {
  try {
    const textElement = page.locator(
      "text=/^Используем куки и рекомендательные технологии$/"
    );

    await textElement.waitFor({ state: "visible", timeout: 10000 });

    if ((await textElement.count()) === 1) {
      // Найти родительский блок текста
      const parentBlock = await textElement.locator("..");

      // Найти кнопку "ОК" внутри этого блока
      const okButton = parentBlock.locator("button", { hasText: /ок/i });

      // Проверить, видна ли кнопка, и нажать на нее
      if (await okButton.isVisible()) {
        await okButton.click();
      }
    }
  } catch {
    return;
  }
}

module.exports = acceptCookies;
