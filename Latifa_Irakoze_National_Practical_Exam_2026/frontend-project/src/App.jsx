import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Customers from './pages/Customers';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import Reports from './pages/Reports';

function PrivateRoute({ auth, children }) {
  return auth ? children : <Navigate to="/login" replace />;
}

function Layout({ auth, setAuth, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <Navbar auth={auth} setAuth={setAuth} />
      <main className="py-4">{children}</main>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to={auth ? '/customers' : '/login'} replace />} />
        <Route path="/customers" element={
          <PrivateRoute auth={auth}>
            <Layout auth={auth} setAuth={setAuth}><Customers /></Layout>
          </PrivateRoute>
        } />
        <Route path="/bookings" element={
          <PrivateRoute auth={auth}>
            <Layout auth={auth} setAuth={setAuth}><Bookings /></Layout>
          </PrivateRoute>
        } />
        <Route path="/payments" element={
          <PrivateRoute auth={auth}>
            <Layout auth={auth} setAuth={setAuth}><Payments /></Layout>
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute auth={auth}>
            <Layout auth={auth} setAuth={setAuth}><Reports /></Layout>
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
