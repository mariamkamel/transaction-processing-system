const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');
const authenticateUser = require('../middlewares/authenticateUser');
const authorizeUser =  require('../middlewares/authorizeUser');

router.use(authenticateUser);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a transaction
 *     description: Create a new transaction (deposit, withdrawal, or transfer).
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiver:
 *                 type: string
 *               amount:
 *                 type: number
 *               transactionType:
 *                 type: string
 *             example:
 *               receiver: receiverID
 *               amount: 100.0
 *               transactionType: deposit
 *     responses:
 *       201:
 *         description: Transaction created successfully.
 *       400:
 *         description: Bad request.
 */

router.post('/', authenticateUser, TransactionController.createTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieve a list of all transactions (admin only).
 *     responses:
 *       200:
 *         description: A list of transactions.
 *         content:
 *           application/json:
 *             example:
 *               - sender: senderID
 *                 receiver: receiverID
 *                 amount: 100.0
 *                 transactionType: deposit
 *               - sender: senderID
 *                 receiver: receiverID
 *                 amount: 50.0
 *                 transactionType: withdrawal
 *       403:
 *         description: Permission denied (only admins can use this feature).
 */router.get('/', [authenticateUser, authorizeUser('admin')] ,TransactionController.getAllTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     description: Retrieve transaction details by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Transaction's ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details.
 *         content:
 *           application/json:
 *             example:
 *               sender: senderID
 *               receiver: receiverID
 *               amount: 100.0
 *               transactionType: deposit
 *       404:
 *         description: Transaction not found.
 */
router.get('/:id', authenticateUser, TransactionController.getTransactionById);

module.exports = router;
