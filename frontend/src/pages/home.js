import Sidebar from "../components/sidebar.js";
import Navbar from "../components/navbar.js";

// ══════════ DATOS ══════════
const events = [
  { id: 1, title: "Torneo Interbarrial de Fútbol", subgerencia: "Recreación y Deporte", tipo: "Fútbol", date: "2026-03-05", time: "09:00", location: "Estadio Municipal", status: "Programado", description: "Competencia deportiva entre barrios del municipio." },
  { id: 2, title: "Liga de Baloncesto Juvenil", subgerencia: "Recreación y Deporte", tipo: "Baloncesto", date: "2026-03-10", time: "14:00", location: "Coliseo Central", status: "Programado", description: "Torneo juvenil municipal." },
  { id: 3, title: "Jornada de Aeróbicos Comunitaria", subgerencia: "Actividad Física", tipo: "Aeróbicos", date: "2026-03-08", time: "07:00", location: "Parque Principal", status: "Activo", description: "Actividad física abierta a la comunidad." },
  { id: 4, title: "Festival Cultural de Danza", subgerencia: "Eventos Culturales", tipo: "Danza", date: "2026-03-18", time: "18:00", location: "Teatro Municipal", status: "Programado", description: "Presentación cultural de grupos de danza." }
];

// ══════════ ESTADO GLOBAL ══════════
let selectedSubgerencia = "Todas";
let selectedTipo = "Todos";
let selectedDate = null;
let searchText = "";

// ══════════ VISTA PRINCIPAL ══════════
export default function Home() {
  setTimeout(() => {
    window.home_renderTipos();
    window.home_renderCalendar();
    window.home_renderEvents();
  }, 0);

  return `
    <div class="flex w-full min-h-screen bg-gray-50">
      ${Sidebar()}

      <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        ${Navbar()}

        <main class="flex-1 p-6 overflow-y-auto space-y-8">
          ${heroSection()}

          <div class="space-y-4">
            <h2 class="text-xl font-bold text-gray-800">Filtrar Eventos</h2>
            <div id="subgerencia-filters" class="flex flex-wrap gap-2">
              ${renderSubgerenciaFilters()}
            </div>
            <div id="tipos-filters" class="flex flex-wrap gap-2 min-h-[32px]"></div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-8 space-y-4">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  id="searchEvents"
                  type="text"
                  placeholder="Buscar eventos por título o descripción..."
                  class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  oninput="window.home_setSearch(this.value)"
                />
              </div>

              <div id="eventsList" class="space-y-4"></div>
            </div>

            <div class="lg:col-span-4 space-y-6">
              ${calendarComponent()}
            </div>
          </div>

          ${modalComponent()}
        </main>
      </div>
    </div>
  `;
}

// ══════════ COMPONENTES VISUALES ══════════

