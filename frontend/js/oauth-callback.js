// oauth-callback.js
const hash = window.location.hash.slice(1);
const params = new URLSearchParams(hash);
const accessToken = params.get("accessToken");
const error = params.get("error");

if (error) {
  const el = document.getElementById("status");
  el.textContent = "Error: " + decodeURIComponent(error);
  el.classList.add("error");
} else if (accessToken) {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(
      { type: "OAUTH_SUCCESS", accessToken },
      window.location.origin
    );
    setTimeout(() => window.close(), 500);
  } else {
    localStorage.setItem("accessToken", accessToken);
    window.location.href = "index.html";
  }
} else {
  const el = document.getElementById("status");
  el.textContent = "No token received";
  el.classList.add("error");
}