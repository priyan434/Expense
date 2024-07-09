const express = require('express')
const app = express()
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routers = require('./Routers/Router')
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', routers)
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API for managing expenses',
      contact: {
        name: 'priyan',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    components: {
      securitySchemes: {
        xAuthToken: {
          type: 'authKey',
          in: 'header',
          name: 'x-auth-token',
          description: 'Custom header for auth',
        },
      },
    },
    security: [
      {
        xAuthToken: [],
      },
    ],
  },
  apis: ['app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - basecurrency
 *               - profile_url
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               basecurrency:
 *                 type: number
 *                profile_url:
 *                 type:string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /addExpense:
 *   post:
 *     summary: Add a new expense
 *     tags: [expense]
 *     security:
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - amount
 *               - curr_id
 *               - expense
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-08"
 *               amount:
 *                 type: number
 *                 example: 100.50
 *               expense:
 *                 type: string
 *                 example: "Lunch"
 *               curr_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Expense added successfully
 *       400:
 *         description: Bad request. Invalid input, e.g., missing required fields or incorrect data types.
 *       500:
 *         description: Internal server error. Please try again later.
 */

/**
 * @swagger
 * /getallexpense:
 *   get:
 *     summary: Get all expenses for the authenticated user
 *     tags: [expense]
 *     security:
 *       - xAuthToken: []
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   exp_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   amount:
 *                     type: number
 *                   expense:
 *                     type: string
 *                   curr_id:
 *                     type: number
 *       400:
 *         description: User not found or expenses not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error. Please try again later.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /updateExpense/{id}:
 *   put:
 *     summary: Update a specific expense by ID
 *     tags: [expense]
 *     security:
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *               expense:
 *                 type: string
 *               curr_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       400:
 *         description: Bad request. Invalid input, e.g., missing required fields or incorrect data types.
 *       404:
 *         description: Expense not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Expense with ID {id} not found
 *       500:
 *         description: Internal server error. Please try again later.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /deleteExpense/{id}:
 *   delete:
 *     summary: Delete a specific expense by ID
 *     tags: [expense]
 *     security:
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Expense with ID {id} not found
 *       500:
 *         description: Internal server error. Please try again later.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
module.exports = app