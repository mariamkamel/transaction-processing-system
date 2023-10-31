const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authenticateUser = require('../middlewares/authenticateUser');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with a unique username.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             example:
 *               username: testuser
 *               password: testpassword
 *               role: user
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       500:
 *         description: Registration failed.
 */
router.post('/register', UserController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate and log in an existing user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: testuser
 *               password: testpassword
 *     responses:
 *       200:
 *         description: User logged in successfully. Returns a JWT token.
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               expiresIn: 3600
 *       401:
 *         description: Authentication failed.
 */
router.post('/login', UserController.loginUser);
/**
 * @swagger
 * /api/users/account-anaylytics:
 *   get:
 *     summary: Get user account analytics
 *     description: Retrieve analytics data for the authenticated user.
 *     responses:
 *       200:
 *         description: User analytics data.
 *         content:
 *           application/json:
 *             example:
 *               totalVolume: 500.0
 *               avgAmount: 100.0
 *               transactionCount: 5
 *       401:
 *         description: Unauthorized.
 */
router.get('/account-anaylytics', authenticateUser, UserController.getUserAnalytics);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve user details by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User's ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details.
 *         content:
 *           application/json:
 *             example:
 *               username: testuser
 *               role: user
 *       404:
 *         description: User not found.
 */
router.get('/:id',authenticateUser, UserController.getUserById);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             example:
 *               - username: user1
 *                 role: user
 *               - username: user2
 *                 role: admin
 *       403:
 *         description: Permission denied (only admins can use this feature).
 */
router.get('/', authenticateUser, UserController.getAllUsers);

module.exports = router;

