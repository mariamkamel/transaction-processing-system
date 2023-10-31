const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

require('dotenv').config();
const { MONGODB_URI, PORT } = process.env;
// Define Swagger options
const options = {
  definition: {
    openapi: '3.0.0', // specify the OpenAPI version
    info: {
      title: 'Transaction Processing System API',
      version: '1.0.0',
      description: 'API documentation for the Transaction Processing System',
    },
  },
  apis: [
    path.join(__dirname, 'routes/*.js'), // Include your route files
    path.join(__dirname, 'models/*.js'), // Include your model files
  ],
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());

// Set up MongoDB connection using Mongoose
const mongoose = require('mongoose');
mongoose.connect(MONGODB_URI+
  'replicaSet=rs', { useNewUrlParser: true, useUnifiedTopology: true });

// Require your models
const Transaction = require('./models/transaction.model');

const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);


module.exports = app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});