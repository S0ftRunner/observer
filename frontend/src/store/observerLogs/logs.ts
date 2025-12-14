import { create } from 'zustand';
import { IUseLogs } from './types';
import { deleteLogById, getAllLogs, getLogById, TLog } from '@/api';

const useLogs = create<IUseLogs>((set, get) => ({
  logs: [],
  getLogs: async () => {
    const data = await getAllLogs();
    set({logs: data});
  },
  setLogs: () => {},
  getLog: async (id: string) => {
    const data = await getLogById(id) as TLog;

    return data;
  },
  deleteLog: async (id: string) => {
    const data = await deleteLogById()
  }
}))