const User = require('../models/user.model'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../errors/errors');


class UserService {

  async registerUser(userData) {
    try {
        const { username, password, role } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Registration failed');
      }
  }

  async loginUser(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new AuthenticationError('Authentication failed');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Authentication failed');
    }

    const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });
    return { token, expiresIn: 3600 };
  }
  
  async getUserById(userId) {
    const user = await User.findById(userId);
    return user;
  }

  async getAllUsers() {
    const users = await User.find();
    return users;
  }

  async getUserAnalytics(user) {
    const analytics = await user.getAnalytics();
    return analytics;
  }

}
module.exports = new UserService();
