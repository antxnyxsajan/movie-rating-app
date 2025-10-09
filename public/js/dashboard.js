// Fetch movies when page loads
window.onload = () => {
  fetchMovies();
};

async function fetchMovies() {
  try {
    const res = await fetch('/movies');
    const movies = await res.json();

    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    movies.forEach(movie => {
      const div = document.createElement('div');
      div.classList.add('movie-item');
      div.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.description}</p>
        <label>Rate:
          <select id="rate-${movie._id}">
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>
        </label>
        <button onclick="submitRating('${movie._id}')">Submit</button>
      `;
      movieList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
  }
}

async function submitRating(movieId) {
  const rate = document.getElementById(`rate-${movieId}`).value;

  const res = await fetch('/rate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId, rating: rate })
  });

  const data = await res.json();
  alert(data.message);
}

function logout() {
  window.location.href = '/';
}
