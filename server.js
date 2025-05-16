require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// POST route to handle form submission
app.post('/submit', (req, res) => {
  const { name, email, rating, feedback } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,       // from .env
      pass: process.env.EMAIL_PASS        // from .env
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'gautivasu@gmail.com',
    subject: `New Feedback from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Rating: ${rating}
      Feedback: ${feedback}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Something went wrong!');
    }
    res.send('Thanks for your feedback!');
  });
});

// Start server
const PORT = process.env.PORT || 3001; // Changed from 3000 to 3001
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
