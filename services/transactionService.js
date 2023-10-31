const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

async function createTransaction(senderUser, receiverId, amount, transactionType) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const receiverUser = await User.findById(receiverId).session(session);
    if (!receiverUser) {
      throw new Error('Receiver user not found');
    }

    if (senderUser.balance - amount < 0) {
      throw new Error('Insufficient balance');
    }

    const transaction = new Transaction({
      sender: senderUser,
      receiver: receiverId,
      amount,
      transactionType,
    });

    await transaction.save({ session: session });

    senderUser.transactionHistory.push(transaction._id);
    receiverUser.transactionHistory.push(transaction._id);

    if (transactionType === 'withdrawal' || transactionType === 'transfer') {
      senderUser.balance -= amount;
    }

    if (transactionType === 'deposit' || transactionType === 'transfer') {
      receiverUser.balance += amount;
    }

    await senderUser.save({ session: session });
    await receiverUser.save({ session: session });

    await session.commitTransaction();
    session.endSession();

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function getAllTransactions() {
  return Transaction.find();
}

async function getTransactionById(transactionId) {
  return Transaction.findById(transactionId);
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
};
