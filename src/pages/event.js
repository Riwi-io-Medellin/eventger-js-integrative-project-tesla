// src/pages/eventos.js

// ─── Estilos ──────────────────────────────────────────────────────────────────
if (!document.getElementById('eventos-style')) {
  const s = document.createElement('style');
  s.id = 'eventos-style';
  s.textContent = `
    * { box-sizing: border-box; }
    body { margin: 0; }
    .dash-layout { display: flex; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    .dash-sidebar {
      width: 210px; flex-shrink: 0;
      background: #0f172a;
      display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
      transition: transform 0.3s;
    }
    .dash-main { margin-left: 210px; flex: 1; display: flex; flex-direction: column; background: #f8fafc; min-height: 100vh; }

    .nav-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.65rem 1.25rem; border-radius: 0.5rem; margin: 0.125rem 0.75rem;
      font-size: 0.875rem; font-weight: 500; color: #94a3b8;
      cursor: pointer; text-decoration: none; transition: background 0.15s, color 0.15s;
      border: none; background: none; width: calc(100% - 1.5rem); text-align: left;
    }
    .nav-item:hover  { background: rgba(255,255,255,0.07); color: #e2e8f0; }
    .nav-item.active { background: #2563eb; color: #fff; }

    .view-btn {
      display: flex; align-items: center; justify-content: center;
      width: 2.25rem; height: 2.25rem; border-radius: 0.5rem; border: 1.5px solid #e2e8f0;
      background: #fff; cursor: pointer; color: #94a3b8; transition: all 0.15s;
    }
    .view-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }
    .view-btn:hover:not(.active) { border-color: #2563eb; color: #2563eb; }

    /* Tabla */
    .ev-table { width: 100%; border-collapse: collapse; }
    .ev-table th {
      text-align: left; padding: 0.875rem 1.25rem;
      font-size: 0.8rem; font-weight: 600; color: #64748b;
      border-bottom: 1px solid #f1f5f9; white-space: nowrap;
    }
    .ev-table td { padding: 1rem 1.25rem; border-bottom: 1px solid #f8fafc; }
    .ev-table tr:last-child td { border-bottom: none; }
    .ev-table tbody tr { transition: background 0.1s; }
    .ev-table tbody tr:hover { background: #f8fafc; }

    /* Cards */
    .ev-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
      gap: 1.25rem;
    }
    .ev-card {
      background: #fff; border-radius: 1rem; border: 1px solid #e2e8f0;
      overflow: hidden; transition: box-shadow 0.2s, transform 0.15s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .ev-card:hover { box-shadow: 0 8px 24px -4px rgba(0,0,0,0.1); transform: translateY(-2px); }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15,23,42,0.55);
      backdrop-filter: blur(4px); z-index: 200;
      display: flex; align-items: center; justify-content: center; padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: #fff; border-radius: 1rem;
      width: 100%; max-width: 32rem; max-height: 90vh; overflow-y: auto;
      box-shadow: 0 24px 48px -8px rgba(0,0,0,0.2);
      animation: slideUp 0.25s cubic-bezier(0.22,1,0.36,1);
    }
    .modal-header {
      padding: 1.5rem 1.5rem 0;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; background: #fff; z-index: 1;
      border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem;
    }
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.125rem; }

    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
    .form-input {
      width: 100%; border-radius: 0.625rem; border: 1.5px solid #e2e8f0;
      background: #f8fafc; padding: 0.75rem 1rem; font-size: 0.9rem;
      color: #1e293b; font-family: inherit; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); background: #fff; }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .action-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 2rem; height: 2rem; border-radius: 0.5rem; border: none;
      cursor: pointer; transition: background 0.15s, transform 0.1s; background: transparent;
    }
    .action-btn:hover { transform: scale(1.1); }

    @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }

    @media (max-width: 768px) {
      .dash-sidebar { transform: translateX(-100%); }
      .dash-sidebar.open { transform: translateX(0); }
      .dash-main { margin-left: 0; }
      .hide-mobile { display: none !important; }
      .ev-cards { grid-template-columns: 1fr; }
      .form-grid-2 { grid-template-columns: 1fr; }
    }
    @media (min-width: 769px) { .show-mobile { display: none !important; } }
  `;
  document.head.appendChild(s);
}

