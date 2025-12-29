let cursorPosition = { x: 0, y: 0 };

async function userMovementEmulation(page, elem) {
  const boundingBox = await elem.boundingBox();

  if (!boundingBox) {
    throw new Error("Не удалось получить координаты элемента");
  }

  const { x, y, width, height } = boundingBox;
  const randomX = x + Math.round(Math.random() * width);
  const randomY = y + Math.round(Math.random() * height);

  // Эмулируем движение мыши с задержками
  await cursorMovement(page, randomX, randomY);
}

async function moveRandomCursorPosition(page, isVirtualCursor) {
  // Получаем размеры окна
  const viewport = await page.viewportSize();

  if (!viewport) {
    throw new Error("Не удалось получить размеры окна.");
  }

  // Генерируем случайные координаты
  const randomX = Math.floor(Math.random() * viewport.width);
  const randomY = Math.floor(Math.random() * viewport.height);

  await moveCursorPosition(isVirtualCursor, page, randomX, randomY);
}

async function moveCursorPosition(isVirtualCursor, page, x, y) {
  cursorPosition = { x, y };
  await page.mouse.move(x, y); // Двигаем реальный курсор
  if (!isVirtualCursor) return;

  virtualCursorMove(page, x, y);
}

function bezierCurve(start, end, t) {
  const cx = start.x + (end.x - start.x) * t;
  const cy = start.y + (end.y - start.y) * t;
  return { x: cx, y: cy };
}

async function virtualCursorMove(page, x, y) {
  await page.evaluate(
    ({ x, y }) => {
      window.updateCursor(x, y); // Двигаем "виртуальный" курсор
    },
    { x, y }
  );
}

async function cursorMovement(page, endX, endY) {
  const start = { x: cursorPosition.x, y: cursorPosition.y };
  const end = { x: endX, y: endY };

  const stepDistance = 10;

  // Вычисление расстояния между точками
  const distance = Math.sqrt(
    Math.pow(endX - cursorPosition.x, 2) + Math.pow(endY - cursorPosition.y, 2)
  );

  const step = 1 / (distance / stepDistance);

  for (let t = 0; t <= 1; t += step) {
    const { x, y } = bezierCurve(start, end, t);
    // await page.mouse.move(x, y);
    await moveCursorPosition(page, x, y);
    await page.waitForTimeout(1);
  }
}

module.exports = {
  cursorMovement,
  moveCursorPosition,
  moveRandomCursorPosition,
  userMovementEmulation,
};
