import { TLog } from "@/api";
/**
 * Брать логи
 * Логи
 * Брать лог по айди
 * Удалить лог
 */
export interface IUseLogs {
  logs: any;
  setLogs: (logs: TLog[]) => void;
  getLog: (id: string) => Promise<TLog>;
  deleteLog: (id: string) => void;
  createLog: (data: unknown) => void; // подумать над типом данных
  getLogs: () => Promise<any>;
};

