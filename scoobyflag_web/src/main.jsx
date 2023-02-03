import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "../route/Home";
import "./index.css";

const router = createBrowserRouter([
  {
    element: <Root />,
    path: "/",
    children: [
      {
        element: <Home />,
        path:""
      },
    ],
  },
]);

//Provider
function Root() {
  return <Outlet />;
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
