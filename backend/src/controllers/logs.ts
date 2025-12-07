import { Request, Response } from 'express';
import ObserverLog, { ILog } from '../models/log';
import fs from 'fs';
import { ZEEK_URL } from '../config';
import { HttpStatuses, ZeekAnalyseResponse } from '../types';

export const createLog = async (req: Request, res: Response) => {
  try {
    const createdLog = await ObserverLog.create({ ...req.body });
    return res.status(HttpStatuses.Success).send(createdLog);
  } catch (err) {
    // проверяем на дупликацию
    if (err instanceof Error && err.message.includes('E11000')) {
      return res.status(HttpStatuses.DuplicateInstance).send({ message: 'Лог с таким названием уже существует' });
    }
    return res.status(HttpStatuses.InternalServerError).send({ message: 'Ошибка на стороне сервера', error: err });
  }
};

export const analizeLog = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(HttpStatuses.BadRequest).send({ message: 'Файл не был загружен' });
    }

    // подготавливаем formData для python сервера
    const formData = new FormData();

    // для node.js используется другой подход
    const fileBuffer = fs.readFileSync(file.path);
    formData.append('file', new Blob([fileBuffer]), file.originalname);

    // отправляем запрос на сервер python

    console.log(ZEEK_URL);
    const response = await fetch(`${ZEEK_URL}/analyze-pcap`, {
      method: 'POST',
      body: formData,
    });

    console.log(response);

    const result = (await response.json()) as ZeekAnalyseResponse;

    const logData: ILog = {
      title: result.filename,
      analizedDescription: result.analysis[0].text,
    };

    const createdLog = await saveLogToDatabase(logData);

    return res.status(200).send({
      status: 'success',
      message: 'File analyzed successfully',
      logId: createdLog._id,
      analysis: createdLog.analizedDescription,
      fileInfo: {
        originalName: file.originalname,
        savedPath: file.path,
        size: file.size,
      },
    });
  } catch (error) {
    console.error(`PCAP analysis error: ${error}`);

    if (error instanceof Error && error.message.includes('Only .pcap')) {
      return res.status(HttpStatuses.BadRequest).send({ message: 'Файл должен быть формата .pcap или .pcapng' });
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return res.status(HttpStatuses.DuplicateInstance).send({ message: 'Лог с таким ID уже существует' });
    }

    return res.status(HttpStatuses.InternalServerError).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const getLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findedLog = await ObserverLog.findById(id);

    return res.status(HttpStatuses.Success).send(findedLog);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return res
        .status(HttpStatuses.InternalServerError)
        .send({ message: `Произошла ошибка на сервере: ${error.message}` });
    }

    return res.status(HttpStatuses.InternalServerError).send({ message: 'Произошла неизвестная ошибка на сервере' });
  }
};

export const getAllLogs = async (_req: Request, res: Response) => {
  try {
    const findedLogs = ObserverLog.find();
    return res.status(HttpStatuses.Success).send({ items: findedLogs });
  } catch (err) {
    return res.status(HttpStatuses.NotFound).send({ message: 'Логов нет', err });
  }
};

export const updateLogById = async (req: Request, res: Response) => {
  try {
    const updatedLog = ObserverLog.findByIdAndUpdate(req.body.id, { $set: { ...req.body } }, { new: true });
    return res.status(HttpStatuses.Success).send(updatedLog);
  } catch (err) {
    res.status(HttpStatuses.NotFound).send({ message: 'Лога с таким id нет', err });
  }
};

export const deleteLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedLog = await ObserverLog.findByIdAndDelete(id);

    return res.status(HttpStatuses.Success).send(deletedLog);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HttpStatuses.NotFound).send({ message: `Лога с таким id не существует` });
    }

    return res.status(HttpStatuses.InternalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const saveLogToDatabase = async (log: ILog) => {
  const createdLog = await ObserverLog.create(log);

  return createdLog;
};
