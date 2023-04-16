const express = require('express');
const router = express.Router();

// Sample data
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

// Route to fetch all users
router.get('/', (req, res) => {
  res.json(users);
});

// Route to fetch a user by ID
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

module.exports = router;