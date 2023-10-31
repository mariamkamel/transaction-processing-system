const mongoose = require('mongoose');
const Transaction = require('./transaction.model')
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         balance:
 *           type: number
 *           description: The balance of the user's account.
 *         transactionHistory:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of transaction IDs.
 *         role:
 *           type: string
 *           description: The role of the user (user or admin).
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0.0, // Initial balance is 0
  },
  transactionHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
  role: {
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user', 
  },});


userSchema.methods.getAnalytics = async function () {
  const userId = this._id; // User's ID
  try {
    // Calculate the total transaction volume for the user
    const totalVolume = await Transaction.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Calculate the average transaction amount for the user
    const avgAmount = await Transaction.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$amount' },
        },
      },
    ]);

    // Calculate the transaction frequency for the user
    const transactionCount = await Transaction.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // Construct the user analytics object
    const userAnalytics = {
      totalVolume: totalVolume[0] ? totalVolume[0].total : 0,
      avgAmount: avgAmount[0] ? avgAmount[0].avg : 0,
      transactionCount,
    };

    return userAnalytics;
  } catch (error) {
    console.error('Error calculating user analytics:', error);
    throw error;
  }
};
  
const User = mongoose.model('User', userSchema);

module.exports = User;
