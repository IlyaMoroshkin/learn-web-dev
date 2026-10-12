import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import SelectionBanner from './components/SelectionBanner';
import CalendarCard from './components/CalendarCard';
import TimeSlots from './components/TimeSlots';
import ActionsBar from './components/ActionsBar';
import Footer from './components/Footer';
import { getSlotsForDate, calculateEndTime, MONTHS_GENITIVE } from './data/date';

export default function App() {
  // 1. Состояние отображаемого в календаре месяца/года
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(9); // Октябрь (0-индексировано: 9)

  // 2. Фиксированная дата "сегодня" для соответствия макету Figma (8 октября 2026)
  const today = useMemo(() => new Date(2026, 9, 8), []);

  // 3. Состояние выбранной даты
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedDay, setSelectedDay] = useState(16);

  // 4. Состояние выбранного времени (по умолчанию 11:00)
  const [selectedTime, setSelectedTime] = useState('11:00');

  // Длительность процедуры в минутах
  const durationMinutes = 60;

  // 5. Динамические слоты для выбранного дня
  const slots = useMemo(() => {
    return getSlotsForDate(selectedYear, selectedMonth, selectedDay);
  }, [selectedYear, selectedMonth, selectedDay]);

  // Обработчики переключения месяцев
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Выбор дня в календаре
  const handleSelectDay = (day, month, year) => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);

    // ВАЖНО: сбрасываем время при смене дня, как требуется по заданию
    setSelectedTime(null);
  };

  // Выбор времени
  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  // Клик по кнопке «Далее»
  const handleNext = () => {
    if (!selectedTime) {
      alert('Пожалуйста, выберите удобное время для записи.');
      return;
    }

    const monthName = MONTHS_GENITIVE[selectedMonth];
    const endTime = calculateEndTime(selectedTime, durationMinutes);
    alert(
      `Запись подтверждена:\n${selectedDay} ${monthName} ${selectedYear} г., ${selectedTime}–${endTime}.\nПереход к следующему шагу — «Ваши данные»!`
    );
  };

  return (
    <>
      <Header />

      <main className="main">
        <div className="main__container">
          <Stepper />

          <section className="page-heading">
            <span className="page-heading__eyebrow">ЗАПИСЬ В САЛОН · ШАГ 3 ИЗ 5</span>
            <h1 className="page-heading__title">Выберите дату и время</h1>
            <p className="page-heading__subtitle">
              Найдите удобное время для визита. Мы будем ждать вас в салоне.
            </p>
          </section>

          <SelectionBanner />

          <section className="booking-grid">
            <CalendarCard
              viewYear={viewYear}
              viewMonth={viewMonth}
              today={today}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDay={selectedDay}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSelectDay={handleSelectDay}
            />

            <TimeSlots
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDay={selectedDay}
              slots={slots}
              selectedTime={selectedTime}
              onSelectTime={handleSelectTime}
            />
          </section>

          <ActionsBar
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            durationMinutes={durationMinutes}
            onNext={handleNext}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
