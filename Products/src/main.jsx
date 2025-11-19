import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "@styles/globals.css";

import RootLayout from "@components/layouts/RootLayout";
import AuthLayout from "@components/layouts/Auth-Layout";
import DashboardLayout from "@components/layouts/Dashboard-Layout";

import LoginPage from "@pages/Login";
import RegisterPage from "@pages/Register";
import ProductsCards from "@pages/ProductsCards";
import CreateProduct from "@pages/createProduct";
import ModifyProduct from "@pages/modifyProduct";
import RolesPermissionsPage from "./pages/RolesPermissionsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/", element: <LoginPage /> },
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          { path: "cards", element: <ProductsCards /> },
          { path: "/roles", element: <RolesPermissionsPage /> },
          { path: "/products/add", element: <CreateProduct /> },
          { path: "/products/:id", element: <ModifyProduct /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
