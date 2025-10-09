async function signup() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const msg = document.getElementById('msg');

  if (!username || !password) {
    msg.textContent = "Please enter both username and password.";
    return;
  }

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    msg.textContent = data.message || "Signup complete!";
  } catch (err) {
    msg.textContent = "Error connecting to server.";
  }
}

async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const msg = document.getElementById('msg');

  if (!username || !password) {
    msg.textContent = "Please enter both username and password.";
    return;
  }

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      msg.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } else {
      msg.textContent = data.message || "Invalid credentials.";
    }
  } catch (err) {
    msg.textContent = "Error connecting to server.";
  }
}
