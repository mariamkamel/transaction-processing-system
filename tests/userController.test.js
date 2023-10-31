const axios = require('axios');
const userService = require('../services/userService'); 
const db = require('./db')

beforeAll(async () => {
  await db.connect();
  await db.clearDatabase()
})

afterEach(async () => await db.clearDatabase())

afterAll(async () => await db.closeDatabase())

const url = "http://localhost:3000/api"
describe('User Controller', () => {
  it('should register a new user', async () => {
    const userData = {
      username: 'testusername',
      password: 'testpassword',
      role: 'user',
    };

   const response =  await userService.registerUser(userData);
    expect(response).toBeDefined();
    expect(response).toHaveProperty('_id', 'balance', 'password', 'role', 'transactionHistory', 'username');
  });

  it('should login a user', async () => {
    const userData = {
      username: 'testusername',
      password: 'testpassword',
    };
    
    await userService.registerUser(userData);

    const loggedInUser = await userService.loginUser( userData.username, userData.password);


    expect(loggedInUser).toBeDefined();
    expect(loggedInUser).toHaveProperty('token');
    expect(loggedInUser).toHaveProperty('expiresIn');
  });

  it('should get all users', async () => {
    const users = await userService.getAllUsers()
    expect(Array.isArray(users)).toBe(true);
  });

  it('should get a user by ID', async () => {
    const userData = {
      username: 'testusername',
      password: 'testpassword',
      role: 'user',
    };

    const newUser =  await userService.registerUser(userData);

    const user = await userService.getUserById(newUser._id)
    expect(user.username).toEqual(userData.username);
  });

});
