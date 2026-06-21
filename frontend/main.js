async function login() {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Logged in! Plan: " + data.plan);
  } else {
    alert("Login failed");
  }
}

async function getPremium() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/premium", {
    headers: {
      Authorization: token
    }
  });

  const data = await res.json();
  alert(JSON.stringify(data));
}

document.querySelector("#app").innerHTML = `
  <h1>V5 SaaS System</h1>

  <input id="email" placeholder="email" />
  <input id="password" type="password" placeholder="password" />

  <button onclick="login()">Login</button>
  <button onclick="getPremium()">Get Premium Data</button>
`;
