import React from 'react';
import {
  MONTHS_NOMINATIVE,
  WEEKDAY_LABELS,
  buildCalendarGrid,
  isDateSelectable
} from '../data/date';

export default function CalendarCard({
  viewYear,
  viewMonth,
  today,
  selectedYear,
  selectedMonth,
  selectedDay,
  onPrevMonth,
  onNextMonth,
  onSelectDay
}) {
  const gridCells = buildCalendarGrid(viewYear, viewMonth);

  // Проверяем, можно ли листать назад (не раньше месяца "сегодня")
  const isPastMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  return (
    <article className="calendar-card">
      <header className="calendar-card__header">
        <button
          type="button"
          className="calendar-card__nav-btn"
          onClick={onPrevMonth}
          disabled={isPastMonth}
          aria-label="Предыдущий месяц"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <h2 className="calendar-card__month-title">
          {MONTHS_NOMINATIVE[viewMonth]} {viewYear}
        </h2>

        <button
          type="button"
          className="calendar-card__nav-btn"
          onClick={onNextMonth}
          aria-label="Следующий месяц"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </header>

      <div className="calendar-card__weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map(weekday => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-card__days-grid" role="grid" aria-label="Дни месяца">
        {gridCells.map((cell, index) => {
          const isCurrentSelected =
            cell.day === selectedDay &&
            cell.month === selectedMonth &&
            cell.year === selectedYear;

          const isToday =
            cell.day === today.getDate() &&
            cell.month === today.getMonth() &&
            cell.year === today.getFullYear();

          const selectable =
            !cell.isOtherMonth &&
            isDateSelectable(cell.day, cell.month, cell.year, today);

          let classNames = 'calendar-day';
          if (cell.isOtherMonth) classNames += ' calendar-day--other-month';
          if (!selectable && !cell.isOtherMonth) classNames += ' calendar-day--disabled';
          if (isToday) classNames += ' calendar-day--today';
          if (isCurrentSelected) classNames += ' calendar-day--selected';

          return (
            <button
              key={`${cell.year}-${cell.month}-${cell.day}-${index}`}
              type="button"
              className={classNames}
              disabled={!selectable}
              aria-selected={isCurrentSelected}
              onClick={() => {
                if (selectable) {
                  onSelectDay(cell.day, cell.month, cell.year);
                }
              }}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <footer className="calendar-card__footer">
        <p>Время записи указано по Москве (МСК).</p>
      </footer>
    </article>
  );
}
