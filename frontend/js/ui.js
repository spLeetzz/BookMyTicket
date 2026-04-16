import { state, apiFetch } from "./api.js";

export function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const icon = type === "error" ? "error" : "check_circle";
  const iconColor = type === "error" ? "text-red-400" : "text-primary";

  toast.className = `glass-panel px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 translate-x-10 opacity-0 flex items-center gap-3 border-l-4 ${type === "error" ? "border-red-500" : "border-primary"}`;

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor}">${icon}</span>
    <span class="font-body text-sm font-medium text-on-surface">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-x-10", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("translate-x-10", "opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

export function renderNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const user = state.user;
  const navContent = `
    <header class="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        <a href="index.html" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 animate-pulse group-hover:bg-primary/20 transition-colors">
            <span class="material-symbols-outlined text-primary text-2xl transition-transform group-hover:scale-110" style="font-variation-settings: 'FILL' 1;">water_drop</span>
          </div>
          <span class="font-headline font-extrabold text-2xl tracking-tighter text-on-surface">BookMyTicket</span>
        </a>
        
        <div class="flex gap-6 items-center">
          ${
            user
              ? `
            <div class="flex items-center gap-3 px-4 py-2 bg-surface-container rounded-full border border-white/5">
              <span class="material-symbols-outlined text-primary text-sm">person</span>
              <span class="text-on-surface-variant text-xs font-bold uppercase tracking-widest">${user.userId}</span>
            </div>
            <button id="logout-btn" class="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Logout
              <span class="material-symbols-outlined text-sm">logout</span>
            </button>
          `
              : `
            <a href="login.html" class="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">Login</a>
            <a href="register.html" class="px-6 py-2 rounded-full caustic-bg border border-primary/30 text-primary hover:bg-primary/10 transition-all text-xs font-bold uppercase tracking-widest">Sign Up</a>
          `
          }
        </div>
      </div>
    </header>
  `;
  container.innerHTML = navContent;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      try {
        await apiFetch("/logout", { method: "POST" });
      } catch (e) {
        console.error("Logout failed", e);
      } finally {
        state.token = null;
        window.location.href = "login.html";
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", renderNavbar);
