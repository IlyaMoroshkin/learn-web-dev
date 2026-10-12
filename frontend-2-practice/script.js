/**
 * ============================================================================
 * Blossom Beauty — Скрипт выбора даты и времени (Задание 2. JavaScript)
 * ============================================================================
 */

// 1. Константы и локализация
const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

// Базовые слоты времени рабочего дня салона
const DEFAULT_SCHEDULE = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

// 2. Состояние приложения (State)
const state = {
  // Текущий отображаемый месяц и год в календаре
  viewYear: 2026,
  viewMonth: 9, // 0-индексировано: 9 = Октябрь

  // Фиксированная дата "сегодня" для проверки макета (8 октября 2026)
  today: new Date(2026, 9, 8),

  // Выбранные пользователем дата и время (по умолчанию 16 октября 2026, 11:00)
  selectedYear: 2026,
  selectedMonth: 9,
  selectedDay: 16,
  selectedTime: '11:00',

  // Продолжительность услуги (минут)
  durationMinutes: 60
};

// 3. Чистые функции (Pure functions)

/**
 * Сравнение двух дат без учета времени.
 * Возвращает -1 если d1 < d2, 0 если d1 == d2, 1 если d1 > d2.
 */
function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Проверка, доступен ли день для выбора (не раньше, чем "сегодня").
 */
function isDateSelectable(day, month, year, today) {
  const targetDate = new Date(year, month, day);
  return compareDates(targetDate, today) >= 0;
}

/**
 * Расчет времени окончания услуги: "11:00" + 60 мин -> "12:00"
 */
