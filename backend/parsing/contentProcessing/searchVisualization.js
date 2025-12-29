async function drawRectangles(page, positions) {
  for (const key in positions) {
    const { x, y, width, height } = positions[key];

    // Рисуем прямоугольники
    await page.evaluate(
      ({ x, y, width, height }) => {
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = `${y}px`;
        overlay.style.left = `${x}px`;
        overlay.style.width = `${width}px`;
        overlay.style.height = `${height}px`;
        overlay.style.border = "2px solid red"; // Цвет границы
        overlay.style.pointerEvents = "none"; // Чтобы прямоугольник не мешал взаимодействовать с элементами
        document.body.appendChild(overlay);
      },
      { x, y, width, height }
    );
  }
}
