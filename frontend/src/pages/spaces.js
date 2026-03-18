// src/pages/spaces.js
import Sidebar from "../components/sidebar.js";
import Navbar  from "../components/navbar.js";
import { toast } from "../utils/toast.js";
// Funciones de la API para espacios y escenarios
import {
  getSpaces, createSpace, updateSpace, patchSpace, deleteSpace,
  getScenarios, createScenario, updateScenario, deleteScenario,
} from "../services/api.js";

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
    .ev-cards { display:grid;grid-template-columns:1fr;gap:1rem; }
    .ev-card { background:#fff;border-radius:1rem;border:1px solid #e2e8f0;overflow:hidden;transition:box-shadow 0.2s,transform 0.15s;box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    .ev-card:hover { box-shadow:0 8px 24px -4px rgba(0,0,0,0.1);transform:translateY(-2px); }
    .modal-backdrop { position:fixed;inset:0;background:rgba(15,23,42,0.55);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn 0.2s ease; }
    .modal-box { background:#fff;border-radius:1rem;width:100%;max-width:34rem;max-height:90vh;overflow-y:auto;box-shadow:0 24px 48px -8px rgba(0,0,0,0.2);animation:slideUp 0.25s cubic-bezier(0.22,1,0.36,1); }
    .modal-header { padding:1.5rem 1.5rem 1rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1;border-bottom:1px solid #f1f5f9; }
    .modal-body { padding:1.5rem;display:flex;flex-direction:column;gap:1rem; }
    .form-group { display:flex;flex-direction:column;gap:0.4rem; }
    .form-label { font-size:0.8375rem;font-weight:600;color:#1e293b; }
    .form-input { width:100%;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#f8fafc;padding:0.7rem 1rem;font-size:0.875rem;color:#1e293b;font-family:inherit;outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;appearance:none;-webkit-appearance:none; }
    .form-input:focus { border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.12);background:#fff; }
    .form-input.error { border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
    .select-wrap { position:relative; }
    .select-wrap::after { content:'';position:absolute;right:0.875rem;top:50%;transform:translateY(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #94a3b8;pointer-events:none; }
    .select-wrap select.form-input { cursor:pointer;padding-right:2.25rem; }
    .form-grid-2 { display:grid;grid-template-columns:1fr;gap:1rem; }
    .form-err { display:none;color:#ef4444;font-size:0.75rem;margin:0; }
    .form-err.show { display:flex;align-items:center;gap:0.25rem; }
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


// Se cargan desde el backend en initSpaces() e initScenarios()
let SP_SCENARIOS = [];
let SP_SPACES    = [];

function nameOf(list, id) {
  return list.find((x) => x.id === id)?.name || "—";
}

function genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// --- espacios (#/espaces) ---
let spSearch = "";
let spModal = null;
let spSelected = null;
let spFilter = ""; // '' | 'activo' | 'inactivo'

function getFilteredSpaces() {
  return SP_SPACES.filter((sp) => {
    const matchFilter = spFilter === "" || sp.status === spFilter;
    const q = spSearch.toLowerCase();
    const matchSearch =
      sp.name.toLowerCase().includes(q) ||
      sp.description.toLowerCase().includes(q) ||
      nameOf(SP_SCENARIOS, sp.scenario_id).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
}

// marco 'spaces' como activo para ambas sub-páginas de este módulo
function renderSpSidebar() {
  return Sidebar();
}

function emptySpState() {
  const cfg =
    spFilter === "activo"
      ? { icon: "🏟️", title: "Sin espacios activos", sub: "No hay espacios con estado activo.", btn: false }
      : spFilter === "inactivo"
      ? { icon: "📭", title: "Sin espacios inactivos", sub: "No hay espacios dados de baja.", btn: false }
      : { icon: null, title: "Sin espacios", sub: "Crea el primer espacio deportivo.", btn: true };
  return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 1rem;text-align:center;gap:1rem;">
      ${cfg.icon ? `<div style="font-size:2.5rem;line-height:1;">${cfg.icon}</div>` : `
        <div style="width:3.5rem;height:3.5rem;border-radius:1rem;background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
          <svg fill="none" stroke="#94a3b8" viewBox="0 0 24 24" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </div>`}
      <div>
        <p style="font-size:1rem;font-weight:700;color:#1e293b;margin:0 0 0.25rem;">${cfg.title}</p>
        <p style="font-size:0.875rem;color:#94a3b8;margin:0;">${cfg.sub}</p>
      </div>
      ${cfg.btn ? `<button onclick="openSpModal('create')" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Crear Espacio</button>` : ""}
    </div>`;
}

const SP_COLORS = [
  { top: "#2563eb", bg: "#eff6ff" },
  { top: "#16a34a", bg: "#f0fdf4" },
  { top: "#0d9488", bg: "#f0fdfa" },
  { top: "#7c3aed", bg: "#f5f3ff" },
  { top: "#be185d", bg: "#fdf2f8" },
];

function renderSpCards(spaces) {
  if (!spaces.length) return emptySpState();
  return `<div class="ev-cards">${spaces.map((sp, i) => {
    const isActive = sp.status === "activo";
    const scenarioName = nameOf(SP_SCENARIOS, sp.scenario_id);
    const accent = SP_COLORS[i % SP_COLORS.length].top;
    // Cuando inactivo → paleta gris
    const topBar   = isActive ? accent    : "#cbd5e1";
    const iconBg   = isActive ? `${accent}1a` : "#f1f5f9";
    const iconBdr  = isActive ? `${accent}33` : "#e2e8f0";
    const iconClr  = isActive ? accent    : "#94a3b8";
    const nameClr  = isActive ? "#1e293b" : "#94a3b8";
    const descClr  = isActive ? "#94a3b8" : "#cbd5e1";
    const cardBg   = isActive ? "#fff"    : "#f8fafc";
    return `
    <div class="ev-card" style="background:${cardBg};">
      <div style="height:0.3rem;background:${topBar};transition:background 0.25s;"></div>
      <div style="padding:1.125rem 1.25rem;">

        <!-- Fila superior: icono + nombre | toggle -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.875rem;">
          <div style="display:flex;align-items:center;gap:0.625rem;min-width:0;">
            <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:${iconBg};border:1px solid ${iconBdr};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.25s,border-color 0.25s;">
              <svg fill="none" stroke="${iconClr}" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div style="min-width:0;">
              <p style="font-weight:700;color:${nameClr};font-size:0.9rem;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:color 0.25s;">${sp.name}</p>
              <p style="color:${descClr};font-size:0.775rem;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${sp.description || "—"}</p>
            </div>
          </div>
          <!-- Toggle switch → 🔌 PATCH /api/spaces/${sp.id}/status -->
          <button
            onclick="toggleSpStatus(${i})"
            title="${isActive ? "Desactivar espacio" : "Activar espacio"}"
            style="width:2.625rem;height:1.5rem;border-radius:9999px;border:none;cursor:pointer;background:${isActive ? "#22c55e" : "#cbd5e1"};position:relative;transition:background 0.25s;padding:0;flex-shrink:0;margin-top:0.125rem;"
          >
            <span style="position:absolute;top:0.2rem;left:${isActive ? "1.325rem" : "0.2rem"};width:1.1rem;height:1.1rem;border-radius:50%;background:#fff;transition:left 0.25s;box-shadow:0 1px 4px rgba(0,0,0,0.18);"></span>
          </button>
        </div>

        <!-- Fila inferior: escenario | acciones -->
        <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;padding-top:0.75rem;border-top:1px solid #f1f5f9;">
          <span style="font-size:0.775rem;color:#64748b;display:flex;align-items:center;gap:0.3rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            ${scenarioName}
          </span>
          <div style="display:flex;gap:0.125rem;flex-shrink:0;">
            <button class="action-btn" title="Editar" style="color:#2563eb;" onclick="openSpModal('edit',${i})" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="action-btn" title="Eliminar" style="color:#ef4444;" onclick="openSpModal('delete',${i})" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>`;
  }).join("")}</div>`;
}

function buildSpModal() {
  if (!spModal) return "";
  const { type } = spModal;
  const sp = spSelected;

  if (type === "delete") {
    // Guard: si el espacio no se encontró en SP_SPACES (ID no coincide), cerramos el modal
    if (!sp) { spModal = null; spSelected = null; return ""; }
    return `
    <div class="modal-backdrop" onclick="if(event.target===this)closeSpModal()">
      <div class="modal-box" style="max-width:26rem;">
        <div class="modal-header">
          <h3 style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;">Eliminar espacio</h3>
          <button onclick="closeSpModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.375rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div style="display:flex;gap:0.875rem;align-items:flex-start;padding:1rem;background:#fef2f2;border-radius:0.75rem;border:1px solid #fecaca;">
            <svg fill="none" stroke="#dc2626" viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0;margin-top:0.1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <div>
              <p style="font-weight:700;color:#dc2626;margin:0 0 0.25rem;font-size:0.875rem;">¿Eliminar "${sp.name}"?</p>
              <p style="color:#ef4444;font-size:0.8125rem;margin:0;">Esta acción no se puede deshacer. Los eventos asociados quedarán sin espacio asignado.</p>
            </div>
          </div>
          <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
            <button onclick="closeSpModal()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;color:#475569;font-family:inherit;">Cancelar</button>
            <button onclick="confirmDeleteSpace()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:none;background:#dc2626;color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">Eliminar</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  const isEdit = type === "edit";
  const title = isEdit ? "Editar espacio" : "Crear espacio";
  const initActive = isEdit ? sp.status === "activo" : true;

  return `
  <div class="modal-backdrop" onclick="if(event.target===this)closeSpModal()">
    <div class="modal-box">
      <div class="modal-header">
        <h3 style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;">${title}</h3>
        <button onclick="closeSpModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.375rem;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Nombre del espacio *</label>
          <input id="sp-f-name" class="form-input" type="text" placeholder="Ej: Cancha Sintética Norte" value="${isEdit ? sp.name : ""}" />
          <p class="form-err" id="sp-e-name">⚠ Este campo es requerido.</p>
        </div>
        <div class="form-group">
          <label class="form-label">Descripción <span style="font-weight:400;color:#94a3b8;font-size:0.775rem;">(opcional)</span></label>
          <textarea id="sp-f-desc" class="form-input" rows="2" placeholder="Breve descripción del espacio..." style="resize:vertical;">${isEdit ? sp.description : ""}</textarea>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Estado</label>
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0.875rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#f8fafc;">
              <button
                id="sp-f-status-btn"
                type="button"
                data-active="${initActive}"
                onclick="spToggleModalStatus()"
                style="width:2.625rem;height:1.5rem;border-radius:9999px;border:none;cursor:pointer;background:${initActive ? '#22c55e' : '#cbd5e1'};position:relative;padding:0;flex-shrink:0;transition:background 0.2s;"
              >
                <span style="position:absolute;top:0.2rem;left:${initActive ? '1.325rem' : '0.2rem'};width:1.1rem;height:1.1rem;border-radius:50%;background:#fff;transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.18);"></span>
              </button>
              <span id="sp-f-status-label" style="font-size:0.875rem;font-weight:600;color:${initActive ? '#16a34a' : '#94a3b8'};">${initActive ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Escenario *</label>
            <div class="select-wrap">
              <select id="sp-f-scenario" class="form-input">
                <option value="">Seleccionar escenario...</option>
                ${SP_SCENARIOS.map((sc) => `<option value="${sc.id}" ${isEdit && sp.scenario_id === sc.id ? "selected" : ""}>${sc.name}</option>`).join("")}
              </select>
            </div>
            <p class="form-err" id="sp-e-scenario">⚠ Selecciona un escenario.</p>
          </div>
        </div>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;padding-top:0.5rem;">
          <button onclick="closeSpModal()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;color:#475569;font-family:inherit;">Cancelar</button>
          <button onclick="saveSpModal()" style="padding:0.6rem 1.5rem;border-radius:0.625rem;border:none;background:#2563eb;color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">${isEdit ? "Guardar cambios" : "Crear espacio"}</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderSpPage() {
  const spaces = getFilteredSpaces();
  const total = SP_SPACES.length;
  const activos = SP_SPACES.filter((s) => s.status === "activo").length;
  const inactivos = SP_SPACES.filter((s) => s.status === "inactivo").length;

  const app = document.getElementById("app");
  app.innerHTML = `
  <div class="flex w-full min-h-screen">
    ${renderSpSidebar()}
    <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
      ${Navbar()}
      <div class="ev-main-content" style="flex:1;">
        <!-- Header -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
          <div>
            <h1 class="ev-page-title" style="font-weight:800;color:#1e293b;margin:0 0 0.25rem;">Administrar Espacios</h1>
            <p style="color:#64748b;font-size:0.875rem;margin:0;">Catálogo de espacios deportivos</p>
          </div>
          <button onclick="openSpModal('create')" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Crear Espacio
          </button>
        </div>

        <!-- Stats rápidas -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:0.75rem;margin-bottom:1.5rem;">
          ${[
            { label: "Total", value: total, color: "#2563eb", bg: "#eff6ff" },
            { label: "Activos", value: activos, color: "#16a34a", bg: "#f0fdf4" },
            { label: "Inactivos", value: inactivos, color: "#dc2626", bg: "#fef2f2" },
          ].map((s) => `
            <div style="background:#fff;border-radius:0.75rem;border:1px solid #e2e8f0;padding:0.875rem 1rem;">
              <p style="font-size:1.375rem;font-weight:800;color:${s.color};margin:0 0 0.125rem;">${s.value}</p>
              <p style="font-size:0.75rem;font-weight:600;color:#64748b;margin:0;">${s.label}</p>
            </div>`).join("")}
        </div>

        <!-- Barra de búsqueda + filtros -->
        <div style="background:#fff;border-radius:0.875rem;border:1px solid #e2e8f0;padding:0.875rem 1rem;margin-bottom:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
          <div style="position:relative;">
            <svg fill="none" stroke="#94a3b8" viewBox="0 0 24 24" width="16" height="16" style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);pointer-events:none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Buscar espacios..." value="${spSearch}" oninput="onSpSearch(this.value)" style="width:100%;padding:0.6rem 1rem 0.6rem 2.5rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;font-size:0.875rem;color:#1e293b;font-family:inherit;outline:none;background:#f8fafc;transition:border-color 0.2s;" onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'" />
          </div>
          <div style="display:flex;gap:0.375rem;flex-wrap:wrap;">
            <button class="ev-filter-pill ${spFilter === "" ? "active" : ""}" onclick="setSpFilter('')">Todos</button>
            <button class="ev-filter-pill ${spFilter === "activo" ? "active" : ""}" onclick="setSpFilter('activo')">
              <span style="width:0.45rem;height:0.45rem;border-radius:50%;background:#22c55e;flex-shrink:0;"></span>Activos
            </button>
            <button class="ev-filter-pill ${spFilter === "inactivo" ? "active" : ""}" onclick="setSpFilter('inactivo')">
              <span style="width:0.45rem;height:0.45rem;border-radius:50%;background:#ef4444;flex-shrink:0;"></span>Inactivos
            </button>
          </div>
        </div>

        <!-- Lista de espacios -->
        <div id="sp-cards-wrapper">${renderSpCards(spaces)}</div>
      </div>
    </div>
  </div>
  ${buildSpModal()}`;

  // Cerrar sidebar al hacer clic fuera (mobile)
  document.addEventListener("click", (e) => {
    const sidebar = document.getElementById("sp-sidebar");
    if (sidebar && sidebar.classList.contains("open") && !sidebar.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  }, { once: true });
}

// handlers de espacios
window.openSpModal = function (type, idx = null) {
  spSelected = idx !== null ? getFilteredSpaces()[idx] || null : null;
  spModal = { type };
  renderSpPage();
};

window.closeSpModal = function () {
  spModal = null;
  spSelected = null;
  renderSpPage();
};

window.saveSpModal = async function () {
  const name = document.getElementById("sp-f-name")?.value.trim();
  const desc = document.getElementById("sp-f-desc")?.value.trim();
  const statusBtn = document.getElementById("sp-f-status-btn");
  const status = statusBtn?.dataset.active === "true" ? "activo" : "inactivo";
  const scenario_id = document.getElementById("sp-f-scenario")?.value;

  let valid = true;
  const eN = document.getElementById("sp-e-name");
  const eSc = document.getElementById("sp-e-scenario");

  if (!name) { eN?.classList.add("show"); document.getElementById("sp-f-name")?.classList.add("error"); valid = false; }
  else { eN?.classList.remove("show"); document.getElementById("sp-f-name")?.classList.remove("error"); }

  if (!scenario_id) { eSc?.classList.add("show"); document.getElementById("sp-f-scenario")?.classList.add("error"); valid = false; }
  else { eSc?.classList.remove("show"); document.getElementById("sp-f-scenario")?.classList.remove("error"); }

  if (!valid) return;

  const apiData = { name, description: desc, scenario_id };

  if (spModal.type === "edit" && spSelected) {
    try {
      await updateSpace(spSelected.id, apiData); // PUT /space/:id
      const idx = SP_SPACES.findIndex((s) => s.id === spSelected.id);
      SP_SPACES[idx] = { ...SP_SPACES[idx], name, description: desc, status, scenario_id };
      toast("success", "Espacio actualizado correctamente.");
    } catch (err) {
      toast("error", err.message || "Error al actualizar el espacio.");
      return;
    }
  } else {
    try {
      const created = await createSpace(apiData); // POST /space
      // Usamos el ID real que devuelve el servidor
      SP_SPACES.push({ id: created?.id || genId("sp"), name, description: desc, status, scenario_id });
      toast("success", "Espacio creado correctamente.");
    } catch (err) {
      toast("error", err.message || "Error al crear el espacio.");
      return;
    }
  }

  spModal = null;
  spSelected = null;
  renderSpPage();
};

window.confirmDeleteSpace = async function () {
  if (!spSelected) return;
  const idToDelete = spSelected.id;
  const nameToDelete = spSelected.name;
  if (!idToDelete) {
    toast("error", "Recarga la página — el servidor aún no devuelve los IDs.");
    return;
  }
  try {
    await deleteSpace(idToDelete); // DELETE /space/:id
    SP_SPACES = SP_SPACES.filter((s) => s.id !== idToDelete);
    toast("success", `"${nameToDelete}" eliminado.`);
    spModal = null;
    spSelected = null;
    renderSpPage();
  } catch (err) {
    toast("error", err.message || "Error al eliminar el espacio.");
  }
};

window.spToggleModalStatus = function () {
  const btn = document.getElementById("sp-f-status-btn");
  const label = document.getElementById("sp-f-status-label");
  if (!btn) return;
  const nowActive = btn.dataset.active !== "true";
  btn.dataset.active = nowActive;
  btn.style.background = nowActive ? "#22c55e" : "#cbd5e1";
  btn.querySelector("span").style.left = nowActive ? "1.325rem" : "0.2rem";
  label.textContent = nowActive ? "Activo" : "Inactivo";
  label.style.color = nowActive ? "#16a34a" : "#94a3b8";
};

window.toggleSpStatus = async function (filteredIdx) {
  const sp = getFilteredSpaces()[filteredIdx];
  if (!sp) return;
  if (!sp.id) {
    toast("error", "Recarga la página — el servidor aún no devuelve los IDs.");
    return;
  }
  const newStatus = sp.status === "activo" ? "inactivo" : "activo";
  const backendStatus = newStatus === "activo" ? "active" : "inactive";
  try {
    await patchSpace(sp.id, { status: backendStatus }); // PATCH /space/:id
    const idx = SP_SPACES.findIndex((s) => s.id === sp.id);
    if (idx !== -1) SP_SPACES[idx] = { ...SP_SPACES[idx], status: newStatus };
    toast("success", `Espacio ${newStatus === "activo" ? "activado" : "desactivado"}.`);
    renderSpPage();
  } catch (err) {
    toast("error", err.message || "Error al cambiar el estado.");
  }
};

window.setSpFilter = function (val) {
  spFilter = val;
  renderSpPage();
};

window.onSpSearch = function (val) {
  spSearch = val.toLowerCase();
  const wrapper = document.getElementById("sp-cards-wrapper");
  if (wrapper) { wrapper.innerHTML = renderSpCards(getFilteredSpaces()); return; }
  renderSpPage();
};

export async function initSpaces() {
  spSearch  = "";
  spModal   = null;
  spSelected = null;
  spFilter  = "";
  // Cargamos escenarios y espacios desde el backend antes de renderizar
  try {
    const [scenarios, spaces] = await Promise.all([getScenarios(), getSpaces()]);
    // Convertimos camelCase del backend a snake_case interno
    SP_SCENARIOS = (scenarios || []).map((sc) => ({ id: sc.id, name: sc.name, location: sc.location || '' }));
    SP_SPACES    = (spaces    || []).map((sp) => ({ id: sp.id, name: sp.name, description: sp.description || '', status: sp.status === 'active' ? 'activo' : sp.status === 'inactive' ? 'inactivo' : 'activo', scenario_id: sp.scenarioId || sp.scenario_id || '' }));
  } catch {
    toast("error", "No se pudieron cargar los espacios del servidor.");
  }
  renderSpPage();
}

// --- escenarios (#/complex) ---
let scSearch = "";
let scModal = null;
let scSelected = null;

function getFilteredScenarios() {
  const q = scSearch.toLowerCase();
  return SP_SCENARIOS.filter(
    (sc) =>
      sc.name.toLowerCase().includes(q) ||
      sc.location.toLowerCase().includes(q)
  );
}

function spaceCountFor(scenarioId) {
  return SP_SPACES.filter((sp) => sp.scenario_id === scenarioId).length;
}

function emptyScState() {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 1rem;text-align:center;gap:1rem;">
      <div style="width:3.5rem;height:3.5rem;border-radius:1rem;background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
        <svg fill="none" stroke="#94a3b8" viewBox="0 0 24 24" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
      </div>
      <div>
        <p style="font-size:1rem;font-weight:700;color:#1e293b;margin:0 0 0.25rem;">Sin escenarios</p>
        <p style="font-size:0.875rem;color:#94a3b8;margin:0;">Crea el primer escenario deportivo.</p>
      </div>
      <button onclick="openScModal('create')" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Crear Escenario</button>
    </div>`;
}

const SC_COLORS = [
  { top: "#7c3aed", accent: "#7c3aed" },
  { top: "#0369a1", accent: "#0369a1" },
  { top: "#0d9488", accent: "#0d9488" },
  { top: "#be185d", accent: "#be185d" },
];

function renderScCards(scenarios) {
  if (!scenarios.length) return emptyScState();
  return `<div class="ev-cards">${scenarios.map((sc, i) => {
    // Espacios que pertenecen a este escenario (filtramos por scenario_id)
    const spacesOfSc = SP_SPACES.filter((sp) => sp.scenario_id === sc.id);
    const count      = spacesOfSc.length;
    const { top }    = SC_COLORS[i % SC_COLORS.length];
    return `
    <div class="ev-card">
      <div style="height:0.3rem;background:${top};"></div>
      <div style="padding:1.125rem 1.25rem;">

        <!-- Fila superior: ícono + nombre del escenario | botones editar/eliminar -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;">
          <div style="display:flex;align-items:center;gap:0.625rem;min-width:0;">
            <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:${top}1a;border:1px solid ${top}33;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg fill="none" stroke="${top}" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div style="min-width:0;">
              <p style="font-weight:700;color:#1e293b;font-size:0.9rem;margin:0;">${sc.name}</p>
              <p style="color:#94a3b8;font-size:0.775rem;margin:0;display:flex;align-items:center;gap:0.25rem;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="11" height="11"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                ${sc.location}
              </p>
            </div>
          </div>
          <div style="display:flex;gap:0.25rem;flex-shrink:0;">
            <button class="action-btn" title="Editar" style="color:#2563eb;" onclick="openScModal('edit','${sc.id}')" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="action-btn" title="Eliminar" style="color:#ef4444;" onclick="openScModal('delete','${sc.id}')" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <!-- Sección de espacios del escenario -->
        <div style="padding-top:0.75rem;border-top:1px solid #f1f5f9;">
          <p style="font-size:0.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 0.5rem;display:flex;align-items:center;gap:0.35rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <strong style="color:${top};">${count}</strong>&nbsp;${count === 1 ? "espacio" : "espacios"}
          </p>
          ${count === 0
            // Sin espacios → mensaje vacío
            ? `<p style="font-size:0.8rem;color:#cbd5e1;margin:0;font-style:italic;">Sin espacios registrados aún.</p>`
            // Con espacios → lista con nombre y estado de cada uno
            : `<div style="display:flex;flex-direction:column;gap:0.3rem;">
                ${spacesOfSc.map((sp) => {
                  const isActive = sp.status === "activo";
                  return `
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:0.375rem 0.625rem;background:#f8fafc;border-radius:0.5rem;border:1px solid #f1f5f9;">
                    <span style="font-size:0.8125rem;font-weight:600;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${sp.name}</span>
                    <span style="flex-shrink:0;margin-left:0.5rem;font-size:0.7rem;font-weight:600;padding:0.15rem 0.5rem;border-radius:9999px;background:${isActive ? "#f0fdf4" : "#f1f5f9"};color:${isActive ? "#16a34a" : "#94a3b8"};">${isActive ? "Activo" : "Inactivo"}</span>
                  </div>`;
                }).join("")}
              </div>`
          }
        </div>

      </div>
    </div>`;
  }).join("")}</div>`;
}

function buildScModal() {
  if (!scModal) return "";
  const { type } = scModal;
  const sc = scSelected;

  if (type === "delete") {
    const count = sc ? spaceCountFor(sc.id) : 0;
    return `
    <div class="modal-backdrop" onclick="if(event.target===this)closeScModal()">
      <div class="modal-box" style="max-width:26rem;">
        <div class="modal-header">
          <h3 style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;">Eliminar escenario</h3>
          <button onclick="closeScModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.375rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          ${count > 0 ? `
          <div style="display:flex;gap:0.875rem;align-items:flex-start;padding:1rem;background:#fefce8;border-radius:0.75rem;border:1px solid #fef08a;">
            <svg fill="none" stroke="#ca8a04" viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0;margin-top:0.1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <p style="color:#a16207;font-size:0.8125rem;margin:0;font-weight:500;">Este escenario tiene <strong>${count} ${count === 1 ? "espacio" : "espacios"}</strong> asociados. Eliminar el escenario no eliminará los espacios, pero quedarán sin escenario asignado.</p>
          </div>` : ""}
          <div style="display:flex;gap:0.875rem;align-items:flex-start;padding:1rem;background:#fef2f2;border-radius:0.75rem;border:1px solid #fecaca;">
            <svg fill="none" stroke="#dc2626" viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0;margin-top:0.1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <div>
              <p style="font-weight:700;color:#dc2626;margin:0 0 0.25rem;font-size:0.875rem;">¿Eliminar "${sc.name}"?</p>
              <p style="color:#ef4444;font-size:0.8125rem;margin:0;">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
            <button onclick="closeScModal()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;color:#475569;font-family:inherit;">Cancelar</button>
            <button onclick="confirmDeleteScenario()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:none;background:#dc2626;color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">Eliminar</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  const isEdit = type === "edit";
  return `
  <div class="modal-backdrop" onclick="if(event.target===this)closeScModal()">
    <div class="modal-box" style="max-width:28rem;">
      <div class="modal-header">
        <h3 style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;">${isEdit ? "Editar escenario" : "Crear escenario"}</h3>
        <button onclick="closeScModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.375rem;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Nombre del escenario *</label>
          <input id="sc-f-name" class="form-input" type="text" placeholder="Ej: Unidad Deportiva Norte" value="${isEdit ? sc.name : ""}" />
          <p class="form-err" id="sc-e-name">⚠ Este campo es requerido.</p>
        </div>
        <div class="form-group">
          <label class="form-label">Ubicación *</label>
          <input id="sc-f-location" class="form-input" type="text" placeholder="Ej: Medellín, Laureles" value="${isEdit ? sc.location : ""}" />
          <p class="form-err" id="sc-e-location">⚠ Este campo es requerido.</p>
        </div>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;padding-top:0.5rem;">
          <button onclick="closeScModal()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;color:#475569;font-family:inherit;">Cancelar</button>
          <button onclick="saveScModal()" style="padding:0.6rem 1.5rem;border-radius:0.625rem;border:none;background:#2563eb;color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">${isEdit ? "Guardar cambios" : "Crear escenario"}</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderScPage() {
  const scenarios = getFilteredScenarios();
  const app = document.getElementById("app");
  app.innerHTML = `
  <div class="flex w-full min-h-screen">
    ${renderSpSidebar()}
    <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
      ${Navbar()}
      <div class="ev-main-content" style="flex:1;">
        <!-- Header -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
          <div>
            <h1 class="ev-page-title" style="font-weight:800;color:#1e293b;margin:0 0 0.25rem;">Administrar Escenarios</h1>
            <p style="color:#64748b;font-size:0.875rem;margin:0;">Gestiona los escenarios deportivos y sus ubicaciones</p>
          </div>
          <button onclick="openScModal('create')" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Crear Escenario
          </button>
        </div>

        <!-- Stats rápidas -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:0.75rem;margin-bottom:1.5rem;">
          ${[
            { label: "Escenarios", value: SP_SCENARIOS.length, color: "#7c3aed", bg: "#f5f3ff" },
            { label: "Total espacios", value: SP_SPACES.length, color: "#2563eb", bg: "#eff6ff" },
          ].map((s) => `
            <div style="background:#fff;border-radius:0.75rem;border:1px solid #e2e8f0;padding:0.875rem 1rem;">
              <p style="font-size:1.375rem;font-weight:800;color:${s.color};margin:0 0 0.125rem;">${s.value}</p>
              <p style="font-size:0.75rem;font-weight:600;color:#64748b;margin:0;">${s.label}</p>
            </div>`).join("")}
        </div>

        <!-- Búsqueda -->
        <div style="background:#fff;border-radius:0.875rem;border:1px solid #e2e8f0;padding:0.875rem 1rem;margin-bottom:1.25rem;">
          <div style="position:relative;">
            <svg fill="none" stroke="#94a3b8" viewBox="0 0 24 24" width="16" height="16" style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);pointer-events:none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Buscar escenarios..." value="${scSearch}" oninput="onScSearch(this.value)" style="width:100%;padding:0.6rem 1rem 0.6rem 2.5rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;font-size:0.875rem;color:#1e293b;font-family:inherit;outline:none;background:#f8fafc;transition:border-color 0.2s;" onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'" />
          </div>
        </div>

        <!-- Lista de escenarios -->
        <div id="sc-cards-wrapper">${renderScCards(scenarios)}</div>
      </div>
    </div>
  </div>
  ${buildScModal()}`;
}

// handlers de escenarios
window.openScModal = function (type, id = null) {
  scSelected = id ? SP_SCENARIOS.find((s) => s.id === id) : null;
  scModal = { type };
  renderScPage();
};

window.closeScModal = function () {
  scModal = null;
  scSelected = null;
  renderScPage();
};

window.saveScModal = async function () {
  const name = document.getElementById("sc-f-name")?.value.trim();
  const location = document.getElementById("sc-f-location")?.value.trim();

  let valid = true;
  const eN = document.getElementById("sc-e-name");
  const eL = document.getElementById("sc-e-location");

  if (!name) { eN?.classList.add("show"); document.getElementById("sc-f-name")?.classList.add("error"); valid = false; }
  else { eN?.classList.remove("show"); document.getElementById("sc-f-name")?.classList.remove("error"); }

  if (!location) { eL?.classList.add("show"); document.getElementById("sc-f-location")?.classList.add("error"); valid = false; }
  else { eL?.classList.remove("show"); document.getElementById("sc-f-location")?.classList.remove("error"); }

  if (!valid) return;

  if (scModal.type === "edit" && scSelected) {
    try {
      await updateScenario(scSelected.id, { name, location }); // PUT /scenario/:id
      const idx = SP_SCENARIOS.findIndex((s) => s.id === scSelected.id);
      SP_SCENARIOS[idx] = { ...SP_SCENARIOS[idx], name, location };
      toast("success", "Escenario actualizado correctamente.");
    } catch (err) {
      toast("error", err.message || "Error al actualizar el escenario.");
      return;
    }
  } else {
    try {
      const created = await createScenario({ name, location }); // POST /scenario
      SP_SCENARIOS.push({ id: created?.id || genId("sc"), name, location });
      toast("success", "Escenario creado correctamente.");
    } catch (err) {
      toast("error", err.message || "Error al crear el escenario.");
      return;
    }
  }

  scModal = null;
  scSelected = null;
  renderScPage();
};

window.confirmDeleteScenario = async function () {
  if (!scSelected) return;
  const idToDelete   = scSelected.id;
  const nameToDelete = scSelected.name;
  try {
    await deleteScenario(idToDelete); // DELETE /scenario/:id
    SP_SCENARIOS = SP_SCENARIOS.filter((s) => s.id !== idToDelete);
    toast("success", `"${nameToDelete}" eliminado.`);
    scModal = null;
    scSelected = null;
    renderScPage();
  } catch (err) {
    toast("error", err.message || "Error al eliminar el escenario.");
  }
};

window.onScSearch = function (val) {
  scSearch = val.toLowerCase();
  const wrapper = document.getElementById("sc-cards-wrapper");
  if (wrapper) { wrapper.innerHTML = renderScCards(getFilteredScenarios()); return; }
  renderScPage();
};

export async function initScenarios() {
  scSearch  = "";
  scModal   = null;
  scSelected = null;
  // Cargamos escenarios Y espacios en paralelo — los espacios los necesitamos
  // para saber cuáles pertenecen a cada escenario y mostrarlos dentro de la tarjeta
  try {
    const [scenarios, spaces] = await Promise.all([getScenarios(), getSpaces()]);
    SP_SCENARIOS = (scenarios || []).map((sc) => ({ id: sc.id, name: sc.name, location: sc.location || '' }));
    SP_SPACES    = (spaces    || []).map((sp) => ({
      id:          sp.id,
      name:        sp.name,
      description: sp.description || '',
      status:      sp.status === 'active' ? 'activo' : sp.status === 'inactive' ? 'inactivo' : 'activo',
      scenario_id: sp.scenarioId  || sp.scenario_id || '',
    }));
  } catch {
    toast("error", "No se pudieron cargar los datos del servidor.");
  }
  renderScPage();
}
