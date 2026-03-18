import { getUsers, createUser, deleteUser, getDepartments } from "../services/api.js";
import Sidebar from "../components/sidebar.js";
import Navbar  from "../components/navbar.js";

// ── Module state ──────────────────────────────────────────────────────────────
let USU_USERS = [];

// ── Solicitudes (mock — no API endpoint yet) ──────────────────────────────────
const requests = [
  { id: 1, name: "Sebastián Torres", email: "sebastian.torres@itagui.gov.co", subgerencia: "recreacion",         date: "15 de mar 2026", initials: "ST", color: "#8b5cf6" },
  { id: 2, name: "Valentina Ríos",   email: "valentina.rios@itagui.gov.co",   subgerencia: "actividad-fisica",   date: "14 de mar 2026", initials: "VR", color: "#ec4899" },
  { id: 3, name: "Felipe Morales",   email: "felipe.morales@itagui.gov.co",   subgerencia: "eventos-culturales", date: "13 de mar 2026", initials: "FM", color: "#14b8a6" },
];

const SUB_LABEL = {
  "recreacion":         "Recreación y Deporte",
  "actividad-fisica":   "Actividad Física",
  "eventos-culturales": "Eventos Culturales",
};
const SUB_COLOR = {
  "recreacion":         { bg: "#ede9fe", text: "#6d28d9" },
  "actividad-fisica":   { bg: "#dcfce7", text: "#15803d" },
  "eventos-culturales": { bg: "#fff7ed", text: "#c2410c" },
};

// ── Avatar helpers ────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#6366f1","#22c55e","#f97316","#ec4899","#14b8a6","#8b5cf6","#0ea5e9"];

function nameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0x7FFFFFFF;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

// ── Badge renderers ───────────────────────────────────────────────────────────
function statusBadge(isActive) {
  return isActive
    ? `<span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Activo</span>`
    : `<span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Inactivo</span>`;
}

function subBadge(key) {
  const c = SUB_COLOR[key] || { bg: "#f1f5f9", text: "#475569" };
  return `<span style="background:${c.bg};color:${c.text};" class="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">${SUB_LABEL[key] || key}</span>`;
}

