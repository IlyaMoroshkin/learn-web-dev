/**
 * ============================================================================
 * src/api.js — Клиент асинхронных запросов к серверу
 * ============================================================================
 */

/**
 * Получение текущей даты с сервера
 * @returns {Promise<{ day: number, month: number, year: number }>}
 */
export async function fetchToday() {
  const response = await fetch('/api/booking/today');
  if (!response.ok) {
    throw new Error(`Ошибка сервера (${response.status}): не удалось получить текущую дату`);
  }
  return response.json();
}

/**
 * Получение слотов на выбранную дату
 * @param {{ day: number, month: number, year: number }} date
 * @returns {Promise<{ date: { day: number, month: number, year: number }, slots: Array<{ time: string, available: boolean }> }>}
 */
export async function fetchSlots({ day, month, year }) {
  const params = new URLSearchParams({
    day: String(day),
    month: String(month),
    year: String(year)
  });

  const response = await fetch(`/api/slots?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Ошибка сервера (${response.status}): не удалось загрузить расписание слотов`);
  }
  return response.json();
}
