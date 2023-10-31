const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const mongoose = require('mongoose')
const userService = require('../services/userService'); // Import the user service
const {AuthenticationError} = require('../errors/errors')

// Controller for user registration
exports.registerUser = async (req, res) => {
  try {
      const newUser = await userService.registerUser(req.body);
      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
}

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const loginResponse = await userService.loginUser(username, password);
    res.status(200).json(loginResponse);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(401).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }
};

// Controller for getting all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller for getting a single user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller method to get user-level analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const user = req.user; // the authenticated user is available in the request by the middleware
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userAnalytics = await userService.getUserAnalytics(user);
    res.json(userAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};