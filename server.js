import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import User from './models/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Static files
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

// =======================
// Auth routes
// =======================
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
    console.error(err);
    res.json({ success: false, message: "Error signing up." });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.json({ success: false, message: "Invalid username or password." });
    }
    res.json({ success: true, message: "Login successful!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error logging in." });
  }
});

// =======================
// Movies route
// =======================
app.get('/movies', async (req, res) => {
  res.set('Cache-Control', 'no-store'); // disable caching

  try {
    const movieTitles = ['Inception', 'The Dark Knight', 'Interstellar'];
    const movies = [];

    for (const title of movieTitles) {
      const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${process.env.OMDB_KEY}`);
      const data = await response.json();
      if (data.Response === "True") {
        movies.push({
          title: data.Title,
          year: data.Year,
          rating: data.imdbRating,
          poster: data.Poster
        });
      }
    }

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});


// =======================
// Fallback route
// =======================
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});



// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
