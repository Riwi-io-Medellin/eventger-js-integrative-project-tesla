// src/components/calendar.js
//
// Usa FullCalendar v6 (cargado desde CDN, sin npm).
// FullCalendar es la librería de calendarios más popular del ecosistema web.
//
// ─── USO ──────────────────────────────────────────────────────────────────────
//
//   import { createCalendar } from '../components/calendar.js';
//
//   const cal = createCalendar({
//     containerId: 'mi-calendario',
//     events: MOCK_EVENTS,          // array de eventos del backend
//     onEventClick: (evInfo) => {},  // opcional
//   });
//
//   cal.setEvents(nuevosEventos);   // actualizar eventos (ej. después del fetch)
//   cal.destroy();                  // limpiar al cambiar de página
//
// ─── FORMATO DE EVENTOS ───────────────────────────────────────────────────────
//   Los eventos de tu tabla event se mapean así:
//   {
//     id:          string  (event.id)
//     title:       string  (event.title)
//     start_date:  ISO     (event.start_date)
//     finish_date: ISO     (event.finish_date)
//     is_active:   bool    (event.is_active)
//     type?:       'bloqueo' | undefined
//     description?: string
//   }

// ─── Carga dinámica de FullCalendar desde CDN ─────────────────────────────────
function loadFullCalendar() {
  return new Promise((resolve, reject) => {
    if (window.FullCalendar) { resolve(); return; }

    // CSS
    if (!document.getElementById('fc-css')) {
      const link = document.createElement('link');
      link.id   = 'fc-css';
      link.rel  = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css';
      document.head.appendChild(link);
    }

    // JS (bundle global — incluye core + daygrid + timegrid + interaction)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js';
    script.onload  = resolve;
    script.onerror = () => reject(new Error('[Calendar] No se pudo cargar FullCalendar'));
    document.head.appendChild(script);
  });
}

