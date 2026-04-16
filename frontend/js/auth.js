import { apiFetch, state, API_URL } from "./api.js";
import { showToast } from "./ui.js";

// Note: Google OAuth returns JSON with accessToken.
// The user will see the JSON response and can copy the token,
// or you can use a browser extension to auto-capture it.
// For production, consider having backend redirect instead.

// Setup Google OAuth buttons (direct navigation)
const googleBtn = document.getElementById("google-oauth-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const popup = window.open(
      `${API_URL}/google`,
      "googleOAuth",
      "width=500,height=600,scrollbars=yes,resizable=yes",
    );

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "OAUTH_SUCCESS") return;

      window.removeEventListener("message", handleMessage);
      state.token = event.data.accessToken;
      showToast("Logged in!");
      window.location.href = "index.html";
    };

    window.addEventListener("message", handleMessage);

    // cleanup if popup closed without completing
    const pollClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollClosed);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  });
}

// Login form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      state.token = data.accessToken;
      showToast("Logged in!");
      window.location.href = "index.html";
    } catch (err) {
      showToast(err.message, "error");
    }
  };
}

// Register form
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const data = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      state.token = data.accessToken;
      showToast("Registered!");
      window.location.href = "index.html";
    } catch (err) {
      showToast(err.message, "error");
    }
  };
}
