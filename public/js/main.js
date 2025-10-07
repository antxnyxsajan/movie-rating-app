async function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  document.getElementById("msg").innerText = data.message || "Signed up!";
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.success) window.location.href = "/dashboard";
  else document.getElementById("msg").innerText = data.message;
}
