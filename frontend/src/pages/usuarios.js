import Sidebar from "../components/sidebar.js";
import Navbar from "../components/navbar.js";

export default function Usuarios() {

  const users = [
    { id: 1, name: "Carlos Martínez",  email: "carlos.martinez@itagui.gov.co",  role: "Administrador", status: "Activo",   lastAccess: "4 de mar 09:15 a. m.",  initials: "CM", color: "#6366f1", subgerencia: "recreacion" },
    { id: 2, name: "María López",      email: "maria.lopez@itagui.gov.co",      role: "Editor",        status: "Activo",   lastAccess: "3 de mar 04:42 p. m.",  initials: "ML", color: "#22c55e", subgerencia: "actividad-fisica" },
    { id: 3, name: "Andrés García",    email: "andres.garcia@itagui.gov.co",    role: "Supervisor",    status: "Activo",   lastAccess: "4 de mar 08:30 a. m.",  initials: "AG", color: "#f97316", subgerencia: "eventos-culturales" },
    { id: 4, name: "Laura Rodríguez",  email: "laura.rodriguez@itagui.gov.co",  role: "Editor",        status: "Activo",   lastAccess: "2 de mar 11:20 a. m.",  initials: "LR", color: "#22c55e", subgerencia: "recreacion" },
    { id: 5, name: "Jorge Hernández",  email: "jorge.hernandez@itagui.gov.co",  role: "Editor",        status: "Inactivo", lastAccess: "15 de feb 02:05 p. m.", initials: "JH", color: "#22c55e", subgerencia: "actividad-fisica" },
    { id: 6, name: "Diana Pérez",      email: "diana.perez@itagui.gov.co",      role: "Supervisor",    status: "Activo",   lastAccess: "1 de mar 10:00 a. m.",  initials: "DP", color: "#f97316", subgerencia: "eventos-culturales" },
  ];

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

  const ROLE_COLOR = {
    "Administrador": { bg: "#ede9fe", text: "#6d28d9", border: "#c4b5fd" },
    "Editor":        { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
    "Supervisor":    { bg: "#fef9c3", text: "#a16207", border: "#fde047" },
  };

  // ══════════ LÓGICA GLOBAL ══════════
  window.usu_tab = function(t) {
    const isU = t === "usuarios";
    document.getElementById("usu-p1").style.display = isU ? "block" : "none";
    document.getElementById("usu-p2").style.display = isU ? "none"  : "block";
    document.getElementById("usu-t1").className = "usu-tab" + (isU  ? " on" : "");
    document.getElementById("usu-t2").className = "usu-tab" + (!isU ? " on" : "");
  };

  window.usu_filterUsers = function() {
    const q    = (document.getElementById("usu-usearch").value || "").toLowerCase();
    const sub  = document.getElementById("usu-usub").value;
    const role = document.getElementById("usu-urole").value;
    document.querySelectorAll("#usu-tbody tr[data-user-row]").forEach(r => {
      const matchQ    = !q    || r.dataset.name.includes(q) || r.dataset.email.includes(q);
      const matchSub  = !sub  || r.dataset.sub  === sub;
      const matchRole = !role || r.dataset.role === role;
      r.style.display = (matchQ && matchSub && matchRole) ? "" : "none";
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
    document.getElementById("usu-msub").textContent  = "Aprobar acceso para " + name;
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

  // ══════════ BADGES ══════════
  function roleBadge(role) {
    const c = ROLE_COLOR[role] || { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };
    return `<span style="background:${c.bg};color:${c.text};border:1.5px solid ${c.border};" class="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">${role}</span>`;
  }

  function statusBadge(s) {
    const ok = s === "Activo";
    return `<span class="px-3 py-0.5 rounded-full text-xs font-semibold ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}">${s}</span>`;
  }

  function subBadge(key) {
    const c = SUB_COLOR[key] || { bg: "#f1f5f9", text: "#475569" };
    return `<span style="background:${c.bg};color:${c.text};" class="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">${SUB_LABEL[key] || key}</span>`;
  }

  // ══════════ FILAS DE TABLA ══════════
  const userRows = users.map(u => `
    <tr data-user-row data-name="${u.name.toLowerCase()}" data-email="${u.email.toLowerCase()}" data-role="${u.role}" data-sub="${u.subgerencia}"
        class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td class="px-4 py-3">
        <div class="flex items-center gap-2.5">
          <div style="background:${u.color}18;color:${u.color};border:1.5px solid ${u.color}40;"
               class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">${u.initials}</div>
          <span class="font-semibold text-textPrimary text-sm">${u.name}</span>
        </div>
      </td>
      <td class="px-4 py-3 text-textSecondary text-sm">${u.email}</td>
      <td class="px-4 py-3">${subBadge(u.subgerencia)}</td>
      <td class="px-4 py-3">${roleBadge(u.role)}</td>
      <td class="px-4 py-3">${statusBadge(u.status)}</td>
      <td class="px-4 py-3 text-neutral text-xs">
        <span class="flex items-center gap-1">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${u.lastAccess}
        </span>
      </td>
      <td class="px-4 py-3">
        <div class="flex gap-1.5 justify-end">
          <button onclick="alert('Editar: ${u.name}')" title="Editar"
            class="bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 text-textSecondary transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onclick="if(confirm('¿Eliminar a ${u.name}?'))this.closest('tr').remove()" title="Eliminar"
            class="bg-red-50 hover:bg-red-100 rounded-lg p-1.5 text-danger transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join("");

  // ══════════ TARJETAS DE SOLICITUDES ══════════
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

  // ══════════ RENDER PRINCIPAL ══════════
  return `
    <div class="flex h-screen overflow-hidden">
      ${Sidebar()}

      <div class="flex-1 flex flex-col overflow-hidden">
        ${Navbar()}

        <main class="flex-1 overflow-y-auto bg-gray-50 px-9 py-8">

          <style>
            .usu-tab { padding:9px 18px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;background:transparent;color:#64748b;transition:all .18s; }
            .usu-tab.on { background:#2965EB;color:#fff;box-shadow:0 3px 10px rgba(41,101,235,.25); }
            #usu-overlay { display:none;position:fixed;inset:0;z-index:9000;background:rgba(15,23,42,.45);backdrop-filter:blur(5px);align-items:center;justify-content:center; }
            #usu-overlay.show { display:flex; }
            #usu-mbox { background:#fff;border-radius:18px;padding:32px;width:100%;max-width:450px;box-shadow:0 20px 60px rgba(0,0,0,.18);animation:mboxIn .22s cubic-bezier(.34,1.56,.64,1); }
            @keyframes mboxIn { from{opacity:0;transform:scale(.93) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
            #usu-toast { display:none;position:fixed;bottom:24px;right:24px;z-index:9999;background:#171F30;color:#fff;border-radius:11px;padding:13px 18px;font-size:13px;font-weight:600;max-width:380px;line-height:1.4;box-shadow:0 8px 28px rgba(0,0,0,.22); }
          </style>

          <div id="usu">

            <!-- Encabezado -->
            <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 class="text-2xl font-extrabold text-textPrimary">Gestión de Usuarios</h1>
                <p class="text-sm text-textSecondary mt-0.5">
                  ${users.length} usuarios registrados &nbsp;·&nbsp;
                  <span id="usu-req-n">${requests.length}</span> solicitudes pendientes
                </p>
              </div>
              <button onclick="alert('Nuevo usuario')"
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
                <select id="usu-usub"
                  class="border border-borderSubtle rounded-xl px-3 py-2.5 text-sm text-textSecondary bg-white focus:outline-none focus:ring-2 focus:ring-focus"
                  onchange="window.usu_filterUsers()">
                  <option value="">Todas las subgerencias</option>
                  <option value="recreacion">Recreación y Deporte</option>
                  <option value="actividad-fisica">Actividad Física</option>
                  <option value="eventos-culturales">Eventos Culturales</option>
                </select>
                <select id="usu-urole"
                  class="border border-borderSubtle rounded-xl px-3 py-2.5 text-sm text-textSecondary bg-white focus:outline-none focus:ring-2 focus:ring-focus"
                  onchange="window.usu_filterUsers()">
                  <option value="">Todos los roles</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Editor">Editor</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div class="bg-white border border-borderSubtle rounded-2xl overflow-hidden shadow-sm">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gray-50 border-b border-borderSubtle">
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Nombre</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Correo</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Subgerencia</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Rol</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Estado</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider">Último acceso</th>
                      <th class="px-4 py-3 text-right text-[11px] font-bold text-textSecondary uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="usu-tbody">
                    ${userRows}
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

    <!-- Modal de aprobación -->
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
            <option value="Editor">Editor</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Administrador">Administrador</option>
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

    <div id="usu-toast"></div>
  `;
}
