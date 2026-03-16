// src/utils/layout.js
// sidebar compartido — cada página llama buildSidebar('nombre') para marcar el link activo

import { getSession, clearSession, getInitials, getRoleName } from './session.js';

const ICONS = {
  muro: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6"/></svg>`,
  dashboard: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>`,
  users: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
  events: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  spaces: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  profile: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
  logout: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>`,
};

// qué puede ver cada rol — admin_gen es excepción, ve todo (lo manejo abajo)
const NAV_ITEMS = [
  { label: 'Muro',      page: 'muro',      href: '#/muro',      icon: ICONS.muro,      roles: ['admin_gen','admin_spa','event_creator','visualizer'] },
  { label: 'Dashboard', page: 'dashboard', href: '#/dashboard', icon: ICONS.dashboard, roles: ['admin_spa','event_creator','visualizer'] },
  { label: 'Usuarios',  page: 'users',     href: '#/users',     icon: ICONS.users,     roles: ['admin_gen'] },
  { label: 'Eventos',   page: 'events',    href: '#/events',    icon: ICONS.events,    roles: ['admin_spa','event_creator'] },
  { label: 'Espacios',  page: 'spaces',    href: '#/espaces',   icon: ICONS.spaces,    roles: ['admin_spa'] },
  { label: 'Mi Perfil', page: 'profile',   href: '#/profile',   icon: ICONS.profile,   roles: ['admin_gen','admin_spa','event_creator','visualizer'] },
];

export function buildSidebar(activePage = '') {
  const session  = getSession();
  const role     = session?.role  || 'visualizer';
  const name     = session?.name  || 'Usuario';
  const initials = getInitials(name);
  const roleName = getRoleName(role);

  // el admin ve todo; los demás solo lo suyo
  const visible = role === 'admin_gen'
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => item.roles.includes(role));

  const links = visible.map((item) => `
    <a class="nav-item${activePage === item.page ? ' active' : ''}" href="${item.href}">
      ${item.icon}${item.label}
    </a>`).join('');

  return `
  <aside class="dash-sidebar" id="ev-sidebar">
    <div style="padding:1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid rgba(255,255,255,0.07);">
      <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:#2563eb;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
      </div>
      <div>
        <p style="color:#f1f5f9;font-weight:700;font-size:0.9375rem;margin:0;line-height:1.2;">ICRD Events</p>
        <p style="color:#64748b;font-size:0.7rem;margin:0;">Gestión Deportiva</p>
      </div>
    </div>
    <nav style="flex:1;padding:1rem 0;overflow-y:auto;">
      <span class="nav-group-label">Principal</span>
      ${links}
    </nav>
    <div style="padding:1rem;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:0.75rem;">
      <div style="width:2rem;height:2rem;border-radius:50%;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.7rem;font-weight:700;flex-shrink:0;">${initials}</div>
      <div style="min-width:0;flex:1;">
        <p style="color:#e2e8f0;font-size:0.8rem;font-weight:600;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</p>
        <p style="color:#64748b;font-size:0.7rem;margin:0;">${roleName}</p>
      </div>
      <button id="sidebar-logout-btn"
        style="background:none;border:none;cursor:pointer;color:#64748b;padding:0.25rem;border-radius:0.375rem;transition:color 0.15s;"
        title="Cerrar sesión"
        onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#64748b'">
        ${ICONS.logout}
      </button>
    </div>
  </aside>`;
}

// engancho el logout y el botón hamburguesa — llamar esto después de pintar el HTML
export function bindSidebarLogout() {
  const btn = document.getElementById('sidebar-logout-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      clearSession();
      window.location.hash = '#/login';
    });
  }

  // hamburguesa mobile
  const menuBtn = document.getElementById('ev-menu-btn');
  const sidebar  = document.getElementById('ev-sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}
