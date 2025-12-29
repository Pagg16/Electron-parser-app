function getReadableRandomColor(colorCheck = "#FFFFFF", existingColors = []) {
  let color;
  do {
    color = getRandomColor();
  } while (
    !isContrastEnough(color, colorCheck) ||
    existingColors.includes(color)
  ); // Проверка на повторение
  return color;
}

// Функция для генерации случайного цвета
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Проверка контраста по формуле W3C (WCAG)
function isContrastEnough(bgColor, textColor) {
  const bgLuminance = getLuminance(bgColor);
  const textLuminance = getLuminance(textColor);
  const contrast =
    (Math.max(bgLuminance, textLuminance) + 0.05) /
    (Math.min(bgLuminance, textLuminance) + 0.05);
  return contrast >= 4.5; // Минимальный коэффициент контраста для хорошей читаемости
}

// Вычисление яркости цвета
function getLuminance(color) {
  const rgb = hexToRgb(color);
  const a = rgb.map((value) => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; // Формула яркости
}

// Преобразование HEX в RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export default getReadableRandomColor;
