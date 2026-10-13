import React from 'react';
import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../data/date';

export default function TimeSlots({
  selectedYear,
  selectedMonth,
  selectedDay,
  slots,
  selectedTime,
  onSelectTime,
  setSlots,
  onUpdateSlotAvailability
}) {
  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[selectedMonth];

  const availableSlotsCount = slots.filter(s => s.isAvailable).length;

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
          const isSelected = slot.time === selectedTime && slot.isAvailable;
          const isDisabled = !slot.isAvailable;

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
    </article>
  );
}
