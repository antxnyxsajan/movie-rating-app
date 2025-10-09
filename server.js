import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes

// Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ success: false, message: "Missing fields." });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.json({ success: false, message: "Username already exists." });

    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ success: true, message: "Signup successful!" });
  } catch (err) {
    res.json({ success: false, message: "Error signing up." });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.json({ success: false, message: "Invalid username or password." });
    res.json({ success: true, message: "Login successful!" });
  } catch (err) {
    res.json({ success: false, message: "Error logging in." });
  }
});

// Movies placeholder route
app.get('/movies', (req, res) => {
  res.json({ success: true, movies: ["Movie 1", "Movie 2", "Movie 3"] });
});

// Fallback route (catch-all)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
