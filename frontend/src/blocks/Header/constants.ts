import { Route, RouteEnum } from "@/types";

export const ROUTES: Array<Route> = [
  {
    url: RouteEnum.Main,
    text: 'Главная'
  },
  {
    url: RouteEnum.Logs,
    text: 'История логов'
  },
  {
    url: RouteEnum.DownloadLogs,
    text: 'Загрузить лог'
  }
] 