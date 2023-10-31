const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         sender:
 *           type: string
 *           description: The sender's user ID.
 *         receiver:
 *           type: string
 *           description: The receiver's user ID.
 *         amount:
 *           type: number
 *           description: The transaction amount.
 *         transactionType:
 *           type: string
 *           description: The type of transaction (deposit, withdrawal, or transfer).
 *         timestamp:
 *           type: string
 *           description: The timestamp of the transaction.
 */

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
