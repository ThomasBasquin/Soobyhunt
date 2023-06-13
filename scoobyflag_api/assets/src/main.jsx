import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Index from "./route/Index";
import Carte from "./route/Carte";
import User from "./route/User";
import "./css/main.css";
import Login from "./route/Login";
import Dashboard from "./route/Dashboard";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/app/login",
    element: <Login />
  },
  {
    path: "/app/dashboard",
    element: <Dashboard />
  },
  {
    path: "/app/carte",
    element: <Carte />
  },
  {
    path: "/app/user",
    element: <User />
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
