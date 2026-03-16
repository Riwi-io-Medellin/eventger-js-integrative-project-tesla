import Sidebar from "../components/sidebar.js";
import Navbar from "../components/navbar.js";

export default function Usuarios() {

  // ══════════ DATOS ══════════
  const users = [
    { id: 1, name: "Carlos Martínez",  email: "carlos.martinez@itagui.gov.co",  role: "Administrador", status: "Activo",   lastAccess: "4 de mar 09:15 a. m.", initials: "CM", color: "#6366f1", subgerencia: "recreacion" },
    { id: 2, name: "María López",      email: "maria.lopez@itagui.gov.co",      role: "Editor",        status: "Activo",   lastAccess: "3 de mar 04:42 p. m.", initials: "ML", color: "#22c55e", subgerencia: "actividad-fisica" },
    { id: 3, name: "Andrés García",    email: "andres.garcia@itagui.gov.co",    role: "Supervisor",    status: "Activo",   lastAccess: "4 de mar 08:30 a. m.", initials: "AG", color: "#f97316", subgerencia: "eventos-culturales" },
    { id: 4, name: "Laura Rodríguez",  email: "laura.rodriguez@itagui.gov.co",  role: "Editor",        status: "Activo",   lastAccess: "2 de mar 11:20 a. m.", initials: "LR", color: "#22c55e", subgerencia: "recreacion" },
    { id: 5, name: "Jorge Hernández",  email: "jorge.hernandez@itagui.gov.co",  role: "Editor",        status: "Inactivo", lastAccess: "15 de feb 02:05 p. m.", initials: "JH", color: "#22c55e", subgerencia: "actividad-fisica" },
    { id: 6, name: "Diana Pérez",      email: "diana.perez@itagui.gov.co",      role: "Supervisor",    status: "Activo",   lastAccess: "1 de mar 10:00 a. m.", initials: "DP", color: "#f97316", subgerencia: "eventos-culturales" },
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

  // ══════════ LÓGICA JAVASCRIPT GLOBALES ══════════
  // Se asignan al objeto window para que el HTML inyectado pueda ejecutarlas
  window.usu_tab = function(t) {
    const isU = t === 'usuarios';
    document.getElementById('usu-p1').style.display = isU ? 'block' : 'none';
    document.getElementById('usu-p2').style.display = isU ? 'none'  : 'block';
    document.getElementById('usu-t1').className = 'usu-tab' + (isU ? ' on' : '');
    document.getElementById('usu-t2').className = 'usu-tab' + (!isU ? ' on' : '');
  };

  window.usu_filterUsers = function() {
    const q = (document.getElementById('usu-usearch').value || '').toLowerCase();
    const sub = document.getElementById('usu-usub').value;
    const role = document.getElementById('usu-urole').value;

    document.querySelectorAll('#usu-tbody tr[data-user-row]').forEach(r => {
      const matchQ = !q || r.dataset.name.includes(q) || r.dataset.email.includes(q);
      const matchSub = !sub || r.dataset.sub === sub;
      const matchRole = !role || r.dataset.role === role;
      r.style.display = (matchQ && matchSub && matchRole) ? '' : 'none';
    });
  };

  window.usu_filterReqs = function() {
    const q = (document.getElementById('usu-rsearch').value || '').toLowerCase();
    const sub = document.getElementById('usu-rsub').value;
    let vis = 0;
    document.querySelectorAll('#usu-rlist [data-req-id]').forEach(c => {
      const matchQ = !q || c.dataset.name.includes(q) || c.dataset.email.includes(q);
      const matchSub = !sub || c.dataset.sub === sub;
      const ok = matchQ && matchSub;
      c.style.display = ok ? 'flex' : 'none';
      if (ok) vis++;
    });
    document.getElementById('usu-rempty').style.display = vis === 0 ? 'block' : 'none';
  };

  window.usu_pwd = function() {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    return Array.from({length:12}, () => c[Math.floor(Math.random() * c.length)]).join('');
  };

  window._usu_id = null;

  window.usu_openModal = function(id, name, email, sub) {
    window._usu_id = id;
    document.getElementById('usu-msub').textContent = 'Aprobar acceso para ' + name;
    document.getElementById('usu-msub-badge').textContent = SUB_LABEL[sub] || sub;
    document.getElementById('usu-memail').value = email;
    document.getElementById('usu-mpwd').value = window.usu_pwd();
    document.getElementById('usu-overlay').classList.add('show');
  };

  window.usu_closeModal = function() {
    document.getElementById('usu-overlay').classList.remove('show');
    window._usu_id = null;
  };

  window.usu_confirm = function() {
    const email = document.getElementById('usu-memail').value;
    const role = document.getElementById('usu-mrole').value;
    const card = document.querySelector('[data-req-id="' + window._usu_id + '"]');
    if (card) card.remove();
    
    window.usu_updateBadge();
    window.usu_filterReqs();
    window.usu_closeModal();
    window.usu_toast('✅ Acceso aprobado — Credenciales enviadas a ' + email + ' · Rol: ' + role);
  };

  window.usu_reject = function(id, name, btn) {
    if (!confirm('¿Rechazar la solicitud de ' + name + '? Esta acción no se puede deshacer.')) return;
    const card = btn.closest('[data-req-id]');
    if (card) card.remove();
    window.usu_updateBadge();
    window.usu_filterReqs();
    window.usu_toast('🚫 Solicitud de ' + name + ' rechazada.');
  };

  window.usu_updateBadge = function() {
    const n = document.querySelectorAll('#usu-rlist [data-req-id]').length;
    const b = document.getElementById('usu-badge');
    if (b) b.textContent = n > 0 ? n : '';
    const c = document.getElementById('usu-req-n');
    if (c) c.textContent = n;
  };

  window.usu_toast = function(msg) {
    const t = document.getElementById('usu-toast');
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.style.display = 'none'; }, 5000);
  };

  window.usu_overlayClick = function(e, el) {
    if (e.target === el) window.usu_closeModal();
  };

  // ══════════ COMPONENTES VISUALES ══════════
  function roleBadge(role) {
    const c = ROLE_COLOR[role] || { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };
    return `<span style="background:${c.bg};color:${c.text};border:1.5px solid ${c.border};padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap;">${role}</span>`;
  }

  function statusBadge(s) {
    const ok = s === "Activo";
    return `<span style="background:${ok?"#dcfce7":"#fee2e2"};color:${ok?"#15803d":"#b91c1c"};padding:2px 12px;border-radius:20px;font-size:12px;font-weight:600;">${s}</span>`;
  }

  function subBadge(key) {
    const c = SUB_COLOR[key] || { bg: "#f1f5f9", text: "#475569" };
    return `<span style="background:${c.bg};color:${c.text};padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap;">${SUB_LABEL[key] || key}</span>`;
  }

  const userRows = users.map(u => `
    <tr data-user-row data-name="${u.name.toLowerCase()}" data-email="${u.email.toLowerCase()}" data-role="${u.role}" data-sub="${u.subgerencia}"
        style="border-bottom:1px solid #f1f5f9;transition:background .12s;"
        onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background='transparent'">
      <td style="padding:13px 16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:50%;background:${u.color}18;color:${u.color};font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;border:1.5px solid ${u.color}40;flex-shrink:0;">${u.initials}</div>
          <span style="font-weight:600;color:#0f172a;font-size:14px;">${u.name}</span>
        </div>
      </td>
      <td style="padding:13px 16px;color:#64748b;font-size:13px;">${u.email}</td>
      <td style="padding:13px 16px;">${subBadge(u.subgerencia)}</td>
      <td style="padding:13px 16px;">${roleBadge(u.role)}</td>
      <td style="padding:13px 16px;">${statusBadge(u.status)}</td>
      <td style="padding:13px 16px;color:#94a3b8;font-size:12px;">
        <span style="display:flex;align-items:center;gap:4px;">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${u.lastAccess}
        </span>
      </td>
      <td style="padding:13px 16px;">
        <div style="display:flex;gap:6px;justify-content:flex-end;">
          <button onclick="alert('Editar: ${u.name}')" title="Editar"
            style="background:#f1f5f9;border:none;border-radius:7px;padding:6px;cursor:pointer;color:#64748b;line-height:0;transition:background .15s;"
            onmouseenter="this.style.background='#e2e8f0'" onmouseleave="this.style.background='#f1f5f9'">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onclick="if(confirm('¿Eliminar a ${u.name}?'))this.closest('tr').remove()" title="Eliminar"
            style="background:#fff1f2;border:none;border-radius:7px;padding:6px;cursor:pointer;color:#ef4444;line-height:0;transition:background .15s;"
            onmouseenter="this.style.background='#fecdd3'" onmouseleave="this.style.background='#fff1f2'">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join("");

  const reqCards = requests.map(r => `
    <div data-req-id="${r.id}" data-sub="${r.subgerencia}"
         data-name="${r.name.toLowerCase()}" data-email="${r.email.toLowerCase()}"
         style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:14px;transition:box-shadow .15s;"
         onmouseenter="this.style.boxShadow='0 2px 12px rgba(0,0,0,.06)'" onmouseleave="this.style.boxShadow='none'">
      <div style="width:44px;height:44px;border-radius:50%;background:${r.color}18;color:${r.color};font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;border:1.5px solid ${r.color}40;flex-shrink:0;">${r.initials}</div>
      <div style="flex:1;min-width:0;">
        <p style="margin:0 0 2px;font-weight:700;color:#0f172a;font-size:14px;">${r.name}</p>
        <p style="margin:0 0 8px;color:#64748b;font-size:13px;">${r.email}</p>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${subBadge(r.subgerencia)}
          <span style="color:#cbd5e1;font-size:11px;">|</span>
          <span style="color:#94a3b8;font-size:12px;display:flex;align-items:center;gap:4px;">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${r.date}
          </span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0;">
        <button onclick="window.usu_openModal('${r.id}','${r.name.replace(/'/g,"\\'")}','${r.email}','${r.subgerencia}')"
          style="background:#16a34a;color:#fff;border:none;border-radius:9px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px;transition:background .15s;white-space:nowrap;"
          onmouseenter="this.style.background='#15803d'" onmouseleave="this.style.background='#16a34a'">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Aceptar
        </button>
        <button onclick="window.usu_reject('${r.id}','${r.name.replace(/'/g,"\\'")}',this)"
          style="background:#fff1f2;color:#dc2626;border:1px solid #fecaca;border-radius:9px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px;transition:background .15s;white-space:nowrap;"
          onmouseenter="this.style.background='#fee2e2'" onmouseleave="this.style.background='#fff1f2'">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Rechazar
        </button>
      </div>
    </div>`).join("");

  return `
    <div style="display:flex;height:100vh;overflow:hidden;">

      ${Sidebar()}

      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">

        ${Navbar()}

        <main style="flex:1;overflow-y:auto;background:#f8fafc;padding:32px 36px;">

          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            #usu * { box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
            .usu-tab { padding:9px 18px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;background:transparent;color:#64748b;transition:all .18s; }
            .usu-tab.on { background:#3b82f6;color:#fff;box-shadow:0 3px 10px #3b82f640; }
            .usu-inp { width:100%;padding:10px 14px 10px 40px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:13px;color:#0f172a;outline:none;transition:border-color .18s;background:#fff; }
            .usu-inp:focus { border-color:#3b82f6;box-shadow:0 0 0 3px #3b82f615; }
            .usu-sel { padding:10px 34px 10px 12px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:13px;color:#64748b;outline:none;cursor:pointer;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 10px center;-webkit-appearance:none;appearance:none;transition:border-color .18s; }
            .usu-sel:focus { border-color:#3b82f6; }
            .usu-badge { background:#ef4444;color:#fff;border-radius:20px;padding:0 7px;font-size:11px;font-weight:700;line-height:18px; }

            /* Modal overlay */
            #usu-overlay { display:none; position:fixed;inset:0;z-index:9000; background:rgba(15,23,42,.45); backdrop-filter:blur(5px); align-items:center;justify-content:center; }
            #usu-overlay.show { display:flex; }
            #usu-mbox { background:#fff;border-radius:18px;padding:32px;width:100%;max-width:450px; box-shadow:0 20px 60px rgba(0,0,0,.18); animation:mboxIn .22s cubic-bezier(.34,1.56,.64,1); }
            @keyframes mboxIn { from{opacity:0;transform:scale(.93) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
            .usu-minp { width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:9px;font-size:13px;color:#0f172a;outline:none;transition:border-color .18s;background:#fff; }
            .usu-minp:focus { border-color:#3b82f6;box-shadow:0 0 0 3px #3b82f615; }
            #usu-toast { display:none;position:fixed;bottom:24px;right:24px;z-index:9999; background:#0f172a;color:#fff;border-radius:11px;padding:13px 18px; font-size:13px;font-weight:600;max-width:380px;line-height:1.4; box-shadow:0 8px 28px rgba(0,0,0,.22); }
          </style>

          <div id="usu">

            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
              <div>
                <h1 style="margin:0 0 3px;font-size:26px;font-weight:800;color:#0f172a;">Gestión de Usuarios</h1>
                <p style="margin:0;font-size:13px;color:#64748b;">${users.length} usuarios registrados &nbsp;·&nbsp; <span id="usu-req-n">${requests.length}</span> solicitudes pendientes</p>
              </div>
              <button onclick="alert('Nuevo usuario')"
                style="background:#3b82f6;color:#fff;border:none;border-radius:11px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px;box-shadow:0 3px 12px #3b82f640;transition:background .15s;"
                onmouseenter="this.style.background='#2563eb'" onmouseleave="this.style.background='#3b82f6'">
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Crear Usuario
              </button>
            </div>

            <div style="display:inline-flex;gap:4px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:5px;margin-bottom:22px;">
              <button id="usu-t1" class="usu-tab on" onclick="window.usu_tab('usuarios')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Usuarios
              </button>
              <button id="usu-t2" class="usu-tab" onclick="window.usu_tab('solicitudes')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                Solicitudes
                <span class="usu-badge" id="usu-badge">${requests.length}</span>
              </button>
            </div>

            <div id="usu-p1">
              <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="position:relative;flex:1;min-width:200px;">
                  <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input id="usu-usearch" class="usu-inp" placeholder="Buscar por nombre o correo..." oninput="window.usu_filterUsers()">
                </div>
                <select id="usu-usub" class="usu-sel" onchange="window.usu_filterUsers()">
                  <option value="">Todas las subgerencias</option>
                  <option value="recreacion">Recreación y Deporte</option>
                  <option value="actividad-fisica">Actividad Física</option>
                  <option value="eventos-culturales">Eventos Culturales</option>
                </select>
                <select id="usu-urole" class="usu-sel" onchange="window.usu_filterUsers()">
                  <option value="">Todos los roles</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Editor">Editor</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04);">
                <table style="width:100%;border-collapse:collapse;">
                  <thead>
                    <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                      <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Nombre</th>
                      <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Correo</th>
                      <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Subgerencia</th>
                      <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Rol</th>
                      <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Estado</th>
                      <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Último acceso</th>
                      <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.07em;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="usu-tbody">
                    ${userRows}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="usu-p2" style="display:none;">
              <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04);">
                <div style="padding:20px 24px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:12px;">
                  <div style="width:40px;height:40px;background:#eff6ff;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg width="18" height="18" fill="none" stroke="#3b82f6" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                  </div>
                  <div>
                    <p style="margin:0 0 1px;font-size:15px;font-weight:700;color:#0f172a;">Solicitudes de Acceso Pendientes</p>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Revisa, aprueba o rechaza cada solicitud. Al aceptar se generan las credenciales.</p>
                  </div>
                </div>

                <div style="padding:16px 24px;border-bottom:1px solid #f1f5f9;display:flex;gap:10px;flex-wrap:wrap;background:#fafafa;">
                  <div style="position:relative;flex:1;min-width:200px;">
                    <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input id="usu-rsearch" class="usu-inp" placeholder="Buscar por nombre o correo..." oninput="window.usu_filterReqs()">
                  </div>
                  <select id="usu-rsub" class="usu-sel" onchange="window.usu_filterReqs()">
                    <option value="">Todas las subgerencias</option>
                    <option value="recreacion">Recreación y Deporte</option>
                    <option value="actividad-fisica">Actividad Física</option>
                    <option value="eventos-culturales">Eventos Culturales</option>
                  </select>
                </div>

                <div id="usu-rlist" style="padding:20px 24px;display:flex;flex-direction:column;gap:12px;">
                  ${reqCards}
                </div>

                <div id="usu-rempty" style="display:none;text-align:center;padding:48px 24px;color:#94a3b8;">
                  <svg width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin:0 auto 10px;display:block;opacity:.3;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <p style="font-size:14px;margin:0;font-weight:500;">No hay solicitudes que coincidan</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>

    <div id="usu-overlay" onclick="window.usu_overlayClick(event, this)">
      <div id="usu-mbox">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px;">
          <div style="width:40px;height:40px;background:#dcfce7;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="19" height="19" fill="none" stroke="#16a34a" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <p style="margin:0 0 2px;font-size:17px;font-weight:800;color:#0f172a;">Aprobar Solicitud</p>
            <p id="usu-msub" style="margin:0;font-size:12px;color:#64748b;">Asignar credenciales al solicitante</p>
          </div>
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Subgerencia solicitada</label>
          <div id="usu-msub-badge" style="padding:8px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:9px;font-size:13px;color:#64748b;"></div>
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Correo electrónico</label>
          <input id="usu-memail" class="usu-minp" readonly style="background:#f8fafc;color:#64748b;">
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Rol asignado</label>
          <select id="usu-mrole" class="usu-minp" style="-webkit-appearance:none;appearance:none;cursor:pointer;background:#fff url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2213%22 height=%2213%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 viewBox=%220 0 24 24%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E') no-repeat right 12px center;padding-right:34px;">
            <option value="Editor">Editor</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div style="margin-bottom:22px;">
          <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Contraseña temporal</label>
          <div style="position:relative;">
            <input id="usu-mpwd" class="usu-minp" readonly style="background:#f8fafc;font-family:monospace;letter-spacing:.06em;padding-right:42px;">
            <button onclick="document.getElementById('usu-mpwd').value=window.usu_pwd()" title="Regenerar"
              style="position:absolute;right:9px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;padding:3px;line-height:0;transition:color .15s;"
              onmouseenter="this.style.color='#3b82f6'" onmouseleave="this.style.color='#94a3b8'">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
          </div>
        </div>

        <div style="display:flex;gap:9px;">
          <button onclick="window.usu_closeModal()"
            style="flex:1;background:#f1f5f9;color:#64748b;border:none;border-radius:9px;padding:11px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;"
            onmouseenter="this.style.background='#e2e8f0'" onmouseleave="this.style.background='#f1f5f9'">
            Cancelar
          </button>
          <button onclick="window.usu_confirm()"
            style="flex:2;background:#16a34a;color:#fff;border:none;border-radius:9px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .15s;"
            onmouseenter="this.style.background='#15803d'" onmouseleave="this.style.background='#16a34a'">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Aprobar
          </button>
        </div>
      </div>
    </div>

    <div id="usu-toast"></div>
  `;
}