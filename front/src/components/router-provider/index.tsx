import App from "@/App";
import HomePage from "@/pages/home";
import NotfoundPage from "@/pages/notfound";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider as Provider,
} from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotfoundPage />,
  },
];

const router = createBrowserRouter(routes);

export const RouterProvider = () => {
  return <Provider router={router} />;
};
