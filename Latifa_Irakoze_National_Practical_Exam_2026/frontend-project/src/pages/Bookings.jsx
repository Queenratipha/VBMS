import { useEffect, useState } from 'react';
import api from '../api';

const empty = { customer_id: '', vehicleName: '', bookingDate: '', bookingDuration: '', bookingCost: '' };

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const [b, c] = await Promise.all([api.get('/bookings'), api.get('/customers')]);
    setBookings(b.data);
    setCustomers(c.data);
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/bookings/${editId}`, form);
      flash('Booking updated successfully');
      setEditId(null);
    } else {
      await api.post('/bookings', form);
      flash('Booking added successfully');
    }
    setForm(empty);
    load();
  };

  const handleEdit = (b) => {
    setForm({
      customer_id: b.customer_id,
      vehicleName: b.vehicle_name,
      bookingDate: b.booking_date?.slice(0, 10),
      bookingDuration: b.booking_duration,
      bookingCost: b.booking_cost
    });
    setEditId(b.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return;
    await api.delete(`/bookings/${id}`);
    flash('Booking deleted');
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
      <div className="flex items-center gap-3 mb-8 slide-up">
        <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center text-lg">📋</div>
        <h2 className="text-3xl font-bold title-gradient">Bookings</h2>
      </div>

      {msg && (
        <div className="toast mb-6 bg-green-500/20 border border-green-500/30 text-green-300 px-5 py-3 rounded-xl text-sm flex items-center gap-2">
          ✓ {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass p-6 mb-8 slide-up grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="label-dark">Customer</label>
          <select className="input-dark" value={form.customer_id}
            onChange={e => setForm({ ...form, customer_id: e.target.value })} required>
            <option value="">-- Select Customer --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label-dark">Vehicle Name</label>
          <input className="input-dark" placeholder="e.g. Toyota Corolla"
            value={form.vehicleName} onChange={e => setForm({ ...form, vehicleName: e.target.value })} required />
        </div>
        <div>
          <label className="label-dark">Booking Date</label>
          <input type="date" className="input-dark"
            value={form.bookingDate} onChange={e => setForm({ ...form, bookingDate: e.target.value })} required />
        </div>
        <div>
          <label className="label-dark">Duration (days)</label>
          <input type="number" min="1" className="input-dark" placeholder="Number of days"
            value={form.bookingDuration} onChange={e => setForm({ ...form, bookingDuration: e.target.value })} required />
        </div>
        <div>
          <label className="label-dark">Booking Cost (RWF)</label>
          <input type="number" min="0" className="input-dark" placeholder="Amount in RWF"
            value={form.bookingCost} onChange={e => setForm({ ...form, bookingCost: e.target.value })} required />
        </div>
        <div className="flex items-end gap-3">
          <button type="submit" className="btn-glow text-white px-8 py-2.5 rounded-xl font-medium text-sm">
            {editId ? '✏ Update Booking' : '+ Add Booking'}
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
              <th>#</th><th>Customer</th><th>Vehicle</th><th>Date</th><th>Duration</th><th>Cost (RWF)</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.customer_name}</td>
                <td>{b.vehicle_name}</td>
                <td>{b.booking_date?.slice(0, 10)}</td>
                <td>{b.booking_duration} day(s)</td>
                <td>{Number(b.booking_cost).toLocaleString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(b)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan="7" className="text-center py-10 text-white/30">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
