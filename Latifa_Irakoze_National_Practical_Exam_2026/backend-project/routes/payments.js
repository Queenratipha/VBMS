import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

const SELECT_PAYMENTS = `
  SELECT p.id, p.payment_amount, p.payment_status, p.payment_date,
         b.id AS booking_id, b.vehicle_name, b.booking_date,
         c.id AS customer_id, c.name AS customer_name
  FROM payments p
  JOIN bookings b ON p.booking_id = b.id
  JOIN customers c ON b.customer_id = c.id
  ORDER BY p.created_at DESC
`;

router.post('/', async (req, res) => {
  const { booking_id, paymentAmount, paymentStatus, paymentDate } = req.body;
  try {
    const [check] = await pool.execute('SELECT id FROM bookings WHERE id = ?', [booking_id]);
    if (check.length === 0) return res.status(400).json({ message: 'Booking not found' });

    const [result] = await pool.execute(
      'INSERT INTO payments (booking_id, payment_amount, payment_status, payment_date) VALUES (?, ?, ?, ?)',
      [booking_id, paymentAmount, paymentStatus || 'Pending', paymentDate]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create payment', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(SELECT_PAYMENTS);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch payments', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { booking_id, paymentAmount, paymentStatus, paymentDate } = req.body;
  try {
    await pool.execute(
      'UPDATE payments SET booking_id = ?, payment_amount = ?, payment_status = ?, payment_date = ? WHERE id = ?',
      [booking_id, paymentAmount, paymentStatus, paymentDate, req.params.id]
    );
    res.json({ message: 'Payment updated' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update payment', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM payments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete payment', error: error.message });
  }
});

export default router;
