/* global Chart */
import Sidebar from "../components/sidebar.js";
import Navbar  from "../components/navbar.js";
import { getEvents, getDisciplines, getSpaces, getScenarios, getDashboardMetrics } from "../services/api.js";

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
    try {
        const res = await getDashboardMetrics(currentYear);
        metrics = res?.general_metrics || metrics;
    } catch { /* si falla, mostramos ceros */ }

    const pct = Math.round(metrics.percentage_advance || 0);

    // Calcular total de eventos para gráficas
    const total = events.length;

    // ── Eventos por disciplina ──────────────────────────────────────────────
    const discMap = {};
    disciplines.forEach(d => { discMap[d.id] = d.name; });
    const discCount = {};
    events.forEach(e => {
        const name = discMap[e.discipline_id || e.disciplineId] || 'Sin disciplina';
        discCount[name] = (discCount[name] || 0) + 1;
    });
    const discLabels = Object.keys(discCount);
    const discData   = discLabels.map(l => discCount[l]);

    // ── Eventos por mes (start_date) ────────────────────────────────────────
    const monthCount = new Array(12).fill(0);
    events.forEach(e => {
        const d = new Date(e.start_date || e.startDate || '');
        if (!isNaN(d)) monthCount[d.getMonth()]++;
    });

    // ── Top 2 disciplinas para cards de detalle ─────────────────────────────
    const topDisc = discLabels
        .map(name => ({ name, count: discCount[name] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 2);

    // ── Charts data (disponible en closure para renderCharts) ───────────────
    const chartsData = { pct, discLabels, discData, monthCount, topDisc, total };

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

    // ── Top 2 disciplinas para sección de detalle ────────────────────────────
    function detailCard(disc, idx) {
        const pctDisc = total > 0 ? Math.round((disc.count / total) * 100) : 0;
        const color   = idx === 0 ? '#3DA442' : '#2965EB';
        return `
        <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="font-semibold text-textPrimary mb-4">${disc.name}</h3>
            <div class="flex items-center gap-6">
                <div class="w-[140px] h-[140px] flex-shrink-0">
                    <canvas id="discChart${idx}"></canvas>
                </div>
                <div class="space-y-2">
                    <div><p class="text-xs text-textSecondary">Total eventos</p><p class="font-semibold text-textPrimary">${total}</p></div>
                    <div><p class="text-xs text-textSecondary">En esta disciplina</p><p class="font-semibold" style="color:${color};">${disc.count}</p></div>
                    <div><p class="text-xs text-textSecondary">% del total</p><p class="font-semibold text-textPrimary">${pctDisc}%</p></div>
                </div>
            </div>
        </div>`;
    }

    setTimeout(() => {
        renderCharts(chartsData);

        document.querySelectorAll('[data-module-href]').forEach(card => {
            card.addEventListener('click', () => {
                const href = card.dataset.moduleHref;
                window.location.hash = href.startsWith('#') ? href : '#' + href;
            });
        });
    }, 0);

    return `
    <div class="flex w-full min-h-screen">
        ${Sidebar()}

        <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
            ${Navbar()}

            <main class="flex-1 p-8 bg-gray-50 space-y-8 overflow-y-auto">

                <!-- Encabezado -->
                <div>
                    <h1 class="text-3xl font-bold text-textPrimary">Panel de Control</h1>
                    <p class="text-textSecondary text-sm mt-1">Resumen general del sistema</p>
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
                            <span class="text-xs bg-gray-100 text-textSecondary px-2 py-1 rounded font-medium">Año ${currentYear}</span>
                        </div>
                        <h2 class="text-3xl font-bold mt-4 text-textPrimary">${metrics.total_goal}</h2>
                        <p class="text-textSecondary text-sm mt-1">Meta de Eventos</p>
                        <div class="mt-4 bg-gray-200 h-2 rounded"><div class="bg-neutral h-2 w-full rounded"></div></div>
                    </div>

                    <!-- Completados -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
                        <div class="flex justify-between items-start">
                            <div class="w-10 h-10 bg-green-100 flex items-center justify-center rounded-lg">
                                <i class="fa-solid fa-check text-grn"></i>
                            </div>
                            <span class="text-grn text-sm font-semibold">↗ ${pct}%</span>
                        </div>
                        <h2 class="text-3xl font-bold text-grn mt-4">${metrics.completed_events}</h2>
                        <p class="text-textSecondary text-sm mt-1">Eventos Completados</p>
                        <div class="mt-4 bg-gray-200 h-2 rounded"><div class="bg-grn h-2 rounded" style="width:${pct}%"></div></div>
                    </div>

                    <!-- Pendientes -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
                        <div class="flex justify-between items-start">
                            <div class="w-10 h-10 bg-red-100 flex items-center justify-center rounded-lg">
                                <i class="fa-solid fa-clock text-danger"></i>
                            </div>
                            <span class="text-danger text-sm font-semibold">${100 - pct}%</span>
                        </div>
                        <h2 class="text-3xl font-bold text-danger mt-4">${metrics.pending_events}</h2>
                        <p class="text-textSecondary text-sm mt-1">Eventos Pendientes</p>
                        <div class="mt-4 bg-gray-200 h-2 rounded"><div class="bg-danger h-2 rounded" style="width:${100 - pct}%"></div></div>
                    </div>

                    <!-- % Avance -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle flex flex-col items-center justify-center">
                        <div class="w-[120px] h-[120px]"><canvas id="progressChart"></canvas></div>
                        <p class="text-textSecondary text-sm mt-3">% Avance del Año</p>
                    </div>

                </div>

                <!-- Gráficas -->
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                        <h2 class="font-semibold text-textPrimary mb-1">Eventos por Disciplina</h2>
                        <p class="text-sm text-textSecondary mb-5">Distribución de eventos según disciplina</p>
                        <div class="h-[300px]">
                            <canvas id="departmentChart"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                        <h2 class="font-semibold text-textPrimary mb-1">Tendencia Mensual</h2>
                        <p class="text-sm text-textSecondary mb-5">Eventos por mes según fecha de inicio</p>
                        <div class="h-[300px]">
                            <canvas id="trendChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Detalle por disciplina (top 2) -->
                ${topDisc.length > 0 ? `
                <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                    <div class="mb-6">
                        <h2 class="font-semibold text-textPrimary">Top Disciplinas</h2>
                        <p class="text-sm text-textSecondary">Las disciplinas con más eventos registrados</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${topDisc.map((d, i) => detailCard(d, i)).join('')}
                    </div>
                </div>` : ''}

            </main>
        </div>
    </div>
    `;
}

function renderCharts({ pct, discLabels, discData, monthCount, topDisc, total }) {
    const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

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

    // Eventos por disciplina
    new Chart(document.getElementById('departmentChart'), {
        type: 'bar',
        data: {
            labels: discLabels.length ? discLabels : ['Sin datos'],
            datasets: [{
                label: 'Eventos',
                data: discData.length ? discData : [0],
                backgroundColor: '#3DA442',
                borderRadius: 6
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Tendencia mensual
    new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            labels: MONTHS,
            datasets: [{
                label: 'Eventos',
                data: monthCount,
                borderColor: '#2965EB',
                backgroundColor: 'rgba(41,101,235,0.12)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Top 2 disciplinas (doughnuts)
    topDisc.forEach((disc, i) => {
        const canvas = document.getElementById(`discChart${i}`);
        if (!canvas) return;
        const pctDisc = total > 0 ? Math.round((disc.count / total) * 100) : 0;
        const color   = i === 0 ? '#3DA442' : '#2965EB';
        new Chart(canvas, {
            type: 'doughnut',
            data: { datasets: [{ data: [pctDisc, 100 - pctDisc], backgroundColor: [color, '#e5e7eb'] }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
        });
    });
}
