import { Role } from "./role";

export enum RouteEnum {
  Main = '/main',
  Logs = '/logs',
  DownloadLogs = '/download-logs'
};

export type Route = {
  url: string;
  text: string;
  requiredRole?: Role; // в MVP пока не предусмотрено
}