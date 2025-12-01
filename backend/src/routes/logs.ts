import { analizeLog, createLog, deleteLogById, getAllLogs, getLogById, updateLogById } from 'controllers';
import { Router } from 'express';

const router = Router();

// Берем лог по Id
router.get('/:id', getLogById);

// берем все логи
router.get('/', getAllLogs);

// вызываем питоновский сервис для анализа лога
router.post('/analize', analizeLog);

// обновление лога (если оператор захочет внести свои заметки)
router.patch('/:id/log', updateLogById);

// удаление лога
router.delete('/:id', deleteLogById);

// создание лога
router.post('/', createLog);

export default router;
