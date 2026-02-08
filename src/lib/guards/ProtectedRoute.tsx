import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

export default function ProtectedRoute() {
  const isAuthed = useAuthStore((s) => s.isAuthenticated());

  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}
