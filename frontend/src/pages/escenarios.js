// src/pages/escenarios.js
// Página de administración de escenarios deportivos.
// Permite ver, crear, editar y eliminar escenarios.
// Cada tarjeta muestra los espacios que pertenecen al escenario.

import Sidebar from "../components/sidebar.js";
import Navbar  from "../components/navbar.js";
import { toast } from "../utils/toast.js";
import {
  getScenarios, createScenario, updateScenario, deleteScenario,
  getSpaces,
} from "../services/api.js";

// ─── Estilos ───────────────────────────────────────────────────────────────────
if (!document.getElementById("esc-style")) {
  const s = document.createElement("style");
  s.id = "esc-style";
  s.textContent = `
    .esc-cards { display:grid;grid-template-columns:1fr;gap:1rem; }
    .esc-card  { background:#fff;border-radius:1rem;border:1px solid #e2e8f0;overflow:hidden;transition:box-shadow 0.2s,transform 0.15s;box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    .esc-card:hover { box-shadow:0 8px 24px -4px rgba(0,0,0,0.1);transform:translateY(-2px); }
    .esc-modal-backdrop { position:fixed;inset:0;background:rgba(15,23,42,0.55);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;animation:escFadeIn 0.2s ease; }
    .esc-modal-box { background:#fff;border-radius:1rem;width:100%;max-width:32rem;max-height:90vh;overflow-y:auto;box-shadow:0 24px 48px -8px rgba(0,0,0,0.2);animation:escSlideUp 0.25s cubic-bezier(0.22,1,0.36,1); }
    .esc-modal-header { padding:1.25rem 1.5rem 1rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f1f5f9;position:sticky;top:0;background:#fff;z-index:1; }
    .esc-modal-body { padding:1.5rem;display:flex;flex-direction:column;gap:1rem; }
    .esc-form-group { display:flex;flex-direction:column;gap:0.4rem; }
    .esc-form-label { font-size:0.8375rem;font-weight:600;color:#1e293b; }
    .esc-form-input { width:100%;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#f8fafc;padding:0.7rem 1rem;font-size:0.875rem;color:#1e293b;font-family:inherit;outline:none;transition:border-color 0.2s,box-shadow 0.2s;box-sizing:border-box; }
    .esc-form-input:focus { border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.12);background:#fff; }
    .esc-form-input.error { border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
    .esc-form-err { display:none;color:#ef4444;font-size:0.75rem;margin:0; }
    .esc-form-err.show { display:flex;align-items:center;gap:0.25rem; }
    .esc-action-btn { display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:0.5rem;border:none;cursor:pointer;transition:background 0.15s;background:transparent; }
    @keyframes escFadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes escSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @media (min-width:769px) {
      .esc-cards { grid-template-columns:repeat(auto-fill,minmax(22rem,1fr)); }
    }
  `;
  document.head.appendChild(s);
}

// ─── Estado del módulo ────────────────────────────────────────────────────────
// Listas cargadas desde el backend
let ESC_SCENARIOS = [];
let ESC_SPACES    = [];

// Estado de la UI
let escSearch   = "";
let escModal    = null;   // { type: 'create'|'edit'|'delete' }
let escSelected = null;   // escenario actualmente seleccionado para editar/eliminar

