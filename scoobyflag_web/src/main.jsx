import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./route/Auth";
import Index from "./route/Index";
import Carte from "./route/Carte";
import User from "./route/User";
import "./css/main.css";
import Login from "./route/Login";
import Dashboard from "./route/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/carte",
    element: <Carte />
  },
  {
    path: "/user",
    element: <User />
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
