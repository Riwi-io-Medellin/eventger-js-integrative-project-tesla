import Sidebar from "../components/sidebar.js";
import Navbar  from "../components/navbar.js";
import { getEventsByLapse } from "../services/api.js";

// ══════════ ESTADO ══════════
let allEvents    = [];
let selectedDate = null;
let searchText   = "";
let currentPage  = 1;
const PER_PAGE   = 10;

// ══════════ HELPERS DE FECHA ══════════
function fmtDate(raw) {
    if (!raw) return '—';
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}
function fmtTime(raw) {
    if (!raw) return '';
    const d = new Date(raw);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}
function dateKey(e) {
    const raw = e.start_date || e.startDate || '';
    if (!raw) return '';
    const d = new Date(raw);
    if (isNaN(d)) return '';
    return d.toISOString().split('T')[0];
}

// Carga todos los eventos usando by-lapse con rango amplio (sin LIMIT)
async function loadAllEvents() {
    const start  = '2000-01-01';
    const finish = '2100-12-31';
    const data = await getEventsByLapse(start, finish);
    return (data || []).sort((a, b) =>
        new Date(b.start_date || 0) - new Date(a.start_date || 0)
    );
}

// ══════════ VISTA PRINCIPAL ══════════
export default async function Home() {
    try {
        allEvents = await loadAllEvents();
    } catch {
        allEvents = [];
    }

    const now      = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const todayCount    = allEvents.filter(e => dateKey(e) === todayStr).length;
    const upcomingCount = allEvents.filter(e => dateKey(e) > todayStr).length;

    setTimeout(() => {
        renderCalendar();
        renderEvents();
    }, 0);

    return `
    <div class="flex w-full min-h-screen bg-gray-50">
        ${Sidebar()}

        <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
            ${Navbar()}

            <main class="flex-1 p-6 overflow-y-auto space-y-8">

                <!-- Hero -->
                <div class="bg-main p-8 w-full rounded-2xl min-h-[220px] flex flex-col justify-center relative overflow-hidden shadow-md">
                    <div class="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="relative z-10">
                        <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-2">Muro de Eventos</h1>
                        <p class="text-blue-100 text-lg">Descubre y gestiona las actividades del municipio</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
                        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div><p class="text-gray-500 text-sm font-medium">Eventos hoy</p><h2 class="text-2xl font-black text-gray-800">${todayCount}</h2></div>
                            <div class="w-12 h-12 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">
                                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div><p class="text-gray-500 text-sm font-medium">Próximos</p><h2 class="text-2xl font-black text-gray-800">${upcomingCount}</h2></div>
                            <div class="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div><p class="text-gray-500 text-sm font-medium">Cargados</p><h2 class="text-2xl font-black text-gray-800">${allEvents.length}</h2></div>
                            <div class="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div><p class="text-gray-500 text-sm font-medium">Activos</p><h2 class="text-2xl font-black text-gray-800">${allEvents.filter(e => e.is_active ?? e.isActive).length}</h2></div>
                            <div class="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contenido principal -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <!-- Lista de eventos -->
                    <div class="lg:col-span-8 space-y-4">
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input id="searchEvents" type="text" placeholder="Buscar eventos por título o descripción..."
                                class="w-full border border-borderSubtle rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent transition-all"
                                oninput="window.home_setSearch(this.value)" />
                        </div>
                        <div id="eventsList" class="space-y-4"></div>
                    </div>

                    <!-- Calendario -->
                    <div class="lg:col-span-4">
                        <div id="calendarContainer" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"></div>
                    </div>

                </div>

                <!-- Modal -->
                <div id="eventModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden items-center justify-center opacity-0 transition-opacity duration-200" onclick="if(event.target===this)window.home_closeModal()">
                    <div id="modalContent" class="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl transform scale-95 transition-transform duration-200"></div>
                </div>

            </main>
        </div>
    </div>`;
}

// ══════════ RENDERIZADO ══════════

function loadingHTML() {
    return `<div class="text-center py-10 text-gray-400">
        <svg class="mx-auto mb-3 animate-spin" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        Cargando eventos...
    </div>`;
}

