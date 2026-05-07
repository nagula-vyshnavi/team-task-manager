import cors from "cors";

app.use(cors({
  origin: "https://your-app.vercel.app",
  credentials: true
}));
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
router.get("/", (req, res) => {
  res.json({ message: "Tasks working" });
});

module.exports = router;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks')); // ✅ ONLY THIS

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API Running! 🚀' });
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log('❌ DB Error:', err));
  app.get("/test", (req, res) => {
  res.json({ message: "server working" });
});