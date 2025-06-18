//vadliation.js
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// ✅ Register logic
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const error = document.getElementById("regError");

    let valid = true;

    // Reset classes
    [name, email, password].forEach((input) => {
      input.classList.remove("is-invalid", "is-valid");
    });

    if (!name.value.trim()) {
      name.classList.add("is-invalid");
      valid = false;
    } else {
      name.classList.add("is-valid");
    }

    if (!validateEmail(email.value)) {
      email.classList.add("is-invalid");
      valid = false;
    } else {
      email.classList.add("is-valid");
    }

    if (password.value.length < 6) {
      password.classList.add("is-invalid");
      valid = false;
    } else {
      password.classList.add("is-valid");
    }

    if (!valid) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.some(u => u.email === email.value.toLowerCase());

    if (exists) {
      error.textContent = " This email is already registered.";
      email.classList.add("is-invalid");
      return;
    }

    users.push({
      name: name.value.trim(),
      email: email.value.toLowerCase(),
      password: password.value,
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ Registered successfully!");
    window.location.href = "index.html";
  });
}

// ✅ Login logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    const error = document.getElementById("loginError");

    [email, password].forEach((input) => {
      input.classList.remove("is-invalid", "is-valid");
    });

    let valid = true;

    if (!validateEmail(email.value)) {
      email.classList.add("is-invalid");
      valid = false;
    } else {
      email.classList.add("is-valid");
    }

    if (!password.value.trim()) {
      password.classList.add("is-invalid");
      valid = false;
    } else {
      password.classList.add("is-valid");
    }

    if (!valid) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email.value.toLowerCase() && u.password === password.value
    );

    if (!user) {
      error.textContent = " Incorrect email or password.";
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "home.html";
  });
}

// ✅ Home page name display
const welcomeUser = document.getElementById("welcomeUser");
if (welcomeUser) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "index.html";
  } else {
    welcomeUser.textContent = user.name;
  }
}

// ✅ Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
