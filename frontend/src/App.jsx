import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chats from "./pages/Chats";
import Settings from "./pages/Settings";
import Embed from "./pages/Embed";
import Billing from "./pages/Billing";
import WidgetPreview from "./pages/WidgetPreview";
import Account from "./pages/Account";

function ProtectedRoute({ children }) {
  const isAuth = !!localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="chats" element={<Chats />} />
        <Route path="settings" element={<Settings />} />
        <Route path="embed" element={<Embed />} />
        <Route path="billing" element={<Billing />} />
        <Route path="widget" element={<WidgetPreview />} />
        <Route path="account" element={<Account />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
