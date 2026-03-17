// src/pages/profile.js

import Sidebar from '../components/sidebar.js';
import Navbar  from '../components/navbar.js';
import { getSession, getInitials, getRoleName } from '../utils/session.js';

if (!document.getElementById('profile-style')) {
  const s = document.createElement('style');
  s.id = 'profile-style';
  s.textContent = `
    .prof-card    { background:#fff;border-radius:1rem;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    .ev-card      { background:#fff;border-radius:1rem;border:1px solid #e2e8f0;padding:1rem;transition:box-shadow 0.2s,transform 0.15s;box-shadow:0 1px 3px rgba(0,0,0,0.04); }
    .ev-card:hover { box-shadow:0 8px 24px -4px rgba(0,0,0,0.1);transform:translateY(-2px); }
    .events-grid  { display:grid;grid-template-columns:1fr;gap:1rem; }
    @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    .card-animate { animation:slideUp 0.3s cubic-bezier(0.22,1,0.36,1); }
    @media (min-width:769px) {
      .events-grid  { grid-template-columns:repeat(2,1fr); }
      .prof-grid    { display:grid;grid-template-columns:280px 1fr;gap:1.5rem;align-items:start; }
    }
  `;
  document.head.appendChild(s);
}

// 🔌 estos vendrán del backend cuando conectemos la API
// scenario = complejo/escenario deportivo; space = el espacio dentro de ese escenario
const MOCK_EVENTS = [
  { id:'1', title:'Torneo Interbarrial de Fútbol',  discipline:'Fútbol',      status:'programado', start_date:'2026-03-05', scenario:'Unidad Deportiva Atanasio Girardot',    space:'Estadio Atanasio Girardot',  creator:'Sara Calderón' },
  { id:'2', title:'Liga de Baloncesto Juvenil',     discipline:'Baloncesto',   status:'activo',     start_date:'2026-03-01', scenario:'Polideportivo Sur',                     space:'Coliseo Iván de Bedout',     creator:'Sara Calderón' },
  { id:'3', title:'Copa de Voleibol',               discipline:'Voleibol',     status:'activo',     start_date:'2026-02-28', scenario:'Polideportivo Sur',                     space:'Cancha de Voleibol',         creator:'Jose David Henao' },
  { id:'4', title:'Campeonato de Natación',         discipline:'Natación',     status:'finalizado', start_date:'2026-02-20', scenario:'Complejo Acuático Julio César Noriega', space:'Piscina Olímpica 50m',       creator:'Jose David Henao' },
  { id:'5', title:'Festival de Atletismo',          discipline:'Atletismo',    status:'programado', start_date:'2026-03-25', scenario:'Unidad Deportiva Atanasio Girardot',    space:'Pista Atlética Principal',   creator:'Ana García' },
  { id:'6', title:'Copa de Microfútbol',            discipline:'Microfútbol',  status:'activo',     start_date:'2026-03-10', scenario:'Unidad Deportiva María Paz',            space:'Cancha Múltiple Sur',        creator:'Ana García' },
];

// colores de los chips según la disciplina
const DISCIPLINE_COLORS = {
  'Fútbol':     { bg:'#dcfce7', color:'#16a34a' },
  'Baloncesto': { bg:'#fef3c7', color:'#d97706' },
  'Voleibol':   { bg:'#e0f2fe', color:'#0369a1' },
  'Natación':   { bg:'#ede9fe', color:'#7c3aed' },
  'Atletismo':  { bg:'#fff7ed', color:'#c2410c' },
  'Ciclismo':   { bg:'#fce7f3', color:'#be185d' },
  'Tenis':      { bg:'#ecfdf5', color:'#065f46' },
  'Microfútbol':{ bg:'#f0fdf4', color:'#15803d' },
};

function getDisciplineStyle(discipline) {
  return DISCIPLINE_COLORS[discipline] || { bg:'#f1f5f9', color:'#475569' };
}

function getStatusMeta(status) {
  if (status === 'activo')     return { label:'Activo',      bg:'#f0fdf4', color:'#16a34a' };
  if (status === 'programado') return { label:'Programado',  bg:'#eff6ff', color:'#1d4ed8' };
  return                              { label:'Finalizado',  bg:'#f1f5f9', color:'#64748b' };
}

// badge del rol: color según permisos
function getRoleBadge(role) {
  const map = {
    admin_gen:     { label:'Administrador', bg:'#fee2e2', color:'#dc2626' },
    admin_spa:     { label:'Admin Espacios', bg:'#fef3c7', color:'#d97706' },
    event_creator: { label:'Coordinador',   bg:'#e0f2fe', color:'#0369a1' },
    visualizer:    { label:'Visualizador',  bg:'#f0fdf4', color:'#16a34a' },
  };
  return map[role] || { label: role, bg:'#f1f5f9', color:'#64748b' };
}

