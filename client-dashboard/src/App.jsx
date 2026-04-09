import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Chats from './pages/Chats'
import Settings from './pages/Settings'
import Embed from './pages/Embed'
import Billing from './pages/Billing'
import WidgetPreview from './pages/WidgetPreview'

const isAuth = () => !!localStorage.getItem('token')

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={isAuth() ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="chats" element={<Chats />} />
        <Route path="settings" element={<Settings />} />
        <Route path="embed" element={<Embed />} />
        <Route path="billing" element={<Billing />} />
        <Route path="widget" element={<WidgetPreview />} />
      </Route>
    </Routes>
  )
}