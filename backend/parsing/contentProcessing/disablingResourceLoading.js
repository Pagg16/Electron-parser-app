const resourceArr = ["image", "font", "media"];

async function disablingResourceLoading(page) {
  await page.route("**/*", (route) => {
    const request = route.request();

    // Блокировка изображений, шрифтов, медиа и стилей
    if (resourceArr.includes(request.resourceType())) {
      route.abort(); // Прерываем запрос
    } else {
      route.continue(); // Разрешаем остальные запросы
    }
  });
}

module.exports = disablingResourceLoading;
