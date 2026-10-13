# Задание 4. Асинхронный Javascript и создание React-приложений

Интеграция страницы выбора даты и времени для салона красоты **Blossom Beauty** с имитационным API-сервером через `fetch`.

## Архитектура проекта
```
frontend-4-practice/
├── server/
│   ├── database.js       # Имитационная база данных (today, наборы слотов)
│   └── server.js         # Плагин Vite: перехват запросов /api/* и задержка DELAY_MS
├── src/
│   ├── api.js            # Асинхронные функции fetchToday() и fetchSlots(date)
│   ├── App.jsx           # Главный компонент с состояниями loading, error, data и защитой от гонок
│   ├── components/       # Модульные React-компоненты
│   │   ├── Header.jsx          # Шапка сайта
│   │   ├── Stepper.jsx         # Пошаговый индикатор
│   │   ├── SelectionBanner.jsx # Плашка выбранного мастера
│   │   ├── CalendarCard.jsx    # Календарь с днями месяца
│   │   ├── TimeSlots.jsx       # Слоты времени с состояниями загрузки и ошибок
│   │   ├── ActionsBar.jsx      # Нижняя панель действий (с днем недели)
│   │   └── Footer.jsx          # Подвал сайта
│   └── data/
│       └── date.js       # Чистые функции форматирования и расчета дат
├── vite.config.js        # Конфигурация Vite с подключением mockServerPlugin
└── package.json          # Зависимости React 18 и Vite 5
```

## Эндпоинты сервера
- `GET /api/booking/today` — возвращает `{ day, month, year }` (текущая дата).
- `GET /api/slots?day=&month=&year=` — возвращает `{ date: { day, month, year }, slots }`.

## Как запустить проект
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите сервер разработки Vite:
   ```bash
   npm run dev
   ```
3. Откройте в браузере: `http://localhost:3000/`.
