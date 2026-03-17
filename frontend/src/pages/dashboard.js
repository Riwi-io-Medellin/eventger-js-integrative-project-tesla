import Sidebar from "../components/sidebar.js";
import Navbar from "../components/navbar.js";

const MODULES = [
    {
        title: 'Muro de Eventos',
        desc: 'Explora y filtra todos los eventos del municipio en tiempo real.',
        href: '/',
        color: '#2563eb',
        bg: '#eff6ff',
        border: '#bfdbfe',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6"/></svg>`,
    },
    {
        title: 'Gestión de Eventos',
        desc: 'Crea, edita y administra eventos deportivos y culturales.',
        href: '/eventos',
        color: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    },
    {
        title: 'Espacios Deportivos',
        desc: 'Consulta la disponibilidad y detalles de escenarios deportivos.',
        href: '#/espacios',
        color: '#16a34a',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
        badge: 'Próximamente',
    },
    {
        title: 'Gestión de Usuarios',
        desc: 'Administra cuentas, roles y solicitudes de acceso al sistema.',
        href: '/usuarios',
        color: '#7c3aed',
        bg: '#f5f3ff',
        border: '#ddd6fe',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    },
    {
        title: 'Mi Perfil',
        desc: 'Revisa tu información, rol y los eventos que has creado.',
        href: '/perfil',
        color: '#0891b2',
        bg: '#ecfeff',
        border: '#a5f3fc',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    },
    {
        title: 'Estadísticas',
        desc: 'Indicadores de cumplimiento y progreso por departamento.',
        href: '#stats',
        color: '#0f172a',
        bg: '#f8fafc',
        border: '#e2e8f0',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
    },
];

export default function Dashboard() {
    setTimeout(() => {
        renderCharts();
        initFilters();

        // navegación de las tarjetas de módulo
        document.querySelectorAll('[data-module-href]').forEach(card => {
            card.addEventListener('click', () => {
                const href = card.dataset.moduleHref;
                if (href.startsWith('#stats')) return; // ancla local
                window.location.hash = href.startsWith('#') ? href : '#' + href;
            });
        });
    }, 0);

    const moduleCards = MODULES.map(m => `
        <div data-module-href="${m.href}"
             style="background:${m.bg};border:1.5px solid ${m.border};border-radius:1rem;padding:1.5rem;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;position:relative;overflow:hidden;"
             onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px -4px rgba(0,0,0,0.1)'"
             onmouseout="this.style.transform='none';this.style.boxShadow='none'">
            ${m.badge ? `<span style="position:absolute;top:0.75rem;right:0.75rem;background:#e0f2fe;color:#0369a1;font-size:0.65rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:9999px;">${m.badge}</span>` : ''}
            <div style="width:3rem;height:3rem;border-radius:0.75rem;background:white;border:1.5px solid ${m.border};display:flex;align-items:center;justify-content:center;color:${m.color};margin-bottom:1rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                ${m.icon}
            </div>
            <h3 style="font-size:0.9375rem;font-weight:700;color:#0f172a;margin:0 0 0.375rem;">${m.title}</h3>
            <p style="font-size:0.8125rem;color:#64748b;margin:0;line-height:1.5;">${m.desc}</p>
        </div>
    `).join('');

    return `
    <div class="flex w-full min-h-screen">
        ${Sidebar()}

        <div class="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
            ${Navbar()}

            <main class="flex-1 p-8 bg-gray-50 space-y-8 overflow-y-auto">

                <!-- Encabezado -->
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-textPrimary">Panel de Control</h1>
                        <p class="text-textSecondary text-sm mt-1">Accede rápidamente a todos los módulos del sistema</p>
                    </div>
                    <select class="border border-borderSubtle rounded-lg px-3 py-2 bg-white text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-focus">
                        <option>2026</option>
                        <option>2025</option>
                    </select>
                </div>

                <!-- Módulos -->
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.25rem;">
                    ${moduleCards}
                </div>

                <!-- KPIs -->
                <div id="stats" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    ${metaCard()}
                    ${completedCard()}
                    ${pendingCard()}
                    ${progressCard()}
                </div>

                <!-- Gráficas -->
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                        <h2 class="font-semibold text-textPrimary mb-1">Progreso por Departamento</h2>
                        <p class="text-sm text-textSecondary mb-5">Comparación de eventos completados vs pendientes</p>
                        <div class="h-[300px]">
                            <canvas id="departmentChart"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                        <h2 class="font-semibold text-textPrimary mb-1">Tendencia Mensual</h2>
                        <p class="text-sm text-textSecondary mb-5">Eventos completados por mes</p>
                        <div class="h-[300px]">
                            <canvas id="trendChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm border border-borderSubtle">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div>
                            <h2 class="font-semibold text-textPrimary">Análisis Detallado</h2>
                            <p class="text-sm text-textSecondary">Explora el progreso por subgerencia y categoría</p>
                        </div>
                        <div class="flex gap-3">
                            <select id="subgerenciaSelect" class="border border-borderSubtle rounded-lg px-3 py-2 bg-white text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-focus">
                                <option value="deporte">Recreación y Deporte</option>
                                <option value="actividad">Actividad Física</option>
                                <option value="cultural">Eventos Culturales</option>
                            </select>
                            <select id="categoriaSelect" class="border border-borderSubtle rounded-lg px-3 py-2 bg-white text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-focus">
                                <option>Fútbol</option>
                                <option>Baloncesto</option>
                                <option>Atletismo</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-gray-50 rounded-xl p-6">
                            <h3 class="font-semibold text-textPrimary mb-4">Deportes</h3>
                            <div class="flex items-center gap-6">
                                <div class="w-[140px] h-[140px] flex-shrink-0">
                                    <canvas id="sportsProgress"></canvas>
                                </div>
                                <div class="space-y-2">
                                    <div><p class="text-xs text-textSecondary">Meta</p><p class="font-semibold text-textPrimary">35</p></div>
                                    <div><p class="text-xs text-textSecondary">Completados</p><p class="font-semibold text-grn">28</p></div>
                                    <div><p class="text-xs text-textSecondary">Pendientes</p><p class="font-semibold text-danger">7</p></div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-6">
                            <h3 class="font-semibold text-textPrimary mb-4">Fútbol</h3>
                            <div class="flex items-center gap-6">
                                <div class="w-[140px] h-[140px] flex-shrink-0">
                                    <canvas id="footballProgress"></canvas>
                                </div>
                                <div class="space-y-2">
                                    <div><p class="text-xs text-textSecondary">Meta</p><p class="font-semibold text-textPrimary">25</p></div>
                                    <div><p class="text-xs text-textSecondary">Completados</p><p class="font-semibold text-grn">18</p></div>
                                    <div><p class="text-xs text-textSecondary">Pendientes</p><p class="font-semibold text-danger">7</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    </div>
    `;
}