// ─── Estado ───────────────────────────────────────────────────────────────────
let evView       = 'list';   // 'list' | 'cards'
let evSearch     = '';
let evModal      = null;     // null | 'create' | 'edit' | 'delete'
let evSelected   = null;     // evento seleccionado para editar/eliminar

// Mock data — reemplazar con llamadas reales a la API
let MOCK_EVENTS = [
  { id:'1', title:'Torneo Interbarrial de Fútbol', description:'Torneo anual entre barrios de la ciudad.', start_date:'2026-03-05T08:00', finish_date:'2026-03-05T18:00', is_active:true,  discipline_id:'Fútbol',    scenario_id:'Escenario Principal', space_id:'Estadio Municipal',    creator_id:'Sara Calderón' },
  { id:'2', title:'Campeonato de Natación',         description:'Competencia departamental de natación.',  start_date:'2026-03-08T09:00', finish_date:'2026-03-08T17:00', is_active:true,  discipline_id:'Natación',   scenario_id:'Escenario Acuático',  space_id:'Complejo Acuático',    creator_id:'Jeronimo Gallego' },
  { id:'3', title:'Bloqueo Mantenimiento',          description:'Cierre por mantenimiento preventivo.',   start_date:'2026-03-10T00:00', finish_date:'2026-03-10T23:59', is_active:true,  discipline_id:null,         scenario_id:'Escenario Central',   space_id:'Coliseo Central',      creator_id:'Sara Calderón',   type:'bloqueo' },
  { id:'4', title:'Festival de Atletismo',          description:'Festival juvenil de atletismo.',          start_date:'2026-03-15T07:00', finish_date:'2026-03-15T16:00', is_active:false, discipline_id:'Atletismo',  scenario_id:'Escenario Norte',     space_id:'Pista Atlética Norte', creator_id:'Jose David Henao' },
  { id:'5', title:'Copa de Baloncesto',             description:'Copa intercolegial de baloncesto.',       start_date:'2026-03-20T10:00', finish_date:'2026-03-20T20:00', is_active:false, discipline_id:'Baloncesto', scenario_id:'Escenario Sur',       space_id:'Coliseo Sur',          creator_id:'Jhon Cadavid' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatus(ev) {
  const now   = Date.now();
  const start = new Date(ev.start_date).getTime();
  const end   = new Date(ev.finish_date).getTime();
  if (!ev.is_active)     return { label:'pendiente',  bg:'#fef9c3', color:'#a16207', dot:'#ca8a04' };
  if (now > end)         return { label:'finalizado',  bg:'#f1f5f9', color:'#64748b', dot:'#94a3b8' };
  if (now >= start)      return { label:'en curso',    bg:'#eff6ff', color:'#2563eb', dot:'#3b82f6' };
  return                        { label:'activo',      bg:'#f0fdf4', color:'#16a34a', dot:'#22c55e' };
}
function getType(ev) {
  if (ev.type === 'bloqueo') return { label:'bloqueo', bg:'#f1f5f9', color:'#475569' };
  return { label:'evento', bg:'#e0f2fe', color:'#0369a1' };
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit', hour12:false });
}
function fmtDateInput(iso) {
  return iso ? iso.slice(0,16) : '';
}

// ─── Sidebar (compartido) ─────────────────────────────────────────────────────
function renderSidebar() {
  return /* html */`
  <aside class="dash-sidebar" id="ev-sidebar">
    <div style="padding:1.25rem; display:flex; align-items:center; gap:0.75rem; border-bottom:1px solid rgba(255,255,255,0.07);">
      <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:#2563eb;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
      </div>
      <div>
        <p style="color:#f1f5f9;font-weight:700;font-size:0.9375rem;margin:0;line-height:1.2;">EventgerJS</p>
        <p style="color:#64748b;font-size:0.7rem;margin:0;">Gestión Deportiva</p>
      </div>
    </div>

    <nav style="flex:1;padding:1rem 0;overflow-y:auto;">
      <p style="color:#475569;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0 1.25rem;margin:0 0 0.5rem;">Principal</p>
      <a class="nav-item" href="#/dashboard">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6"/></svg>
        Muro de Eventos
      </a>
      <a class="nav-item" href="#/dashboard">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
        Dashboard
      </a>
      <p style="color:#475569;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0 1.25rem;margin:1rem 0 0.5rem;">Gestión</p>
      <a class="nav-item" href="#/dashboard">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        Gestión Usuarios
      </a>
      <a class="nav-item active" href="#/eventos">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        Gestión Eventos
      </a>
      <a class="nav-item" href="#/espacios">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Gestión Espacios
      </a>
      <a class="nav-item" href="#/perfil">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        Mi Perfil
      </a>
    </nav>

    <div style="padding:1rem;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:0.75rem;">
      <div style="width:2rem;height:2rem;border-radius:50%;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.7rem;font-weight:700;flex-shrink:0;">SC</div>
      <div style="min-width:0;flex:1;">
        <p style="color:#e2e8f0;font-size:0.8rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Sara Calderón</p>
        <p style="color:#64748b;font-size:0.7rem;margin:0;">Admin General</p>
      </div>
      <button onclick="handleLogout()" style="background:none;border:none;cursor:pointer;color:#64748b;padding:0.25rem;border-radius:0.375rem;" title="Cerrar sesión">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      </button>
    </div>
  </aside>`;
}

// ─── Vista lista ──────────────────────────────────────────────────────────────
function renderList(events) {
  if (!events.length) return emptyState();
  return /* html */`
  <div style="background:#fff;border-radius:0.875rem;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
    <table class="ev-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th class="hide-mobile">Fecha inicio</th>
          <th class="hide-mobile">Hora</th>
          <th class="hide-mobile">Espacio</th>
          <th class="hide-mobile">Disciplina</th>
          <th class="hide-mobile">Tipo</th>
          <th>Estado</th>
          <th style="text-align:right;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${events.map(ev => {
          const st = getStatus(ev);
          const ty = getType(ev);
          return /* html */`
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg fill="none" stroke="#2563eb" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <span style="font-weight:600;color:#1e293b;font-size:0.9rem;">${ev.title}</span>
              </div>
            </td>
            <td class="hide-mobile" style="color:#475569;font-size:0.875rem;">${fmtDate(ev.start_date)}</td>
            <td class="hide-mobile" style="color:#475569;font-size:0.875rem;font-variant-numeric:tabular-nums;">${fmtTime(ev.start_date)}</td>
            <td class="hide-mobile" style="color:#475569;font-size:0.875rem;">${ev.space_id}</td>
            <td class="hide-mobile" style="color:#475569;font-size:0.875rem;">${ev.discipline_id || '—'}</td>
            <td class="hide-mobile">
              <span style="display:inline-flex;align-items:center;padding:0.2rem 0.65rem;border-radius:0.375rem;font-size:0.75rem;font-weight:600;background:${ty.bg};color:${ty.color};">${ty.label}</span>
            </td>
            <td>
              <span style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.25rem 0.7rem;border-radius:9999px;font-size:0.75rem;font-weight:600;background:${st.bg};color:${st.color};border:1px solid ${st.bg};">
                <span style="width:0.45rem;height:0.45rem;border-radius:50%;background:${st.dot};flex-shrink:0;"></span>
                ${st.label}
              </span>
            </td>
            <td style="text-align:right;">
              <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.25rem;">
                <button class="action-btn" title="Editar" style="color:#2563eb;" onclick="openEvModal('edit','${ev.id}')" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="action-btn" title="Eliminar" style="color:#ef4444;" onclick="openEvModal('delete','${ev.id}')" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

// ─── Vista cards ──────────────────────────────────────────────────────────────
function renderCards(events) {
  if (!events.length) return emptyState();
  const COLORS = ['#eff6ff,#2563eb','#f0fdf4,#16a34a','#fef9c3,#a16207','#fdf2f8,#be185d','#f0fdfa,#0d9488'];
  return /* html */`
  <div class="ev-cards">
    ${events.map((ev, i) => {
      const st = getStatus(ev);
      const ty = getType(ev);
      const [cardBg, cardAccent] = COLORS[i % COLORS.length].split(',');
      return /* html */`
      <div class="ev-card">
        <!-- Header de color -->
        <div style="height:0.375rem;background:${cardAccent};"></div>
        <div style="padding:1.25rem;">
          <!-- Top row -->
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.875rem;">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.375rem;flex-wrap:wrap;">
                <span style="display:inline-flex;align-items:center;padding:0.15rem 0.55rem;border-radius:0.375rem;font-size:0.7rem;font-weight:700;background:${ty.bg};color:${ty.color};">${ty.label}</span>
                <span style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.15rem 0.6rem;border-radius:9999px;font-size:0.7rem;font-weight:700;background:${st.bg};color:${st.color};">
                  <span style="width:0.4rem;height:0.4rem;border-radius:50%;background:${st.dot};"></span>
                  ${st.label}
                </span>
              </div>
              <h3 style="font-size:1rem;font-weight:700;color:#0f172a;margin:0;line-height:1.35;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${ev.title}</h3>
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

          ${ev.description ? `<p style="font-size:0.8125rem;color:#64748b;margin:0 0 1rem;line-height:1.5;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${ev.description}</p>` : ''}

          <!-- Metadatos -->
          <div style="display:flex;flex-direction:column;gap:0.5rem;border-top:1px solid #f1f5f9;padding-top:1rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:#475569;">
              <svg fill="none" stroke="${cardAccent}" viewBox="0 0 24 24" width="14" height="14" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span><strong style="color:#1e293b;">${fmtDate(ev.start_date)}</strong> · ${fmtTime(ev.start_date)} — ${fmtTime(ev.finish_date)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:#475569;">
              <svg fill="none" stroke="${cardAccent}" viewBox="0 0 24 24" width="14" height="14" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              ${ev.space_id}
            </div>
            ${ev.discipline_id ? `
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:#475569;">
              <svg fill="none" stroke="${cardAccent}" viewBox="0 0 24 24" width="14" height="14" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              ${ev.discipline_id}
            </div>` : ''}
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:#94a3b8;">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              ${ev.creator_id}
            </div>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function emptyState() {
  return /* html */`
  <div style="background:#fff;border-radius:0.875rem;border:1px solid #e2e8f0;padding:4rem 2rem;text-align:center;">
    <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:#eff6ff;border:2px solid #bfdbfe;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:#2563eb;">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
    </div>
    <h3 style="font-size:1rem;font-weight:600;color:#1e293b;margin:0 0 0.5rem;">Sin eventos</h3>
    <p style="color:#64748b;font-size:0.875rem;margin:0 0 1.25rem;">No se encontraron eventos con esa búsqueda.</p>
    <button onclick="openEvModal('create')" style="display:inline-flex;align-items:center;gap:0.5rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;padding:0.625rem 1.25rem;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      Crear primer evento
    </button>
  </div>`;
}

// ─── Modal crear / editar ─────────────────────────────────────────────────────
function renderFormModal(ev) {
  const isEdit = !!ev;
  const v = ev || { title:'', description:'', start_date:'', finish_date:'', is_active:true, discipline_id:'', scenario_id:'', space_id:'' };
  return /* html */`
  <div class="modal-backdrop" id="ev-modal-backdrop" onclick="closeEvModal(event)">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div>
          <h3 style="font-size:1.125rem;font-weight:700;color:#0f172a;margin:0 0 0.125rem;">${isEdit ? 'Editar evento' : 'Crear nuevo evento'}</h3>
          <p style="font-size:0.8125rem;color:#64748b;margin:0;">${isEdit ? 'Modifica los campos necesarios' : 'Completa la información del evento'}</p>
        </div>
        <button onclick="closeEvModal()" style="background:none;border:none;cursor:pointer;color:#94a3b8;padding:0.25rem;border-radius:0.5rem;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="ev-form" onsubmit="submitEvForm(event)" novalidate>

          <div class="form-group">
            <label class="form-label">Título *</label>
            <input class="form-input" id="ev-title" type="text" placeholder="Nombre del evento" value="${v.title}" required/>
            <p id="ev-title-err" style="display:none;color:#ef4444;font-size:0.75rem;margin:0;"><span></span></p>
          </div>

          <div class="form-group" style="margin-top:1rem;">
            <label class="form-label">Descripción</label>
            <textarea class="form-input" id="ev-desc" placeholder="Describe el evento..." rows="3" style="resize:vertical;">${v.description || ''}</textarea>
          </div>

          <div class="form-grid-2" style="margin-top:1rem;">
            <div class="form-group">
              <label class="form-label">Fecha y hora inicio *</label>
              <input class="form-input" id="ev-start" type="datetime-local" value="${fmtDateInput(v.start_date)}" required/>
              <p id="ev-start-err" style="display:none;color:#ef4444;font-size:0.75rem;margin:0;"><span></span></p>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha y hora fin *</label>
              <input class="form-input" id="ev-finish" type="datetime-local" value="${fmtDateInput(v.finish_date)}" required/>
              <p id="ev-finish-err" style="display:none;color:#ef4444;font-size:0.75rem;margin:0;"><span></span></p>
            </div>
          </div>

          <div class="form-group" style="margin-top:1rem;">
            <label class="form-label">Espacio</label>
            <input class="form-input" id="ev-space" type="text" placeholder="Ej: Estadio Municipal" value="${v.space_id || ''}"/>
          </div>

          <div class="form-grid-2" style="margin-top:1rem;">
            <div class="form-group">
              <label class="form-label">Disciplina</label>
              <input class="form-input" id="ev-discipline" type="text" placeholder="Ej: Fútbol" value="${v.discipline_id || ''}"/>
            </div>
            <div class="form-group">
              <label class="form-label">Escenario</label>
              <input class="form-input" id="ev-scenario" type="text" placeholder="Ej: Escenario Principal" value="${v.scenario_id || ''}"/>
            </div>
          </div>

          <div class="form-group" style="margin-top:1rem;">
            <label class="form-label">Estado</label>
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.75rem 1rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#f8fafc;">
              <div style="position:relative;">
                <input type="checkbox" id="ev-active" ${v.is_active ? 'checked' : ''} style="sr-only;position:absolute;opacity:0;" onchange="toggleSwitch(this)"/>
                <div id="ev-switch-track" style="width:2.5rem;height:1.375rem;border-radius:9999px;background:${v.is_active ? '#2563eb' : '#cbd5e1'};transition:background 0.2s;position:relative;">
                  <div id="ev-switch-thumb" style="position:absolute;top:0.1875rem;left:${v.is_active ? '1.25rem' : '0.1875rem'};width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:left 0.2s;"></div>
                </div>
              </div>
              <span style="font-size:0.875rem;color:#475569;">Marcar como <strong style="color:#1e293b;">${v.is_active ? 'activo' : 'inactivo'}</strong></span>
            </label>
          </div>

          <div style="display:flex;gap:0.75rem;margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid #f1f5f9;">
            <button type="button" onclick="closeEvModal()" style="flex:1;padding:0.75rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;color:#475569;font-size:0.9rem;font-weight:600;font-family:inherit;cursor:pointer;">
              Cancelar
            </button>
            <button type="submit" style="flex:2;padding:0.75rem;border-radius:0.625rem;border:none;background:#2563eb;color:#fff;font-size:0.9rem;font-weight:600;font-family:inherit;cursor:pointer;box-shadow:0 4px 12px -2px rgba(37,99,235,0.4);">
              ${isEdit ? 'Guardar cambios' : 'Crear evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>`;
}

// ─── Modal eliminar ───────────────────────────────────────────────────────────
function renderDeleteModal(ev) {
  return /* html */`
  <div class="modal-backdrop" id="ev-modal-backdrop" onclick="closeEvModal(event)">
    <div class="modal-box" style="max-width:24rem;" onclick="event.stopPropagation()">
      <div style="padding:2rem;text-align:center;">
        <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:#fef2f2;border:2px solid #fecaca;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;color:#ef4444;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <h3 style="font-size:1.125rem;font-weight:700;color:#0f172a;margin:0 0 0.5rem;">¿Eliminar evento?</h3>
        <p style="color:#64748b;font-size:0.9rem;margin:0 0 1.25rem;line-height:1.6;">
          Vas a eliminar <strong style="color:#1e293b;">"${ev.title}"</strong>. Esta acción no se puede deshacer.
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:0.625rem;padding:0.875rem 1rem;text-align:left;font-size:0.8125rem;color:#475569;margin-bottom:1.5rem;display:flex;flex-direction:column;gap:0.3rem;">
          <span><strong style="color:#1e293b;">Fecha:</strong> ${fmtDate(ev.start_date)}</span>
          <span><strong style="color:#1e293b;">Espacio:</strong> ${ev.space_id}</span>
        </div>
        <div style="display:flex;gap:0.75rem;">
          <button onclick="closeEvModal()" style="flex:1;padding:0.75rem;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;color:#475569;font-size:0.9rem;font-weight:600;font-family:inherit;cursor:pointer;">Cancelar</button>
          <button onclick="confirmDeleteEv()" style="flex:1;padding:0.75rem;border-radius:0.625rem;border:none;background:#ef4444;color:#fff;font-size:0.9rem;font-weight:600;font-family:inherit;cursor:pointer;box-shadow:0 4px 12px -2px rgba(239,68,68,0.4);">Sí, eliminar</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── Render principal ─────────────────────────────────────────────────────────
function renderPage() {
  const filtered = MOCK_EVENTS.filter(ev =>
    ev.title.toLowerCase().includes(evSearch) ||
    (ev.space_id || '').toLowerCase().includes(evSearch) ||
    (ev.discipline_id || '').toLowerCase().includes(evSearch)
  );

  document.getElementById('app').innerHTML = /* html */`
  <div class="dash-layout">
    ${renderSidebar()}
    <main class="dash-main">

      <!-- Topbar -->
      <header style="height:3.5rem;background:#fff;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;padding:0 1.5rem;gap:1rem;position:sticky;top:0;z-index:50;">
        <button onclick="document.getElementById('ev-sidebar').classList.toggle('open')" class="show-mobile" style="background:none;border:none;cursor:pointer;color:#64748b;padding:0.25rem;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div style="flex:1;max-width:26rem;position:relative;">
          <svg style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Buscar eventos, espacios, usuarios..." value="${evSearch}"
            style="width:100%;border:1.5px solid #e2e8f0;border-radius:0.625rem;background:#f8fafc;padding:0.5rem 1rem 0.5rem 2.25rem;font-size:0.875rem;font-family:inherit;color:#1e293b;outline:none;"
            onfocus="this.style.borderColor='#2563eb';this.style.background='#fff'"
            onblur="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc'"
            oninput="evSearchHandler(this.value)"/>
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;margin-left:auto;">
          <button style="background:none;border:none;cursor:pointer;color:#64748b;padding:0.25rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </button>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <div style="width:2rem;height:2rem;border-radius:50%;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.7rem;font-weight:700;">SC</div>
            <div class="hide-mobile">
              <p style="font-size:0.8125rem;font-weight:600;color:#1e293b;margin:0;line-height:1.2;">Sara Calderón</p>
              <p style="font-size:0.7rem;color:#64748b;margin:0;">Administrador General</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido -->
      <div style="padding:2rem 1.5rem;flex:1;">

        <!-- Título + botón -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.75rem;flex-wrap:wrap;">
          <div>
            <h1 style="font-size:1.5rem;font-weight:700;color:#0f172a;margin:0 0 0.25rem;letter-spacing:-0.02em;">Gestión de Eventos</h1>
            <p style="color:#64748b;font-size:0.9375rem;margin:0;">Administrar todos los eventos · <strong style="color:#1e293b;">${MOCK_EVENTS.length}</strong> en total</p>
          </div>
          <button onclick="openEvModal('create')"
            style="display:flex;align-items:center;gap:0.5rem;background:#2563eb;color:#fff;border:none;border-radius:0.625rem;padding:0.65rem 1.25rem;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;box-shadow:0 4px 12px -2px rgba(37,99,235,0.4);transition:transform 0.15s;"
            onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Crear Evento
          </button>
        </div>

        <!-- Buscador + toggle vista -->
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
          <div style="flex:1;min-width:14rem;max-width:24rem;position:relative;">
            <svg style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" id="ev-search-local" placeholder="Buscar evento..." value="${evSearch}"
              style="width:100%;border:1.5px solid #e2e8f0;border-radius:0.625rem;background:#fff;padding:0.625rem 1rem 0.625rem 2.25rem;font-size:0.875rem;font-family:inherit;color:#1e293b;outline:none;transition:border-color 0.2s;"
              onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'"
              oninput="evSearchHandler(this.value)"/>
          </div>

          <!-- Toggle vista -->
          <div style="display:flex;gap:0.375rem;margin-left:auto;">
            <button id="btn-list" class="view-btn ${evView === 'list' ? 'active' : ''}" onclick="setEvView('list')" title="Vista lista">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            </button>
            <button id="btn-cards" class="view-btn ${evView === 'cards' ? 'active' : ''}" onclick="setEvView('cards')" title="Vista cards">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
            </button>
          </div>
        </div>

        <!-- Resultados -->
        <div id="ev-content">
          ${evView === 'list' ? renderList(filtered) : renderCards(filtered)}
        </div>

      </div>
    </main>

    <!-- Modal container -->
    <div id="ev-modal-container"></div>
  </div>`;
}

// ─── Acciones ─────────────────────────────────────────────────────────────────
function setEvView(view) {
  evView = view;
  const filtered = MOCK_EVENTS.filter(ev =>
    ev.title.toLowerCase().includes(evSearch) ||
    (ev.space_id || '').toLowerCase().includes(evSearch) ||
    (ev.discipline_id || '').toLowerCase().includes(evSearch)
  );
  document.getElementById('ev-content').innerHTML =
    view === 'list' ? renderList(filtered) : renderCards(filtered);
  document.getElementById('btn-list').classList.toggle('active', view === 'list');
  document.getElementById('btn-cards').classList.toggle('active', view === 'cards');
}

function evSearchHandler(val) {
  evSearch = val.toLowerCase();
  const filtered = MOCK_EVENTS.filter(ev =>
    ev.title.toLowerCase().includes(evSearch) ||
    (ev.space_id || '').toLowerCase().includes(evSearch) ||
    (ev.discipline_id || '').toLowerCase().includes(evSearch)
  );
  document.getElementById('ev-content').innerHTML =
    evView === 'list' ? renderList(filtered) : renderCards(filtered);
  // sync ambos inputs
  const top = document.getElementById('ev-search-local');
  if (top && top !== document.activeElement) top.value = val;
}

function openEvModal(type, id) {
  evModal    = type;
  evSelected = id ? MOCK_EVENTS.find(e => e.id === id) : null;
  const html = type === 'delete'
    ? renderDeleteModal(evSelected)
    : renderFormModal(evSelected);
  document.getElementById('ev-modal-container').innerHTML = html;
}

function closeEvModal(e) {
  if (e && e.target?.id !== 'ev-modal-backdrop') return;
  document.getElementById('ev-modal-container').innerHTML = '';
  evModal = null; evSelected = null;
}

function toggleSwitch(cb) {
  const track = document.getElementById('ev-switch-track');
  const thumb = document.getElementById('ev-switch-thumb');
  const label = cb.closest('label').querySelector('strong');
  if (cb.checked) {
    track.style.background = '#2563eb';
    thumb.style.left = '1.25rem';
    if (label) label.textContent = 'activo';
  } else {
    track.style.background = '#cbd5e1';
    thumb.style.left = '0.1875rem';
    if (label) label.textContent = 'inactivo';
  }
}

function submitEvForm(e) {
  e.preventDefault();
  const title  = document.getElementById('ev-title').value.trim();
  const start  = document.getElementById('ev-start').value;
  const finish = document.getElementById('ev-finish').value;
  let valid = true;

  function setErr(id, msg) {
    const el = document.getElementById(id);
    el.querySelector('span').textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    valid = false;
  }
  if (!title)  setErr('ev-title-err', 'El título es requerido.');
  if (!start)  setErr('ev-start-err', 'La fecha de inicio es requerida.');
  if (!finish) setErr('ev-finish-err', 'La fecha de fin es requerida.');
  if (start && finish && finish <= start) setErr('ev-finish-err', 'La fecha fin debe ser posterior al inicio.');
  if (!valid) return;

  const payload = {
    id:            evSelected?.id || String(Date.now()),
    title,
    description:   document.getElementById('ev-desc').value.trim(),
    start_date:    start,
    finish_date:   finish,
    space_id:      document.getElementById('ev-space').value.trim(),
    discipline_id: document.getElementById('ev-discipline').value.trim() || null,
    scenario_id:   document.getElementById('ev-scenario').value.trim(),
    is_active:     document.getElementById('ev-active').checked,
    creator_id:    evSelected?.creator_id || 'Sara Calderón',
    created_at:    evSelected?.created_at || new Date().toISOString(),
  };

  if (evModal === 'edit') {
    // 🔌 await api.updateEvent(payload.id, payload)
    const idx = MOCK_EVENTS.findIndex(e => e.id === payload.id);
    if (idx > -1) MOCK_EVENTS[idx] = payload;
  } else {
    // 🔌 await api.createEvent(payload)
    MOCK_EVENTS.unshift(payload);
  }

  document.getElementById('ev-modal-container').innerHTML = '';
  evModal = null; evSelected = null;
  renderPage();
}

function confirmDeleteEv() {
  // 🔌 await api.deleteEvent(evSelected.id)
  MOCK_EVENTS = MOCK_EVENTS.filter(e => e.id !== evSelected.id);
  document.getElementById('ev-modal-container').innerHTML = '';
  evModal = null; evSelected = null;
  renderPage();
}

function handleLogout() {
  localStorage.removeItem('token');
  window.location.hash = '#/login';
}

// Exponer globalmente
window.setEvView       = setEvView;
window.evSearchHandler = evSearchHandler;
window.openEvModal     = openEvModal;
window.closeEvModal    = closeEvModal;
window.toggleSwitch    = toggleSwitch;
window.submitEvForm    = submitEvForm;
window.confirmDeleteEv = confirmDeleteEv;
window.handleLogout    = handleLogout;

// ─── Export ───────────────────────────────────────────────────────────────────
export function initEvent() {
  evView = 'list'; evSearch = '';
  renderPage();
}