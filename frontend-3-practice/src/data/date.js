/**
 * ============================================================================
 * Чистые функции и константы для работы с датами и временем (React)
 * ============================================================================
 */

export const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

export const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const DEFAULT_SCHEDULE = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

/**
 * Сравнение двух дат без учета времени.
 */
export function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Проверка возможности выбора даты (не раньше сегодняшнего дня).
 */
export function isDateSelectable(day, month, year, today) {
  const targetDate = new Date(year, month, day);
  return compareDates(targetDate, today) >= 0;
}

/**
 * Вычисление времени завершения процедуры.
 */
export function calculateEndTime(startTime, durationMinutes = 60) {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Построение календарной сетки с днями недели (начиная с понедельника).
 */
export function buildCalendarGrid(year, month) {
  const cells = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const jsDay = firstDayOfMonth.getDay();
  const startDayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

  // Дни предыдущего месяца
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({
      day: prevDay,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isOtherMonth: true
    });
  }

  // Дни текущего месяца
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    cells.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      isOtherMonth: false
    });
  }

  // Дни следующего месяца для завершения сетки
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const daysToAdd = 7 - remainder;
    for (let day = 1; day <= daysToAdd; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      cells.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isOtherMonth: true
      });
    }
  }

  return cells;
}

/**
 * Генерация слотов времени.
 */
export function getSlotsForDate(year, month, day) {
  // Для 16 октября 2026 воспроизводим точное распределение из макета Figma:
  // 10 свободно, 6 занято (09:00, 09:30, 10:30, 12:00, 13:30, 16:00)
  if (day === 16 && month === 9 && year === 2026) {
    const busyTimes = new Set(['09:00', '09:30', '10:30', '12:00', '13:30', '16:00']);
    return DEFAULT_SCHEDULE.map(time => ({
      time,
      isAvailable: !busyTimes.has(time)
    }));
  }

  // 17 октября — все слоты заняты (альтернативный сценарий)
  if (day === 17 && month === 9 && year === 2026) {
    return DEFAULT_SCHEDULE.map(time => ({
      time,
      isAvailable: false
    }));
  }

  // Для остальных дней — реалистичное расписание
  const seed = (day * 7 + month * 13) % 10;
  return DEFAULT_SCHEDULE.map((time, idx) => ({
    time,
    isAvailable: (idx + seed) % 3 !== 0
  }));
}
