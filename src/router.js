// src/router.js
// Router hash-based para SPA vanilla

import { initLogin } from "./pages/login.js";
import { initHome } from "./pages/home.js";
import { initDashboard } from "./pages/dashboard.js";
import { initNotFound } from "./pages/notFound.js";
import { initRegister } from "./pages/register.js";
import { initEvent } from "./pages/event.js";
import { initSpaces, initScenarios } from "./pages/spaces.js";

// ─── Tabla de rutas ───────────────────────────────────────────────────────────
const routes = {
  "#/": initHome,
  "#/login": initLogin,
  "#/register": initRegister,
  "#/dashboard": initDashboard,
  "#/events": initEvent,
  "#/espaces": initSpaces,
  "#/complex": initScenarios,
};

// ─── Guard de autenticación ───────────────────────────────────────────────────
// Páginas que requieren sesión activa
const protectedRoutes = ["#/dashboard"];

function isAuthenticated() {
  // Ajusta esto a como guardas la sesión en tu store/state.js
  // Ej: import { getState } from './store/state.js'; return !!getState().token;
  return !!localStorage.getItem("token");
}

// ─── Motor del router ─────────────────────────────────────────────────────────
function resolve() {
  const hash = window.location.hash || "#/";
  const handler = routes[hash];

  // Ruta protegida sin sesión → redirigir al login
  if (protectedRoutes.includes(hash) && !isAuthenticated()) {
    window.location.hash = "#/login";
    return;
  }

  // Ruta no encontrada
  if (!handler) {
    initNotFound();
    return;
  }

  handler();
}

// ─── Inicialización ───────────────────────────────────────────────────────────
export function initRouter() {
  window.addEventListener("hashchange", resolve);
  resolve(); // cargar la ruta inicial al abrir la app
}
