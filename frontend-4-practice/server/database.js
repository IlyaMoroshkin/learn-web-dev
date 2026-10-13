/**
 * ============================================================================
 * Имитационная база данных (Mock Database) для сервера
 * ============================================================================
 */

// Вычисляем актуальную дату "сегодня"
const now = new Date();

export const database = {
  today: {
    day: now.getDate(),
    month: now.getMonth(), // 0-индексированный: 0 = Январь, 9 = Октябрь
    year: now.getFullYear()
  }
};

// Базовый график рабочего дня
export const DEFAULT_SCHEDULE = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

/**
 * Получение слотов для переданной даты
 * Формат каждого слота: { time: string, available: boolean, isAvailable: boolean }
 */
export function getSlotsForDate(year, month, day) {
  // Для 16 октября 2026 воспроизводим точный макет Figma: 10 свободных, 6 занятых
  if (day === 16 && month === 9 && year === 2026) {
    const busyTimes = new Set(['09:00', '09:30', '10:30', '12:00', '13:30', '16:00']);
    return DEFAULT_SCHEDULE.map(time => {
      const isFree = !busyTimes.has(time);
      return {
        time,
        available: isFree,
        isAvailable: isFree
      };
    });
  }

  // Для 17 октября 2026 — альтернативный сценарий: нет свободных слотов
  if (day === 17 && month === 9 && year === 2026) {
    return DEFAULT_SCHEDULE.map(time => ({
      time,
      available: false,
      isAvailable: false
    }));
  }

  // Для остальных дат — детерминированное распределение слотов
  const seed = (day * 7 + month * 13) % 10;
  return DEFAULT_SCHEDULE.map((time, idx) => {
    const isFree = (idx + seed) % 3 !== 0;
    return {
      time,
      available: isFree,
      isAvailable: isFree
    };
  });
}
