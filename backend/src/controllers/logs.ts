import { Request, Response } from 'express';
import ObserverLog from '../models/log';

export const createLog = async (req: Request, res: Response) => {
  try {
    
  }
};

export const analizeLog = async () => {};

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
