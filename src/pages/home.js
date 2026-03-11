export function initHome() {
  // Si no hay sesión, redirigir al login automáticamente
  window.location.hash = '#/login';
}
