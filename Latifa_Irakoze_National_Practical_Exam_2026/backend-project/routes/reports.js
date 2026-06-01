import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/daily-bookings', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.name AS customerName, b.vehicle_name AS vehicleName,
             b.booking_date AS bookingDate, b.booking_duration AS bookingDuration,
             b.booking_cost AS bookingCost
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      ORDER BY b.booking_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to generate daily booking report', error: error.message });
  }
});

router.get('/payment-report', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.name AS customerName, b.vehicle_name AS vehicleName,
             p.payment_amount AS paymentAmount, p.payment_date AS paymentDate,
             p.payment_status AS paymentStatus
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to generate payment report', error: error.message });
  }
});

export default router;
