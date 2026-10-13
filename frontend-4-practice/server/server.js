/**
 * ============================================================================
 * server/server.js — Плагин Vite, имитирующий сервер API
 * ============================================================================
 */
import { database, getSlotsForDate } from './database.js';

// Задержка имитации сети (в миллисекундах)
export const DELAY_MS = 400;

export function mockServerPlugin() {
  return {
    name: 'mock-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Парсим URL входящего запроса
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        // Эндпоинт 1: GET /api/booking/today
        if (url.pathname === '/api/booking/today' && req.method === 'GET') {
          if (DELAY_MS > 0) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(database.today));
          return;
        }

        // Эндпоинт 2: GET /api/slots?day=&month=&year=
        if (url.pathname === '/api/slots' && req.method === 'GET') {
          const day = parseInt(url.searchParams.get('day'), 10);
          const month = parseInt(url.searchParams.get('month'), 10);
          const year = parseInt(url.searchParams.get('year'), 10);

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Параметры day, month и year обязательны и должны быть числами' }));
            return;
          }

          if (DELAY_MS > 0) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          }

          const slots = getSlotsForDate(year, month, day);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            date: { day, month, year },
            slots
          }));
          return;
        }

        // Если путь не относится к /api, передаем управление дальше
        next();
      });
    }
  };
}
