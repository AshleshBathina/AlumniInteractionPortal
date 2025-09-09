const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, (req, res) => {
  const db = req.db;
  
  db.get('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Update user profile
router.put('/profile', auth, (req, res) => {
  const { name, email } = req.body;
  const db = req.db;

  const query = `
    UPDATE users 
    SET name = ?, email = ?
    WHERE id = ?
  `;

  db.run(query, [name, email, req.user.id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating profile' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
});

// Get user notifications
router.get('/notifications', auth, (req, res) => {
  const db = req.db;

  const query = `
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `;

  db.all(query, [req.user.id], (err, notifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(notifications);
  });
});

// Mark notification as read
router.put('/notifications/:id/read', auth, (req, res) => {
  const db = req.db;

  db.run(
    'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Notification marked as read' });
    }
  );
});

module.exports = router;
