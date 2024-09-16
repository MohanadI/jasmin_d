import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { AuthProvider } from "./Providers/AuthProvider";
import ProtectedRoute from "./Providers/ProtectedRoute";
import InvoicePage from "./InvoicePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin-dashboard",
    element: <ProtectedRoute element={<AdminDashboard />} />,
  },
  {
    path: "/invoice/:apartment/:description",
    element: <InvoicePage />, // Add the new route
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
