const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const { createNotification } = require('./notifications');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '../../uploads/resumes');
    try {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
    } catch (e) {
      return cb(e);
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Apply for a job (student only)
router.post('/:jobId', auth, upload.single('resume'), (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { jobId } = req.params;
  const { cover_letter } = req.body;
  // Normalize stored path to a web-accessible URL under /uploads
  const resume_url = req.file ? `/uploads/resumes/${path.basename(req.file.path)}` : null;

  if (!resume_url) {
    return res.status(400).json({ error: 'Resume is required' });
  }

  const db = req.db;

  // Check if already applied
  db.get(
    'SELECT * FROM applications WHERE job_id = ? AND student_id = ?',
    [jobId, req.user.id],
    (err, application) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (application) {
        return res.status(400).json({ error: 'Already applied for this job' });
      }

      // Create application
      const query = `
        INSERT INTO applications (job_id, student_id, resume_url, cover_letter)
        VALUES (?, ?, ?, ?)
      `;

      db.run(query, [jobId, req.user.id, resume_url, cover_letter], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error creating application' });
        }

        // Create notification for alumni including student name
        db.get('SELECT alumni_id, title FROM jobs WHERE id = ?', [jobId], (jobErr, jobRow) => {
          if (jobErr || !jobRow) {
            return; // Silent fail for notification creation
          }

          db.get('SELECT name FROM users WHERE id = ?', [req.user.id], (userErr, userRow) => {
            const studentName = userErr || !userRow ? 'A student' : userRow.name;
            const jobTitle = jobRow.title || 'your job posting';

            const notificationQuery = `
              INSERT INTO notifications (user_id, message)
              VALUES (?, ?)
            `;
            const message = `${studentName} applied for your posting: ${jobTitle}`;
            db.run(notificationQuery, [jobRow.alumni_id, message]);

            // Also notify the student that their application was submitted
            const studentMessage = `Your application for ${jobTitle} has been submitted`;
            db.run(notificationQuery, [req.user.id, studentMessage]);
          });
        });

        res.json({ id: this.lastID });
      });
    }
  );
});

// Get applications for a job (alumni only)
router.get('/job/:jobId', auth, (req, res) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const db = req.db;

  // Verify job belongs to alumni
  db.get('SELECT * FROM jobs WHERE id = ? AND alumni_id = ?', 
    [req.params.jobId, req.user.id],
    (err, job) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!job) {
        return res.status(404).json({ error: 'Job not found or not authorized' });
      }

      // Get applications
      const query = `
        SELECT a.*, u.name as student_name, u.email as student_email
        FROM applications a
        JOIN users u ON a.student_id = u.id
        WHERE a.job_id = ?
        ORDER BY a.created_at DESC
      `;

      db.all(query, [req.params.jobId], (err, applications) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(applications);
      });
    }
  );
});

// Get student's applications (student only)
router.get('/my-applications', auth, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const db = req.db;

  const query = `
    SELECT a.*, j.title as job_title, j.company, j.location,
           u.name as alumni_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON j.alumni_id = u.id
    WHERE a.student_id = ?
    ORDER BY a.created_at DESC
  `;

  db.all(query, [req.user.id], (err, applications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(applications);
  });
});

// Update application status (alumni only)
router.put('/:id/status', auth, (req, res) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { status } = req.body;
  const db = req.db;

  // Verify application belongs to alumni's job
  const query = `
    SELECT a.*, j.alumni_id, j.title as job_title
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ? AND j.alumni_id = ?
  `;

  db.get(query, [req.params.id, req.user.id], (err, application) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!application) {
      return res.status(404).json({ error: 'Application not found or not authorized' });
    }

    // Update status
    db.run(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, req.params.id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating application' });
        }

        // Create notification for student
        const notificationQuery = `
          INSERT INTO notifications (user_id, message)
          VALUES (?, ?)
        `;
        db.run(notificationQuery, [
          application.student_id,
          `Your application for ${application.job_title} has been ${status}`
        ]);

        res.json({ message: 'Application status updated successfully' });
      }
    );
  });
});

module.exports = router;