function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;

    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    const firstDay   = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const eventDays = new Set(allEvents.map(e => dateKey(e)).filter(Boolean));

    let days = '';
    for (let i = 0; i < firstDay; i++) days += `<div></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent  = eventDays.has(ds);
        const isSelected = selectedDate === ds;
        let cls = 'p-2 text-center rounded-lg cursor-pointer transition-colors text-sm ';
        if (isSelected)       cls += 'bg-blue-600 text-white font-bold shadow-md';
        else if (hasEvent)    cls += 'bg-blue-50 text-blue-700 font-bold hover:bg-blue-100';
        else                  cls += 'text-gray-600 hover:bg-gray-100';
        days += `<div class="${cls}" onclick="window.home_setDate('${ds}')">${d}</div>`;
    }

    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800 capitalize">${monthName}</h3>
            ${selectedDate
                ? `<button onclick="window.home_clearFilters()" class="text-xs text-blue-600 hover:underline">Limpiar filtro</button>`
                : ''}
        </div>
        <div class="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-400 text-center mb-2">
            <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
        </div>
        <div class="grid grid-cols-7 gap-1">${days}</div>
        ${selectedDate
            ? `<p class="text-xs text-blue-600 mt-4 text-center bg-blue-50 rounded-lg py-2">Desde <strong>${selectedDate}</strong></p>`
            : `<p class="text-xs text-gray-400 mt-4 text-center">Selecciona una fecha para filtrar</p>`}
    `;
}

