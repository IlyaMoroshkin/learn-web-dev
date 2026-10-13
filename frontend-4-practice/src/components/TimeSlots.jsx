import React from 'react';
import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../data/date';

export default function TimeSlots({
  selectedYear,
  selectedMonth,
  selectedDay,
  slots = [],
  selectedTime,
  onSelectTime,
  isLoading,
  error,
  onRetry
}) {
  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[selectedMonth];

  const availableSlotsCount = slots.filter(
    s => (s.available !== undefined ? s.available : s.isAvailable)
  ).length;

  return (
    <article className="time-slots">
      <header className="time-slots__header">
        <h2 className="time-slots__title">
          {dayOfWeekName}, {selectedDay} {monthGenitive}
        </h2>
        <p className="time-slots__subtitle">
          Выберите время начала. Продолжительность — 60 минут.
        </p>
      </header>

      {/* Состояние 1: Загрузка слотов */}
      {isLoading && (
        <div className="loading-box">
          <div className="spinner" aria-hidden="true"></div>
          <p className="loading-text">Загрузка слотов…</p>
        </div>
      )}

      {/* Состояние 2: Ошибка загрузки */}
      {!isLoading && error && (
        <div className="error-box">
          <h3 className="error-box__title">Ошибка загрузки слотов</h3>
          <p className="error-box__message">{error}</p>
          {onRetry && (
            <button type="button" className="btn-retry" onClick={onRetry}>
              Попробовать снова
            </button>
          )}
        </div>
      )}

      {/* Состояние 3: Слоты успешно загружены */}
      {!isLoading && !error && (
        <>
          <div className="slots-alert">
            <svg
              className="slots-alert__icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>
              {availableSlotsCount > 0
                ? `${availableSlotsCount} свободных слотов · Выберите удобное время`
                : 'На выбранную дату нет свободных слотов'}
            </span>
          </div>

          <div className="time-slots__grid" role="group" aria-label="Доступное время для записи">
            {slots.map(slot => {
              const isFree = slot.available !== undefined ? slot.available : slot.isAvailable;
              const isSelected = slot.time === selectedTime && isFree;
              const isDisabled = !isFree;

              let slotClass = 'slot';
              if (isDisabled) slotClass += ' slot--disabled';
              if (isSelected) slotClass += ' slot--selected';

              return (
                <button
                  key={slot.time}
                  type="button"
                  className={slotClass}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (!isDisabled) {
                      onSelectTime(slot.time);
                    }
                  }}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>

          <p className="time-slots__legend">
            {selectedTime ? (
              <>
                Серым отмечено занятое время. Вы выбрали <strong>{selectedTime}</strong>.
              </>
            ) : (
              'Серым отмечено занятое время. Пожалуйста, выберите подходящий слот.'
            )}
          </p>
        </>
      )}
    </article>
  );
}
