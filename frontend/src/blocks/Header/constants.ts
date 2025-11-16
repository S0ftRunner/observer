import { Route, RouteEnum } from "@/types";

export const ROUTES: Array<Route> = [
  {
    url: RouteEnum.Logs,
    text: 'История логов'
  },
  {
    url: RouteEnum.Main,
    text: 'Главная'
  },
  {
    url: RouteEnum.DownloadLogs,
    text: 'Загрузить лог'
  }
] 