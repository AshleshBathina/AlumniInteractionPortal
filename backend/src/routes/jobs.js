const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all jobs with applications count
router.get('/', auth, (req, res) => {
  const db = req.db;
  
  const query = `
    SELECT j.*, u.name as alumni_name, u.email as alumni_email,
           COUNT(a.id) as applications_count
    FROM jobs j
    JOIN users u ON j.alumni_id = u.id
    LEFT JOIN applications a ON a.job_id = j.id
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `;
  
  db.all(query, [], (err, jobs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(jobs);
  });
});

// Get single job
router.get('/:id', auth, (req, res) => {
  const db = req.db;
  
  const query = `
    SELECT j.*, u.name as alumni_name, u.email as alumni_email 
    FROM jobs j
    JOIN users u ON j.alumni_id = u.id
    WHERE j.id = ?
  `;
  
  db.get(query, [req.params.id], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  });
});

// Create job (alumni only)
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { title, description, company, location, stipend, apply_by } = req.body;
  const db = req.db;

  const query = `
    INSERT INTO jobs (title, description, company, location, stipend, apply_by, alumni_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [title, description, company, location, stipend, apply_by, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error creating job' });
    }
    res.json({ id: this.lastID });
  });
});

// Update job (alumni only)
router.put('/:id', auth, (req, res) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { title, description, company, location, stipend, apply_by } = req.body;
  const db = req.db;

  // Verify job belongs to alumni
  db.get('SELECT * FROM jobs WHERE id = ? AND alumni_id = ?', [req.params.id, req.user.id], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!job) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    const query = `
      UPDATE jobs 
      SET title = ?, description = ?, company = ?, location = ?, stipend = ?, apply_by = ?
      WHERE id = ?
    `;

    db.run(query, [title, description, company, location, stipend, apply_by, req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating job' });
      }
      res.json({ message: 'Job updated successfully' });
    });
  });
});

// Delete job (alumni only)
router.delete('/:id', auth, (req, res) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const db = req.db;

  // Verify job belongs to alumni
  db.get('SELECT * FROM jobs WHERE id = ? AND alumni_id = ?', [req.params.id, req.user.id], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!job) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    db.run('DELETE FROM jobs WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting job' });
      }
      res.json({ message: 'Job deleted successfully' });
    });
  });
});

module.exports = router;
