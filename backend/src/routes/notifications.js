const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all notifications for a user
router.get('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  
  console.log('=== NOTIFICATIONS API CALL ===');
  console.log('User ID:', userId);
  console.log('Request headers:', req.headers);
  
  const query = `
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.all(query, [userId], (err, notifications) => {
    if (err) {
      console.error('Database error fetching notifications:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Found notifications:', notifications.length);
    console.log('Notifications data:', notifications);
    res.json(notifications);
  });
});

// Get unread notifications count
router.get('/unread-count', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  
  console.log('=== UNREAD COUNT API CALL ===');
  console.log('User ID:', userId);
  
  const query = `
    SELECT COUNT(*) as count FROM notifications 
    WHERE user_id = ? AND read = 0
  `;
  
  db.get(query, [userId], (err, result) => {
    if (err) {
      console.error('Database error fetching unread count:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Unread count for user', userId, ':', result.count);
    res.json({ count: result.count });
  });
});

// Mark notification as read
router.put('/:id/read', auth, (req, res) => {
  const db = req.db;
  const notificationId = req.params.id;
  const userId = req.user.id;
  
  const query = `
    UPDATE notifications 
    SET read = 1 
    WHERE id = ? AND user_id = ?
  `;
  
  db.run(query, [notificationId, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ message: 'Notification marked as read' });
  });
});

// Mark all notifications as read
router.put('/mark-all-read', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  
  const query = `
    UPDATE notifications 
    SET read = 1 
    WHERE user_id = ? AND read = 0
  `;
  
  db.run(query, [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'All notifications marked as read' });
  });
});

// Delete notification
router.delete('/:id', auth, (req, res) => {
  const db = req.db;
  const notificationId = req.params.id;
  const userId = req.user.id;
  
  const query = `
    DELETE FROM notifications 
    WHERE id = ? AND user_id = ?
  `;
  
  db.run(query, [notificationId, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
  });
});

// Helper function to create notification (can be used by other routes)
const createNotification = (db, userId, message) => {
  const query = `
    INSERT INTO notifications (user_id, message)
    VALUES (?, ?)
  `;
  
  db.run(query, [userId, message], (err) => {
    if (err) {
      console.error('Error creating notification:', err);
    }
  });
};

module.exports = { router, createNotification };
