import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login({ setAuth }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      setAuth(res.data.username);
      navigate('/customers');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="glass slide-up w-full max-w-md mx-4 p-10 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl btn-glow pulse-ring flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">SW</span>
          </div>
          <h1 className="text-3xl font-bold title-gradient">SwiftWheels</h1>
          <p className="text-white/40 text-sm mt-1">Vehicle Booking Management System</p>
        </div>

        {error && (
          <div className="toast mb-5 bg-red-500/20 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-dark">Username</label>
            <input
              className="input-dark"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-dark">Password</label>
            <input
              type="password"
              className="input-dark"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full text-white font-semibold py-3 rounded-xl mt-2 flex items-center justify-center gap-2"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-400 hover:text-orange-300 font-medium transition">Create one</Link>
        </p>
      </div>
    </div>
  );
}
