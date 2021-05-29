const express = require("express");
const router = express.Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: List of users.
 *     description: This api end point retrieves list users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 */
router.get('/user');