// Paleta de colores para las tarjetas
const ESC_COLORS = [
  { top: "#7c3aed" },
  { top: "#0369a1" },
  { top: "#0d9488" },
  { top: "#be185d" },
  { top: "#d97706" },
  { top: "#2563eb" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Devuelve los escenarios que coinciden con la búsqueda
function getFiltered() {
  const q = escSearch.toLowerCase();
  return ESC_SCENARIOS.filter(
    (sc) => sc.name.toLowerCase().includes(q) || sc.location.toLowerCase().includes(q)
  );
}

// Devuelve los espacios que pertenecen a un escenario
function spacesOf(scenarioId) {
  return ESC_SPACES.filter((sp) => sp.scenario_id === scenarioId);
}

// ─── Renderizado ──────────────────────────────────────────────────────────────

function renderEmpty() {
  return `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 1rem;text-align:center;gap:1rem;">
    <div style="width:3.5rem;height:3.5rem;border-radius:1rem;background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
      <svg fill="none" stroke="#94a3b8" viewBox="0 0 24 24" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
    </div>
    <div>
      <p style="font-size:1rem;font-weight:700;color:#1e293b;margin:0 0 0.25rem;">Sin escenarios</p>
      <p style="font-size:0.875rem;color:#94a3b8;margin:0;">Crea el primer escenario deportivo.</p>
    </div>
    <button onclick="window.escOpenModal('create')" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1.25rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Crear Escenario
    </button>
  </div>`;
}

function renderCards(scenarios) {
  if (!scenarios.length) return renderEmpty();
  return `<div class="esc-cards">${scenarios.map((sc, i) => {
    const spaces = spacesOf(sc.id);
    const count  = spaces.length;
    const { top } = ESC_COLORS[i % ESC_COLORS.length];
    return `
    <div class="esc-card">
      <!-- Barra de color superior -->
      <div style="height:0.3rem;background:${top};"></div>
      <div style="padding:1.125rem 1.25rem;">

        <!-- Fila superior: ícono + nombre | botones -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;">
          <div style="display:flex;align-items:center;gap:0.625rem;min-width:0;">
            <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:${top}1a;border:1px solid ${top}33;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg fill="none" stroke="${top}" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div style="min-width:0;">
              <p style="font-weight:700;color:#1e293b;font-size:0.9rem;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${sc.name}</p>
              <p style="color:#94a3b8;font-size:0.775rem;margin:0;display:flex;align-items:center;gap:0.25rem;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="11" height="11"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                ${sc.location || "—"}
              </p>
            </div>
          </div>
          <!-- Botones editar y eliminar -->
          <div style="display:flex;gap:0.25rem;flex-shrink:0;">
            <button class="esc-action-btn" title="Editar" style="color:#2563eb;"
              onclick="window.escOpenModal('edit','${sc.id}')"
              onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="esc-action-btn" title="Eliminar" style="color:#ef4444;"
              onclick="window.escOpenModal('delete','${sc.id}')"
              onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <!-- Espacios que pertenecen a este escenario -->
        <div style="padding-top:0.75rem;border-top:1px solid #f1f5f9;">
          <p style="font-size:0.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 0.5rem;display:flex;align-items:center;gap:0.35rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <strong style="color:${top};">${count}</strong>&nbsp;${count === 1 ? "espacio" : "espacios"}
          </p>
          ${count === 0
            ? `<p style="font-size:0.8rem;color:#cbd5e1;margin:0;font-style:italic;">Sin espacios registrados aún.</p>`
            : `<div style="display:flex;flex-direction:column;gap:0.3rem;">
                ${spaces.map((sp) => {
                  const isActive = sp.status === "activo";
                  return `
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:0.375rem 0.625rem;background:#f8fafc;border-radius:0.5rem;border:1px solid #f1f5f9;">
                    <span style="font-size:0.8125rem;font-weight:600;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${sp.name}</span>
                    <span style="flex-shrink:0;margin-left:0.5rem;font-size:0.7rem;font-weight:600;padding:0.15rem 0.5rem;border-radius:9999px;
                      background:${isActive ? "#f0fdf4" : "#f1f5f9"};
                      color:${isActive ? "#16a34a" : "#94a3b8"};">
                      ${isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>`;
                }).join("")}
              </div>`
          }
        </div>

      </div>
    </div>`;
  }).join("")}</div>`;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function buildModal() {
  if (!escModal) return "";
  const { type } = escModal;
  const sc = escSelected;

  // Modal de confirmación de eliminación
  if (type === "delete") {
    if (!sc) { escModal = null; return ""; } // guard: si no hay escenario seleccionado
    const count = spacesOf(sc.id).length;
    return `
    <div class="esc-modal-backdrop" onclick="if(event.target===this)window.escCloseModal()">
      <div class="esc-modal-box" style="max-width:26rem;">
        <div class="esc-modal-header">
          <h3 style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;">Eliminar escenario</h3>
          <button onclick="window.escCloseModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.375rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="esc-modal-body">
          ${count > 0 ? `
          <div style="display:flex;gap:0.875rem;align-items:flex-start;padding:1rem;background:#fefce8;border-radius:0.75rem;border:1px solid #fef08a;">
            <svg fill="none" stroke="#ca8a04" viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0;margin-top:0.1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <p style="color:#a16207;font-size:0.8125rem;margin:0;font-weight:500;">
              Este escenario tiene <strong>${count} ${count === 1 ? "espacio" : "espacios"}</strong> asociados.
              Los espacios no se eliminarán pero quedarán sin escenario asignado.
            </p>
          </div>` : ""}
          <div style="display:flex;gap:0.875rem;align-items:flex-start;padding:1rem;background:#fef2f2;border-radius:0.75rem;border:1px solid #fecaca;">
            <svg fill="none" stroke="#dc2626" viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0;margin-top:0.1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <div>
              <p style="font-weight:700;color:#dc2626;margin:0 0 0.25rem;font-size:0.875rem;">¿Eliminar "${sc.name}"?</p>
              <p style="color:#ef4444;font-size:0.8125rem;margin:0;">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
            <button onclick="window.escCloseModal()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;color:#475569;font-family:inherit;">Cancelar</button>
            <button onclick="window.escConfirmDelete()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:none;background:#dc2626;color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">Eliminar</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  // Modal de crear o editar escenario
  const isEdit = type === "edit";
  if (isEdit && !sc) { escModal = null; return ""; } // guard

  return `
  <div class="esc-modal-backdrop" onclick="if(event.target===this)window.escCloseModal()">
    <div class="esc-modal-box">
      <div class="esc-modal-header">
        <h3 style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;">${isEdit ? "Editar escenario" : "Crear escenario"}</h3>
        <button onclick="window.escCloseModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.375rem;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="esc-modal-body">
        <div class="esc-form-group">
          <label class="esc-form-label">Nombre del escenario *</label>
          <input id="esc-f-name" class="esc-form-input" type="text"
            placeholder="Ej: Unidad Deportiva Norte"
            value="${isEdit ? sc.name : ""}" />
          <p class="esc-form-err" id="esc-e-name">⚠ Este campo es requerido.</p>
        </div>
        <div class="esc-form-group">
          <label class="esc-form-label">Ubicación *</label>
          <input id="esc-f-location" class="esc-form-input" type="text"
            placeholder="Ej: Medellín, Laureles"
            value="${isEdit ? sc.location : ""}" />
          <p class="esc-form-err" id="esc-e-location">⚠ Este campo es requerido.</p>
        </div>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;padding-top:0.5rem;">
          <button onclick="window.escCloseModal()" style="padding:0.6rem 1.25rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;color:#475569;font-family:inherit;">
            Cancelar
          </button>
          <button onclick="window.escSave()" style="padding:0.6rem 1.5rem;border-radius:0.625rem;border:none;background:#2563eb;color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;">
            ${isEdit ? "Guardar cambios" : "Crear escenario"}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── Función que dibuja la página completa ────────────────────────────────────

function renderPage() {
  const scenarios = getFiltered();
  document.getElementById("app").innerHTML = `
  <div class="flex w-full min-h-screen">
    ${Sidebar()}
    <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
      ${Navbar()}
      <main style="flex:1;overflow-y:auto;background:#f8fafc;padding:1.5rem;">

        <!-- Header de la página -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
          <div>
            <h1 style="font-size:1.5rem;font-weight:800;color:#1e293b;margin:0 0 0.25rem;">Administrar Escenarios</h1>
            <p style="color:#64748b;font-size:0.875rem;margin:0;">Gestiona los escenarios deportivos y los espacios que contienen</p>
          </div>
          <button onclick="window.escOpenModal('create')"
            style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.25rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;box-shadow:0 2px 8px rgba(37,99,235,0.3);">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Crear Escenario
          </button>
        </div>

        <!-- Tarjetas de estadísticas rápidas -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:0.75rem;margin-bottom:1.5rem;">
          ${[
            { label: "Escenarios",    value: ESC_SCENARIOS.length, color: "#7c3aed", bg: "#f5f3ff" },
            { label: "Total espacios", value: ESC_SPACES.length,    color: "#2563eb", bg: "#eff6ff" },
          ].map((s) => `
            <div style="background:#fff;border-radius:0.75rem;border:1px solid #e2e8f0;padding:0.875rem 1rem;">
              <p style="font-size:1.375rem;font-weight:800;color:${s.color};margin:0 0 0.125rem;">${s.value}</p>
              <p style="font-size:0.75rem;font-weight:600;color:#64748b;margin:0;">${s.label}</p>
            </div>`).join("")}
        </div>

        <!-- Buscador -->
        <div style="background:#fff;border-radius:0.875rem;border:1px solid #e2e8f0;padding:0.875rem 1rem;margin-bottom:1.25rem;">
          <div style="position:relative;">
            <svg fill="none" stroke="#94a3b8" viewBox="0 0 24 24" width="16" height="16"
              style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);pointer-events:none;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder="Buscar por nombre o ubicación..."
              value="${escSearch}"
              oninput="window.escOnSearch(this.value)"
              style="width:100%;padding:0.6rem 1rem 0.6rem 2.5rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;font-size:0.875rem;color:#1e293b;font-family:inherit;outline:none;background:#f8fafc;box-sizing:border-box;transition:border-color 0.2s;"
              onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'" />
          </div>
        </div>

        <!-- Tarjetas de escenarios -->
        ${renderCards(scenarios)}

      </main>
    </div>
  </div>
  ${buildModal()}`;
}

// ─── Handlers globales (los llama el HTML con window.*) ──────────────────────

// Abre el modal según el tipo: 'create', 'edit' o 'delete'
window.escOpenModal = function (type, id = null) {
  // Si se pasa un id, buscamos el escenario en nuestra lista local
  escSelected = id ? ESC_SCENARIOS.find((sc) => sc.id === id) || null : null;
  escModal = { type };
  renderPage();
};

window.escCloseModal = function () {
  escModal    = null;
  escSelected = null;
  renderPage();
};

// Guarda los datos del formulario → POST /scenario (crear) o PUT /scenario/:id (editar)
window.escSave = async function () {
  const name     = document.getElementById("esc-f-name")?.value.trim();
  const location = document.getElementById("esc-f-location")?.value.trim();

  // Validación
  let valid = true;
  if (!name) {
    document.getElementById("esc-e-name")?.classList.add("show");
    document.getElementById("esc-f-name")?.classList.add("error");
    valid = false;
  } else {
    document.getElementById("esc-e-name")?.classList.remove("show");
    document.getElementById("esc-f-name")?.classList.remove("error");
  }
  if (!location) {
    document.getElementById("esc-e-location")?.classList.add("show");
    document.getElementById("esc-f-location")?.classList.add("error");
    valid = false;
  } else {
    document.getElementById("esc-e-location")?.classList.remove("show");
    document.getElementById("esc-f-location")?.classList.remove("error");
  }
  if (!valid) return;

  if (escModal?.type === "edit" && escSelected) {
    // ── Editar → PUT /scenario/:id ──────────────────────────────────────────
    try {
      await updateScenario(escSelected.id, { name, location });
      const idx = ESC_SCENARIOS.findIndex((sc) => sc.id === escSelected.id);
      ESC_SCENARIOS[idx] = { ...ESC_SCENARIOS[idx], name, location };
      toast("success", "Escenario actualizado correctamente.");
    } catch (err) {
      toast("error", err.message || "Error al actualizar el escenario.");
      return;
    }
  } else {
    // ── Crear → POST /scenario ──────────────────────────────────────────────
    try {
      const created = await createScenario({ name, location });
      // El backend devuelve el nuevo escenario con su id — lo añadimos a la lista
      ESC_SCENARIOS.push({ id: created?.id, name, location });
      toast("success", "Escenario creado correctamente.");
    } catch (err) {
      toast("error", err.message || "Error al crear el escenario.");
      return;
    }
  }

  escModal    = null;
  escSelected = null;
  renderPage();
};

// Confirma la eliminación → DELETE /scenario/:id
window.escConfirmDelete = async function () {
  if (!escSelected) return;
  const { id, name } = escSelected;
  try {
    await deleteScenario(id); // DELETE /scenario/:id
    ESC_SCENARIOS = ESC_SCENARIOS.filter((sc) => sc.id !== id);
    toast("success", `"${name}" eliminado correctamente.`);
    escModal    = null;
    escSelected = null;
    renderPage();
  } catch (err) {
    toast("error", err.message || "Error al eliminar el escenario.");
  }
};

// Filtra las tarjetas mientras el usuario escribe en el buscador
window.escOnSearch = function (val) {
  escSearch = val.toLowerCase();
  renderPage();
};

// ─── Función de inicialización (la llama el router) ──────────────────────────
export async function initEscenarios() {
  // Reseteamos el estado local al entrar a la página
  escSearch   = "";
  escModal    = null;
  escSelected = null;

  // Cargamos escenarios y espacios en paralelo desde el backend
  try {
    const [scenarios, spaces] = await Promise.all([getScenarios(), getSpaces()]);

    // Mapeamos al formato interno del frontend
    ESC_SCENARIOS = (scenarios || []).map((sc) => ({
      id:       sc.id,
      name:     sc.name,
      location: sc.location || "",
    }));

    // Los espacios los necesitamos solo para mostrarlos dentro de cada tarjeta
    ESC_SPACES = (spaces || []).map((sp) => ({
      id:          sp.id,
      name:        sp.name,
      status:      sp.status === 'active' ? 'activo' : sp.status === 'inactive' ? 'inactivo' : 'activo',
      scenario_id: sp.scenarioId || sp.scenario_id || "",
    }));
  } catch (err) {
    toast("error", "No se pudieron cargar los datos del servidor.");
  }

  renderPage();
}
