/* global Chart */
import Sidebar from "../components/sidebar.js";
import Navbar  from "../components/navbar.js";
import { getEvents, getDisciplines, getSpaces, getScenarios, getDashboardMetrics, getDashboardFilter } from "../services/api.js";

const MODULES = [
    {
        title: 'Muro de Eventos',
        desc: 'Explora y filtra todos los eventos del municipio en tiempo real.',
        href: '/',
        color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6"/></svg>`,
    },
    {
        title: 'Gestión de Eventos',
        desc: 'Crea, edita y administra eventos deportivos y culturales.',
        href: '/eventos',
        color: '#d97706', bg: '#fffbeb', border: '#fde68a',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    },
    {
        title: 'Espacios Deportivos',
        desc: 'Gestiona escenarios y espacios disponibles.',
        href: '/espacios',
        color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    },
    {
        title: 'Gestión de Usuarios',
        desc: 'Administra cuentas, roles y solicitudes de acceso al sistema.',
        href: '/usuarios',
        color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    },
    {
        title: 'Mi Perfil',
        desc: 'Revisa tu información, rol y los eventos que has creado.',
        href: '/perfil',
        color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    },
    {
        title: 'Escenarios',
        desc: 'Administra los complejos deportivos del municipio.',
        href: '/escenarios',
        color: '#0f172a', bg: '#f8fafc', border: '#e2e8f0',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
    },
];

