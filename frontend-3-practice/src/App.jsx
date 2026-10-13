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
  // 1. Актуальная сегодняшняя дата (динамическая, а не захардкоженная)
  const today = useMemo(() => new Date(), []);

  // 2. Состояние отображаемого в календаре месяца/года (на основе текущей даты)
  const [viewYear, setViewYear] = useState(() => today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => today.getMonth());

  // 3. Состояние выбранной даты (по умолчанию текущая дата)
  const [selectedYear, setSelectedYear] = useState(() => today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => today.getMonth());
  const [selectedDay, setSelectedDay] = useState(() => today.getDate());

  // 4. Управляемое состояние слотов времени через useState и сеттер setSlots
  const [slots, setSlots] = useState(() =>
    getSlotsForDate(today.getFullYear(), today.getMonth(), today.getDate())
  );

  // 5. Состояние выбранного времени (по умолчанию первый свободный слот на сегодня, либо дефолтный)
  const [selectedTime, setSelectedTime] = useState(() => {
    const initialSlots = getSlotsForDate(today.getFullYear(), today.getMonth(), today.getDate());
    const availableSlot = initialSlots.find(s => s.isAvailable);
    return availableSlot ? availableSlot.time : null;
  });

  // Длительность процедуры в минутах
  const durationMinutes = 60;

  // Функция для динамического изменения доступности слота во время работы приложения
  const handleUpdateSlotAvailability = (time, isAvailable = false) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.time === time ? { ...slot, isAvailable } : slot
      )
    );
  };

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

    // Обновляем управляемое состояние слотов для выбранного дня через сеттер
    setSlots(getSlotsForDate(year, month, day));
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

    // Динамически помечаем забронированный слот как занятый через сеттер состояния
    handleUpdateSlotAvailability(selectedTime, false);
    setSelectedTime(null);
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
              setSlots={setSlots}
              selectedTime={selectedTime}
              onSelectTime={handleSelectTime}
              onUpdateSlotAvailability={handleUpdateSlotAvailability}
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