// ─── Estilos propios (sobre FullCalendar) ─────────────────────────────────────
function injectStyles() {
  if (document.getElementById('cal-custom-style')) return;
  const s = document.createElement('style');
  s.id = 'cal-custom-style';
  s.textContent = `
    /* ── Contenedor ── */
    .cal-wrapper {
      background: #fff;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
    }
    .cal-wrapper .fc { padding: 1rem 1.25rem 1.25rem; }

    /* ── Toolbar (cabecera) ── */
    .cal-wrapper .fc-toolbar-title {
      font-size: 1.125rem !important;
      font-weight: 700 !important;
      color: #0f172a !important;
      text-transform: capitalize;
    }
    .cal-wrapper .fc-toolbar.fc-header-toolbar {
      margin-bottom: 1rem !important;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .cal-wrapper .fc-button {
      background: #fff !important;
      border: 1.5px solid #e2e8f0 !important;
      color: #64748b !important;
      border-radius: 0.5rem !important;
      font-size: 0.8rem !important;
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 600 !important;
      padding: 0.35rem 0.75rem !important;
      box-shadow: none !important;
      transition: all 0.15s !important;
    }
    .cal-wrapper .fc-button:hover {
      border-color: #2563eb !important;
      color: #2563eb !important;
      background: #eff6ff !important;
    }
    .cal-wrapper .fc-button-primary:not(:disabled).fc-button-active,
    .cal-wrapper .fc-button-primary:not(:disabled):active {
      background: #2563eb !important;
      border-color: #2563eb !important;
      color: #fff !important;
    }
    .cal-wrapper .fc-today-button {
      text-transform: capitalize !important;
    }

    /* ── Cabeceras de día ── */
    .cal-wrapper .fc-col-header-cell-cushion {
      font-size: 0.72rem !important;
      font-weight: 700 !important;
      color: #94a3b8 !important;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      text-decoration: none !important;
      padding: 0.5rem 0 !important;
    }
    .cal-wrapper .fc-col-header-cell { border-color: #f1f5f9 !important; background: #f8fafc; }

    /* ── Celdas de día ── */
    .cal-wrapper .fc-daygrid-day { cursor: pointer; transition: background 0.12s; }
    .cal-wrapper .fc-daygrid-day:hover { background: #f8fafc !important; }
    .cal-wrapper .fc-day-today { background: #eff6ff !important; }
    .cal-wrapper .fc-daygrid-day-number {
      font-size: 0.85rem !important;
      font-weight: 600 !important;
      color: #1e293b !important;
      text-decoration: none !important;
      padding: 0.4rem 0.5rem !important;
    }
    .cal-wrapper .fc-day-today .fc-daygrid-day-number {
      background: #2563eb;
      color: #fff !important;
      border-radius: 50%;
      width: 1.75rem; height: 1.75rem;
      display: flex; align-items: center; justify-content: center;
      margin: 0.25rem;
    }
    .cal-wrapper .fc-day-other .fc-daygrid-day-number { color: #cbd5e1 !important; }

    /* Bordes de la grilla */
    .cal-wrapper .fc-scrollgrid { border-color: #e2e8f0 !important; border-radius: 0; }
    .cal-wrapper td, .cal-wrapper th { border-color: #f1f5f9 !important; }

    /* ── Chips de evento ── */
    .cal-wrapper .fc-daygrid-event {
      border-radius: 0.35rem !important;
      border: none !important;
      font-size: 0.72rem !important;
      font-weight: 600 !important;
      padding: 0.15rem 0.5rem !important;
      margin: 0.1rem 0.25rem !important;
      cursor: pointer;
      transition: filter 0.1s !important;
    }
    .cal-wrapper .fc-daygrid-event:hover { filter: brightness(0.9); }

    /* Colores: evento (azul) / bloqueo (rojo) — se asignan por className */
    .cal-wrapper .fc-event.ev-evento  { background: #dbeafe !important; color: #1d4ed8 !important; }
    .cal-wrapper .fc-event.ev-bloqueo { background: #fee2e2 !important; color: #b91c1c !important; }
    .cal-wrapper .fc-event.ev-inactivo { background: #fef9c3 !important; color: #a16207 !important; }

    /* punto de color en eventos que desbordan */
    .cal-wrapper .fc-daygrid-event-dot { display: none !important; }

    /* ── Panel lateral de día (custom) ── */
    .cal-day-overlay {
      position: fixed; inset: 0;
      background: rgba(15,23,42,0.3);
      z-index: 299;
      backdrop-filter: blur(3px);
      animation: calFadeIn 0.2s ease;
    }
    .cal-day-panel {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 22rem; max-width: 100vw;
      background: #fff;
      border-left: 1px solid #e2e8f0;
      z-index: 300;
      display: flex; flex-direction: column;
      box-shadow: -8px 0 32px rgba(0,0,0,0.1);
      animation: calSlideIn 0.28s cubic-bezier(0.22,1,0.36,1);
      font-family: 'DM Sans', sans-serif;
    }
    .cal-panel-head {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex; align-items: flex-start; justify-content: space-between;
      flex-shrink: 0;
    }
    .cal-panel-close {
      width: 2rem; height: 2rem;
      border-radius: 0.5rem; border: none; background: none;
      cursor: pointer; color: #94a3b8;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .cal-panel-close:hover { background: #f1f5f9; color: #1e293b; }

    /* Timeline */
    .cal-timeline { flex: 1; overflow-y: auto; padding: 0.5rem 0; }
    .cal-hour-block {
      display: flex; gap: 0;
      min-height: 3rem;
      border-bottom: 1px solid #f8fafc;
    }
    .cal-hour-label {
      width: 3.5rem; flex-shrink: 0;
      font-size: 0.7rem; font-weight: 600; color: #cbd5e1;
      text-align: right; padding: 0.625rem 0.75rem 0 0;
    }
    .cal-hour-slots {
      flex: 1; padding: 0.35rem 1rem 0.35rem 0;
      display: flex; flex-direction: column; gap: 0.25rem;
    }
    .cal-ev-slot {
      display: flex; align-items: center; gap: 0.5rem;
      border-radius: 0.5rem; padding: 0.375rem 0.75rem;
      font-size: 0.78rem; font-weight: 600;
      border-left: 3px solid transparent;
      transition: filter 0.12s;
    }
    .cal-ev-slot.ev-evento  { background: #dbeafe; color: #1d4ed8; border-left-color: #2563eb; }
    .cal-ev-slot.ev-bloqueo { background: #fee2e2; color: #b91c1c; border-left-color: #ef4444; }
    .cal-ev-slot.ev-inactivo { background: #fef9c3; color: #a16207; border-left-color: #ca8a04; }
    .cal-slot-time { font-size: 0.67rem; opacity: 0.75; margin-left: auto; white-space: nowrap; }

    /* Leyenda */
    .cal-legend {
      display: flex; gap: 0.875rem; flex-wrap: wrap;
      padding: 0.875rem 1.5rem;
      border-top: 1px solid #f1f5f9; flex-shrink: 0;
    }
    .cal-legend-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; color: #64748b; font-family: 'DM Sans', sans-serif; }
    .cal-legend-dot { width: 0.7rem; height: 0.7rem; border-radius: 0.2rem; flex-shrink: 0; }

    /* Estado vacío */
    .cal-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; flex: 1;
      padding: 3rem 1.5rem; text-align: center; color: #94a3b8; gap: 0.75rem;
    }
    .cal-empty p { font-size: 0.875rem; margin: 0; font-family: 'DM Sans', sans-serif; }

    @keyframes calFadeIn  { from { opacity: 0 }            to { opacity: 1 } }
    @keyframes calSlideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
    @keyframes calSlideOut{ from { transform: translateX(0) }    to { transform: translateX(100%) } }

    @media (max-width: 640px) {
      .cal-day-panel { width: 100vw; }
    }
  `;
  document.head.appendChild(s);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hhmm(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

/** Clasifica el evento para asignarle color */
function evClass(ev) {
  if (ev.type === 'bloqueo') return 'ev-bloqueo';
  if (!ev.is_active)         return 'ev-inactivo';
  return 'ev-evento';
}

/** Convierte un evento del backend al formato que FullCalendar espera */
function toFCEvent(ev) {
  return {
    id:        ev.id,
    title:     ev.title,
    start:     ev.start_date,
    end:       ev.finish_date,
    classNames: [evClass(ev)],
    extendedProps: { raw: ev },   // guardamos el objeto original para el panel
  };
}

/** Eventos que tocan el día `date` */
function eventsOnDay(events, date) {
  const dayStart = new Date(date); dayStart.setHours(0,0,0,0);
  const dayEnd   = new Date(date); dayEnd.setHours(23,59,59,999);
  return events.filter(ev => {
    const s = new Date(ev.start_date);
    const f = new Date(ev.finish_date);
    return s <= dayEnd && f >= dayStart;
  });
}

/** Eventos activos en la hora `h` del día `date` */
function eventsInHour(events, date, h) {
  const hStart = new Date(date); hStart.setHours(h, 0, 0, 0);
  const hEnd   = new Date(date); hEnd.setHours(h, 59, 59, 999);
  return events.filter(ev => {
    const s = new Date(ev.start_date);
    const f = new Date(ev.finish_date);
    return s <= hEnd && f >= hStart;
  });
}

// ─── Panel lateral de día ─────────────────────────────────────────────────────
function buildDayPanelHTML(dateStr, events) {
  const date   = new Date(dateStr + 'T00:00:00');
  const dayEvs = eventsOnDay(events, date);

  const dateLabel = date.toLocaleDateString('es-CO', {
    weekday:'long', day:'numeric', month:'long', year:'numeric',
  });

  // Rango de horas: ±1h alrededor de los eventos, o 07–22 si no hay
  let minH = 7, maxH = 22;
  if (dayEvs.length) {
    const starts = dayEvs.map(ev => new Date(ev.start_date).getHours());
    const ends   = dayEvs.map(ev => new Date(ev.finish_date).getHours());
    minH = Math.max(0,  Math.min(...starts) - 1);
    maxH = Math.min(23, Math.max(...ends)   + 1);
  }

  const rows = [];
  for (let h = minH; h <= maxH; h++) {
    const slotEvs = eventsInHour(events, date, h);
    const slots   = slotEvs.map(ev => `
      <div class="cal-ev-slot ${evClass(ev)}">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12" style="flex-shrink:0;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${ev.title}</span>
        <span class="cal-slot-time">${hhmm(ev.start_date)} – ${hhmm(ev.finish_date)}</span>
      </div>`).join('');

    rows.push(`
      <div class="cal-hour-block">
        <div class="cal-hour-label">${String(h).padStart(2,'0')}:00</div>
        <div class="cal-hour-slots">${slots}</div>
      </div>`);
  }

  const emptyState = dayEvs.length === 0 ? `
    <div class="cal-empty">
      <svg fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" width="44" height="44">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p>No hay eventos<br>para este día</p>
    </div>` : '';

  return `
    <div class="cal-day-overlay" id="cal-overlay"></div>
    <div class="cal-day-panel" id="cal-panel">
      <div class="cal-panel-head">
        <div>
          <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin:0 0 0.3rem;">
            ${dayEvs.length} evento${dayEvs.length !== 1 ? 's' : ''}
          </p>
          <h3 style="font-size:1rem;font-weight:700;color:#0f172a;margin:0;text-transform:capitalize;">
            ${dateLabel}
          </h3>
        </div>
        <button class="cal-panel-close" id="cal-panel-close">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="cal-timeline">
        ${emptyState || rows.join('')}
      </div>

      <div class="cal-legend">
        <div class="cal-legend-item">
          <div class="cal-legend-dot" style="background:#2563eb;"></div> Evento activo
        </div>
        <div class="cal-legend-item">
          <div class="cal-legend-dot" style="background:#ef4444;"></div> Bloqueo
        </div>
        <div class="cal-legend-item">
          <div class="cal-legend-dot" style="background:#ca8a04;"></div> Pendiente
        </div>
      </div>
    </div>`;
}

// ─── Factory principal ────────────────────────────────────────────────────────
/**
 * createCalendar({ containerId, events, onEventClick? })
 * Retorna: { setEvents(arr), destroy() }
 */
export async function createCalendar({ containerId, events = [], onEventClick = null }) {
  injectStyles();
  await loadFullCalendar();

  const container = document.getElementById(containerId);
  if (!container) {
    return null;
  }
  container.classList.add('cal-wrapper');

  let calEvents = [...events];
  let fcInstance = null;
  let panelOpen  = false;

  // Nodo raíz del panel (fuera del calendario para no interferir con FullCalendar)
  const panelRoot = document.createElement('div');
  panelRoot.id = 'cal-panel-root';
  document.body.appendChild(panelRoot);

  // ── Abrir/cerrar panel ──
  function openPanel(dateStr) {
    closePanel(false);
    panelOpen = true;
    panelRoot.innerHTML = buildDayPanelHTML(dateStr, calEvents);
    document.getElementById('cal-overlay')?.addEventListener('click', () => closePanel(true));
    document.getElementById('cal-panel-close')?.addEventListener('click', () => closePanel(true));
    const dayEvs = eventsOnDay(calEvents, new Date(dateStr + 'T00:00:00'));
    if (onEventClick) onEventClick(dateStr, dayEvs);
  }

  function closePanel(animate) {
    if (!panelRoot.innerHTML) return;
    panelOpen = false;
    if (animate) {
      const panel = document.getElementById('cal-panel');
      if (panel) {
        panel.style.animation = 'calSlideOut 0.22s cubic-bezier(0.22,1,0.36,1) forwards';
        setTimeout(() => { panelRoot.innerHTML = ''; }, 220);
        return;
      }
    }
    panelRoot.innerHTML = '';
  }

  // ── Inicializar FullCalendar ──
  fcInstance = new window.FullCalendar.Calendar(container, {
    initialView:  'dayGridMonth',
    locale:       'es',
    height:       'auto',
    firstDay:     1,            // semana empieza en lunes
    headerToolbar: {
      left:   'prev,next today',
      center: 'title',
      right:  '',               // sin cambio de vista (solo mes)
    },
    buttonText: {
      today: 'Hoy',
    },
    events: calEvents.map(toFCEvent),
    eventDisplay: 'block',

    // Click en un día (celda vacía o número)
    dateClick(info) {
      openPanel(info.dateStr);
    },

    // Click en un chip de evento → también abre el panel del día
    eventClick(info) {
      const dateStr = info.event.startStr.slice(0, 10);
      openPanel(dateStr);
    },

    // Tooltip básico con descripción al hacer hover
    eventDidMount(info) {
      const raw = info.event.extendedProps.raw;
      if (raw?.description) {
        info.el.title = raw.description;
      }
    },
  });

  fcInstance.render();

  // ── API pública ──
  return {
    /** Reemplaza los eventos (llámalo después de fetch a la API) */
    setEvents(newEvents) {
      calEvents = [...newEvents];
      fcInstance.removeAllEvents();
      fcInstance.addEventSource(calEvents.map(toFCEvent));
      closePanel(false);
    },

    /** Limpia todo al cambiar de página */
    destroy() {
      fcInstance?.destroy();
      panelRoot?.remove();
      container.classList.remove('cal-wrapper');
      container.innerHTML = '';
    },
  };
}