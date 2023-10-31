const transactionService = require('../services/transactionService'); // Import the transaction service

// Controller for creating a transaction
exports.createTransaction = async (req, res) => {
  try {
    const { receiver, amount, transactionType } = req.body;
    const senderUser = req.user; // Assuming you have a user object in the request

    const transaction = await transactionService.createTransaction(
      senderUser,
      receiver,
      amount,
      transactionType
    );

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error(error);
    if (error.message === 'Receiver user not found') {
      res.status(400).json({ message: 'Receiver user not found' });
    } else if (error.message === 'Insufficient balance') {
      res.status(400).json({ message: 'Insufficient balance' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Controller for getting all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller for getting a single transaction by ID
exports.getTransactionById = async (req, res) => {
  const transactionId = req.params.id;
  try {
    const transaction = await transactionService.getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
