const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
// Load environment variables
dotenv.config();

// Database connection is handled at the bottom before starting the server
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Feedback Email Route
app.post('/api/feedback', async (req, res) => {
  const { rating, feedbackText, userPhone } = req.body;
  
  if (!feedbackText) {
    return res.status(400).json({ error: 'Feedback text is required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'souravkumarpandab1437@gmail.com',
      subject: `New AgriSahayak Feedback! (Rating: ${rating} Stars)`,
      text: `You have received new feedback from the AgriSahayak Platform.\n\nRating: ${rating} / 5\nUser Phone: ${userPhone || 'Anonymous'}\n\nFeedback:\n${feedbackText}`
    };

    // Attempt to send email
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log('Feedback email sent to souravkumarpandab1437@gmail.com');
    } else {
      console.log('EMAIL_USER not configured. Feedback logged locally:', mailOptions.text);
    }

    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(200).json({ message: 'Feedback logged (Email failed)' });
  }
});

app.post('/predict', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const scriptPath = path.join(__dirname, 'predict_image.py');
    const modelPath = path.join(__dirname, '../Html/model.tflite');
    const imgPath = req.file.path;

    exec(`python "${scriptPath}" "${imgPath}" "${modelPath}"`, (error, stdout, stderr) => {
        fs.unlink(imgPath, () => {}); // cleanup temp file

        if (error) {
            console.error(`Error executing python script: ${error}`);
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: 'Prediction failed internally' });
        }
        
        try {
            const match = stdout.match(/\{[\s\S]*\}/);
            if (!match) throw new Error("No JSON found in stdout");
            const jsonOutput = JSON.parse(match[0]);
            return res.json(jsonOutput);
        } catch(e) {
             console.error(`JSON parse error: ${e}. Stdout: ${stdout}`);
             return res.status(500).json({ error: 'Invalid prediction output format' });
        }
    });
});

const PORT = process.env.PORT || 5000; // Trigger Nodemon Backend Restart

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
