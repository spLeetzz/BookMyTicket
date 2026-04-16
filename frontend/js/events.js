import { apiFetch } from './api.js';
import { showToast } from './ui.js';

async function loadEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  try {
    const events = await apiFetch('/events');
    if (!events || events.length === 0) {
      grid.innerHTML = '<p class="text-gray-500 col-span-full text-center py-10">No events found.</p>';
      return;
    }

    grid.innerHTML = events.map(e => `
      <div class="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 group cursor-pointer flex flex-col h-full" 
           onclick="window.location.href='seats.html?eventId=${e.id}'">
        <div class="relative aspect-video overflow-hidden">
          <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80" 
               class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
               alt="${e.name}">
          <div class="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent opacity-60"></div>
          <div class="absolute bottom-4 left-4">
            <span class="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
              Live Event
            </span>
          </div>
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="font-headline text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">${e.title || 'Event ' + e.id}</h3>
          <p class="text-on-surface-variant text-sm mb-6 line-clamp-2">${e.description || 'Experience the magic of this exclusive live performance. Secure your seats now.'}</p>
          
          <div class="mt-auto pt-4 border-t border-outline-variant/10 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
            <div class="flex items-center gap-2 text-primary">
              <span class="material-symbols-outlined text-sm">confirmation_number</span>
              Available
            </div>
            <span class="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">View Seats →</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
