import { TLog } from "@/api";
/**
 * Брать логи
 * Логи
 * Брать лог по айди
 * Удалить лог
 */
export interface IUseLogs {
  logs: TLog[];
  setLogs: () => void;
  getLog: (id: string) => TLog;
  deleteLog: (id: string) => void;
  createLog: (data: unknown) => void; // подумать над типом данных
  getLogs: () => void;
};

