import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    if (!/[A-Z]/.test(form.password)) return setError('Must contain at least one uppercase letter');
    if (!/[0-9]/.test(form.password)) return setError('Must contain at least one number');
    if (!/[^A-Za-z0-9]/.test(form.password)) return setError('Must contain at least one special character');

    setLoading(true);
    try {
      await api.post('/auth/register', { username: form.username, password: form.password });
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl btn-glow pulse-ring flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">SW</span>
          </div>
          <h1 className="text-3xl font-bold title-gradient">Create Account</h1>
          <p className="text-white/40 text-sm mt-1">Join SwiftWheels VBMS</p>
        </div>

        {error && (
          <div className="toast mb-4 bg-red-500/20 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}
        {success && (
          <div className="toast mb-4 bg-green-500/20 border border-green-500/40 text-green-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span>✓</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-dark">Username</label>
            <input className="input-dark" placeholder="Choose a username"
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div>
            <label className="label-dark">Password</label>
            <input type="password" className="input-dark" placeholder="Create a strong password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label className="label-dark">Confirm Password</label>
            <input type="password" className="input-dark" placeholder="Repeat your password"
              value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          </div>
          <p className="text-white/25 text-xs">8+ chars · uppercase · number · special character</p>
          <button type="submit" disabled={loading}
            className="btn-glow w-full text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin" /> : null}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