function heroSection() {
  return `
    <div class="bg-blue-600 p-8 w-full rounded-2xl min-h-[220px] flex flex-col justify-center relative overflow-hidden shadow-md">
      <div class="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative z-10">
        <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-2">Muro de Eventos</h1>
        <p class="text-blue-100 text-lg">Descubre y gestiona las actividades del municipio</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
        
        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p class="text-gray-500 text-sm font-medium">Eventos hoy</p>
            <h2 class="text-2xl font-black text-gray-800">2</h2>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">
             <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p class="text-gray-500 text-sm font-medium">Próximos</p>
            <h2 class="text-2xl font-black text-gray-800">4</h2>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p class="text-gray-500 text-sm font-medium">Espacios</p>
            <h2 class="text-2xl font-black text-gray-800">4</h2>
          </div>
          <div class="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Eventos</p>
            <h2 class="text-2xl font-black text-gray-800">${events.length}</h2>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderSubgerenciaFilters() {
  const subs = ["Todas", "Recreación y Deporte", "Actividad Física", "Eventos Culturales"];
  return subs.map(s => {
    const isActive = selectedSubgerencia === s;
    const baseClass = "px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border";
    const activeClass = isActive ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100";
    return `<button class="${baseClass} ${activeClass}" onclick="window.home_setSubgerencia('${s}')">${s}</button>`;
  }).join("");
}

function renderTiposFilters() {
  const tipos = getTipos();
  if (tipos.length <= 1) return ""; // No mostrar si solo existe "Todos"
  
  return tipos.map(t => {
    const isActive = selectedTipo === t;
    const baseClass = "px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border";
    const activeClass = isActive ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50";
    return `<button class="${baseClass} ${activeClass}" onclick="window.home_setTipo('${t}')">${t}</button>`;
  }).join("");
}

function calendarComponent() {
  return `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-800">Marzo 2026</h3>
        ${selectedDate ? `<button onclick="window.home_setDate(null)" class="text-xs text-blue-600 hover:underline">Limpiar filtro</button>` : ''}
      </div>
      <div class="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-400 text-center mb-2">
        <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
      </div>
      <div id="calendarDays" class="grid grid-cols-7 gap-1 text-sm"></div>
    </div>
  `;
}

function modalComponent() {
  return `
    <div id="eventModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden items-center justify-center opacity-0 transition-opacity duration-200" onclick="if(event.target === this) window.home_closeModal()">
      <div id="modalContent" class="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl transform scale-95 transition-transform duration-200">
        </div>
    </div>
  `;
}

// ══════════ LÓGICA DE NEGOCIO Y RENDERIZADO ══════════

function getTipos() {
  if (selectedSubgerencia === "Recreación y Deporte") return ["Todos", "Fútbol", "Baloncesto", "Voleibol"];
  if (selectedSubgerencia === "Actividad Física") return ["Todos", "Aeróbicos", "Yoga", "Caminata"];
  if (selectedSubgerencia === "Eventos Culturales") return ["Todos", "Danza", "Música", "Teatro"];
  return ["Todos"];
}

function statusColor(status) {
  if (status === "Programado") return "bg-blue-50 text-blue-600 border border-blue-100";
  if (status === "Activo") return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  return "bg-gray-100 text-gray-600 border border-gray-200";
}

// Global scope para que funcionen los onclick en los strings HTML
window.home_setSubgerencia = (sub) => {
  selectedSubgerencia = sub;
  selectedTipo = "Todos"; // Reseteamos el tipo secundario
  document.getElementById("subgerencia-filters").innerHTML = renderSubgerenciaFilters();
  window.home_renderTipos();
  window.home_renderEvents();
};

window.home_setTipo = (tipo) => {
  selectedTipo = tipo;
  window.home_renderTipos();
  window.home_renderEvents();
};

window.home_setDate = (date) => {
  // Si se hace clic en la misma fecha, la deselecciona
  selectedDate = selectedDate === date ? null : date; 
  window.home_renderCalendar(); // Re-render para actualizar la vista activa y botón "Limpiar"
  window.home_renderEvents();
};

window.home_setSearch = (text) => {
  searchText = text.toLowerCase();
  window.home_renderEvents();
};

window.home_renderTipos = () => {
  const container = document.getElementById("tipos-filters");
  if (container) container.innerHTML = renderTiposFilters();
};

window.home_renderCalendar = () => {
  const container = document.getElementById("calendarDays");
  if (!container) return;

  // Renderizamos Marzo 2026. Marzo empieza en Domingo.
  let html = "";
  for (let i = 1; i <= 31; i++) {
    const day = i;
    const dateStr = `2026-03-${String(day).padStart(2, "0")}`;
    const hasEvent = events.some(e => e.date === dateStr);
    const isSelected = selectedDate === dateStr;

    let classes = "p-2 text-center rounded-lg cursor-pointer transition-colors ";
    if (isSelected) {
      classes += "bg-blue-600 text-white font-bold shadow-md";
    } else if (hasEvent) {
      classes += "bg-blue-50 text-blue-700 font-bold hover:bg-blue-100";
    } else {
      classes += "text-gray-600 hover:bg-gray-100";
    }

    html += `<div class="${classes}" onclick="window.home_setDate('${dateStr}')">${day}</div>`;
  }
  
  // Refrescar componente entero para mostrar/ocultar el botón "Limpiar filtro"
  const calendarParent = container.parentElement;
  if(calendarParent) {
     calendarParent.outerHTML = calendarComponent();
     // Inyectar los días después de redibujar el cascarón
     document.getElementById("calendarDays").innerHTML = html;
  }
};

window.home_renderEvents = () => {
  let filtered = events.filter(e => {
    const matchSub = selectedSubgerencia === "Todas" || e.subgerencia === selectedSubgerencia;
    const matchTipo = selectedTipo === "Todos" || e.tipo === selectedTipo;
    const matchDate = !selectedDate || e.date === selectedDate;
    const matchSearch = !searchText || e.title.toLowerCase().includes(searchText) || e.description.toLowerCase().includes(searchText);
    
    return matchSub && matchTipo && matchDate && matchSearch;
  });

  const container = document.getElementById("eventsList");
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
        <svg class="mx-auto text-gray-300 mb-3" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <h3 class="text-gray-900 font-medium">No se encontraron eventos</h3>
        <p class="text-gray-500 text-sm mt-1">Intenta ajustando los filtros o tu búsqueda.</p>
        <button onclick="window.home_setDate(null); window.home_setSubgerencia('Todas'); document.getElementById('searchEvents').value='';" class="mt-4 text-sm text-blue-600 font-medium hover:underline">Limpiar todos los filtros</button>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(e => `
    <div onclick="window.home_openModal(${e.id})" class="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
      <div class="flex justify-between items-start mb-2">
        <span class="text-xs font-bold text-blue-600 tracking-wide uppercase">${e.subgerencia}</span>
        <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor(e.status)}">${e.status}</span>
      </div>
      <h3 class="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">${e.title}</h3>
      <div class="flex flex-wrap items-center gap-3 text-gray-500 text-sm mt-3">
        <div class="flex items-center gap-1.5"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg> ${e.date}</div>
        <div class="flex items-center gap-1.5"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> ${e.time}</div>
        <div class="flex items-center gap-1.5"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> ${e.location}</div>
      </div>
    </div>
  `).join("");
};

window.home_openModal = (id) => {
  const event = events.find(ev => ev.id === id);
  if (!event) return;

  const modal = document.getElementById("eventModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <div>
        <span class="text-xs font-bold text-blue-600 tracking-wide uppercase">${event.tipo}</span>
        <h2 class="text-2xl font-extrabold text-gray-900 mt-1">${event.title}</h2>
      </div>
      <button onclick="window.home_closeModal()" class="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
      <div class="flex items-center gap-2 text-gray-700"><svg class="text-gray-400" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg> <strong>Fecha:</strong> ${event.date}</div>
      <div class="flex items-center gap-2 text-gray-700"><svg class="text-gray-400" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> <strong>Hora:</strong> ${event.time}</div>
      <div class="flex items-center gap-2 text-gray-700"><svg class="text-gray-400" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> <strong>Lugar:</strong> ${event.location}</div>
    </div>
    <div class="mb-6">
      <h3 class="font-bold text-gray-800 mb-1">Acerca del evento</h3>
      <p class="text-gray-600 text-sm leading-relaxed">${event.description}</p>
    </div>
    <div class="flex justify-end">
      <button onclick="window.home_closeModal()" class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">Entendido</button>
    </div>
  `;

  modal.classList.remove("hidden");
  // Pequeño timeout para permitir que la transición de opacidad ocurra (efecto fade-in)
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    content.classList.remove("scale-95");
  }, 10);
};

window.home_closeModal = () => {
  const modal = document.getElementById("eventModal");
  const content = document.getElementById("modalContent");
  
  modal.classList.add("opacity-0");
  content.classList.add("scale-95");
  
  // Esperar a que termine la animación antes de ocultarlo
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 200);
};