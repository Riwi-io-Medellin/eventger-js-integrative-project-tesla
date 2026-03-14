// src/pages/event.js
import { createCalendar } from "../components/calendar.js";

// ─── Sonner CDN ───────────────────────────────────────────────────────────────
function loadSonner() {
  return new Promise((resolve) => {
    if (window.Sonner) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/sonner@1.4.41/dist/index.umd.js";
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
}
function toast(type, message) {
  if (window.Sonner?.toast) {
    if (type === "success")
      window.Sonner.toast.success(message, { duration: 3500 });
    else if (type === "error")
      window.Sonner.toast.error(message, { duration: 4000 });
    else window.Sonner.toast.warning(message, { duration: 4000 });
    return;
  }
  // Fallback propio
  let c = { bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", icon: "✓" };
  if (type === "error")
    c = { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", icon: "✕" };
  if (type === "warning")
    c = { bg: "#fefce8", border: "#fef08a", color: "#ca8a04", icon: "⚠" };
  let box = document.getElementById("ev-toast-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "ev-toast-box";
    box.style.cssText =
      "position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;";
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.style.cssText = `display:flex;align-items:center;gap:0.75rem;background:${c.bg};border:1.5px solid ${c.border};color:${c.color};border-radius:0.75rem;padding:0.875rem 1.25rem;font-size:0.875rem;font-weight:600;font-family:'DM Sans',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.1);min-width:16rem;max-width:24rem;animation:toastIn 0.3s cubic-bezier(0.22,1,0.36,1);`;
  t.innerHTML = `<span>${c.icon}</span><span>${message}</span>`;
  box.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity 0.3s";
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
if (!document.getElementById("eventos-style")) {
  const s = document.createElement("style");
  s.id = "eventos-style";
  s.textContent = `
    * { box-sizing: border-box; }
    body { margin: 0; }
    .dash-layout { display:flex; min-height:100vh; font-family:'DM Sans',sans-serif; }
    .dash-sidebar { width:210px;flex-shrink:0;background:#0f172a;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform 0.3s; }
    .dash-sidebar.open { transform:translateX(0); }
    .dash-main { margin-left:0;flex:1;display:flex;flex-direction:column;background:#f8fafc;min-height:100vh; }
    .nav-item { display:flex;align-items:center;gap:0.75rem;padding:0.65rem 1.25rem;border-radius:0.5rem;margin:0.125rem 0.75rem;font-size:0.875rem;font-weight:500;color:#94a3b8;cursor:pointer;text-decoration:none;transition:background 0.15s,color 0.15s;border:none;background:none;width:calc(100% - 1.5rem);text-align:left; }
    .nav-item:hover  { background:rgba(255,255,255,0.07);color:#e2e8f0; }
    .nav-item.active { background:#2563eb;color:#fff; }
    .nav-sub { padding-left:2.5rem;font-size:0.8125rem; }
    .nav-group-label { color:#475569;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0 1.25rem;margin:1rem 0 0.5rem;display:block; }
    .view-btn { display:flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:0.5rem;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;color:#94a3b8;transition:all 0.15s; }
    .view-btn.active { background:#2563eb;border-color:#2563eb;color:#fff; }
    .view-btn:hover:not(.active) { border-color:#2563eb;color:#2563eb; }
    .ev-table { width:100%;border-collapse:collapse; }
    .ev-table th { text-align:left;padding:0.875rem 1.25rem;font-size:0.8rem;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;white-space:nowrap; }
    .ev-table td { padding:1rem 1.25rem;border-bottom:1px solid #f8fafc; }
    .ev-table tr:last-child td { border-bottom:none; }
    .ev-table tbody tr:hover { background:#f8fafc; }
    .ev-cards { display:grid;grid-template-columns:1fr;gap:1rem; }
    .ev-card { background:#fff;border-radius:1rem;border:1px solid #e2e8f0;overflow:hidden;transition:box-shadow 0.2s,transform 0.15s;box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    .ev-card:hover { box-shadow:0 8px 24px -4px rgba(0,0,0,0.1);transform:translateY(-2px); }
    .modal-backdrop { position:fixed;inset:0;background:rgba(15,23,42,0.55);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn 0.2s ease; }
    .modal-box { background:#fff;border-radius:1rem;width:100%;max-width:34rem;max-height:90vh;overflow-y:auto;box-shadow:0 24px 48px -8px rgba(0,0,0,0.2);animation:slideUp 0.25s cubic-bezier(0.22,1,0.36,1); }
    .modal-header { padding:1.5rem 1.5rem 1rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1;border-bottom:1px solid #f1f5f9; }
    .modal-body { padding:1.5rem;display:flex;flex-direction:column;gap:1rem; }
    .form-group { display:flex;flex-direction:column;gap:0.4rem; }
    .form-label { font-size:0.8375rem;font-weight:600;color:#1e293b; }
    .form-label .hint { font-weight:400;color:#94a3b8;font-size:0.775rem; }
    .form-input { width:100%;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#f8fafc;padding:0.7rem 1rem;font-size:0.875rem;color:#1e293b;font-family:inherit;outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;appearance:none;-webkit-appearance:none; }
    .form-input:focus { border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.12);background:#fff; }
    .form-input.error { border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
    .form-input:disabled { opacity:0.5;cursor:not-allowed;background:#f1f5f9; }
    .select-wrap { position:relative; }
    .select-wrap::after { content:'';position:absolute;right:0.875rem;top:50%;transform:translateY(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #94a3b8;pointer-events:none; }
    .select-wrap select.form-input { cursor:pointer;padding-right:2.25rem; }
    .form-grid-2 { display:grid;grid-template-columns:1fr;gap:1rem; }
    .form-err { display:none;color:#ef4444;font-size:0.75rem;margin:0; }
    .form-err.show { display:flex;align-items:center;gap:0.25rem; }
    .avail-banner { display:flex;align-items:flex-start;gap:0.625rem;border-radius:0.625rem;padding:0.7rem 0.875rem;font-size:0.8rem;font-weight:500;line-height:1.5;border:1.5px solid; }
    .avail-banner.ok   { background:#f0fdf4;border-color:#bbf7d0;color:#15803d; }
    .avail-banner.busy { background:#fef2f2;border-color:#fecaca;color:#dc2626; }
    .space-status-badge { display:inline-flex;align-items:center;gap:0.25rem;font-size:0.7rem;font-weight:600;padding:0.125rem 0.5rem;border-radius:9999px; }
    .action-btn { display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:0.5rem;border:none;cursor:pointer;transition:background 0.15s,transform 0.1s;background:transparent; }
    .action-btn:hover { transform:scale(1.1); }
    .ev-filter-pill { display:inline-flex;align-items:center;gap:0.35rem;padding:0.3rem 0.75rem;border-radius:9999px;border:1.5px solid #e2e8f0;background:#fff;font-size:0.775rem;font-weight:600;color:#64748b;cursor:pointer;transition:all 0.15s;white-space:nowrap;font-family:inherit; }
    .ev-filter-pill:hover { border-color:#2563eb;color:#2563eb; }
    .ev-filter-pill.active { background:#eff6ff;border-color:#2563eb;color:#2563eb; }
    .hide-mobile { display:none!important; }
    .ev-main-content { padding:1rem; }
    .ev-page-title { font-size:1.25rem; }
    .ev-header { padding:0 1rem; }
    @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes toastIn { from{opacity:0;transform:translateX(1rem)} to{opacity:1;transform:translateX(0)} }
    @media (min-width:769px) {
      .show-mobile { display:none!important; }
      .dash-sidebar { transform:none; }
      .dash-main { margin-left:210px; }
      .hide-mobile { display:revert!important; }
      .ev-cards { grid-template-columns:repeat(auto-fill,minmax(19rem,1fr));gap:1.25rem; }
      .form-grid-2 { grid-template-columns:1fr 1fr; }
      .ev-main-content { padding:2rem 1.5rem; }
      .ev-page-title { font-size:1.5rem; }
      .ev-header { padding:0 1.5rem; }
    }
  `;
  document.head.appendChild(s);
}

// ─── Mock data FK ─────────────────────────────────────────────────────────────
// 🔌 await api.getScenarios()
const MOCK_SCENARIOS = [
  {
    id: "sc-1",
    name: "Unidad Deportiva Atanasio Girardot",
    location: "Medellín, Laureles",
  },
  {
    id: "sc-2",
    name: "Complejo Acuático Julio César Noriega",
    location: "Medellín, Robledo",
  },
  { id: "sc-3", name: "Polideportivo Sur", location: "Medellín, El Poblado" },
  {
    id: "sc-4",
    name: "Unidad Deportiva María Paz",
    location: "Medellín, Popular",
  },
];

// 🔌 await api.getSpaces()
// status: 'activo' | 'inactivo'
const MOCK_SPACES = [
  // Atanasio Girardot
  {
    id: "sp-1",
    name: "Cancha Sintética Marte 2",
    description: "Fútbol 11 sintético",
    status: "activo",
    scenario_id: "sc-1",
  },
  {
    id: "sp-2",
    name: "Estadio Atanasio Girardot",
    description: "Fútbol profesional",
    status: "activo",
    scenario_id: "sc-1",
  },
  {
    id: "sp-3",
    name: "Coliseo Iván de Bedout",
    description: "Baloncesto y eventos",
    status: "inactivo",
    scenario_id: "sc-1",
  },
  {
    id: "sp-4",
    name: "Pista Atlética Principal",
    description: "Atletismo y ciclismo",
    status: "activo",
    scenario_id: "sc-1",
  },
  // Complejo Acuático
  {
    id: "sp-5",
    name: "Piscina Olímpica 50m",
    description: "Natación de competencia",
    status: "activo",
    scenario_id: "sc-2",
  },
  {
    id: "sp-6",
    name: "Piscina de Saltos",
    description: "Saltos ornamentales",
    status: "inactivo",
    scenario_id: "sc-2",
  },
  {
    id: "sp-7",
    name: "Piscina de Calentamiento",
    description: "Entrenamiento",
    status: "activo",
    scenario_id: "sc-2",
  },
  // Polideportivo Sur
  {
    id: "sp-8",
    name: "Cancha de Tenis 1",
    description: "Arcilla",
    status: "activo",
    scenario_id: "sc-3",
  },
  {
    id: "sp-9",
    name: "Cancha de Voleibol",
    description: "Voleibol sala",
    status: "activo",
    scenario_id: "sc-3",
  },
  {
    id: "sp-10",
    name: "Gimnasio Funcional",
    description: "Pesas y cardio",
    status: "inactivo",
    scenario_id: "sc-3",
  },
  // María Paz
  {
    id: "sp-11",
    name: "Cancha Múltiple Norte",
    description: "Microfútbol / Básquet",
    status: "activo",
    scenario_id: "sc-4",
  },
  {
    id: "sp-12",
    name: "Cancha Múltiple Sur",
    description: "Microfútbol / Básquet",
    status: "activo",
    scenario_id: "sc-4",
  },
];

// 🔌 await api.getDisciplines()
const MOCK_DISCIPLINES = [
  { id: "di-1", name: "Fútbol" },
  { id: "di-2", name: "Natación" },
  { id: "di-3", name: "Atletismo" },
  { id: "di-4", name: "Baloncesto" },
  { id: "di-5", name: "Ciclismo" },
  { id: "di-6", name: "Voleibol" },
  { id: "di-7", name: "Tenis" },
  { id: "di-8", name: "Microfútbol" },
];

// ─── Estado ───────────────────────────────────────────────────────────────────
let evView = "list";
let evSearch = "";
let evModal = null;
let evSelected = null;
let calInstance = null;
let evCalSpace = ""; // '' = todos los espacios
let evFilter = "";  // '' | 'active' | 'inactive'

let MOCK_EVENTS = [
  {
    id: "1",
    title: "Torneo Interbarrial de Fútbol",
    description: "Torneo anual entre barrios.",
    start_date: "2026-03-15T08:00",
    finish_date: "2026-03-15T18:00",
    is_active: true,
    discipline_id: "di-1",
    scenario_id: "sc-1",
    space_id: "sp-1",
    creator_id: "Sara Calderón",
  },
  {
    id: "2",
    title: "Campeonato de Natación",
    description: "Competencia departamental.",
    start_date: "2026-03-18T09:00",
    finish_date: "2026-03-18T17:00",
    is_active: true,
    discipline_id: "di-2",
    scenario_id: "sc-2",
    space_id: "sp-5",
    creator_id: "Jeronimo Gallego",
  },
  {
    id: "3",
    title: "Bloqueo Mantenimiento",
    description: "Cierre por mantenimiento.",
    start_date: "2026-03-20T00:00",
    finish_date: "2026-03-20T23:59",
    is_active: true,
    discipline_id: null,
    scenario_id: "sc-1",
    space_id: "sp-3",
    creator_id: "Sara Calderón",
    type: "bloqueo",
  },
  {
    id: "4",
    title: "Festival de Atletismo",
    description: "Festival juvenil de atletismo.",
    start_date: "2026-03-25T07:00",
    finish_date: "2026-03-25T16:00",
    is_active: false,
    discipline_id: "di-3",
    scenario_id: "sc-1",
    space_id: "sp-4",
    creator_id: "Jose David Henao",
  },
  {
    id: "5",
    title: "Copa de Baloncesto",
    description: "Copa intercolegial.",
    start_date: "2026-03-28T10:00",
    finish_date: "2026-03-28T20:00",
    is_active: false,
    discipline_id: "di-4",
    scenario_id: "sc-3",
    space_id: "sp-9",
    creator_id: "Jhon Cadavid",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const HOUR_MIN = 6;
const HOUR_MAX = 23;

function nameOf(list, id) {
  return list.find((x) => x.id === id)?.name || id || "—";
}

function getStatus(ev) {
  const finished = new Date(ev.finish_date).getTime() <= Date.now();
  return finished
    ? { label: "inactivo", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" }
    : { label: "activo",   bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" };
}
function getType(ev) {
  return ev.type === "bloqueo"
    ? { label: "bloqueo", bg: "#f1f5f9", color: "#475569" }
    : { label: "evento", bg: "#e0f2fe", color: "#0369a1" };
}
function spaceStatusMeta(s) {
  if (s === "inactivo")
    return { label: "Inactivo", bg: "#fee2e2", color: "#dc2626" };
  return null; // activo — no badge necesario
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function fmtDateInput(iso) {
  return iso ? iso.slice(0, 16) : "";
}

// ─── Validación disponibilidad ────────────────────────────────────────────────
function checkAvailability(start, finish, spaceId, excludeId = null) {
  const s = new Date(start),
    f = new Date(finish);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  if (s < todayStart)
    return {
      ok: false,
      message: "No se puede crear un evento en una fecha pasada.",
    };

  if (s.getHours() < HOUR_MIN)
    return {
      ok: false,
      message: `El horario mínimo de inicio es las 0${HOUR_MIN}:00 AM.`,
    };

  if (
    f.getHours() > HOUR_MAX ||
    (f.getHours() === HOUR_MAX && f.getMinutes() > 0)
  )
    return {
      ok: false,
      message: `El horario máximo de fin es las ${HOUR_MAX}:00 (11 PM).`,
    };

  if (spaceId) {
    const space = MOCK_SPACES.find((sp) => sp.id === spaceId);
    if (space && space.status !== "activo") {
      const meta = spaceStatusMeta(space.status);
      return {
        ok: false,
        message: `El espacio está ${meta.label.toLowerCase()} y no puede reservarse.`,
      };
    }
    const conflicts = MOCK_EVENTS.filter((ev) => {
      if (excludeId && ev.id === excludeId) return false;
      if (ev.space_id !== spaceId) return false;
      const es = new Date(ev.start_date).getTime(),
        ef = new Date(ev.finish_date).getTime();
      return s.getTime() < ef && f.getTime() > es;
    });
    if (conflicts.length) {
      const names = conflicts
        .map(
          (e) =>
            `"${e.title}" (${fmtTime(e.start_date)}–${fmtTime(e.finish_date)})`,
        )
        .join(", ");
      return {
        ok: false,
        message: `El espacio ya está ocupado por: ${names}.`,
      };
    }
  }
  return { ok: true, message: "Disponible ✓" };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function renderSidebar() {
  return `
  <aside class="dash-sidebar" id="ev-sidebar">
    <div style="padding:1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid rgba(255,255,255,0.07);">
      <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:#2563eb;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
      </div>
      <div>
        <p style="color:#f1f5f9;font-weight:700;font-size:0.9375rem;margin:0;line-height:1.2;">EventgerJS</p>
        <p style="color:#64748b;font-size:0.7rem;margin:0;">Gestión Deportiva</p>
      </div>
    </div>
    <nav style="flex:1;padding:1rem 0;overflow-y:auto;">
      <span class="nav-group-label">Principal</span>
      <a class="nav-item" href="#/dashboard"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6"/></svg>Muro de Eventos</a>
      <a class="nav-item" href="#/dashboard"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>Dashboard</a>
      <span class="nav-group-label">Gestión</span>
      <a class="nav-item" href="#/dashboard"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>Gestión Usuarios</a>
      <a class="nav-item active" href="#/events"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>Gestión Eventos</a>
      <div style="padding:0.4rem 1.25rem 0.25rem;display:flex;align-items:center;gap:0.5rem;color:#cbd5e1;font-size:0.875rem;font-weight:500;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Gestión Espacios
      </div>
      <a class="nav-item nav-sub" href="#/espaces">Administrar Espacios</a>
      <a class="nav-item nav-sub" href="#/complex">Administrar Escenarios</a>
      <a class="nav-item" href="#/perfil"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>Mi Perfil</a>
    </nav>
    <div style="padding:1rem;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:0.75rem;">
      <div style="width:2rem;height:2rem;border-radius:50%;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.7rem;font-weight:700;flex-shrink:0;">SC</div>
      <div style="min-width:0;flex:1;">
        <p style="color:#e2e8f0;font-size:0.8rem;font-weight:600;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Sara Calderón</p>
        <p style="color:#64748b;font-size:0.7rem;margin:0;">Admin General</p>
      </div>
      <button onclick="handleLogout()" style="background:none;border:none;cursor:pointer;color:#64748b;padding:0.25rem;border-radius:0.375rem;" title="Cerrar sesión">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      </button>
    </div>
  </aside>`;
}

// ─── Vistas ───────────────────────────────────────────────────────────────────
function renderList(events) {
  if (!events.length) return emptyState();
  return `<div style="background:#fff;border-radius:0.875rem;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
    <table class="ev-table"><thead><tr>
      <th>Nombre</th><th class="hide-mobile">Fecha</th><th class="hide-mobile">Hora</th>
      <th class="hide-mobile">Escenario / Espacio</th><th class="hide-mobile">Disciplina</th>
      <th class="hide-mobile">Tipo</th><th>Estado</th><th style="text-align:right;">Acciones</th>
    </tr></thead><tbody>
    ${events
      .map((ev) => {
        const st = getStatus(ev),
          ty = getType(ev);
        const scenarioName = nameOf(MOCK_SCENARIOS, ev.scenario_id);
        const spaceName = nameOf(MOCK_SPACES, ev.space_id);
        return `<tr>
        <td><div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg fill="none" stroke="#2563eb" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <span style="font-weight:600;color:#1e293b;font-size:0.875rem;">${ev.title}</span>
        </div></td>
        <td class="hide-mobile" style="color:#475569;font-size:0.875rem;">${fmtDate(ev.start_date)}</td>
        <td class="hide-mobile" style="color:#475569;font-size:0.875rem;">${fmtTime(ev.start_date)}</td>
        <td class="hide-mobile"><div style="font-size:0.8125rem;">
          <span style="color:#475569;">${scenarioName}</span><br>
          <span style="color:#94a3b8;font-size:0.775rem;">${spaceName}</span>
        </div></td>
        <td class="hide-mobile" style="color:#475569;font-size:0.875rem;">${nameOf(MOCK_DISCIPLINES, ev.discipline_id)}</td>
        <td class="hide-mobile"><span style="display:inline-flex;align-items:center;padding:0.2rem 0.65rem;border-radius:0.375rem;font-size:0.75rem;font-weight:600;background:${ty.bg};color:${ty.color};">${ty.label}</span></td>
        <td><span style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.25rem 0.7rem;border-radius:9999px;font-size:0.75rem;font-weight:600;background:${st.bg};color:${st.color};">
          <span style="width:0.45rem;height:0.45rem;border-radius:50%;background:${st.dot};flex-shrink:0;"></span>${st.label}
        </span></td>
        <td style="text-align:right;"><div style="display:flex;align-items:center;justify-content:flex-end;gap:0.25rem;">
          <button class="action-btn" title="Editar" style="color:#2563eb;" onclick="openEvModal('edit','${ev.id}')" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button class="action-btn" title="Eliminar" style="color:#ef4444;" onclick="openEvModal('delete','${ev.id}')" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div></td>
      </tr>`;
      })
      .join("")}
    </tbody></table>
  </div>`;
}

function renderCards(events) {
  if (!events.length) return emptyState();
  const COLORS = [
    "#eff6ff,#2563eb",
    "#f0fdf4,#16a34a",
    "#fef9c3,#a16207",
    "#fdf2f8,#be185d",
    "#f0fdfa,#0d9488",
  ];
  return `<div class="ev-cards">${events
    .map((ev, i) => {
      const st = getStatus(ev),
        ty = getType(ev),
        [, acc] = COLORS[i % COLORS.length].split(",");
      return `<div class="ev-card">
      <div style="height:0.375rem;background:${acc};"></div>
      <div style="padding:1.25rem;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.875rem;">
          <div style="flex:1;min-width:0;">
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.375rem;">
              <span style="display:inline-flex;align-items:center;padding:0.15rem 0.55rem;border-radius:0.375rem;font-size:0.7rem;font-weight:700;background:${ty.bg};color:${ty.color};">${ty.label}</span>
              <span style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.15rem 0.6rem;border-radius:9999px;font-size:0.7rem;font-weight:700;background:${st.bg};color:${st.color};">
                <span style="width:0.4rem;height:0.4rem;border-radius:50%;background:${st.dot};"></span>${st.label}
              </span>
            </div>
            <h3 style="font-size:1rem;font-weight:700;color:#0f172a;margin:0;line-height:1.35;">${ev.title}</h3>
          </div>
          <div style="display:flex;gap:0.25rem;flex-shrink:0;">
            <button class="action-btn" title="Editar" style="color:#2563eb;" onclick="openEvModal('edit','${ev.id}')" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="action-btn" title="Eliminar" style="color:#ef4444;" onclick="openEvModal('delete','${ev.id}')" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
        ${ev.description ? `<p style="font-size:0.8rem;color:#64748b;margin:0 0 1rem;line-height:1.5;">${ev.description}</p>` : ""}
        <div style="display:flex;flex-direction:column;gap:0.45rem;border-top:1px solid #f1f5f9;padding-top:0.875rem;">
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:#475569;">
            <svg fill="none" stroke="${acc}" viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <strong style="color:#1e293b;">${fmtDate(ev.start_date)}</strong>&nbsp;·&nbsp;${fmtTime(ev.start_date)}–${fmtTime(ev.finish_date)}
          </div>
          <div style="display:flex;align-items:flex-start;gap:0.5rem;font-size:0.8rem;color:#475569;">
            <svg fill="none" stroke="${acc}" viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0;margin-top:2px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>${nameOf(MOCK_SCENARIOS, ev.scenario_id)}<span style="color:#94a3b8;"> · ${nameOf(MOCK_SPACES, ev.space_id)}</span></span>
          </div>
          ${
            ev.discipline_id
              ? `<div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:#475569;">
            <svg fill="none" stroke="${acc}" viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            ${nameOf(MOCK_DISCIPLINES, ev.discipline_id)}</div>`
              : ""
          }
        </div>
      </div>
    </div>`;
    })
    .join("")}</div>`;
}

function emptyState() {
  const cfg = evFilter === "active"
    ? { icon: "🗓️", title: "Sin eventos activos", sub: "No hay eventos próximos o en curso.", btn: false }
    : evFilter === "inactive"
    ? { icon: "📭", title: "Sin eventos pasados", sub: "Aún no hay eventos que hayan finalizado.", btn: false }
    : { icon: null,  title: "Sin eventos", sub: "No se encontraron eventos.", btn: true };

  const iconEl = cfg.icon
    ? `<div style="font-size:2.5rem;margin-bottom:0.75rem;line-height:1;">${cfg.icon}</div>`
    : `<div style="width:3.5rem;height:3.5rem;border-radius:50%;background:#eff6ff;border:2px solid #bfdbfe;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:#2563eb;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
       </div>`;

  const btnEl = cfg.btn
    ? `<button onclick="openEvModal('create')" style="display:inline-flex;align-items:center;gap:0.5rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;padding:0.625rem 1.25rem;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Crear primer evento
       </button>`
    : "";

  return `
  <div style="background:#fff;border-radius:0.875rem;border:1px solid #e2e8f0;padding:4rem 2rem;text-align:center;">
    ${iconEl}
    <h3 style="font-size:1rem;font-weight:600;color:#1e293b;margin:0 0 0.5rem;">${cfg.title}</h3>
    <p style="color:#64748b;font-size:0.875rem;margin:0 0 1.25rem;">${cfg.sub}</p>
    ${btnEl}
  </div>`;
}

// ─── Selects helpers ──────────────────────────────────────────────────────────
function buildScenarioOptions(selectedId) {
  const none = `<option value="" disabled ${!selectedId ? "selected" : ""}>Selecciona un escenario...</option>`;
  return (
    none +
    MOCK_SCENARIOS.map(
      (sc) =>
        `<option value="${sc.id}" ${sc.id === selectedId ? "selected" : ""}>${sc.name} — ${sc.location}</option>`,
    ).join("")
  );
}

function buildSpaceOptions(scenarioId, selectedId) {
  if (!scenarioId)
    return `<option value="" disabled selected>Primero selecciona un escenario</option>`;
  const spaces = MOCK_SPACES.filter((sp) => sp.scenario_id === scenarioId);
  if (!spaces.length)
    return `<option value="" disabled selected>No hay espacios en este escenario</option>`;
  const none = `<option value="" disabled ${!selectedId ? "selected" : ""}>Selecciona un espacio...</option>`;
  return (
    none +
    spaces
      .map((sp) => {
        const meta = spaceStatusMeta(sp.status);
        const disabled = sp.status !== "activo" ? "disabled" : "";
        const label = meta ? ` (${meta.label})` : "";
        return `<option value="${sp.id}" ${sp.id === selectedId ? "selected" : ""} ${disabled}>${sp.name}${label}</option>`;
      })
      .join("")
  );
}

function buildDisciplineOptions(selectedId) {
  const none = `<option value="">Sin disciplina</option>`;
  return (
    none +
    MOCK_DISCIPLINES.map(
      (d) =>
        `<option value="${d.id}" ${d.id === selectedId ? "selected" : ""}>${d.name}</option>`,
    ).join("")
  );
}

// Llamado desde onchange del select de escenario — actualiza el select de espacio dinámicamente
function onScenarioChange(scenarioId) {
  const spaceEl = document.getElementById("ev-space");
  if (!spaceEl) return;
  spaceEl.innerHTML = buildSpaceOptions(scenarioId, "");
  spaceEl.disabled = false;
  // Limpiar banner disponibilidad
  const banner = document.getElementById("ev-avail-banner");
  if (banner) {
    banner.style.display = "none";
  }
}
window.onScenarioChange = onScenarioChange;

// ─── Modal crear / editar ─────────────────────────────────────────────────────
function renderFormModal(ev) {
  const isEdit = !!ev;
  const v = ev || {
    title: "",
    description: "",
    start_date: "",
    finish_date: "",
    is_active: true,
    discipline_id: "",
    scenario_id: "",
    space_id: "",
  };
  const todayStr = new Date().toISOString().slice(0, 10);
  const minDt = `${todayStr}T06:00`;

  // Mostrar info del escenario seleccionado (si existe)
  const selectedScenario = MOCK_SCENARIOS.find((sc) => sc.id === v.scenario_id);
  const scenarioInfo = selectedScenario
    ? `<span style="font-size:0.775rem;color:#64748b;display:block;margin-top:0.25rem;">📍 ${selectedScenario.location}</span>`
    : "";

  return `
  <div class="modal-backdrop" id="ev-modal-backdrop" onclick="closeEvModal(event)">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div>
          <h3 style="font-size:1.125rem;font-weight:700;color:#0f172a;margin:0 0 0.125rem;">${isEdit ? "Editar evento" : "Crear nuevo evento"}</h3>
          <p style="font-size:0.8rem;color:#64748b;margin:0;">${isEdit ? "Modifica los campos necesarios" : "Completa la información del evento"}</p>
        </div>
        <button onclick="closeEvModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.5rem;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="ev-form" onsubmit="submitEvForm(event)" novalidate>

          <!-- Título -->
          <div class="form-group">
            <label class="form-label">Título *</label>
            <input class="form-input" id="ev-title" type="text" placeholder="Nombre del evento" value="${v.title}" required/>
            <p id="ev-title-err" class="form-err"><span>⚠</span>&nbsp;<span id="ev-title-err-msg"></span></p>
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea class="form-input" id="ev-desc" placeholder="Describe el evento..." rows="2" style="resize:vertical;">${v.description || ""}</textarea>
          </div>

          <!-- Fechas -->
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Inicio * <span class="hint">(desde 6:00)</span></label>
              <input class="form-input" id="ev-start" type="datetime-local" value="${fmtDateInput(v.start_date)}" min="${minDt}" required onchange="onDatesChange()"/>
              <p id="ev-start-err" class="form-err"><span>⚠</span>&nbsp;<span id="ev-start-err-msg"></span></p>
            </div>
            <div class="form-group">
              <label class="form-label">Fin * <span class="hint">(hasta 23:00)</span></label>
              <input class="form-input" id="ev-finish" type="datetime-local" value="${fmtDateInput(v.finish_date)}" min="${minDt}" required onchange="onDatesChange()"/>
              <p id="ev-finish-err" class="form-err"><span>⚠</span>&nbsp;<span id="ev-finish-err-msg"></span></p>
            </div>
          </div>

          <!-- Escenario -->
          <div class="form-group">
            <label class="form-label">Escenario deportivo *</label>
            <div class="select-wrap">
              <select class="form-input" id="ev-scenario" onchange="onScenarioChange(this.value)">
                ${buildScenarioOptions(v.scenario_id)}
              </select>
            </div>
            <div id="ev-scenario-info">${scenarioInfo}</div>
            <p id="ev-scenario-err" class="form-err"><span>⚠</span>&nbsp;<span id="ev-scenario-err-msg"></span></p>
          </div>

          <!-- Espacio — se filtra según escenario -->
          <div class="form-group">
            <label class="form-label">Espacio *
              <span class="hint">— filtra según el escenario seleccionado</span>
            </label>
            <div class="select-wrap">
              <select class="form-input" id="ev-space" ${!v.scenario_id ? "disabled" : ""} onchange="onDatesChange()">
                ${buildSpaceOptions(v.scenario_id, v.space_id)}
              </select>
            </div>
            <p id="ev-space-err" class="form-err"><span>⚠</span>&nbsp;<span id="ev-space-err-msg"></span></p>
          </div>

          <!-- Banner disponibilidad -->
          <div id="ev-avail-banner" style="display:none;margin-top:0.25rem;"></div>

          <!-- Disciplina -->
          <div class="form-group">
            <label class="form-label">Disciplina <span class="hint">(opcional)</span></label>
            <div class="select-wrap">
              <select class="form-input" id="ev-discipline">
                ${buildDisciplineOptions(v.discipline_id)}
              </select>
            </div>
          </div>

          <!-- Estado switch -->
          <div class="form-group">
            <label class="form-label">Estado</label>
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.75rem 1rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#f8fafc;">
              <div style="position:relative;">
                <input type="checkbox" id="ev-active" ${v.is_active ? "checked" : ""} style="position:absolute;opacity:0;" onchange="toggleSwitch(this)"/>
                <div id="ev-switch-track" style="width:2.5rem;height:1.375rem;border-radius:9999px;background:${v.is_active ? "#2563eb" : "#cbd5e1"};transition:background 0.2s;position:relative;">
                  <div id="ev-switch-thumb" style="position:absolute;top:0.1875rem;left:${v.is_active ? "1.25rem" : "0.1875rem"};width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:left 0.2s;"></div>
                </div>
              </div>
              <span style="font-size:0.875rem;color:#475569;">Marcar como <strong style="color:#1e293b;" id="ev-switch-label">${v.is_active ? "activo" : "inactivo"}</strong></span>
            </label>
          </div>

          <!-- Botones -->
          <div style="display:flex;gap:0.75rem;padding-top:1.25rem;border-top:1px solid #f1f5f9;">
            <button type="button" onclick="closeEvModal()" style="flex:1;padding:0.75rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;color:#475569;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;">Cancelar</button>
            <button type="submit" style="flex:2;padding:0.75rem;border-radius:0.625rem;border:none;background:#2563eb;color:#fff;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;box-shadow:0 4px 12px -2px rgba(37,99,235,0.4);">
              ${isEdit ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>`;
}

// ─── Modal eliminar ───────────────────────────────────────────────────────────
function renderDeleteModal(ev) {
  return `
  <div class="modal-backdrop" id="ev-modal-backdrop" onclick="closeEvModal(event)">
    <div class="modal-box" style="max-width:24rem;" onclick="event.stopPropagation()">
      <div style="padding:2rem;text-align:center;">
        <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:#fef2f2;border:2px solid #fecaca;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;color:#ef4444;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <h3 style="font-size:1.125rem;font-weight:700;color:#0f172a;margin:0 0 0.5rem;">¿Eliminar evento?</h3>
        <p style="color:#64748b;font-size:0.875rem;margin:0 0 1.25rem;line-height:1.6;">Vas a eliminar <strong style="color:#1e293b;">"${ev.title}"</strong>. Esta acción no se puede deshacer.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:0.625rem;padding:0.875rem 1rem;text-align:left;font-size:0.8125rem;color:#475569;margin-bottom:1.5rem;display:flex;flex-direction:column;gap:0.3rem;">
          <span><strong style="color:#1e293b;">Fecha:</strong> ${fmtDate(ev.start_date)} · ${fmtTime(ev.start_date)}–${fmtTime(ev.finish_date)}</span>
          <span><strong style="color:#1e293b;">Escenario:</strong> ${nameOf(MOCK_SCENARIOS, ev.scenario_id)}</span>
          <span><strong style="color:#1e293b;">Espacio:</strong> ${nameOf(MOCK_SPACES, ev.space_id)}</span>
        </div>
        <div style="display:flex;gap:0.75rem;">
          <button onclick="closeEvModal()" style="flex:1;padding:0.75rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;color:#475569;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;">Cancelar</button>
          <button onclick="confirmDeleteEv()" style="flex:1;padding:0.75rem;border-radius:0.625rem;border:none;background:#ef4444;color:#fff;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;box-shadow:0 4px 12px -2px rgba(239,68,68,0.4);">Sí, eliminar</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── Helpers calendario por espacio ───────────────────────────────────────────
function applyFilter(events) {
  const now = Date.now();
  if (evFilter === "active")
    return events.filter((ev) => new Date(ev.finish_date).getTime() > now);
  if (evFilter === "inactive")
    return events.filter((ev) => new Date(ev.finish_date).getTime() <= now);
  return events;
}

function getCalEvents() {
  const base = evCalSpace
    ? MOCK_EVENTS.filter((ev) => ev.space_id === evCalSpace)
    : MOCK_EVENTS;
  return applyFilter(base);
}

function buildCalSpaceSelector() {
  const opts = MOCK_SCENARIOS.map((sc) => {
    const spaces = MOCK_SPACES.filter((sp) => sp.scenario_id === sc.id);
    return `<optgroup label="${sc.name}">${spaces
      .map(
        (sp) =>
          `<option value="${sp.id}"${sp.id === evCalSpace ? " selected" : ""}>${sp.name}</option>`,
      )
      .join("")}</optgroup>`;
  }).join("");

  const calEvs = getCalEvents();
  const info = evCalSpace
    ? `${calEvs.length} evento${calEvs.length !== 1 ? "s" : ""} en este espacio`
    : `${calEvs.length} evento${calEvs.length !== 1 ? "s" : ""} en total`;

  return `
  <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap;">
    <div style="display:flex;align-items:center;gap:0.5rem;flex:1;min-width:12rem;max-width:28rem;">
      <svg fill="none" stroke="#94a3b8" viewBox="0 0 24 24" width="15" height="15" style="flex-shrink:0;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <div class="select-wrap" style="flex:1;">
        <select class="form-input" id="ev-cal-space" onchange="onCalSpaceChange(this.value)"
          style="background:#fff;padding-top:0.5rem;padding-bottom:0.5rem;">
          <option value="">Todos los espacios</option>
          ${opts}
        </select>
      </div>
    </div>
    <span id="ev-cal-count" style="font-size:0.8rem;color:#64748b;white-space:nowrap;">${info}</span>
  </div>`;
}

function calendarSection() {
  return `
    ${buildCalSpaceSelector()}
    <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">
      <div id="ev-calendar" style="min-width:520px;"></div>
    </div>`;
}

// ─── Render principal ─────────────────────────────────────────────────────────
function getFiltered() {
  const q = evSearch;
  return applyFilter(MOCK_EVENTS).filter(
    (ev) =>
      ev.title.toLowerCase().includes(q) ||
      nameOf(MOCK_SCENARIOS, ev.scenario_id).toLowerCase().includes(q) ||
      nameOf(MOCK_SPACES, ev.space_id).toLowerCase().includes(q) ||
      nameOf(MOCK_DISCIPLINES, ev.discipline_id).toLowerCase().includes(q),
  );
}

function renderPage() {
  const filtered = getFiltered();
  document.getElementById("app").innerHTML = `
  <div class="dash-layout">
    ${renderSidebar()}
    <main class="dash-main">
      <header class="ev-header" style="height:3.5rem;background:#fff;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:1rem;position:sticky;top:0;z-index:50;">
        <button onclick="document.getElementById('ev-sidebar').classList.toggle('open')" class="show-mobile" style="background:none;border:none;cursor:pointer;color:#64748b;padding:0.25rem;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div style="flex:1;max-width:26rem;position:relative;">
          <svg style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Buscar eventos, escenarios, espacios..." value="${evSearch}"
            style="width:100%;border:1.5px solid #e2e8f0;border-radius:0.625rem;background:#f8fafc;padding:0.5rem 1rem 0.5rem 2.25rem;font-size:0.875rem;font-family:inherit;color:#1e293b;outline:none;"
            onfocus="this.style.borderColor='#2563eb';this.style.background='#fff'"
            onblur="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc'"
            oninput="evSearchHandler(this.value)"/>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-left:auto;">
          <div style="width:2rem;height:2rem;border-radius:50%;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.7rem;font-weight:700;">SC</div>
          <div class="hide-mobile">
            <p style="font-size:0.8125rem;font-weight:600;color:#1e293b;margin:0;line-height:1.2;">Sara Calderón</p>
            <p style="font-size:0.7rem;color:#64748b;margin:0;">Administrador General</p>
          </div>
        </div>
      </header>
      <div class="ev-main-content" style="flex:1;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.75rem;flex-wrap:wrap;">
          <div>
            <h1 class="ev-page-title" style="font-weight:700;color:#0f172a;margin:0 0 0.25rem;letter-spacing:-0.02em;">Gestión de Eventos</h1>
            <p style="color:#64748b;font-size:0.9375rem;margin:0;">Administrar todos los eventos · <strong style="color:#1e293b;">${MOCK_EVENTS.length}</strong> en total</p>
          </div>
          <button onclick="openEvModal('create')"
            style="display:flex;align-items:center;gap:0.5rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;padding:0.65rem 1.25rem;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;box-shadow:0 4px 12px -2px rgba(37,99,235,0.4);transition:transform 0.15s;"
            onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Crear Evento
          </button>
        </div>

        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
          <div style="flex:1;min-width:14rem;max-width:24rem;position:relative;">
            <svg style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" id="ev-search-local" placeholder="Buscar evento..." value="${evSearch}"
              style="width:100%;border:1.5px solid #e2e8f0;border-radius:0.625rem;background:#fff;padding:0.625rem 1rem 0.625rem 2.25rem;font-size:0.875rem;font-family:inherit;color:#1e293b;outline:none;transition:border-color 0.2s;"
              onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'"
              oninput="evSearchHandler(this.value)"/>
          </div>
          <div style="display:flex;gap:0.375rem;flex-wrap:wrap;">
            <button class="ev-filter-pill ${evFilter === "" ? "active" : ""}" onclick="setEvFilter('')">Todos</button>
            <button class="ev-filter-pill ${evFilter === "active" ? "active" : ""}" onclick="setEvFilter('active')">
              <span style="width:0.45rem;height:0.45rem;border-radius:50%;background:#22c55e;flex-shrink:0;"></span>Activos
            </button>
            <button class="ev-filter-pill ${evFilter === "inactive" ? "active" : ""}" onclick="setEvFilter('inactive')">
              <span style="width:0.45rem;height:0.45rem;border-radius:50%;background:#ca8a04;flex-shrink:0;"></span>Inactivos
            </button>
          </div>
          <div style="display:flex;gap:0.375rem;margin-left:auto;">
            <button id="btn-list"     class="view-btn ${evView === "list" ? "active" : ""}"     onclick="setEvView('list')"     title="Vista lista">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            </button>
            <button id="btn-cards"    class="view-btn ${evView === "cards" ? "active" : ""}"    onclick="setEvView('cards')"    title="Vista cards">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
            </button>
            <button id="btn-calendar" class="view-btn ${evView === "calendar" ? "active" : ""}" onclick="setEvView('calendar')" title="Vista calendario">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </button>
          </div>
        </div>

        <div id="ev-content">
          ${evView === "list" ? renderList(filtered) : evView === "cards" ? renderCards(filtered) : calendarSection()}
        </div>
      </div>
    </main>
    <div id="ev-modal-container"></div>
  </div>`;

  if (evView === "calendar") {
    createCalendar({ containerId: "ev-calendar", events: getCalEvents() }).then(
      (cal) => {
        calInstance = cal;
      },
    );
  }
}

// ─── Acciones ─────────────────────────────────────────────────────────────────
function setEvView(view) {
  if (evView === "calendar" && view !== "calendar" && calInstance) {
    calInstance.destroy();
    calInstance = null;
  }
  evView = view;
  const filtered = getFiltered();
  if (view === "list")
    document.getElementById("ev-content").innerHTML = renderList(filtered);
  else if (view === "cards")
    document.getElementById("ev-content").innerHTML = renderCards(filtered);
  else {
    document.getElementById("ev-content").innerHTML = calendarSection();
    createCalendar({ containerId: "ev-calendar", events: getCalEvents() }).then(
      (cal) => {
        calInstance = cal;
      },
    );
  }
  ["list", "cards", "calendar"].forEach((v) =>
    document.getElementById(`btn-${v}`)?.classList.toggle("active", v === view),
  );
}

function setEvFilter(val) {
  evFilter = val;
  document.querySelectorAll(".ev-filter-pill").forEach((el) => {
    const map = { "": 0, active: 1, inactive: 2 };
    const idx = [...el.parentElement.children].indexOf(el);
    el.classList.toggle("active", map[val] === idx);
  });
  const filtered = getFiltered();
  if (evView === "list")
    document.getElementById("ev-content").innerHTML = renderList(filtered);
  else if (evView === "cards")
    document.getElementById("ev-content").innerHTML = renderCards(filtered);
  else if (calInstance) calInstance.setEvents(getCalEvents());
}
window.setEvFilter = setEvFilter;

function onCalSpaceChange(spaceId) {
  evCalSpace = spaceId;
  const calEvs = getCalEvents();
  if (calInstance) calInstance.setEvents(calEvs);
  // Actualizar contador
  const countEl = document.getElementById("ev-cal-count");
  if (countEl) {
    const info = spaceId
      ? `${calEvs.length} evento${calEvs.length !== 1 ? "s" : ""} en este espacio`
      : `${calEvs.length} evento${calEvs.length !== 1 ? "s" : ""} en total`;
    countEl.textContent = info;
  }
}
window.onCalSpaceChange = onCalSpaceChange;

function evSearchHandler(val) {
  evSearch = val.toLowerCase();
  const filtered = getFiltered();
  if (evView !== "calendar") {
    document.getElementById("ev-content").innerHTML =
      evView === "list" ? renderList(filtered) : renderCards(filtered);
  }
  const local = document.getElementById("ev-search-local");
  if (local && local !== document.activeElement) local.value = val;
}

function openEvModal(type, id) {
  evModal = type;
  evSelected = id ? MOCK_EVENTS.find((e) => e.id === id) : null;
  document.getElementById("ev-modal-container").innerHTML =
    type === "delete"
      ? renderDeleteModal(evSelected)
      : renderFormModal(evSelected);
}

function closeEvModal(e) {
  if (e && e.target?.id !== "ev-modal-backdrop") return;
  document.getElementById("ev-modal-container").innerHTML = "";
  evModal = null;
  evSelected = null;
}

// Actualiza banner de disponibilidad en tiempo real
function onDatesChange() {
  const start = document.getElementById("ev-start")?.value;
  const finish = document.getElementById("ev-finish")?.value;
  const spaceId = document.getElementById("ev-space")?.value;
  const banner = document.getElementById("ev-avail-banner");
  if (!banner) return;
  if (!start || !finish || !spaceId || finish <= start) {
    banner.style.display = "none";
    return;
  }

  const res = checkAvailability(start, finish, spaceId, evSelected?.id);
  banner.style.display = "flex";
  banner.className = "avail-banner " + (res.ok ? "ok" : "busy");
  const icon = res.ok
    ? `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    : `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
  banner.innerHTML = icon + `<span>${res.message}</span>`;
}
window.onDatesChange = onDatesChange;

function toggleSwitch(cb) {
  document.getElementById("ev-switch-track").style.background = cb.checked
    ? "#2563eb"
    : "#cbd5e1";
  document.getElementById("ev-switch-thumb").style.left = cb.checked
    ? "1.25rem"
    : "0.1875rem";
  const lbl = document.getElementById("ev-switch-label");
  if (lbl) lbl.textContent = cb.checked ? "activo" : "inactivo";
}

function setErr(fieldId, errId, msg) {
  document.getElementById(fieldId)?.classList.toggle("error", !!msg);
  const err = document.getElementById(errId);
  if (err) err.classList.toggle("show", !!msg);
  const msgEl = document.getElementById(errId + "-msg");
  if (msgEl) msgEl.textContent = msg || "";
}
function clearErrs() {
  ["ev-title", "ev-start", "ev-finish", "ev-scenario", "ev-space"].forEach(
    (id) => setErr(id, id + "-err", ""),
  );
}

function submitEvForm(e) {
  e.preventDefault();
  clearErrs();

  const title = document.getElementById("ev-title").value.trim();
  const start = document.getElementById("ev-start").value;
  const finish = document.getElementById("ev-finish").value;
  const scenarioId = document.getElementById("ev-scenario").value;
  const spaceId = document.getElementById("ev-space").value;
  let valid = true;

  if (!title) {
    setErr("ev-title", "ev-title-err", "El título es requerido.");
    valid = false;
  }
  if (!start) {
    setErr("ev-start", "ev-start-err", "La fecha de inicio es requerida.");
    valid = false;
  }
  if (!finish) {
    setErr("ev-finish", "ev-finish-err", "La fecha de fin es requerida.");
    valid = false;
  }
  if (!scenarioId) {
    setErr("ev-scenario", "ev-scenario-err", "Selecciona un escenario.");
    valid = false;
  }
  if (!spaceId) {
    setErr("ev-space", "ev-space-err", "Selecciona un espacio.");
    valid = false;
  }

  if (start && finish) {
    if (finish <= start) {
      setErr(
        "ev-finish",
        "ev-finish-err",
        "La hora fin debe ser posterior al inicio.",
      );
      valid = false;
    } else if (spaceId) {
      const avail = checkAvailability(start, finish, spaceId, evSelected?.id);
      if (!avail.ok) {
        setErr("ev-start", "ev-start-err", avail.message);
        valid = false;
      }
    }
  }

  if (!valid) return;

  const isEdit = evModal === "edit";
  const payload = {
    id: evSelected?.id || String(Date.now()),
    title,
    description: document.getElementById("ev-desc").value.trim(),
    start_date: start,
    finish_date: finish,
    scenario_id: scenarioId,
    space_id: spaceId,
    discipline_id: document.getElementById("ev-discipline").value || null,
    is_active: document.getElementById("ev-active").checked,
    creator_id: evSelected?.creator_id || "Sara Calderón",
    created_at: evSelected?.created_at || new Date().toISOString(),
  };

  if (isEdit) {
    // 🔌 await api.updateEvent(payload.id, payload)
    const idx = MOCK_EVENTS.findIndex((ev) => ev.id === payload.id);
    if (idx > -1) MOCK_EVENTS[idx] = payload;
  } else {
    // 🔌 await api.createEvent(payload)
    MOCK_EVENTS.unshift(payload);
  }

  document.getElementById("ev-modal-container").innerHTML = "";
  evModal = null;
  evSelected = null;
  toast(
    "success",
    isEdit
      ? `"${payload.title}" actualizado correctamente.`
      : `"${payload.title}" creado correctamente.`,
  );
  refreshContent();
}

function confirmDeleteEv() {
  const title = evSelected?.title || "Evento";
  // 🔌 await api.deleteEvent(evSelected.id)
  MOCK_EVENTS = MOCK_EVENTS.filter((e) => e.id !== evSelected.id);
  document.getElementById("ev-modal-container").innerHTML = "";
  evModal = null;
  evSelected = null;
  toast("success", `"${title}" eliminado correctamente.`);
  refreshContent();
}

function refreshContent() {
  const filtered = getFiltered();
  if (evView === "list")
    document.getElementById("ev-content").innerHTML = renderList(filtered);
  else if (evView === "cards")
    document.getElementById("ev-content").innerHTML = renderCards(filtered);
  else if (calInstance) calInstance.setEvents(getCalEvents());
  // Actualizar contador en el subtítulo
  const subtitle = document.querySelector(".ev-subtitle-count");
  if (subtitle) subtitle.textContent = MOCK_EVENTS.length;
}

function handleLogout() {
  localStorage.removeItem("token");
  window.location.hash = "#/login";
}

// ─── Exponer globalmente ──────────────────────────────────────────────────────
window.setEvView = setEvView;
window.evSearchHandler = evSearchHandler;
window.openEvModal = openEvModal;
window.closeEvModal = closeEvModal;
window.toggleSwitch = toggleSwitch;
window.submitEvForm = submitEvForm;
window.confirmDeleteEv = confirmDeleteEv;
window.handleLogout = handleLogout;

// ─── Export ───────────────────────────────────────────────────────────────────
export async function initEvent() {
  if (calInstance) {
    calInstance.destroy();
    calInstance = null;
  }
  evView = "list";
  evSearch = "";
  evCalSpace = "";
  evFilter = "";
  await loadSonner();
  renderPage();
}
