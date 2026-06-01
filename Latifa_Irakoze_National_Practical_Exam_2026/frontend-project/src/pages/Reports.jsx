import { useEffect, useState } from 'react';
import api from '../api';

export default function Reports() {
  const [dailyBookings, setDailyBookings] = useState([]);
  const [paymentReport, setPaymentReport] = useState([]);
  const [tab, setTab] = useState('daily');

  useEffect(() => {
    api.get('/reports/daily-bookings').then(r => setDailyBookings(r.data));
    api.get('/reports/payment-report').then(r => setPaymentReport(r.data));
  }, []);

  const statusStyle = (s) =>
    s === 'Completed' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
    s === 'Failed' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
    'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
      <div className="flex items-center gap-3 mb-8 slide-up">
        <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center text-lg">📊</div>
        <h2 className="text-3xl font-bold title-gradient">Reports</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 slide-up">
        <button onClick={() => setTab('daily')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'daily'
              ? 'btn-glow text-white'
              : 'glass text-white/50 hover:text-white border border-white/10'
          }`}>
          📅 Daily Booking Report
        </button>
        <button onClick={() => setTab('payment')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'payment'
              ? 'btn-glow text-white'
              : 'glass text-white/50 hover:text-white border border-white/10'
          }`}>
          💰 Payment Report
        </button>
      </div>

      <div className="glass overflow-hidden slide-up fade-in">
        {tab === 'daily' && (
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>#</th><th>Customer Name</th><th>Vehicle Name</th>
                <th>Booking Date</th><th>Duration (days)</th><th>Cost (RWF)</th>
              </tr>
            </thead>
            <tbody>
              {dailyBookings.map((b, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{b.customerName}</td>
                  <td>{b.vehicleName}</td>
                  <td>{b.bookingDate?.slice(0, 10)}</td>
                  <td>{b.bookingDuration}</td>
                  <td>{Number(b.bookingCost).toLocaleString()}</td>
                </tr>
              ))}
              {dailyBookings.length === 0 && (
                <tr><td colSpan="6" className="text-center py-10 text-white/30">No booking data available</td></tr>
              )}
            </tbody>
          </table>
        )}

        {tab === 'payment' && (
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>#</th><th>Customer Name</th><th>Vehicle Name</th>
                <th>Payment Amount (RWF)</th><th>Payment Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentReport.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.customerName}</td>
                  <td>{p.vehicleName}</td>
                  <td>{Number(p.paymentAmount).toLocaleString()}</td>
                  <td>{p.paymentDate?.slice(0, 10)}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(p.paymentStatus)}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {paymentReport.length === 0 && (
                <tr><td colSpan="6" className="text-center py-10 text-white/30">No payment data available</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
