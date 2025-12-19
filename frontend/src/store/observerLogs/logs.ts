import { create } from "zustand";
import { IUseLogs } from "./types";
import { deleteLogById, getAllLogs, getLogById, TLog } from "@/api";

export const useLogs = create<IUseLogs>((set) => ({
  logs: { items: [] },
  getLogs: async () => {
    const data = await getAllLogs();

    console.log(data);
    set({ logs: data });
  },
  setLogs: (logs: any) => {
    set({ logs });
  },
  getLog: async (id: string) => {
    const data = (await getLogById(id)) as TLog;

    return data;
  },
  deleteLog: async (id: string) => {
    const data = await deleteLogById(id);

    return data;
  },
  createLog: () => {},
}));
