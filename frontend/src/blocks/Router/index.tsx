
import App from "@/App";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
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
    element: <div>logs</div>,
    children: [
      {
        path: ":id",
        element: <div>log id</div>,
      },
    ],
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
]);