function metaCard() {
    return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
        <div class="flex justify-between items-start">
            <div class="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg">
                <i class="fa-solid fa-bullseye text-textSecondary"></i>
            </div>
            <span class="text-xs bg-gray-100 text-textSecondary px-2 py-1 rounded font-medium">Año 2026</span>
        </div>
        <h2 class="text-3xl font-bold mt-4 text-textPrimary">120</h2>
        <p class="text-textSecondary text-sm mt-1">Eventos Meta</p>
        <div class="mt-4 bg-gray-200 h-2 rounded"><div class="bg-neutral h-2 w-full rounded"></div></div>
    </div>`;
}

function completedCard() {
    return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
        <div class="flex justify-between items-start">
            <div class="w-10 h-10 bg-green-100 flex items-center justify-center rounded-lg">
                <i class="fa-solid fa-check text-grn"></i>
            </div>
            <span class="text-grn text-sm font-semibold">↗ 71%</span>
        </div>
        <h2 class="text-3xl font-bold text-grn mt-4">85</h2>
        <p class="text-textSecondary text-sm mt-1">Completados</p>
        <div class="mt-4 bg-gray-200 h-2 rounded"><div class="bg-grn h-2 w-[71%] rounded"></div></div>
    </div>`;
}

function pendingCard() {
    return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle">
        <div class="flex justify-between items-start">
            <div class="w-10 h-10 bg-red-100 flex items-center justify-center rounded-lg">
                <i class="fa-solid fa-clock text-danger"></i>
            </div>
            <span class="text-danger text-sm font-semibold flex items-center gap-1">
                <i class="fa-solid fa-triangle-exclamation"></i> 29%
            </span>
        </div>
        <h2 class="text-3xl font-bold text-danger mt-4">35</h2>
        <p class="text-textSecondary text-sm mt-1">Pendientes</p>
        <div class="mt-4 bg-gray-200 h-2 rounded"><div class="bg-danger h-2 w-[29%] rounded"></div></div>
    </div>`;
}

function progressCard() {
    return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-borderSubtle flex flex-col items-center justify-center">
        <div class="w-[120px] h-[120px]"><canvas id="progressChart"></canvas></div>
        <p class="text-textSecondary text-sm mt-3">Cumplimiento General</p>
    </div>`;
}

function renderCharts() {
    new Chart(document.getElementById('progressChart'), {
        type: 'doughnut',
        data: { datasets: [{ data: [71, 29], backgroundColor: ['#2965EB', '#e5e7eb'] }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
    });

    new Chart(document.getElementById('departmentChart'), {
        type: 'bar',
        data: {
            labels: ['Deportes', 'Juventud', 'Turismo', 'Salud', 'Educación', 'Comunidad'],
            datasets: [
                { label: 'Completados', data: [28, 18, 12, 10, 9, 8], backgroundColor: '#3DA442' },
                { label: 'Pendientes',  data: [8, 6, 6, 5, 5, 4],    backgroundColor: '#d1d5db' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Completados',
                data: [8, 9, 10, 8, 9, 10, 8, 7, 6, 5, 3, 2],
                borderColor: '#2965EB',
                backgroundColor: 'rgba(41,101,235,0.12)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('sportsProgress'), {
        type: 'doughnut',
        data: { datasets: [{ data: [80, 20], backgroundColor: ['#3DA442', '#e5e7eb'] }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
    });

    new Chart(document.getElementById('footballProgress'), {
        type: 'doughnut',
        data: { datasets: [{ data: [72, 28], backgroundColor: ['#2965EB', '#e5e7eb'] }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
    });
}

function initFilters() {
    const categorias = {
        deporte:   ['Fútbol', 'Baloncesto', 'Atletismo', 'Natación'],
        actividad: ['Aeróbicos', 'Yoga', 'Gimnasia', 'Crossfit'],
        cultural:  ['Teatro', 'Música', 'Danza', 'Exposiciones']
    };

    const sub = document.getElementById('subgerenciaSelect');
    const cat = document.getElementById('categoriaSelect');

    sub?.addEventListener('change', () => {
        cat.innerHTML = '';
        categorias[sub.value]?.forEach(c => {
            const option = document.createElement('option');
            option.textContent = c;
            cat.appendChild(option);
        });
    });
}
