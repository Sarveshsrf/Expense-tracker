require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionsRouter = require('./routes/transactions');
const exportRouter = require('./routes/export');

const app = express();
app.use(cors());
app.use(express.json()); // body parser for JSON

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker_db';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });

app.use('/api/transactions', transactionsRouter);
app.use('/api/export', exportRouter);

app.get('/', (req, res) => res.send('Expense Tracker Backend is running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
