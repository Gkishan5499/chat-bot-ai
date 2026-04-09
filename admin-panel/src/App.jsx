import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Chats from './pages/Chats';
import Logs from './pages/Logs';

const isAuth = () => !!localStorage.getItem('adminToken');

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={isAuth() ? <Layout /> : <Navigate to="/login" />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="chats" element={<Chats />} />
                <Route path="logs" element={<Logs />} />
            </Route>
        </Routes>
    );
}