// ── Row builder ───────────────────────────────────────────────────────────────
function renderUserRows() {
  if (USU_USERS.length === 0) {
    return `<tr><td colspan="7" class="text-center py-10 text-textSecondary text-sm">No hay usuarios registrados.</td></tr>`;
  }
  return USU_USERS.map((u, i) => {
    const color    = nameColor(u.name);
    const inits    = getInitials(u.name);
    const roleText = u.role_id ? u.role_id.slice(0, 8) + "…" : "—";
    const safeName = u.name.replace(/'/g, "\\'");
    return `
      <tr data-user-row data-name="${u.name.toLowerCase()}" data-email="${u.email.toLowerCase()}"
          data-status="${u.is_active ? 'activo' : 'inactivo'}"
          class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td class="px-4 py-3">
          <div class="flex items-center gap-2.5">
            <div style="background:${color}18;color:${color};border:1.5px solid ${color}40;"
                 class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">${inits}</div>
            <span class="font-semibold text-textPrimary text-sm">${u.name}</span>
          </div>
        </td>
        <td class="px-4 py-3 text-textSecondary text-sm">${u.email}</td>
        <td class="px-4 py-3 text-textSecondary text-sm">${u.phone_number || "—"}</td>
        <td class="px-4 py-3">
          <span title="${u.role_id || ''}"
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 font-mono whitespace-nowrap">${roleText}</span>
        </td>
        <td class="px-4 py-3">${statusBadge(u.is_active)}</td>
        <td class="px-4 py-3 text-neutral text-xs">
          <span class="flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${formatDate(u.created_at)}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="flex gap-1.5 justify-end">
            <button onclick="if(confirm('¿Eliminar a ${safeName}?'))window.usu_deleteUser(${i})" title="Eliminar"
              class="bg-red-50 hover:bg-red-100 rounded-lg p-1.5 text-danger transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
  }).join("");
}

// ── Solicitudes cards (built once, mock data) ─────────────────────────────────
const reqCards = requests.map(r => `
  <div data-req-id="${r.id}" data-sub="${r.subgerencia}"
       data-name="${r.name.toLowerCase()}" data-email="${r.email.toLowerCase()}"
       class="bg-white border border-borderSubtle rounded-2xl px-5 py-4 flex items-center gap-3.5 hover:shadow-md transition-shadow">
    <div style="background:${r.color}18;color:${r.color};border:1.5px solid ${r.color}40;"
         class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">${r.initials}</div>
    <div class="flex-1 min-w-0">
      <p class="font-bold text-textPrimary text-sm mb-0.5">${r.name}</p>
      <p class="text-textSecondary text-xs mb-2">${r.email}</p>
      <div class="flex items-center gap-2 flex-wrap">
        ${subBadge(r.subgerencia)}
        <span class="text-neutral text-xs">|</span>
        <span class="text-neutral text-xs flex items-center gap-1">
          <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${r.date}
        </span>
      </div>
    </div>
    <div class="flex flex-col gap-2 flex-shrink-0">
      <button onclick="window.usu_openModal('${r.id}','${r.name.replace(/'/g, "\\'")}','${r.email}','${r.subgerencia}')"
        class="bg-grn hover:bg-secGrn text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        Aceptar
      </button>
      <button onclick="window.usu_reject('${r.id}','${r.name.replace(/'/g, "\\'")}',this)"
        class="bg-red-50 hover:bg-red-100 text-danger border border-red-200 rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Rechazar
      </button>
    </div>
  </div>`).join("");

// ── Main init ─────────────────────────────────────────────────────────────────
export async function initUsuarios() {

  // 1. Render skeleton
  document.querySelector("#app").innerHTML = `
    <div class="flex h-screen overflow-hidden">
      ${Sidebar()}

      <div class="flex-1 flex flex-col overflow-hidden">
        ${Navbar()}

        <main class="flex-1 overflow-y-auto bg-gray-50 px-9 py-8">

          <style>
            .usu-tab { padding:9px 18px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;background:transparent;color:#64748b;transition:all .18s; }
            .usu-tab.on { background:#2965EB;color:#fff;box-shadow:0 3px 10px rgba(41,101,235,.25); }
            #usu-overlay,#usu-create-overlay { display:none;position:fixed;inset:0;z-index:9000;background:rgba(15,23,42,.45);backdrop-filter:blur(5px);align-items:center;justify-content:center; }
            #usu-overlay.show,#usu-create-overlay.show { display:flex; }
            #usu-mbox,#usu-create-box { background:#fff;border-radius:18px;padding:32px;width:100%;max-width:450px;box-shadow:0 20px 60px rgba(0,0,0,.18);animation:mboxIn .22s cubic-bezier(.34,1.56,.64,1); }
            @keyframes mboxIn { from{opacity:0;transform:scale(.93) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
            #usu-toast { display:none;position:fixed;bottom:24px;right:24px;z-index:9999;background:#171F30;color:#fff;border-radius:11px;padding:13px 18px;font-size:13px;font-weight:600;max-width:380px;line-height:1.4;box-shadow:0 8px 28px rgba(0,0,0,.22); }
          </style>

          <div id="usu">

            <!-- Encabezado -->
            <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 class="text-2xl font-extrabold text-textPrimary">Gestión de Usuarios</h1>
                <p class="text-sm text-textSecondary mt-0.5">
                  <span id="usu-count">…</span> usuarios registrados &nbsp;·&nbsp;
                  <span id="usu-req-n">${requests.length}</span> solicitudes pendientes
                </p>
              </div>
              <button onclick="window.usu_openCreateModal()"
                class="bg-focus hover:bg-main text-white rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2 shadow-md transition-colors">
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Crear Usuario
              </button>
            </div>

            <!-- Tabs -->
            <div class="inline-flex gap-1 bg-white border border-borderSubtle rounded-xl p-1.5 mb-5">
              <button id="usu-t1" class="usu-tab on" onclick="window.usu_tab('usuarios')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Usuarios
              </button>
              <button id="usu-t2" class="usu-tab" onclick="window.usu_tab('solicitudes')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                Solicitudes
                <span class="bg-danger text-white rounded-full px-1.5 text-[11px] font-bold leading-[18px]" id="usu-badge">${requests.length}</span>
              </button>
            </div>

            <!-- Panel: Usuarios -->
            <div id="usu-p1">
              <div class="flex gap-2.5 mb-4 flex-wrap">
                <div class="relative flex-1 min-w-[200px]">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input id="usu-usearch" placeholder="Buscar por nombre o correo..."
                    class="w-full pl-9 pr-3 py-2.5 border border-borderSubtle rounded-xl text-sm text-textPrimary bg-white focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
                    oninput="window.usu_filterUsers()">
                </div>
                <select id="usu-ustatus"
                  class="border border-borderSubtle rounded-xl px-3 py-2.5 text-sm text-textSecondary bg-white focus:outline-none focus:ring-2 focus:ring-focus"
                  onchange="window.usu_filterUsers()">
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div class="bg-white border border-borderSubtle rounded-2xl overflow-hidden shadow-sm">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gray-50 border-b border-borderSubtle">
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Nombre</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Correo</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Teléfono</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Rol</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Estado</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Creado</th>
                      <th class="px-4 py-3 text-right text-[11px] font-bold text-textSecondary uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="usu-tbody">
                    <tr><td colspan="7" class="text-center py-10 text-textSecondary text-sm">Cargando usuarios…</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Panel: Solicitudes -->
            <div id="usu-p2" style="display:none;">
              <div class="bg-white border border-borderSubtle rounded-2xl overflow-hidden shadow-sm">

                <div class="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                  <div class="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" fill="none" stroke="#2965EB" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                  </div>
                  <div>
                    <p class="font-bold text-textPrimary">Solicitudes de Acceso Pendientes</p>
                    <p class="text-xs text-neutral mt-0.5">Revisa, aprueba o rechaza cada solicitud. Al aceptar se generan las credenciales.</p>
                  </div>
                </div>

                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex gap-2.5 flex-wrap">
                  <div class="relative flex-1 min-w-[200px]">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input id="usu-rsearch" placeholder="Buscar por nombre o correo..."
                      class="w-full pl-9 pr-3 py-2.5 border border-borderSubtle rounded-xl text-sm text-textPrimary bg-white focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
                      oninput="window.usu_filterReqs()">
                  </div>
                  <select id="usu-rsub"
                    class="border border-borderSubtle rounded-xl px-3 py-2.5 text-sm text-textSecondary bg-white focus:outline-none focus:ring-2 focus:ring-focus"
                    onchange="window.usu_filterReqs()">
                    <option value="">Todas las subgerencias</option>
                    <option value="recreacion">Recreación y Deporte</option>
                    <option value="actividad-fisica">Actividad Física</option>
                    <option value="eventos-culturales">Eventos Culturales</option>
                  </select>
                </div>

                <div id="usu-rlist" class="px-6 py-5 flex flex-col gap-3">
                  ${reqCards}
                </div>

                <div id="usu-rempty" class="hidden text-center py-12 text-neutral">
                  <svg width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="mx-auto mb-2.5 opacity-30"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <p class="text-sm font-medium">No hay solicitudes que coincidan</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>

    <!-- Modal: Aprobar solicitud -->
    <div id="usu-overlay" onclick="window.usu_overlayClick(event, this)">
      <div id="usu-mbox">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="19" height="19" fill="none" stroke="#16a34a" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <p class="text-lg font-extrabold text-textPrimary">Aprobar Solicitud</p>
            <p id="usu-msub" class="text-xs text-textSecondary mt-0.5">Asignar credenciales al solicitante</p>
          </div>
        </div>

        <div class="mb-3.5">
          <label class="text-xs font-semibold text-gray-700 block mb-1.5">Subgerencia solicitada</label>
          <div id="usu-msub-badge" class="px-3 py-2 bg-gray-50 border border-borderSubtle rounded-xl text-sm text-textSecondary"></div>
        </div>

        <div class="mb-3.5">
          <label class="text-xs font-semibold text-gray-700 block mb-1.5">Correo electrónico</label>
          <input id="usu-memail" readonly
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-gray-50 text-textSecondary focus:outline-none">
        </div>

        <div class="mb-3.5">
          <label class="text-xs font-semibold text-gray-700 block mb-1.5">Rol asignado</label>
          <select id="usu-mrole"
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer">
            <option value="event_creator">Creador de Eventos</option>
            <option value="visualizer">Visualizador</option>
            <option value="admin_spa">Admin de Espacio</option>
            <option value="admin_gen">Admin General</option>
          </select>
        </div>

        <div class="mb-5">
          <label class="text-xs font-semibold text-gray-700 block mb-1.5">Contraseña temporal</label>
          <div class="relative">
            <input id="usu-mpwd" readonly
              class="w-full px-3 py-2.5 pr-10 border border-borderSubtle rounded-xl text-sm bg-gray-50 font-mono tracking-wider text-textSecondary focus:outline-none">
            <button onclick="document.getElementById('usu-mpwd').value=window.usu_pwd()" title="Regenerar"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral hover:text-focus transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
          </div>
        </div>

        <div class="flex gap-2.5">
          <button onclick="window.usu_closeModal()"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-textSecondary rounded-xl py-2.5 text-sm font-semibold transition-colors">
            Cancelar
          </button>
          <button onclick="window.usu_confirm()"
            class="flex-[2] bg-grn hover:bg-secGrn text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Aprobar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Crear Usuario -->
    <div id="usu-create-overlay" onclick="if(event.target===this)window.usu_closeCreateModal()">
      <div id="usu-create-box">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="19" height="19" fill="none" stroke="#2965EB" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <div>
            <p class="text-lg font-extrabold text-textPrimary">Crear Usuario</p>
            <p class="text-xs text-textSecondary mt-0.5">Completa todos los campos para crear la cuenta</p>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <input id="usu-cname" placeholder="Nombre completo *" type="text"
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-focus">
          <input id="usu-cemail" placeholder="Correo electrónico *" type="email"
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-focus">
          <input id="usu-cphone" placeholder="Teléfono *" type="text"
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-focus">
          <input id="usu-cpassword" placeholder="Contraseña *" type="password"
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-focus">
          <select id="usu-cdeptid"
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer">
            <option value="">Cargando departamentos…</option>
          </select>
          <select id="usu-crole"
            class="w-full px-3 py-2.5 border border-borderSubtle rounded-xl text-sm bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer">
            <option value="">Seleccionar rol *</option>
            <option value="admin_gen">Administrador General</option>
            <option value="admin_spa">Administrador de Espacio</option>
            <option value="event_creator">Creador de Eventos</option>
            <option value="visualizer">Visualizador</option>
          </select>
        </div>

        <div class="flex gap-2.5 mt-5">
          <button onclick="window.usu_closeCreateModal()"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-textSecondary rounded-xl py-2.5 text-sm font-semibold transition-colors">
            Cancelar
          </button>
          <button onclick="window.usu_submitCreate()"
            class="flex-[2] bg-focus hover:bg-main text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Crear Usuario
          </button>
        </div>
      </div>
    </div>

    <div id="usu-toast"></div>
  `;

  // 2. Define window functions
  window.usu_tab = function(t) {
    const isU = t === "usuarios";
    document.getElementById("usu-p1").style.display = isU ? "block" : "none";
    document.getElementById("usu-p2").style.display = isU ? "none"  : "block";
    document.getElementById("usu-t1").className = "usu-tab" + (isU  ? " on" : "");
    document.getElementById("usu-t2").className = "usu-tab" + (!isU ? " on" : "");
  };

  window.usu_filterUsers = function() {
    const q      = (document.getElementById("usu-usearch").value || "").toLowerCase();
    const status = document.getElementById("usu-ustatus").value;
    document.querySelectorAll("#usu-tbody tr[data-user-row]").forEach(r => {
      const matchQ      = !q      || r.dataset.name.includes(q) || r.dataset.email.includes(q);
      const matchStatus = !status || r.dataset.status === status;
      r.style.display = (matchQ && matchStatus) ? "" : "none";
    });
  };

  window.usu_filterReqs = function() {
    const q   = (document.getElementById("usu-rsearch").value || "").toLowerCase();
    const sub = document.getElementById("usu-rsub").value;
    let vis = 0;
    document.querySelectorAll("#usu-rlist [data-req-id]").forEach(c => {
      const matchQ   = !q   || c.dataset.name.includes(q) || c.dataset.email.includes(q);
      const matchSub = !sub || c.dataset.sub === sub;
      const ok = matchQ && matchSub;
      c.style.display = ok ? "flex" : "none";
      if (ok) vis++;
    });
    document.getElementById("usu-rempty").style.display = vis === 0 ? "block" : "none";
  };

  window.usu_pwd = function() {
    const c = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    return Array.from({ length: 12 }, () => c[Math.floor(Math.random() * c.length)]).join("");
  };

  window._usu_id = null;

  window.usu_openModal = function(id, name, email, sub) {
    window._usu_id = id;
    document.getElementById("usu-msub").textContent     = "Aprobar acceso para " + name;
    document.getElementById("usu-msub-badge").textContent = SUB_LABEL[sub] || sub;
    document.getElementById("usu-memail").value = email;
    document.getElementById("usu-mpwd").value   = window.usu_pwd();
    document.getElementById("usu-overlay").classList.add("show");
  };

  window.usu_closeModal = function() {
    document.getElementById("usu-overlay").classList.remove("show");
    window._usu_id = null;
  };

  window.usu_confirm = function() {
    const email = document.getElementById("usu-memail").value;
    const role  = document.getElementById("usu-mrole").value;
    const card  = document.querySelector('[data-req-id="' + window._usu_id + '"]');
    if (card) card.remove();
    window.usu_updateBadge();
    window.usu_filterReqs();
    window.usu_closeModal();
    window.usu_toast("✅ Acceso aprobado — Credenciales enviadas a " + email + " · Rol: " + role);
  };

  window.usu_reject = function(_id, name, btn) {
    if (!confirm("¿Rechazar la solicitud de " + name + "? Esta acción no se puede deshacer.")) return;
    const card = btn.closest("[data-req-id]");
    if (card) card.remove();
    window.usu_updateBadge();
    window.usu_filterReqs();
    window.usu_toast("🚫 Solicitud de " + name + " rechazada.");
  };

  window.usu_updateBadge = function() {
    const n = document.querySelectorAll("#usu-rlist [data-req-id]").length;
    const b = document.getElementById("usu-badge");
    if (b) b.textContent = n > 0 ? n : "";
    const c = document.getElementById("usu-req-n");
    if (c) c.textContent = n;
  };

  window.usu_toast = function(msg) {
    const t = document.getElementById("usu-toast");
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.style.display = "none"; }, 5000);
  };

  window.usu_overlayClick = function(e, el) {
    if (e.target === el) window.usu_closeModal();
  };

  window.usu_deleteUser = async function(i) {
    const u = USU_USERS[i];
    if (!u) return;
    if (!u.id) {
      window.usu_toast("❌ Recarga la página — el ID del usuario no está disponible.");
      return;
    }
    try {
      await deleteUser(u.id);
      USU_USERS.splice(i, 1);
      document.getElementById("usu-tbody").innerHTML = renderUserRows();
      document.getElementById("usu-count").textContent = USU_USERS.length;
      window.usu_toast("✅ Usuario eliminado correctamente.");
    } catch (err) {
      window.usu_toast("❌ Error al eliminar: " + (err.message || "Error de red"));
    }
  };

  window.usu_openCreateModal = async function() {
    ["usu-cname","usu-cemail","usu-cphone","usu-cpassword"].forEach(id => {
      document.getElementById(id).value = "";
    });
    document.getElementById("usu-crole").value = "";

    const deptSelect = document.getElementById("usu-cdeptid");
    deptSelect.innerHTML = '<option value="">Cargando departamentos…</option>';
    document.getElementById("usu-create-overlay").classList.add("show");

    try {
      const departments = await getDepartments();
      deptSelect.innerHTML = '<option value="">Seleccionar departamento *</option>' +
        departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("");
    } catch {
      deptSelect.innerHTML = '<option value="">Error al cargar departamentos</option>';
    }
  };

  window.usu_closeCreateModal = function() {
    document.getElementById("usu-create-overlay").classList.remove("show");
  };

  window.usu_submitCreate = async function() {
    const name         = document.getElementById("usu-cname").value.trim();
    const email        = document.getElementById("usu-cemail").value.trim();
    const phone        = document.getElementById("usu-cphone").value.trim();
    const password     = document.getElementById("usu-cpassword").value;
    const departmentId = document.getElementById("usu-cdeptid").value.trim();
    const roleName     = document.getElementById("usu-crole").value;

    if (!name || !email || !phone || !password || !departmentId || !roleName) {
      window.usu_toast("⚠️ Completa todos los campos.");
      return;
    }

    try {
      const result = await createUser({ name, email, phone, password, departmentId, roleName });
      window.usu_closeCreateModal();
      window.usu_toast("✅ Usuario creado: " + (result.name || name));
      // Reload the list
      const data = await getUsers();
      USU_USERS = Array.isArray(data) ? data : [];
      document.getElementById("usu-tbody").innerHTML = renderUserRows();
      document.getElementById("usu-count").textContent = USU_USERS.length;
    } catch (err) {
      window.usu_toast("❌ Error al crear usuario: " + (err.message || "Error de red"));
    }
  };

  // 3. Load users from API
  try {
    const data = await getUsers();
    USU_USERS = Array.isArray(data) ? data : [];
    document.getElementById("usu-tbody").innerHTML = renderUserRows();
    document.getElementById("usu-count").textContent = USU_USERS.length;
  } catch (err) {
    window.usu_toast("❌ Error al cargar usuarios: " + (err.message || "Error de red"));
    document.getElementById("usu-tbody").innerHTML =
      `<tr><td colspan="7" class="text-center py-10 text-red-500 text-sm">Error al cargar usuarios. Intenta recargar.</td></tr>`;
    document.getElementById("usu-count").textContent = "0";
  }
}
