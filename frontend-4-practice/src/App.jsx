import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import SelectionBanner from './components/SelectionBanner';
import CalendarCard from './components/CalendarCard';
import TimeSlots from './components/TimeSlots';
import ActionsBar from './components/ActionsBar';
import Footer from './components/Footer';
import { fetchToday, fetchSlots } from './api';
import { calculateEndTime, MONTHS_GENITIVE } from './data/date';

export default function App() {
  // 1. Асинхронное состояние "сегодня" (загружается с сервера)
  const [today, setToday] = useState(null);
  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  // 2. Отображаемый месяц и год в календаре
  const [viewYear, setViewYear] = useState(null);
  const [viewMonth, setViewMonth] = useState(null);

  // 3. Выбранная дата
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // 4. Асинхронное состояние слотов времени для выбранного дня
  const [slots, setSlots] = useState([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // 5. Выбранное время
  const [selectedTime, setSelectedTime] = useState(null);

  // Флаг первичной инициализации для выбора слота по умолчанию
  const isInitialLoadRef = useRef(true);

  // Продолжительность процедуры
  const durationMinutes = 60;

  // Шаг 1: Загрузка "сегодня" при открытии страницы
  const loadToday = async () => {
    setIsTodayLoading(true);
    setTodayError(null);
    try {
      const data = await fetchToday(); // { day, month, year }
      setToday(data);
      setViewYear(data.year);
      setViewMonth(data.month);
      setSelectedYear(data.year);
      setSelectedMonth(data.month);
      setSelectedDay(data.day);
    } catch (err) {
      setTodayError(err.message || 'Не удалось связаться с сервером');
    } finally {
      setIsTodayLoading(false);
    }
  };

  useEffect(() => {
    loadToday();
  }, []);

  // Шаг 2: Загрузка слотов при смене дня (с защитой от гонок)
  useEffect(() => {
    if (!selectedDay || selectedMonth === null || !selectedYear) return;

    let isCancelled = false;

    const loadSlots = async () => {
      setIsSlotsLoading(true);
      setSlotsError(null);
      try {
        const response = await fetchSlots({
          day: selectedDay,
          month: selectedMonth,
          year: selectedYear
        });

        // Защита от состояния гонки (Race Condition):
        // Проверяем, что эффект не отменен и дата ответа совпадает с текущей выбранной
        if (
          !isCancelled &&
          response.date.day === selectedDay &&
          response.date.month === selectedMonth &&
          response.date.year === selectedYear
        ) {
          const loadedSlots = response.slots || [];
          setSlots(loadedSlots);

          // При первой загрузке приложения выбираем первый доступный слот
          if (isInitialLoadRef.current) {
            const firstAvailable = loadedSlots.find(
              s => (s.available !== undefined ? s.available : s.isAvailable)
            );
            if (firstAvailable) {
              setSelectedTime(firstAvailable.time);
            }
            isInitialLoadRef.current = false;
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setSlotsError(err.message || 'Не удалось загрузить слоты');
          setSlots([]);
        }
      } finally {
        if (!isCancelled) {
          setIsSlotsLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      isCancelled = true;
    };
  }, [selectedDay, selectedMonth, selectedYear]);

  // Обработчики навигации календаря
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

  // Выбор дня в календаре: день меняется, время обязательно сбрасывается
  const handleSelectDay = (day, month, year) => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedTime(null); // Сброс времени
  };

  // Выбор времени
  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  // Повторная загрузка слотов при ошибке
  const handleRetrySlots = () => {
    if (selectedDay && selectedMonth !== null && selectedYear) {
      setIsSlotsLoading(true);
      setSlotsError(null);
      fetchSlots({ day: selectedDay, month: selectedMonth, year: selectedYear })
        .then(response => {
          setSlots(response.slots || []);
        })
        .catch(err => {
          setSlotsError(err.message || 'Ошибка загрузки слотов');
        })
        .finally(() => {
          setIsSlotsLoading(false);
        });
    }
  };

  // Переход к следующему шагу
  const handleNext = () => {
    if (!selectedTime) {
      alert('Пожалуйста, выберите подходящее время для записи.');
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

          {/* Состояние 1: Загрузка первичных данных ("сегодня") */}
          {isTodayLoading && (
            <div className="loading-box" style={{ margin: '40px 0' }}>
              <div className="spinner" aria-hidden="true"></div>
              <p className="loading-text">Загрузка данных календаря…</p>
            </div>
          )}

          {/* Состояние 2: Ошибка загрузки первичных данных */}
          {!isTodayLoading && todayError && (
            <div className="error-box" style={{ margin: '40px 0' }}>
              <h3 className="error-box__title">Ошибка подключения к серверу</h3>
              <p className="error-box__message">{todayError}</p>
              <button type="button" className="btn-retry" onClick={loadToday}>
                Повторить попытку
              </button>
            </div>
          )}

          {/* Состояние 3: Основной интерфейс после загрузки "сегодня" */}
          {!isTodayLoading && !todayError && today && (
            <>
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
                  isLoading={isSlotsLoading}
                  error={slotsError}
                  onRetry={handleRetrySlots}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
