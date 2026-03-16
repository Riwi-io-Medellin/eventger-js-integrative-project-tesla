// src/main.js
// Punto de entrada de la SPA

import { initRouter } from "./router.js";

// Arranca la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  initRouter();
});
