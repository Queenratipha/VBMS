import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

const SELECT_BOOKINGS = `
  SELECT b.id, b.vehicle_name, b.booking_date, b.booking_duration, b.booking_cost,
         c.id AS customer_id, c.name AS customer_name
  FROM bookings b
  JOIN customers c ON b.customer_id = c.id
  ORDER BY b.created_at DESC
`;

router.post('/', async (req, res) => {
  const { customer_id, vehicleName, bookingDate, bookingDuration, bookingCost } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO bookings (customer_id, vehicle_name, booking_date, booking_duration, booking_cost) VALUES (?, ?, ?, ?, ?)',
      [customer_id, vehicleName, bookingDate, bookingDuration, bookingCost]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create booking', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(SELECT_BOOKINGS);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch bookings', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { customer_id, vehicleName, bookingDate, bookingDuration, bookingCost } = req.body;
  try {
    await pool.execute(
      'UPDATE bookings SET customer_id = ?, vehicle_name = ?, booking_date = ?, booking_duration = ?, booking_cost = ? WHERE id = ?',
      [customer_id, vehicleName, bookingDate, bookingDuration, bookingCost, req.params.id]
    );
    res.json({ message: 'Booking updated' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update booking', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete booking', error: error.message });
  }
});

export default router;
