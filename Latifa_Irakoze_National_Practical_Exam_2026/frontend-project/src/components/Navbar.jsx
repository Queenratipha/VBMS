import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();

  const logout = async () => {
    await api.post('/auth/logout');
    setAuth(null);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
        : 'text-white/60 hover:text-white hover:bg-white/10'
    }`;

  return (
    <nav className="nav-glow relative z-20" style={{ background: 'rgba(15,12,41,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-glow flex items-center justify-center">
            <span className="text-white text-xs font-bold">SW</span>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">SwiftWheels <span className="title-gradient">VBMS</span></span>
        </div>

        <div className="flex items-center gap-1">
          <NavLink to="/customers" className={linkClass}>🧑 Customers</NavLink>
          <NavLink to="/bookings" className={linkClass}>📋 Bookings</NavLink>
          <NavLink to="/payments" className={linkClass}>💳 Payments</NavLink>
          <NavLink to="/reports" className={linkClass}>📊 Reports</NavLink>
          <button onClick={logout}
            className="ml-3 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300">
            ⏻ Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
