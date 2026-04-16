import { apiFetch, state } from "./api.js";
import { showToast } from "./ui.js";

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("eventId");

async function loadSeats() {
  const grid = document.getElementById("seats-grid");
  const label = document.getElementById("event-id-label");
  const nameHeader = document.getElementById("event-name");
  if (!grid || !eventId) return;

  label.textContent = `Event ID: ${eventId}`;

  try {
    // Try to fetch event name (if there's an endpoint for it)
    try {
      const event = await apiFetch(`/events`); // Assuming we can find it here or get all events
      const currentEvent = event.find(e => e.id == eventId);
      if (currentEvent) {
        nameHeader.textContent = currentEvent.title;
      }
    } catch (e) { console.log("Could not fetch event name") }

    const seats = await apiFetch(`/seats/event/${eventId}`);
    const currentUser = state.user;

    // Use a grid with 8 columns by default
    grid.className = "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-4 p-4";

    grid.innerHTML = seats
      .sort((a, b) => a.id - b.id)
      .map((seat) => {
        let seatClass = "seat-droplet w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[10px] font-bold transition-all transform cursor-pointer";
        let statusClass = "";
        let isBooked = false;
        const isOccupied = seat.is_booked;
        const bookedByMe = currentUser && seat.booked_by === currentUser.userId;

        if (isOccupied) {
          isBooked = true;
          if (bookedByMe) {
            // Your Booking: Vibrant Cyan
            statusClass = "bg-[#00daf3] text-[#001216] shadow-[0_0_20px_rgba(0,218,243,0.8)] border border-white/20";
          } else {
            // Occupied by others: Muted Crimson/Burgundy
            statusClass = "bg-gray-500/10 text-gray-400 border border-gray-500/20 cursor-not-allowed opacity-50"
          }
        } else {
          // Available: Lighter Gray
          statusClass = "bg-slate-700/50 text-slate-300 hover:bg-[#00daf3]/30 hover:text-white hover:scale-110 border border-white/5";
        }

        return `
        <div class="${seatClass} ${statusClass}"
             data-id="${seat.id}" 
             data-booked="${isBooked}"
             title="Seat ${seat.seat_number} (${isBooked ? (bookedByMe ? 'Your Booking' : 'Occupied') : 'Available'})">
          ${seat.seat_number}
        </div>
      `;
      })
      .join("");

    // Event Delegation for seat clicks
    grid.onclick = async (e) => {
      const seatEl = e.target.closest("[data-id]");
      if (!seatEl || seatEl.dataset.booked === "true") return;

      const seatId = seatEl.dataset.id;

      // Update UI for selected seat
      document.querySelectorAll("[data-id]").forEach(el => {
        if (el.dataset.booked === "false") {
          el.classList.remove("bg-primary-fixed-dim", "ring-2", "ring-primary", "scale-110");
          el.classList.add("bg-surface-container-high");
        }
      });

      seatEl.classList.remove("bg-surface-container-high");
      seatEl.classList.add("bg-primary-fixed-dim", "ring-2", "ring-primary", "scale-110");

      // Show summary
      const summary = document.getElementById("selection-summary");
      const seatName = document.getElementById("selected-seat-name");
      const bookBtn = document.getElementById("book-btn");

      summary.classList.remove("hidden");
      seatName.textContent = `Seat ${seatId}`;

      bookBtn.onclick = () => bookSeat(seatId);
    };
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function bookSeat(seatId) {
  const user = state.user;
  if (!user) {
    showToast("Please login to book a seat", "error");
    setTimeout(() => (window.location.href = "login.html"), 1500);
    return;
  }

  try {
    // Note: The backend route is /seats/:id/:userId
    // although the controller now uses req.user.userId,
    // the route definition still expects a :userId param.
    // We pass the userId from state.user just in case the route logic still expects it.
    await apiFetch(`/seats/${seatId}`, { method: "PUT" });
    showToast("Seat booked successfully!");

    // Hide summary after successful booking
    const summary = document.getElementById("selection-summary");
    if (summary) summary.classList.add("hidden");

    loadSeats(); // Refresh grid
  } catch (err) {
    showToast(err.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!state.token) {
    showToast("Please login first", "error");
    window.location.href = "login.html";
    return;
  }
  loadSeats();
});
