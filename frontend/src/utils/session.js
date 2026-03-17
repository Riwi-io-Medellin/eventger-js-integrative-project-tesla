// src/utils/session.js
// centralizo todo lo de sesión acá para no repetir lógica en cada página

const SESSION_KEY = 'icrd_session';

// guardo los datos del usuario en localStorage después del login
export function setSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  // el token también queda suelto por si algún módulo lo necesita
  localStorage.setItem('token', data.token || 'mock-token');
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// borro todo al hacer logout
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!getSession();
}

// tomo las dos primeras letras del nombre para el avatar → "Carlos Rodríguez" = "CR"
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// etiqueta legible del rol para mostrar en la interfaz
export function getRoleName(role) {
  const labels = {
    admin_gen:     'Admin General',
    admin_spa:     'Admin Espacios',
    event_creator: 'Coordinador',
    visualizer:    'Visualizador',
  };
  return labels[role] || role;
}
