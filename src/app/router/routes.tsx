import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../lib/guards/ProtectedRoute";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoginPage from "../../features/auth/ui/LoginPage";
import ProductsListPage from "../../features/products/ui/pages/ProductsListPage";
import ProductCreatePage from "../../features/products/ui/pages/ProductCreatePage";
import ProductDetailsPage from "../../features/products/ui/pages/ProductDetailsPage";
import ProductEditPage from "../../features/products/ui/pages/ProductEditPage";

export const routes = [
  { path: "/login", element: <LoginPage /> },

  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Default after login
          { index: true, element: <Navigate to="/products" replace /> },
          // Optional alias
          { path: "dashboard", element: <Navigate to="/products" replace /> },

          // Products
          { path: "products", element: <ProductsListPage /> },
          { path: "products/new", element: <ProductCreatePage /> },
          { path: "products/:id", element: <ProductDetailsPage /> },
          { path: "products/:id/edit", element: <ProductEditPage /> },
        ],
      },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
];
