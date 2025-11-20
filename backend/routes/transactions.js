const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/transactions
// supports optional query params: month=YYYY-MM (e.g., 2025-11), category
router.get('/', async (req, res) => {
  try {
    const { month, category } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (month && month !== 'all') {
      const [year, monthNum] = month.split('-').map(Number);
      filter.date = {
        $gte: new Date(year, monthNum - 1, 1),
        $lt: new Date(year, monthNum, 1)
      };
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;
    const tx = new Transaction({
      type,
      amount,
      category: category || 'Uncategorized',
      date: date ? new Date(date) : new Date(),
      note: note || ''
    });
    const saved = await tx.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.date) updates.date = new Date(updates.date);
    const updated = await Transaction.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Transaction.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
