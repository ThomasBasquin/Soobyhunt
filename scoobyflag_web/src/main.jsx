import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Auth from "./route/Auth";
import Home from "./route/Home";
import Index from "./route/Index";
import Map from "./route/Map";
import Config from "./route/Config";
import Header from "./components/Header";
import "./css/main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/login",
    element: <Auth />
  },
  {
    path: "/dashboard",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/dashboard/map",
        element: <Map />
      },
      {
        path: "/dashboard/config",
        element: <Config />
      },
    ],
  }
]);

//Provider
function Root() {
  return (<>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
  );
}


//Authentification
function App() {
  <>
    <Outlet />
  </>
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
