import { Role } from "./role";

export enum RouteEnum {
  Main = '/main',
  Logs = '/logs',
  DownloadLogs = '/download-logs',
  LogDetails = '/logs/:id'
};

export type Route = {
  url: string;
  text: string;
  requiredRole?: Role; // в MVP пока не предусмотрено
}