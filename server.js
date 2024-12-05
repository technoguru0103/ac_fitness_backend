require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed", err));

// const verifyUser = require('../middleware/verifyUser');

// router.get('/profile', authenticateToken, verifyUser, (req, res) => {
//   res.json({ message: 'This is your profile' });
// });
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/profile', require('./routes/profileRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