function renderEvents() {
    const container = document.getElementById('eventsList');
    if (!container) return;

    const filtered = allEvents.filter(e => {
        if (!searchText) return true;
        const title = (e.title || '').toLowerCase();
        const desc  = (e.description || '').toLowerCase();
        return title.includes(searchText) || desc.includes(searchText);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
                <svg class="mx-auto text-gray-300 mb-3" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <h3 class="text-gray-900 font-medium">No se encontraron eventos</h3>
                <p class="text-gray-500 text-sm mt-1">Intenta ajustando los filtros o seleccionando otra fecha.</p>
                <button onclick="window.home_clearFilters()" class="mt-4 text-sm text-blue-600 font-medium hover:underline">Limpiar filtros</button>
            </div>`;
        return;
    }

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    // Números de página: máximo 5 visibles
    const delta = 2;
    let pages = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        pages.push(i);
    }

    const btnBase = 'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors';
    const btnActive = 'bg-blue-600 text-white shadow-sm';
    const btnInactive = 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50';
    const btnDisabled = 'bg-white border border-gray-100 text-gray-300 cursor-not-allowed';

    const pagination = totalPages <= 1 ? '' : `
    <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p class="text-sm text-gray-500">
            Mostrando <strong>${start + 1}–${Math.min(start + PER_PAGE, filtered.length)}</strong> de <strong>${filtered.length}</strong> eventos
        </p>
        <div class="flex items-center gap-1">
            <button onclick="window.home_setPage(${currentPage - 1})"
                class="${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}"
                ${currentPage === 1 ? 'disabled' : ''}>
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            ${pages[0] > 1 ? `<button onclick="window.home_setPage(1)" class="${btnBase} ${btnInactive}">1</button>${pages[0] > 2 ? `<span class="px-1 text-gray-400">…</span>` : ''}` : ''}
            ${pages.map(p => `
                <button onclick="window.home_setPage(${p})" class="${btnBase} ${p === currentPage ? btnActive : btnInactive}">${p}</button>
            `).join('')}
            ${pages[pages.length - 1] < totalPages ? `${pages[pages.length - 1] < totalPages - 1 ? `<span class="px-1 text-gray-400">…</span>` : ''}<button onclick="window.home_setPage(${totalPages})" class="${btnBase} ${btnInactive}">${totalPages}</button>` : ''}
            <button onclick="window.home_setPage(${currentPage + 1})"
                class="${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}"
                ${currentPage === totalPages ? 'disabled' : ''}>
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </div>
    </div>`;

    container.innerHTML = pageItems.map(e => eventCard(e)).join('') + pagination;
}

function statusBadge(e) {
    const active = e.is_active ?? e.isActive;
    if (active === true)  return { label: 'Activo',    cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
    if (active === false) return { label: 'Inactivo',  cls: 'bg-gray-100 text-gray-500 border border-gray-200' };
    return                       { label: 'Programado', cls: 'bg-blue-50 text-blue-600 border border-blue-100' };
}

function eventCard(e) {
    const { label, cls } = statusBadge(e);
    const startRaw   = e.start_date  || e.startDate  || '';
    const discipline = e.discipline_name || '';
    const location   = e.scenario_location || e.space_name || e.scenario_name || '';
    const safeId     = String(e.id).replace(/'/g, '');

    return `
    <div onclick="window.home_openModal('${safeId}')"
         class="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
        <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-bold text-blue-600 tracking-wide uppercase">${discipline}</span>
            <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full ${cls}">${label}</span>
        </div>
        <h3 class="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">${e.title || 'Sin título'}</h3>
        <div class="flex flex-wrap items-center gap-3 text-gray-500 text-sm mt-3">
            <div class="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                ${fmtDate(startRaw)}
            </div>
            ${fmtTime(startRaw) ? `
            <div class="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                ${fmtTime(startRaw)}
            </div>` : ''}
            ${location ? `
            <div class="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                ${location}
            </div>` : ''}
        </div>
    </div>`;
}

// ══════════ HANDLERS GLOBALES ══════════

window.home_setPage = (page) => {
    currentPage = page;
    renderEvents();
    document.getElementById('eventsList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.home_setSearch = (text) => {
    searchText = text.toLowerCase();
    currentPage = 1;
    renderEvents();
};

window.home_setDate = async (date) => {
    if (selectedDate === date) {
        selectedDate = null;
        document.getElementById('eventsList').innerHTML = loadingHTML();
        try { allEvents = await loadAllEvents(); } catch { allEvents = []; }
    } else {
        selectedDate = date;
        document.getElementById('eventsList').innerHTML = loadingHTML();
        const finish = new Date(date);
        finish.setFullYear(finish.getFullYear() + 2);
        try { allEvents = await getEventsByLapse(date, finish.toISOString().split('T')[0]) || []; } catch { allEvents = []; }
        allEvents.sort((a, b) => new Date(a.start_date || 0) - new Date(b.start_date || 0));
    }
    currentPage = 1;
    renderCalendar();
    renderEvents();
};

window.home_clearFilters = async () => {
    selectedDate = null;
    searchText   = '';
    const inp = document.getElementById('searchEvents');
    if (inp) inp.value = '';
    document.getElementById('eventsList').innerHTML = loadingHTML();
    try { allEvents = await loadAllEvents(); } catch { allEvents = []; }
    currentPage = 1;
    renderCalendar();
    renderEvents();
};

// ══════════ MODAL ══════════

window.home_openModal = (id) => {
    const e = allEvents.find(ev => String(ev.id) === String(id));
    if (!e) return;

    const { label, cls } = statusBadge(e);
    const startRaw  = e.start_date  || e.startDate  || '';
    const finishRaw = e.finish_date || e.finishDate || '';
    const location  = e.scenario_location || e.space_name || e.scenario_name || '—';
    const discipline = e.discipline_name || '—';

    document.getElementById('modalContent').innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <span class="text-xs font-bold text-blue-600 tracking-wide uppercase">${discipline}</span>
                <h2 class="text-2xl font-extrabold text-gray-900 mt-1">${e.title || 'Sin título'}</h2>
            </div>
            <button onclick="window.home_closeModal()" class="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
            <div class="flex items-center gap-2 text-gray-700">
                <svg class="text-gray-400" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                <strong>Inicio:</strong> ${fmtDate(startRaw)} ${fmtTime(startRaw)}
            </div>
            ${finishRaw ? `
            <div class="flex items-center gap-2 text-gray-700">
                <svg class="text-gray-400" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                <strong>Fin:</strong> ${fmtDate(finishRaw)} ${fmtTime(finishRaw)}
            </div>` : ''}
            <div class="flex items-center gap-2 text-gray-700">
                <svg class="text-gray-400" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <strong>Lugar:</strong> ${location}
            </div>
            <div class="flex items-center gap-2 text-gray-700">
                <svg class="text-gray-400" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <strong>Estado:</strong> <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${cls}">${label}</span>
            </div>
        </div>
        <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-1">Descripción</h3>
            <p class="text-gray-600 text-sm leading-relaxed">${e.description || 'Sin descripción.'}</p>
        </div>
        <div class="flex justify-end">
            <button onclick="window.home_closeModal()" class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">Cerrar</button>
        </div>`;

    const modal = document.getElementById('eventModal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        document.getElementById('modalContent').classList.remove('scale-95');
    }, 10);
};

window.home_closeModal = () => {
    const modal   = document.getElementById('eventModal');
    const content = document.getElementById('modalContent');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.display = '';
    }, 200);
};
