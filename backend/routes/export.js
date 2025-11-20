const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { stringify } = require('csv-stringify');

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).lean();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');

    const columns = ['_id','type','amount','category','date','note','createdAt','updatedAt'];
    const stringifier = stringify({ header: true, columns });

    transactions.forEach(t => {
      t.date = new Date(t.date).toISOString();
      t.createdAt = t.createdAt ? new Date(t.createdAt).toISOString() : '';
      t.updatedAt = t.updatedAt ? new Date(t.updatedAt).toISOString() : '';
      stringifier.write(columns.map(c => t[c] ?? ''));
    });
    stringifier.pipe(res);
    stringifier.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Export failed');
  }
});

module.exports = router;
