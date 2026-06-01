import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, phoneNumber, address } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO customers (name, phone_number, address) VALUES (?, ?, ?)',
      [name, phoneNumber, address]
    );
    res.status(201).json({ id: result.insertId, name, phoneNumber, address });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create customer', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch customers', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, phoneNumber, address } = req.body;
  try {
    await pool.execute(
      'UPDATE customers SET name = ?, phone_number = ?, address = ? WHERE id = ?',
      [name, phoneNumber, address, req.params.id]
    );
    res.json({ id: req.params.id, name, phoneNumber, address });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update customer', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM customers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete customer', error: error.message });
  }
});

export default router;