function calculateEndTime(startTime, durationMinutes) {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Построение полной сетки календаря для заданного месяца и года.
 * Возвращает массив ячеек: { day, month, year, isCurrentMonth, isOtherMonth }
 */
function buildCalendarGrid(year, month) {
  const cells = [];

  // Первый день месяца
  const firstDayOfMonth = new Date(year, month, 1);
  // Сколько дней в текущем месяце
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  // Сколько дней в предыдущем месяце
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // День недели первого дня (Пн = 0, ..., Вс = 6)
  const jsDay = firstDayOfMonth.getDay();
  const startDayOfWeek = (jsDay === 0) ? 6 : jsDay - 1;

  // Дни предыдущего месяца для заполнения первой недели
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
      day: day,
      month: month,
      year: year,
      isCurrentMonth: true,
      isOtherMonth: false
    });
  }

  // Дни следующего месяца для завершения сетки (до кратного 7)
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const daysToAdd = 7 - remainder;
    for (let day = 1; day <= daysToAdd; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      cells.push({
        day: day,
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
 * Генерация реалистичных слотов времени для выбранного дня.
 * Имитирует занятость части слотов (например, 16 октября ровно 10 свободных слотов, как в макете).
 */
function getSlotsForDate(year, month, day) {
  // Для 16 октября 2026 воспроизводим точное распределение из макета:
  // Заняты: 09:00, 09:30, 10:30, 12:00, 13:30, 16:00 (всего 6 занято, 10 свободно)
  if (day === 16 && month === 9 && year === 2026) {
    const busyTimes = new Set(['09:00', '09:30', '10:30', '12:00', '13:30', '16:00']);
    return DEFAULT_SCHEDULE.map(time => ({
      time,
      isAvailable: !busyTimes.has(time)
    }));
  }

  // Для 17 октября (суббота) — все слоты заняты (для демонстрации альтернативного сценария)
  if (day === 17 && month === 9 && year === 2026) {
    return DEFAULT_SCHEDULE.map(time => ({
      time,
      isAvailable: false
    }));
  }

  // Для остальных дней генерируем детерминированное правдоподобное расписание
  const seed = (day * 7 + month * 13) % 10;
  return DEFAULT_SCHEDULE.map((time, idx) => {
    const isBusy = (idx + seed) % 3 === 0;
    return {
      time,
      isAvailable: !isBusy
    };
  });
}

// 4. Функции рендера (UI Rendering)

/**
 * Отрисовка календаря (заголовок, дни месяца, обработка состояний).
 */
function renderCalendar() {
  const monthTitleEl = document.getElementById('calendarMonthTitle');
  const daysGridEl = document.getElementById('calendarDaysGrid');
  const prevBtn = document.getElementById('prevMonthBtn');

  if (!monthTitleEl || !daysGridEl) return;

  // 1. Обновляем заголовок "Октябрь 2026"
  monthTitleEl.textContent = `${MONTHS_NOMINATIVE[state.viewMonth]} ${state.viewYear}`;

  // 2. Блокируем кнопку "Назад", если просматриваем месяц раньше сегодняшнего
  const isPastMonth = (state.viewYear < state.today.getFullYear()) ||
    (state.viewYear === state.today.getFullYear() && state.viewMonth <= state.today.getMonth());
  if (prevBtn) {
    prevBtn.disabled = isPastMonth;
  }

  // 3. Строим сетку ячеек
  const gridCells = buildCalendarGrid(state.viewYear, state.viewMonth);
  let html = '';

  gridCells.forEach(cell => {
    const classes = ['calendar-day'];
    let isDisabled = false;

    if (cell.isOtherMonth) {
      classes.push('calendar-day--other-month');
      isDisabled = true;
    } else {
      // Проверяем, является ли день прошедшим
      const selectable = isDateSelectable(cell.day, cell.month, cell.year, state.today);
      if (!selectable) {
        classes.push('calendar-day--disabled');
        isDisabled = true;
      }

      // Проверяем, является ли день "сегодня"
      if (
        cell.day === state.today.getDate() &&
        cell.month === state.today.getMonth() &&
        cell.year === state.today.getFullYear()
      ) {
        classes.push('calendar-day--today');
      }

      // Проверяем, выбран ли этот день
      if (
        cell.day === state.selectedDay &&
        cell.month === state.selectedMonth &&
        cell.year === state.selectedYear
      ) {
        classes.push('calendar-day--selected');
      }
    }

    const disabledAttr = isDisabled ? 'disabled aria-disabled="true"' : '';
    const selectedAttr = (classes.includes('calendar-day--selected')) ? 'aria-selected="true"' : '';

    html += `
      <button type="button" 
        class="${classes.join(' ')}" 
        data-day="${cell.day}" 
        data-month="${cell.month}" 
        data-year="${cell.year}"
        ${disabledAttr}
        ${selectedAttr}>
        ${cell.day}
      </button>
    `;
  });

  daysGridEl.innerHTML = html;
}

/**
 * Отрисовка слотов времени для выбранного дня.
 */
function renderTimeSlots() {
  const slotsDateTitleEl = document.getElementById('slotsSelectedDateTitle');
  const slotsCountTextEl = document.getElementById('slotsCountText');
  const slotsGridEl = document.getElementById('timeSlotsGrid');
  const slotsLegendEl = document.getElementById('slotsLegendText');

  if (!slotsDateTitleEl || !slotsGridEl) return;

  // Форматируем выбранную дату: "Пятница, 16 октября"
  const selectedDateObj = new Date(state.selectedYear, state.selectedMonth, state.selectedDay);
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[state.selectedMonth];

  slotsDateTitleEl.textContent = `${dayOfWeekName}, ${state.selectedDay} ${monthGenitive}`;

  // Получаем слоты для этой даты
  const slots = getSlotsForDate(state.selectedYear, state.selectedMonth, state.selectedDay);
  const availableSlotsCount = slots.filter(s => s.isAvailable).length;

  // Обновляем плашку с количеством свободных окон
  if (slotsCountTextEl) {
    if (availableSlotsCount > 0) {
      slotsCountTextEl.textContent = `${availableSlotsCount} свободных слотов · Выберите удобное время`;
    } else {
      slotsCountTextEl.textContent = `На выбранную дату нет свободных слотов`;
    }
  }

  // Рендерим кнопки слотов
  let slotsHtml = '';
  slots.forEach(slot => {
    const classes = ['slot'];
    let isDisabled = !slot.isAvailable;
    let isSelected = (slot.time === state.selectedTime && slot.isAvailable);

    if (isDisabled) {
      classes.push('slot--disabled');
    }
    if (isSelected) {
      classes.push('slot--selected');
    }

    const disabledAttr = isDisabled ? 'disabled aria-disabled="true"' : '';
    const pressedAttr = isSelected ? 'aria-pressed="true"' : 'aria-pressed="false"';

    slotsHtml += `
      <button type="button" 
        class="${classes.join(' ')}" 
        data-time="${slot.time}" 
        ${disabledAttr} 
        ${pressedAttr}>
        ${slot.time}
      </button>
    `;
  });

  slotsGridEl.innerHTML = slotsHtml;

  // Обновляем текст под слотами
  if (slotsLegendEl) {
    if (state.selectedTime) {
      slotsLegendEl.innerHTML = `Серым отмечено занятое время. Вы выбрали <strong>${state.selectedTime}</strong>.`;
    } else {
      slotsLegendEl.innerHTML = `Серым отмечено занятое время. Пожалуйста, выберите подходящий слот.`;
    }
  }
}

/**
 * Обновление нижней панели с итоговой датой и временем.
 */
function updateBottomBar() {
  const summaryEl = document.getElementById('bottomBarSummary');
  const nextBtn = document.getElementById('btnNextStep');

  if (!summaryEl) return;

  const monthGenitive = MONTHS_GENITIVE[state.selectedMonth];

  if (state.selectedTime) {
    const endTime = calculateEndTime(state.selectedTime, state.durationMinutes);
    summaryEl.textContent = `${state.selectedDay} ${monthGenitive} ${state.selectedYear} · ${state.selectedTime}–${endTime}`;
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  } else {
    summaryEl.textContent = `${state.selectedDay} ${monthGenitive} ${state.selectedYear} · Выберите время`;
    if (nextBtn) {
      nextBtn.disabled = true;
    }
  }
}

// 5. Обработчики событий (Event Listeners)

/**
 * Обработка клика по дню в календаре (через делегирование событий).
 */
function onCalendarClick(event) {
  const dayBtn = event.target.closest('.calendar-day');
  if (!dayBtn) return;

  // Игнорируем неактивные или недоступные дни
  if (
    dayBtn.disabled || 
    dayBtn.classList.contains('calendar-day--disabled') || 
    dayBtn.classList.contains('calendar-day--other-month')
  ) {
    return;
  }

  const day = Number(dayBtn.dataset.day);
  const month = Number(dayBtn.dataset.month);
  const year = Number(dayBtn.dataset.year);

  // Обновляем выбранный день
  state.selectedDay = day;
  state.selectedMonth = month;
  state.selectedYear = year;

  // ВАЖНО: сбрасываем выбранное время при смене даты, чтобы пользователь выбрал актуальный слот
  state.selectedTime = null;

  // Перерисовываем интерфейс
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

/**
 * Обработка клика по слоту времени (через делегирование событий).
 */
function onTimeSlotsClick(event) {
  const slotBtn = event.target.closest('.slot');
  if (!slotBtn || slotBtn.disabled || slotBtn.classList.contains('slot--disabled')) {
    return;
  }

  const chosenTime = slotBtn.dataset.time;
  state.selectedTime = chosenTime;

  renderTimeSlots();
  updateBottomBar();
}

/**
 * Переключение месяцев назад/вперед.
 */
function onPrevMonthClick() {
  if (state.viewMonth === 0) {
    state.viewMonth = 11;
    state.viewYear -= 1;
  } else {
    state.viewMonth -= 1;
  }
  renderCalendar();
}

function onNextMonthClick() {
  if (state.viewMonth === 11) {
    state.viewMonth = 0;
    state.viewYear += 1;
  } else {
    state.viewMonth += 1;
  }
  renderCalendar();
}

/**
 * Клик по кнопке «Далее».
 */
function onNextStepClick() {
  if (!state.selectedTime) {
    alert('Пожалуйста, выберите удобное время для записи.');
    return;
  }

  const monthGenitive = MONTHS_GENITIVE[state.selectedMonth];
  const endTime = calculateEndTime(state.selectedTime, state.durationMinutes);
  alert(`Выбранная запись:\n${state.selectedDay} ${monthGenitive} ${state.selectedYear} с ${state.selectedTime} до ${endTime}.\nПереход к следующему шагу — «Ваши данные»!`);
}

// 6. Инициализация (Init)

function init() {
  // Навешиваем обработчики навигации календаря
  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');
  if (prevBtn) prevBtn.addEventListener('click', onPrevMonthClick);
  if (nextBtn) nextBtn.addEventListener('click', onNextMonthClick);

  // Навешиваем делегированные обработчики на сетку календаря и слотов
  const daysGridEl = document.getElementById('calendarDaysGrid');
  if (daysGridEl) daysGridEl.addEventListener('click', onCalendarClick);

  const slotsGridEl = document.getElementById('timeSlotsGrid');
  if (slotsGridEl) slotsGridEl.addEventListener('click', onTimeSlotsClick);

  // Кнопка перехода к следующему шагу
  const nextStepBtn = document.getElementById('btnNextStep');
  if (nextStepBtn) nextStepBtn.addEventListener('click', onNextStepClick);

  // Первоначальный рендер
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

// Запуск после построения DOM
document.addEventListener('DOMContentLoaded', init);
