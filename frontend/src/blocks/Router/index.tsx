
import App from "@/App";
import { LogDetail, LogsLayout, LogsStory, MainPage } from "@/pages";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <div>dashboard</div>,
      },
      {
        path: "/events",
        element: <div>events</div>,
        children: [
          {
            path: ":id",
            element: <div>event id</div>,
          },
        ],
      },
      {
        path: "/logs",
        element: <LogsLayout />,
        children: [
          {
            index: true,
            element: <LogsStory />,
          },
          {
            path: ":id",
            element: <LogDetail />,
          },
        ],
      },
      {
        path: '/main',
        element: <MainPage />
      },
      {
        path: '/reports',
        element: <div>report</div>,
        children: [{
          path: ":id",
          element: <div>report id</div>
        }]
      },
      {
        path: "*",
        element: <div>Nothing found</div>,
      },
    ],
  },
]);