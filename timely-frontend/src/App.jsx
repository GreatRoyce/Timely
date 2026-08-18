import "./App.css";
import LandingPage from "./pages/landing/LandingPage";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginForm from "./features/auth/components/LoginForm";
import RegisterForm from "./features/auth/components/RegisterForm";
import ForgotPasswordForm from "./features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "./features/auth/components/ResetPasswordForm";
import DashboardPage from "./pages/dashboard/DashboardPage";
import OrdersPage from "./pages/orders/OrdersPage";
import SettingsPage from "./pages/settings/SettingsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import CustomersPage from "./pages/customers/CustomersPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordForm />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordForm />
              </PublicRoute>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <OrdersProvider>
                  <DashboardLayout />
                </OrdersProvider>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="tasks" element={<OrdersPage />} />
              <Route path="orders" element={<Navigate to="/dashboard/tasks" replace />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
