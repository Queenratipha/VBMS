import { useEffect, useState } from 'react';
import api from '../api';

const empty = { name: '', phoneNumber: '', address: '' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const res = await api.get('/customers');
    setCustomers(res.data);
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/customers/${editId}`, form);
      flash('Customer updated successfully');
      setEditId(null);
    } else {
      await api.post('/customers', form);
      flash('Customer added successfully');
    }
    setForm(empty);
    load();
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, phoneNumber: c.phone_number, address: c.address });
    setEditId(c.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await api.delete(`/customers/${id}`);
    flash('Customer deleted');
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
      <div className="flex items-center gap-3 mb-8 slide-up">
        <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center text-lg">🧑</div>
        <h2 className="text-3xl font-bold title-gradient">Customers</h2>
      </div>

      {msg && (
        <div className="toast mb-6 bg-green-500/20 border border-green-500/30 text-green-300 px-5 py-3 rounded-xl text-sm flex items-center gap-2">
          ✓ {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass p-6 mb-8 slide-up grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="label-dark">Customer Name</label>
          <input className="input-dark" placeholder="Full name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="label-dark">Phone Number</label>
          <input className="input-dark" placeholder="e.g. 0788000000"
            value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} required />
        </div>
        <div>
          <label className="label-dark">Address</label>
          <input className="input-dark" placeholder="City / District"
            value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
        </div>
        <div className="md:col-span-3 flex gap-3">
          <button type="submit" className="btn-glow text-white px-8 py-2.5 rounded-xl font-medium text-sm">
            {editId ? '✏ Update Customer' : '+ Add Customer'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setForm(empty); setEditId(null); }}
              className="px-8 py-2.5 rounded-xl font-medium text-sm text-white/60 border border-white/10 hover:bg-white/10 transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="glass overflow-hidden slide-up">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Phone</th><th>Address</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>{c.phone_number}</td>
                <td>{c.address}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(c)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="5" className="text-center py-10 text-white/30">No customers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
