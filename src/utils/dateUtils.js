const months = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

export function parseDate(dateStr) {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split(" ");
  const monthIndex = months[month];
  if (monthIndex === undefined) return null; // Обработка неизвестного месяца

  return new Date(Number(year), monthIndex, Number(day));
}
