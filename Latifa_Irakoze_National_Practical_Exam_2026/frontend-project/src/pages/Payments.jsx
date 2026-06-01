import { useEffect, useState } from 'react';
import api from '../api';

const empty = { booking_id: '', paymentAmount: '', paymentStatus: 'Pending', paymentDate: '' };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const [p, b] = await Promise.all([api.get('/payments'), api.get('/bookings')]);
    setPayments(p.data);
    setBookings(b.data);
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/payments/${editId}`, form);
      flash('Payment updated successfully');
      setEditId(null);
    } else {
      await api.post('/payments', form);
      flash('Payment added successfully');
    }
    setForm(empty);
    load();
  };

  const handleEdit = (p) => {
    setForm({
      booking_id: p.booking_id,
      paymentAmount: p.payment_amount,
      paymentStatus: p.payment_status,
      paymentDate: p.payment_date?.slice(0, 10)
    });
    setEditId(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this payment?')) return;
    await api.delete(`/payments/${id}`);
    flash('Payment deleted');
    load();
  };

  const statusStyle = (s) =>
    s === 'Completed' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
    s === 'Failed' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
    'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
      <div className="flex items-center gap-3 mb-8 slide-up">
        <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center text-lg">💳</div>
        <h2 className="text-3xl font-bold title-gradient">Payments</h2>
      </div>

      {msg && (
        <div className="toast mb-6 bg-green-500/20 border border-green-500/30 text-green-300 px-5 py-3 rounded-xl text-sm flex items-center gap-2">
          ✓ {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass p-6 mb-8 slide-up grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="label-dark">Booking</label>
          <select className="input-dark" value={form.booking_id}
            onChange={e => setForm({ ...form, booking_id: e.target.value })} required>
            <option value="">-- Select Booking --</option>
            {bookings.map(b => (
              <option key={b.id} value={b.id}>
                {b.customer_name} — {b.vehicle_name} ({b.booking_date?.slice(0, 10)})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dark">Payment Amount (RWF)</label>
          <input type="number" min="0" className="input-dark" placeholder="Amount in RWF"
            value={form.paymentAmount} onChange={e => setForm({ ...form, paymentAmount: e.target.value })} required />
        </div>
        <div>
          <label className="label-dark">Payment Status</label>
          <select className="input-dark" value={form.paymentStatus}
            onChange={e => setForm({ ...form, paymentStatus: e.target.value })}>
            <option>Pending</option>
            <option>Completed</option>
            <option>Failed</option>
          </select>
        </div>
        <div>
          <label className="label-dark">Payment Date</label>
          <input type="date" className="input-dark"
            value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} required />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn-glow text-white px-8 py-2.5 rounded-xl font-medium text-sm">
            {editId ? '✏ Update Payment' : '+ Add Payment'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setForm(empty); setEditId(null); }}
              className="px-6 py-2.5 rounded-xl font-medium text-sm text-white/60 border border-white/10 hover:bg-white/10 transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="glass overflow-hidden slide-up">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>#</th><th>Customer</th><th>Vehicle</th><th>Amount (RWF)</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.customer_name}</td>
                <td>{p.vehicle_name}</td>
                <td>{Number(p.payment_amount).toLocaleString()}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(p.payment_status)}`}>
                    {p.payment_status}
                  </span>
                </td>
                <td>{p.payment_date?.slice(0, 10)}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="7" className="text-center py-10 text-white/30">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
