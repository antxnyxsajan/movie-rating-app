const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const msg = document.getElementById('msg');

const API_URL = ''; // leave empty if same origin

// Only attach login/signup if elements exist
if (loginBtn) loginBtn.addEventListener('click', login);
if (signupBtn) signupBtn.addEventListener('click', signup);

// Load movies on dashboard
document.addEventListener('DOMContentLoaded', () => {
  const moviesContainer = document.getElementById('movies-container');
  if (moviesContainer) {
    loadMovies();
  }
});

// =======================
// Login function
// =======================
async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    msg.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    msg.textContent = data.message;

    if (data.success) {
      window.location.href = 'dashboard.html';
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "Error connecting to server.";
  }
}

// =======================
// Signup function
// =======================
async function signup() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    msg.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    msg.textContent = data.message;

    if (data.success) {
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "Error connecting to server.";
  }
}

async function loadMovies() {
  const container = document.getElementById('movies-container');
  container.innerHTML = ''; // Clear previous content

  // Static list of popular movies
  const movies = [
    {
      title: "Inception",
      year: "2010",
      rating: "8.8",
      poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg"
    },
    {
      title: "The Dark Knight",
      year: "2008",
      rating: "9.0",
      poster: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg"
    },
    {
      title: "Interstellar",
      year: "2014",
      rating: "8.6",
      poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"
    }
  ];

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h3>${movie.title} (${movie.year})</h3>
      <p>IMDb Rating: ${movie.rating}</p>
      <div class="stars" id="stars-${movie.title.replace(/\s/g, '')}">
        ${[1,2,3,4,5].map(i => `<span class="star" data-value="${i}">☆</span>`).join('')}
      </div>
    `;
    container.appendChild(card);

    // Add click event for stars
    const stars = card.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.getAttribute('data-value');
        rateMovie(movie.title, rating);
        // Fill stars visually
        stars.forEach(s => {
          s.textContent = s.getAttribute('data-value') <= rating ? '★' : '☆';
        });
      });
    });
  });
}

function rateMovie(title, rating) {
  alert(`You rated "${title}" ${rating}/5 stars`);
}