// "2025-01-15" → "ene. 2025"
function fmtMonthYear(isoDate) {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' });
}

function fmtDate(isoDate) {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}

function renderEventCard(ev) {
  const disc   = getDisciplineStyle(ev.discipline);
  const status = getStatusMeta(ev.status);
  return `
  <div class="ev-card card-animate">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem;">
      <p style="font-weight:700;color:#1e293b;font-size:0.9375rem;margin:0;line-height:1.3;">${ev.title}</p>
      <span style="flex-shrink:0;padding:0.2rem 0.6rem;border-radius:9999px;font-size:0.7rem;font-weight:600;background:${status.bg};color:${status.color};">${status.label}</span>
    </div>
    <span style="display:inline-block;padding:0.2rem 0.65rem;border-radius:9999px;font-size:0.75rem;font-weight:600;background:${disc.bg};color:${disc.color};margin-bottom:0.75rem;">${ev.discipline}</span>
    <div style="display:flex;flex-direction:column;gap:0.3rem;">
      <div style="display:flex;align-items:center;gap:0.4rem;color:#64748b;font-size:0.8125rem;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        ${fmtDate(ev.start_date)}
      </div>
      <div style="display:flex;align-items:center;gap:0.4rem;color:#64748b;font-size:0.8125rem;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        ${ev.scenario}
      </div>
      <div style="display:flex;align-items:center;gap:0.4rem;color:#94a3b8;font-size:0.75rem;padding-left:1.0625rem;">
        › ${ev.space}
      </div>
    </div>
  </div>`;
}

function render() {
  const session  = getSession();
  const role     = session?.role       || 'visualizer';
  const name     = session?.name       || 'Usuario';
  const email    = session?.email      || '—';
  const dept     = session?.department || '—';
  const since    = session?.createdAt;
  const initials = getInitials(name);
  const badge    = getRoleBadge(role);

  // admin ve todos los eventos, el resto solo los propios
  const myEvents = role === 'admin_gen'
    ? MOCK_EVENTS
    : MOCK_EVENTS.filter((ev) => ev.creator === name);

  const eventCards = myEvents.length
    ? myEvents.map(renderEventCard).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:#94a3b8;">
        <p style="font-size:0.9rem;margin:0;">No tienes eventos creados aún.</p>
      </div>`;

  return `
  <div class="flex w-full min-h-screen">
    ${Sidebar()}

    <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
      ${Navbar()}

      <!-- Contenido -->
      <main class="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div class="prof-grid card-animate">

          <!-- Tarjeta de perfil -->
          <div class="prof-card">
            <!-- Cover con gradiente -->
            <div style="height:5rem;background:linear-gradient(135deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%);"></div>
            <!-- Avatar -->
            <div style="display:flex;flex-direction:column;align-items:center;padding:0 1.25rem 1.25rem;position:relative;">
              <div style="width:4.5rem;height:4.5rem;border-radius:50%;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.25rem;font-weight:700;border:3px solid #fff;margin-top:-2.25rem;box-shadow:0 4px 12px rgba(37,99,235,0.2);">${initials}</div>
              <h2 style="font-size:1.125rem;font-weight:700;color:#1e293b;margin:0.75rem 0 0.125rem;text-align:center;">${name}</h2>
              <p style="font-size:0.8375rem;color:#64748b;margin:0 0 0.75rem;text-align:center;">${email}</p>
              <span style="padding:0.2rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:600;background:${badge.bg};color:${badge.color};">${badge.label}</span>

              <!-- Datos adicionales -->
              <div style="width:100%;margin-top:1.25rem;display:flex;flex-direction:column;gap:0.625rem;border-top:1px solid #f1f5f9;padding-top:1.25rem;">
                <div style="display:flex;align-items:center;gap:0.625rem;color:#475569;font-size:0.8375rem;">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  ${email}
                </div>
                <div style="display:flex;align-items:center;gap:0.625rem;color:#475569;font-size:0.8375rem;">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Miembro desde ${fmtMonthYear(since)}
                </div>
                <div style="display:flex;align-items:center;gap:0.625rem;color:#475569;font-size:0.8375rem;">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  ${dept}
                </div>
              </div>
            </div>
          </div>

          <!-- Eventos creados -->
          <div>
            <h3 style="font-size:1.0625rem;font-weight:700;color:#1e293b;margin:0 0 1rem;">Eventos Creados</h3>
            <div class="events-grid">
              ${eventCards}
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>`;
}

export default function initProfile() {
  document.getElementById('app').innerHTML = render();
}
