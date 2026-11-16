import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-sm font-semibold text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" aria-hidden="true" />
        Loading your dashboard...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
