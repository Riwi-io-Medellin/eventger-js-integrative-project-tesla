// src/utils/toast.js
// la usaba copiada en event.js y spaces.js — la saqué acá para no repetirla

export function toast(type, message) {
  // si Sonner cargó, lo uso; si no, caigo al fallback manual
  if (window.Sonner?.toast) {
    if (type === 'success') window.Sonner.toast.success(message, { duration: 3500 });
    else if (type === 'error') window.Sonner.toast.error(message, { duration: 4000 });
    else window.Sonner.toast.warning(message, { duration: 4000 });
    return;
  }
  let c = { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: '✓' };
  if (type === 'error')   c = { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '✕' };
  if (type === 'warning') c = { bg: '#fefce8', border: '#fef08a', color: '#ca8a04', icon: '⚠' };
  let box = document.getElementById('app-toast-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'app-toast-box';
    box.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.style.cssText = `display:flex;align-items:center;gap:0.75rem;background:${c.bg};border:1.5px solid ${c.border};color:${c.color};border-radius:0.75rem;padding:0.875rem 1.25rem;font-size:0.875rem;font-weight:600;font-family:'DM Sans',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.1);min-width:16rem;max-width:24rem;animation:toastIn 0.3s cubic-bezier(0.22,1,0.36,1);`;
  t.innerHTML = `<span>${c.icon}</span><span>${message}</span>`;
  box.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.3s';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}
