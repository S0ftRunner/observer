import { NextFunction, Request, Response } from 'express';
import ObserverLog from '../models/log';

export const createLog = async (req: Request, res: Response) => {
  try {
    const createdLog = await ObserverLog.create({ ...req.body });
    return res.status(200).send(createdLog);
  } catch (err) {
    // проверяем на дупликацию
    if (err instanceof Error && err.message.includes('E11000')) {
      return res.status(409).send({ message: 'Лог с таким названием уже существует' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error: err });
  }
};

export const analizeLog = async (req: Request, res: Response, next: NextFunction) => {
  // 1) Отправляем данные на сервис с python
  // 2) получаем ответ и парсим его
  // 3) передаем его в createLog
  try {
    const file = req.file;
  }
};

export const getLogById = async (id: string) => {};

export const getAllLogs = async (_req: Request, res: Response) => {
  try {
    const findedLogs = ObserverLog.find();
    return res.status(200).send({ items: findedLogs });
  } catch (err) {
    return res.status(404).send({ message: 'Логов нет', err });
  }
};

export const updateLogById = async (req: Request, res: Response) => {
  try {
    const updatedLog = ObserverLog.findByIdAndUpdate(req.body.id, { $set: { ...req.body } }, { new: true });
    return res.status(200).send(updatedLog);
  } catch (err) {
    res.status(404).send({ message: 'Лога с таким id нет', err });
  }
};

export const deleteLogById = async (id: string) => {};
