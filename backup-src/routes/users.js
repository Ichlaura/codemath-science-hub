const express = require("express");
const router = express.Router();

// Datos de ejemplo para simular una base de datos
let users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "parent",
    createdAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/", (req, res) => {
  res.json({
    message: "Users retrieved successfully",
    users: users
  });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      error: "User not found",
      message: `User with ID ${userId} does not exist`
    });
  }

  res.json({
    message: "User retrieved successfully",
    user: user
  });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user in the system
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [parent, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", (req, res) => {
  const { name, email, role = 'parent' } = req.body;

  // Validación básica
  if (!name || !email) {
    return res.status(400).json({
      error: "Validation error",
      message: "Name and email are required"
    });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    role,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  
  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update an existing user information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
      message: `User with ID ${userId} does not exist`
    });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    message: "User updated successfully",
    user: users[userIndex]
  });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Remove a user from the system
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
      message: `User with ID ${userId} does not exist`
    });
  }

  users.splice(userIndex, 1);

  res.json({
    message: "User deleted successfully",
    deletedId: userId
  });
});

module.exports = router;