// src/router.js
// Router hash-based con protección de rutas por sesión y por rol.

import { initLogin }    from './pages/login.js';
import { initHome }     from './pages/home.js';
import { initDashboard } from './pages/dashboard.js';
import { initNotFound } from './pages/notFound.js';
import { initRegister } from './pages/register.js';
import { initEvent }    from './pages/event.js';
import { initProfile }  from './pages/profile.js';
import { initSpaces, initScenarios } from './pages/spaces.js';
import { getSession }   from './utils/session.js';

const routes = {
  '#/':         initHome,
  '#/login':    initLogin,
  '#/register': initRegister,
  '#/dashboard': initDashboard,
  '#/events':   initEvent,
  '#/espaces':  initSpaces,
  '#/complex':  initScenarios,
  '#/profile':  initProfile,
};

// null = cualquier usuario logueado; array = solo esos roles
const routeRoles = {
  '#/dashboard': null,
  '#/events':    ['admin_gen', 'admin_spa', 'event_creator'],
  '#/espaces':   ['admin_gen', 'admin_spa'],
  '#/complex':   ['admin_gen', 'admin_spa'],
  '#/profile':   null,
};

function resolve() {
  const hash    = window.location.hash || '#/';
  const handler = routes[hash];

  const isPublic = ['#/', '#/login', '#/register'].includes(hash);
  if (isPublic) {
    handler ? handler() : initNotFound();
    return;
  }

  const session = getSession();
  if (!session) {
    window.location.hash = '#/login';
    return;
  }

  // tiene sesión pero no tiene permiso para esta ruta
  const allowedRoles = routeRoles[hash];
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    window.location.hash = '#/muro';
    return;
  }

  handler ? handler() : initNotFound();
}

export function initRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
