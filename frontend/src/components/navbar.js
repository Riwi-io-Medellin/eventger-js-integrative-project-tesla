import { getSession, getInitials, getRoleName, clearSession } from '../utils/session.js';
import { getNotifications, markNotificationRead } from '../services/api.js';

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const now = new Date();
    const diff = now - d;
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return 'Ahora';
    if (mins < 60)  return `Hace ${mins} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7)   return `Hace ${days}d`;
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

export default function Navbar() {
    const session  = getSession();
    const name     = session?.name || 'Usuario';
    const role     = session?.role || 'visualizer';
    const initials = getInitials(name);
    const roleName = getRoleName(role);
    const shortName = (() => {
        const parts = name.split(' ');
        return parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
    })();

    setTimeout(async () => {
        // Logout
        document.getElementById('navbar-logout-btn')?.addEventListener('click', () => {
            clearSession();
            window.location.hash = '#/login';
        });

        // Bell toggle
        const bellBtn   = document.getElementById('notif-bell-btn');
        const panel     = document.getElementById('notif-panel');
        const backdrop  = document.getElementById('notif-backdrop');

        if (!bellBtn || !panel) return;

        function closePanel() {
            panel.style.display = 'none';
            if (backdrop) backdrop.style.display = 'none';
        }

        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = panel.style.display === 'block';
            if (isOpen) {
                closePanel();
            } else {
                panel.style.display = 'block';
                if (backdrop) backdrop.style.display = 'block';
            }
        });

        if (backdrop) backdrop.addEventListener('click', closePanel);

        // Load notifications
        if (!session?.id) return;
        const list = document.getElementById('notif-list');
        const badge = document.getElementById('notif-badge');

        try {
            let notifications = await getNotifications(session.id);
            notifications = (notifications || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const unread = notifications.filter(n => !n.is_read).length;

            // Update badge
            if (badge) {
                if (unread > 0) {
                    badge.textContent = unread > 9 ? '9+' : String(unread);
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }

            // Render list
            if (list) {
                if (notifications.length === 0) {
                    list.innerHTML = `
                        <div style="text-align:center;padding:2rem 1rem;color:#94a3b8;">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32" style="margin:0 auto 0.5rem;display:block;opacity:0.4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            <p style="font-size:0.8125rem;margin:0;">Sin notificaciones</p>
                        </div>`;
                } else {
                    list.innerHTML = notifications.map(n => `
                        <div id="notif-item-${n.id}" style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.875rem 1rem;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background 0.15s;background:${n.is_read ? '#fff' : '#eff6ff'};"
                            onmouseover="this.style.background='#f8fafc'"
                            onmouseout="this.style.background='${n.is_read ? '#fff' : '#eff6ff'}'">
                            <div style="width:2rem;height:2rem;border-radius:50%;background:${n.is_read ? '#e2e8f0' : '#dbeafe'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:0.1rem;">
                                <svg fill="none" stroke="${n.is_read ? '#94a3b8' : '#2563eb'}" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                            <div style="flex:1;min-width:0;">
                                <p style="font-size:0.8125rem;font-weight:${n.is_read ? '400' : '600'};color:#1e293b;margin:0 0 0.2rem;line-height:1.4;">Nuevo evento programado</p>
                                <p style="font-size:0.75rem;color:#64748b;margin:0;">${formatDate(n.created_at)}</p>
                            </div>
                            ${!n.is_read ? `<div style="width:0.5rem;height:0.5rem;border-radius:50%;background:#2563eb;flex-shrink:0;margin-top:0.35rem;"></div>` : ''}
                        </div>
                    `).join('');

                    // Click to mark as read
                    notifications.forEach(n => {
                        if (n.is_read) return;
                        const item = document.getElementById(`notif-item-${n.id}`);
                        if (!item) return;
                        item.addEventListener('click', async () => {
                            try {
                                await markNotificationRead(n.id);
                                n.is_read = true;
                                item.style.background = '#fff';
                                item.onmouseover = () => item.style.background = '#f8fafc';
                                item.onmouseout  = () => item.style.background = '#fff';
                                // remove blue dot
                                item.querySelector('div[style*="border-radius:50%;background:#2563eb"]')?.remove();
                                // update icon
                                const iconDiv = item.querySelector('div[style*="border-radius:50%"]');
                                if (iconDiv) { iconDiv.style.background = '#e2e8f0'; iconDiv.querySelector('svg')?.setAttribute('stroke', '#94a3b8'); }
                                // update badge
                                if (badge) {
                                    const remaining = parseInt(badge.textContent) - 1;
                                    if (remaining <= 0) badge.style.display = 'none';
                                    else badge.textContent = remaining > 9 ? '9+' : String(remaining);
                                }
                            } catch { /* silently fail */ }
                        });
                    });
                }
            }
        } catch {
            if (badge) badge.style.display = 'none';
            if (list) list.innerHTML = `<p style="text-align:center;padding:1rem;font-size:0.8125rem;color:#94a3b8;">Error al cargar notificaciones</p>`;
        }
    }, 0);

    return `
    <div id="notif-backdrop" style="display:none;position:fixed;inset:0;z-index:149;"></div>
    <nav class="flex pl-5 w-full h-16 justify-between items-center border-b border-gray-200 bg-white">

        <div class="flex items-center mr-6 gap-4 ml-auto">

            <!-- Bell -->
            <div style="position:relative;">
                <button id="notif-bell-btn" title="Notificaciones"
                    class="relative text-gray-500 hover:text-gray-700 transition-colors"
                    style="background:none;border:none;cursor:pointer;padding:0.375rem;border-radius:0.5rem;display:flex;align-items:center;">
                    <i class="fa-regular fa-bell text-lg"></i>
                    <span id="notif-badge" style="display:none;position:absolute;top:-4px;right:-4px;min-width:1rem;height:1rem;background:#ef4444;color:#fff;font-size:0.625rem;font-weight:700;border-radius:9999px;align-items:center;justify-content:center;padding:0 2px;">0</span>
                </button>

                <!-- Panel de notificaciones -->
                <div id="notif-panel" style="display:none;position:absolute;top:calc(100% + 0.5rem);right:0;width:20rem;background:#fff;border:1px solid #e2e8f0;border-radius:0.75rem;box-shadow:0 10px 30px -5px rgba(0,0,0,0.15);z-index:150;overflow:hidden;">
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1rem;border-bottom:1px solid #f1f5f9;">
                        <span style="font-size:0.875rem;font-weight:700;color:#0f172a;">Notificaciones</span>
                    </div>
                    <div id="notif-list" style="max-height:22rem;overflow-y:auto;">
                        <div style="text-align:center;padding:1.5rem;color:#94a3b8;font-size:0.8125rem;">Cargando...</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                    ${initials || `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`}
                </div>

                <div class="flex flex-col leading-tight">
                    <h2 class="text-sm font-semibold text-gray-800">${shortName}</h2>
                    <p class="text-xs text-gray-500">${roleName}</p>
                </div>

                <button id="navbar-logout-btn" title="Cerrar sesión"
                    class="ml-1 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="17" height="17">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </button>
            </div>

        </div>
    </nav>
    `;
}
