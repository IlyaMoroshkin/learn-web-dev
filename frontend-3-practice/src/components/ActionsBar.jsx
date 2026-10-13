import React from 'react';
import { MONTHS_GENITIVE, DAYS_OF_WEEK, calculateEndTime } from '../data/date';

export default function ActionsBar({
  selectedYear,
  selectedMonth,
  selectedDay,
  selectedTime,
  durationMinutes = 60,
  onNext
}) {
  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeek = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[selectedMonth];
  const endTime = selectedTime ? calculateEndTime(selectedTime, durationMinutes) : '';

  const summaryText = selectedTime
    ? `${dayOfWeek}, ${selectedDay} ${monthGenitive} ${selectedYear} · ${selectedTime}–${endTime}`
    : `${dayOfWeek}, ${selectedDay} ${monthGenitive} ${selectedYear} · Выберите время`;

  return (
    <section className="actions-bar">
      <a href="#" className="actions-bar__back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>К выбору услуги</span>
      </a>

      <div className="actions-bar__forward-group">
        <span className="actions-bar__summary">{summaryText}</span>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!selectedTime}
          onClick={onNext}
        >
          <span>Далее</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