export default async function Dashboard() {
    // ── Cargar datos reales ─────────────────────────────────────────────────
    let events = [], disciplines = [], spaces = [], scenarios = [];
    try {
        [events, disciplines, spaces, scenarios] = await Promise.all([
            getEvents(),
            getDisciplines(),
            getSpaces(),
            getScenarios(),
        ]);
        events     = events     || [];
        disciplines= disciplines|| [];
        spaces     = spaces     || [];
        scenarios  = scenarios  || [];
    } catch {
        // Si falla, mostramos ceros — no bloqueamos la vista
    }

    // ── Métricas del dashboard (endpoint /dashboard/:year) ──────────────────
    const currentYear = new Date().getFullYear();
    let metrics = { total_goal: 0, completed_events: 0, pending_events: 0, percentage_advance: 0 };
    let depMetrics = [];
    try {
        const res = await getDashboardMetrics(currentYear);
        metrics = res?.general_metrics || metrics;
        // general_dep_metrics es un objeto { "NombreDep": { name, department_goals, events_completed, events_pendign } }
        const raw = res?.general_dep_metrics || {};
        depMetrics = Object.values(raw);
    } catch { /* si falla, mostramos ceros */ }

    const pct = Math.round(metrics.percentage_advance || 0);

    // ── Datos filtrados por departamento/disciplina ─────────────────────────
    // { "DepName": [{ discipline_name, goals_per_discipline, evenst_completed, pending_events, percentage }] }
    let filterData = {};
    try {
        filterData = await getDashboardFilter(currentYear) || {};
    } catch { /* no bloquea */ }

    const depNames = Object.keys(filterData);
    const firstDep = depNames[0] || '';
    const firstDiscs = firstDep ? filterData[firstDep] : [];


    // ── Charts data (disponible en closure para renderCharts) ───────────────
    const chartsData = { pct, depMetrics };

    // ── Módulos ─────────────────────────────────────────────────────────────
    const moduleCards = MODULES.map(m => `
        <div data-module-href="${m.href}"
             style="background:${m.bg};border:1.5px solid ${m.border};border-radius:1rem;padding:1.5rem;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;position:relative;overflow:hidden;"
             onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px -4px rgba(0,0,0,0.1)'"
             onmouseout="this.style.transform='none';this.style.boxShadow='none'">
            <div style="width:3rem;height:3rem;border-radius:0.75rem;background:white;border:1.5px solid ${m.border};display:flex;align-items:center;justify-content:center;color:${m.color};margin-bottom:1rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                ${m.icon}
            </div>
            <h3 style="font-size:0.9375rem;font-weight:700;color:#0f172a;margin:0 0 0.375rem;">${m.title}</h3>
            <p style="font-size:0.8125rem;color:#64748b;margin:0;line-height:1.5;">${m.desc}</p>
        </div>
    `).join('');

    setTimeout(() => {
        renderCharts(chartsData);

        document.querySelectorAll('[data-module-href]').forEach(card => {
            card.addEventListener('click', () => {
                const href = card.dataset.moduleHref;
                window.location.hash = href.startsWith('#') ? href : '#' + href;
            });
        });

        window.changeDashYear = async (year) => {
            // Loading state en los KPIs
            ['kpi-goal','kpi-completed','kpi-pending'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '...';
            });
            document.getElementById('kpi-year-label').textContent  = `Año ${year}`;
            document.getElementById('kpi-pct-label').textContent    = '...';
            document.getElementById('kpi-pct-badge').textContent    = '↗ ...';
            document.getElementById('kpi-pending-badge').textContent = '...';

            try {
                const res = await getDashboardMetrics(year);
                const m   = res?.general_metrics || {};
                const raw = res?.general_dep_metrics || {};
                const newPct = Math.round(m.percentage_advance || 0);

                // Actualizar valores
                document.getElementById('kpi-goal').textContent         = m.total_goal      ?? 0;
                document.getElementById('kpi-completed').textContent    = m.completed_events ?? 0;
                document.getElementById('kpi-pending').textContent      = m.pending_events   ?? 0;
                document.getElementById('kpi-pct-label').textContent    = `${newPct}%`;
                document.getElementById('kpi-pct-badge').textContent    = `↗ ${newPct}%`;
                document.getElementById('kpi-pending-badge').textContent = `${100 - newPct}%`;
                document.getElementById('kpi-bar-completed').style.width = `${newPct}%`;
                document.getElementById('kpi-bar-pending').style.width   = `${100 - newPct}%`;

                // Actualizar doughnut
                const pc = Chart.getChart('progressChart');
                if (pc) { pc.data.datasets[0].data = [newPct, 100 - newPct]; pc.update(); }

                // Actualizar gráfica de departamentos
                const deps = Object.values(raw);
                const dc = Chart.getChart('departmentChart');
                if (dc) {
                    dc.data.labels                  = deps.map(d => d.name);
                    dc.data.datasets[0].data        = deps.map(d => d.department_goals);
                    dc.data.datasets[1].data        = deps.map(d => d.events_completed);
                    dc.data.datasets[2].data        = deps.map(d => d.events_pendign);
                    dc.update();
                }
            } catch {
                ['kpi-goal','kpi-completed','kpi-pending'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = '—';
                });
            }
        };

        window.onDepChange = (depName) => {
            const discs = filterData[depName] || [];
            const discSel = document.getElementById('filter-disc');
            discSel.innerHTML = discs.map(d => `<option value="${d.discipline_name}">${d.discipline_name}</option>`).join('');
            document.getElementById('filter-result').innerHTML = renderFilterCards(depName, discs[0] || null, filterData);
        };

        window.onDiscChange = (depName, discName) => {
            const discs = filterData[depName] || [];
            const discObj = discs.find(d => d.discipline_name === discName) || null;
            document.getElementById('filter-result').innerHTML = renderFilterCards(depName, discObj, filterData);
        };
    }, 0);

    return `
    <div class="flex w-full min-h-screen">
        ${Sidebar()}

        <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
            ${Navbar()}

            <main class="flex-1 p-8 bg-gray-50 space-y-8 overflow-y-auto">

                <!-- Encabezado -->
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-textPrimary">Panel de Control</h1>
                        <p class="text-textSecondary text-sm mt-1">Resumen general del sistema</p>
                    </div>
                    <select id="dash-year-select"
                        style="border:1.5px solid #e2e8f0;border-radius:0.625rem;padding:0.5rem 1rem;font-size:0.9375rem;font-weight:600;color:#1e293b;background:#fff;cursor:pointer;outline:none;"
                        onchange="changeDashYear(this.value)">
                        ${[currentYear+1, currentYear, currentYear-1, currentYear-2].map(y =>
                            `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`
                        ).join('')}
                    </select>
                </div>

                <!-- Módulos -->
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.25rem;">
                    ${moduleCards}
                </div>

                <!-- KPIs -->
                <div id="stats" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <!-- Meta del año -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
                        <div class="flex justify-between items-start">
                            <div class="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg">
                                <i class="fa-solid fa-bullseye text-textSecondary"></i>
                            </div>
                            <span id="kpi-year-label" class="text-xs bg-gray-100 text-textSecondary px-2 py-1 rounded font-medium">Año ${currentYear}</span>
                        </div>
                        <h2 id="kpi-goal" class="text-3xl font-bold mt-4 text-textPrimary">${metrics.total_goal}</h2>
                        <p class="text-textSecondary text-sm mt-1">Meta de Eventos</p>
                        <div class="mt-4 bg-gray-200 h-2 rounded"><div class="bg-neutral h-2 w-full rounded"></div></div>
                    </div>

                    <!-- Completados -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
                        <div class="flex justify-between items-start">
                            <div class="w-10 h-10 bg-green-100 flex items-center justify-center rounded-lg">
                                <i class="fa-solid fa-check text-grn"></i>
                            </div>
                            <span id="kpi-pct-badge" class="text-grn text-sm font-semibold">↗ ${pct}%</span>
                        </div>
                        <h2 id="kpi-completed" class="text-3xl font-bold text-grn mt-4">${metrics.completed_events}</h2>
                        <p class="text-textSecondary text-sm mt-1">Eventos Completados</p>
                        <div class="mt-4 bg-gray-200 h-2 rounded"><div id="kpi-bar-completed" class="bg-grn h-2 rounded" style="width:${pct}%"></div></div>
                    </div>

                    <!-- Pendientes -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
                        <div class="flex justify-between items-start">
                            <div class="w-10 h-10 bg-red-100 flex items-center justify-center rounded-lg">
                                <i class="fa-solid fa-clock text-danger"></i>
                            </div>
                            <span id="kpi-pending-badge" class="text-danger text-sm font-semibold">${100 - pct}%</span>
                        </div>
                        <h2 id="kpi-pending" class="text-3xl font-bold text-danger mt-4">${metrics.pending_events}</h2>
                        <p class="text-textSecondary text-sm mt-1">Eventos Pendientes</p>
                        <div class="mt-4 bg-gray-200 h-2 rounded"><div id="kpi-bar-pending" class="bg-danger h-2 rounded" style="width:${100 - pct}%"></div></div>
                    </div>

                    <!-- % Avance -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle flex flex-col items-center justify-center">
                        <div style="position:relative;width:120px;height:120px;">
                            <canvas id="progressChart"></canvas>
                            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
                                <span id="kpi-pct-label" style="font-size:1.375rem;font-weight:700;color:#0f172a;">${pct}%</span>
                            </div>
                        </div>
                        <p class="text-textSecondary text-sm mt-3">% Avance del Año</p>
                    </div>

                </div>

                <!-- Gráfica departamentos -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                    <h2 class="font-semibold text-textPrimary mb-1">Progreso por Departamento</h2>
                    <p class="text-sm text-textSecondary mb-5">Metas, completados y pendientes por departamento</p>
                    <div class="h-[300px]">
                        <canvas id="departmentChart"></canvas>
                    </div>
                </div>

                <!-- Análisis por Departamento / Disciplina -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h2 class="font-semibold text-textPrimary">Análisis Detallado</h2>
                            <p class="text-sm text-textSecondary">Explora el progreso por departamento y disciplina</p>
                        </div>
                        <div class="flex gap-3 flex-wrap">
                            <select id="filter-dep"
                                style="border:1.5px solid #e2e8f0;border-radius:0.625rem;padding:0.5rem 1rem;font-size:0.875rem;color:#1e293b;background:#fff;cursor:pointer;outline:none;min-width:160px;"
                                onchange="onDepChange(this.value)">
                                ${depNames.length
                                    ? depNames.map(d => `<option value="${d}">${d}</option>`).join('')
                                    : '<option value="">Sin datos</option>'}
                            </select>
                            <select id="filter-disc"
                                style="border:1.5px solid #e2e8f0;border-radius:0.625rem;padding:0.5rem 1rem;font-size:0.875rem;color:#1e293b;background:#fff;cursor:pointer;outline:none;min-width:160px;"
                                onchange="onDiscChange(document.getElementById('filter-dep').value, this.value)">
                                ${firstDiscs.map(d => `<option value="${d.discipline_name}">${d.discipline_name}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <!-- Tarjetas de resultado -->
                    <div id="filter-result" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${renderFilterCards(firstDep, firstDiscs[0] || null, filterData)}
                    </div>
                </div>

            </main>
        </div>
    </div>
    `;
}

function renderCharts({ pct, depMetrics }) {

    // Cumplimiento doughnut
    new Chart(document.getElementById('progressChart'), {
        type: 'doughnut',
        data: { datasets: [{ data: [pct, 100 - pct], backgroundColor: ['#2965EB', '#e5e7eb'] }] },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } }
            }
        }
    });

    // Progreso por departamento (agrupado: metas / completados / pendientes)
    const depLabels    = depMetrics.length ? depMetrics.map(d => d.name) : ['Sin datos'];
    const depGoals     = depMetrics.length ? depMetrics.map(d => d.department_goals)  : [0];
    const depCompleted = depMetrics.length ? depMetrics.map(d => d.events_completed)  : [0];
    const depPending   = depMetrics.length ? depMetrics.map(d => d.events_pendign)    : [0];

    new Chart(document.getElementById('departmentChart'), {
        type: 'bar',
        data: {
            labels: depLabels,
            datasets: [
                { label: 'Meta',        data: depGoals,     backgroundColor: '#93c5fd', borderRadius: 4 },
                { label: 'Completados', data: depCompleted, backgroundColor: '#3DA442', borderRadius: 4 },
                { label: 'Pendientes',  data: depPending,   backgroundColor: '#f87171', borderRadius: 4 },
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
            scales: { x: { ticks: { font: { size: 11 } } } }
        }
    });
}

function renderFilterCards(depName, discObj, filterData) {
    if (!depName || !filterData[depName]) {
        return `<div style="grid-column:span 2;text-align:center;padding:2rem;color:#94a3b8;">Sin datos para mostrar</div>`;
    }

    const discs = filterData[depName];
    const totalGoals     = discs.reduce((s, d) => s + (d.goals_per_discipline || 0), 0);
    const totalCompleted = discs.reduce((s, d) => s + (d.evenst_completed     || 0), 0);
    const totalPending   = Math.max(0, discs.reduce((s, d) => s + (d.pending_events || 0), 0));
    const depPct         = Math.min(100, totalGoals > 0 ? Math.round((totalCompleted / totalGoals) * 100) : 0);

    const depCard = `
    <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:1rem;padding:1.5rem;">
        <h3 style="font-weight:700;color:#0f172a;margin:0 0 0.25rem;">${depName}</h3>
        <p style="font-size:0.8125rem;color:#64748b;margin:0 0 1.25rem;">Resumen departamental</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">
            <div style="text-align:center;background:white;border-radius:0.75rem;padding:1rem;border:1px solid #f1f5f9;">
                <p style="font-size:1.5rem;font-weight:700;color:#0f172a;margin:0;">${totalGoals}</p>
                <p style="font-size:0.75rem;color:#64748b;margin:0.25rem 0 0;">Meta total</p>
            </div>
            <div style="text-align:center;background:white;border-radius:0.75rem;padding:1rem;border:1px solid #f1f5f9;">
                <p style="font-size:1.5rem;font-weight:700;color:#16a34a;margin:0;">${totalCompleted}</p>
                <p style="font-size:0.75rem;color:#64748b;margin:0.25rem 0 0;">Completados</p>
            </div>
            <div style="text-align:center;background:white;border-radius:0.75rem;padding:1rem;border:1px solid #f1f5f9;">
                <p style="font-size:1.5rem;font-weight:700;color:#dc2626;margin:0;">${totalPending}</p>
                <p style="font-size:0.75rem;color:#64748b;margin:0.25rem 0 0;">Pendientes</p>
            </div>
        </div>
        <div style="margin-top:1.25rem;">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#64748b;margin-bottom:0.375rem;">
                <span>Avance departamental</span><span>${depPct}%</span>
            </div>
            <div style="background:#e2e8f0;border-radius:9999px;height:8px;">
                <div style="background:#2965EB;border-radius:9999px;height:8px;width:${depPct}%;"></div>
            </div>
        </div>
    </div>`;

    if (!discObj) {
        return depCard + `<div style="display:flex;align-items:center;justify-content:center;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:1rem;padding:1.5rem;color:#94a3b8;">Sin disciplina seleccionada</div>`;
    }

    const discPct     = Math.min(100, Math.round(discObj.percentage || 0));
    const discPending = Math.max(0, discObj.pending_events ?? 0);
    const discCard = `
    <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:1rem;padding:1.5rem;">
        <h3 style="font-weight:700;color:#0f172a;margin:0 0 0.25rem;">${discObj.discipline_name}</h3>
        <p style="font-size:0.8125rem;color:#64748b;margin:0 0 1.25rem;">Detalle de disciplina</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">
            <div style="text-align:center;background:white;border-radius:0.75rem;padding:1rem;border:1px solid #f1f5f9;">
                <p style="font-size:1.5rem;font-weight:700;color:#0f172a;margin:0;">${discObj.goals_per_discipline ?? 0}</p>
                <p style="font-size:0.75rem;color:#64748b;margin:0.25rem 0 0;">Meta</p>
            </div>
            <div style="text-align:center;background:white;border-radius:0.75rem;padding:1rem;border:1px solid #f1f5f9;">
                <p style="font-size:1.5rem;font-weight:700;color:#16a34a;margin:0;">${discObj.evenst_completed ?? 0}</p>
                <p style="font-size:0.75rem;color:#64748b;margin:0.25rem 0 0;">Completados</p>
            </div>
            <div style="text-align:center;background:white;border-radius:0.75rem;padding:1rem;border:1px solid #f1f5f9;">
                <p style="font-size:1.5rem;font-weight:700;color:#dc2626;margin:0;">${discPending}</p>
                <p style="font-size:0.75rem;color:#64748b;margin:0.25rem 0 0;">Pendientes</p>
            </div>
        </div>
        <div style="margin-top:1.25rem;">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#64748b;margin-bottom:0.375rem;">
                <span>% Avance</span><span>${discPct}%</span>
            </div>
            <div style="background:#e2e8f0;border-radius:9999px;height:8px;">
                <div style="background:#3DA442;border-radius:9999px;height:8px;width:${discPct}%;"></div>
            </div>
        </div>
    </div>`;

    return depCard + discCard;
}
