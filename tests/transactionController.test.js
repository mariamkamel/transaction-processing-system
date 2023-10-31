const transactionService = require('../services/transactionService');
const db = require('./db')
// Mock the required dependencies
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');
beforeAll(async () => {
    await db.connect();
    await db.clearDatabase()
  })
  
  afterEach(async () => await db.clearDatabase())
  
  afterAll(async () => await db.closeDatabase())
  
// Mock the required functions
User.findById = jest.fn();
Transaction.prototype.save = jest.fn();
Transaction.find = jest.fn();
Transaction.findById = jest.fn();


describe('Transaction Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAllTransactions should return an array of transactions', async () => {
    Transaction.find.mockResolvedValue(['transaction1', 'transaction2']);

    const result = await transactionService.getAllTransactions();

    expect(result).toEqual(['transaction1', 'transaction2']);
    expect(Transaction.find).toHaveBeenCalled();
  });

  it('getTransactionById should return a single transaction by ID', async () => {
    Transaction.findById.mockResolvedValue('transactionData');

    const result = await transactionService.getTransactionById('transactionId');

    expect(result).toEqual('transactionData');
    expect(Transaction.findById).toHaveBeenCalledWith('transactionId');
  });
});
