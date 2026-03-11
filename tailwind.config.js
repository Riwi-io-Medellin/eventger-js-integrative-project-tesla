/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind escanea estos archivos para generar solo las clases que usas
  content: [
    './index.html',
    './src/**/*.{js,html}',
  ],

  theme: {
    extend: {
      // ── Paleta de colores del proyecto ──────────────────────
      colors: {
        primary:    '#2563eb',   // Azul vibrante — botones principales
        secondary:  '#60a5fa',   // Azul suavizado — hover y elementos secundarios
        focus:      '#3b82f6',   // Focus ring — accesibilidad
        card:       '#ffffff',   // Fondo de tarjetas
        'input-bg': '#f8fafc',   // Fondo de inputs
        muted:      '#f1f5f9',   // Fondo general y secciones laterales
        accent:     '#e0f2fe',   // Resaltado suave — selecciones activas
        // Tipografía
        'text-main':   '#1e293b', // Títulos y cuerpo principal
        'text-sub':    '#64748b', // Metadatos y descripciones secundarias
        'text-accent': '#0c4a6e', // Links y énfasis sobre fondos claros
        // Bordes y estados
        border:     '#e2e8f0',   // Bordes sutiles
        'switch-bg': '#cbd5e1',  // Componentes inactivos
        danger:     '#ef4444',   // Errores y acciones destructivas
      },

      // ── Tipografía ──────────────────────────────────────────
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Instrument Serif', 'serif'],
      },

      // ── Sombras ─────────────────────────────────────────────
      boxShadow: {
        card: '0 4px 6px -1px rgba(37,99,235,0.06), 0 2px 4px -2px rgba(37,99,235,0.04)',
        lift: '0 20px 40px -8px rgba(37,99,235,0.14), 0 8px 16px -4px rgba(37,99,235,0.08)',
      },
    },
  },

  plugins: [],
};