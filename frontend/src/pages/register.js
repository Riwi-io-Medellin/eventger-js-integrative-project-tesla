// src/pages/register.js
import { register as apiRegister } from '../services/api.js'; // función de registro del archivo central de la API

// Departamentos mapeados desde la BD
const DEPARTMENTS = [
  {
    id: "dept-c108f73c-dcb5-4052-b098-da3940b3e3e2",
    name: "Fomento Deportivo",
  },
  { id: "dept-fe464789-961f-47d3-beb7-3087b80823af", name: "Actividad Física" },
  {
    id: "dept-480a50f7-bcc6-4e63-be3a-ffaee45d5bcd",
    name: "Cultura Deportiva",
  },
  {
    id: "dept-c48c2dc1-3e13-4e5d-8bc3-7c13a42d0a0a",
    name: "Espacios Deportivos",
  },
];

// ─── NOTA: reemplaza los id de arriba con los UUID reales de tu tabla department
// Ejemplo: { id: 'aa669537-0d75-41e7-bd94-055997017e5b', name: 'Fomento Deportivo' }

const templateForm = /* html */ `
  <div style="display:flex; min-height:100vh; font-family:'DM Sans',sans-serif;">

    <!-- Panel izquierdo azul -->
    <div class="reg-brand" style="
      position:relative;
      width:50%;
      min-height:100vh;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      padding:2.5rem;
      overflow:hidden;
      background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 35%, #2563eb 60%, #3b82f6 100%);
      flex-shrink:0;
    ">
      <div style="position:absolute; top:-6rem; left:-4rem; width:22rem; height:22rem; border-radius:50%; background:rgba(255,255,255,0.06); pointer-events:none;"></div>
      <div style="position:absolute; top:8rem; right:-5rem; width:18rem; height:18rem; border-radius:50%; background:rgba(255,255,255,0.05); pointer-events:none;"></div>
      <div style="position:absolute; bottom:-4rem; left:30%; width:20rem; height:20rem; border-radius:50%; background:rgba(255,255,255,0.05); pointer-events:none;"></div>
      <div style="position:absolute; bottom:6rem; right:1rem; width:8rem; height:8rem; border-radius:50%; border:2px solid rgba(255,255,255,0.15); pointer-events:none;"></div>

      <!-- Logo -->
      <div style="display:flex; align-items:center; gap:0.625rem; position:relative; z-index:1;">
        <div style="width:2.5rem; height:2.5rem; border-radius:0.625rem; background:rgba(255,255,255,0.18); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0;">
          <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
        </div>
        <span style="color:#fff; font-weight:700; font-size:1.125rem; letter-spacing:-0.01em;">EventgerJS</span>
      </div>

      <!-- Texto central -->
      <div style="position:relative; z-index:1;">
        <h1 style="font-family:'Instrument Serif',serif; color:#fff; font-size:clamp(1.75rem,3vw,2.75rem); line-height:1.2; margin:0 0 1.25rem; font-weight:400;">
          Únete a la<br/><em style="font-style:italic;">nueva generación</em><br/>de eventos
        </h1>
        <p style="color:rgba(255,255,255,0.7); font-size:0.9375rem; line-height:1.7; max-width:22rem; margin:0;">
          Crea tu cuenta y empieza a gestionar eventos en tiempo real con tu equipo.
        </p>
      </div>

      <!-- Features -->
      <div style="position:relative; z-index:1; display:flex; flex-direction:column; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.75rem; border-radius:0.75rem; padding:0.75rem 1rem; background:rgba(255,255,255,0.10); backdrop-filter:blur(6px);">
          <div style="width:2rem; height:2rem; border-radius:0.5rem; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.15); color:#7dd3fc; flex-shrink:0;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div>
            <p style="color:#fff; font-size:0.875rem; font-weight:500; margin:0;">Acceso controlado</p>
            <p style="color:#93c5fd; font-size:0.75rem; margin:0;">Tu cuenta será revisada y aprobada</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem; border-radius:0.75rem; padding:0.75rem 1rem; background:rgba(255,255,255,0.10); backdrop-filter:blur(6px);">
          <div style="width:2rem; height:2rem; border-radius:0.5rem; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.15); color:#7dd3fc; flex-shrink:0;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <p style="color:#fff; font-size:0.875rem; font-weight:500; margin:0;">Listo en minutos</p>
            <p style="color:#93c5fd; font-size:0.75rem; margin:0;">Proceso de aprobación rápido</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="position:relative; z-index:1;">
        <p style="color:rgba(255,255,255,0.4); font-size:0.8125rem; margin:0;">© 2026 EventgerJS</p>
      </div>
    </div>

    <!-- Panel derecho -->
    <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#f8fafc; padding:2rem; position:relative; min-width:0; overflow-y:auto;">
      <div style="position:absolute; inset:0; opacity:0.35; background-image:radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size:24px 24px; pointer-events:none;"></div>

      <div style="position:relative; z-index:1; width:100%; max-width:26rem; padding:1rem 0;" class="card-animate">

        <!-- Logo móvil -->
        <div class="reg-mobile-logo" style="display:none; align-items:center; gap:0.625rem; margin-bottom:2rem;">
          <div style="width:2.25rem; height:2.25rem; border-radius:0.625rem; background:#2563eb; display:flex; align-items:center; justify-content:center; color:#fff;" class="logo-ring">
            <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
          </div>
          <span style="font-weight:700; font-size:1.125rem; color:#0f172a;">EventgerJS</span>
        </div>

        <!-- Encabezado -->
        <div style="margin-bottom:1.75rem;">
          <h2 style="font-size:1.625rem; font-weight:700; color:#0f172a; margin:0 0 0.375rem; letter-spacing:-0.02em;">Crear cuenta</h2>
          <p style="color:#64748b; font-size:0.9375rem; margin:0;">Completa el formulario para solicitar acceso al sistema</p>
        </div>

        <!-- Formulario -->
        <form id="register-form" novalidate style="display:flex; flex-direction:column; gap:1.125rem;">

          <!-- Nombre -->
          <div>
            <label for="fullname" style="display:block; font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:0.5rem;">Nombre completo</label>
            <div style="position:relative;">
              <div style="position:absolute; left:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <input type="text" id="fullname" name="fullname" placeholder="Juan Pérez"
                autocomplete="name"
                style="width:100%; box-sizing:border-box; border-radius:0.625rem; border:1.5px solid #e2e8f0; background:#fff; padding:0.75rem 1rem 0.75rem 2.625rem; font-size:0.9375rem; color:#1e293b; font-family:inherit; outline:none; transition:border-color 0.2s, box-shadow 0.2s;"
                onfocus="this.style.borderColor='#2563eb'; this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                aria-describedby="fullname-error"/>
            </div>
            <p id="fullname-error" style="display:none; align-items:center; gap:0.25rem; margin-top:0.375rem; font-size:0.75rem; color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span></span>
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" style="display:block; font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:0.5rem;">Correo electrónico</label>
            <div style="position:relative;">
              <div style="position:absolute; left:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <input type="email" id="email" name="email" placeholder="correo@eventger.com"
                autocomplete="email"
                style="width:100%; box-sizing:border-box; border-radius:0.625rem; border:1.5px solid #e2e8f0; background:#fff; padding:0.75rem 1rem 0.75rem 2.625rem; font-size:0.9375rem; color:#1e293b; font-family:inherit; outline:none; transition:border-color 0.2s, box-shadow 0.2s;"
                onfocus="this.style.borderColor='#2563eb'; this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                aria-describedby="email-error"/>
            </div>
            <p id="email-error" style="display:none; align-items:center; gap:0.25rem; margin-top:0.375rem; font-size:0.75rem; color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span></span>
            </p>
          </div>

          <!-- Teléfono -->
          <div>
            <label for="phone" style="display:block; font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:0.5rem;">Teléfono</label>
            <div style="position:relative;">
              <div style="position:absolute; left:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <input type="tel" id="phone" name="phone" placeholder="+57 300 000 0000"
                autocomplete="tel"
                style="width:100%; box-sizing:border-box; border-radius:0.625rem; border:1.5px solid #e2e8f0; background:#fff; padding:0.75rem 1rem 0.75rem 2.625rem; font-size:0.9375rem; color:#1e293b; font-family:inherit; outline:none; transition:border-color 0.2s, box-shadow 0.2s;"
                onfocus="this.style.borderColor='#2563eb'; this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                aria-describedby="phone-error"/>
            </div>
            <p id="phone-error" style="display:none; align-items:center; gap:0.25rem; margin-top:0.375rem; font-size:0.75rem; color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span></span>
            </p>
          </div>

          <!-- Departamento -->
          <div>
            <label for="department" style="display:block; font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:0.5rem;">Departamento</label>
            <div style="position:relative;">
              <div style="position:absolute; left:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <select id="department" name="department_id"
                style="width:100%; box-sizing:border-box; border-radius:0.625rem; border:1.5px solid #e2e8f0; background:#fff; padding:0.75rem 2.5rem 0.75rem 2.625rem; font-size:0.9375rem; color:#1e293b; font-family:inherit; outline:none; transition:border-color 0.2s, box-shadow 0.2s; appearance:none; cursor:pointer;"
                onfocus="this.style.borderColor='#2563eb'; this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                aria-describedby="department-error">
                <option value="" disabled selected style="color:#94a3b8;">Selecciona tu departamento</option>
                ${DEPARTMENTS.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}
              </select>
              <!-- Chevron -->
              <div style="position:absolute; right:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            <p id="department-error" style="display:none; align-items:center; gap:0.25rem; margin-top:0.375rem; font-size:0.75rem; color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span></span>
            </p>
          </div>

          <!-- Contraseña -->
          <div>
            <label for="password" style="display:block; font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:0.5rem;">Contraseña</label>
            <div style="position:relative;">
              <div style="position:absolute; left:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <input type="password" id="password" name="password" placeholder="••••••••"
                autocomplete="new-password"
                style="width:100%; box-sizing:border-box; border-radius:0.625rem; border:1.5px solid #e2e8f0; background:#fff; padding:0.75rem 3rem 0.75rem 2.625rem; font-size:0.9375rem; color:#1e293b; font-family:inherit; outline:none; transition:border-color 0.2s, box-shadow 0.2s;"
                onfocus="this.style.borderColor='#2563eb'; this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                aria-describedby="password-error"/>
              <button type="button" id="toggle-password"
                style="position:absolute; right:0.875rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#94a3b8; padding:0; display:flex; align-items:center;">
                <svg id="eye-icon-pass" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <!-- Barra de fortaleza -->
            <div id="strength-bar" style="display:none; align-items:center; gap:0.5rem; margin-top:0.5rem;">
              <div style="flex:1; height:3px; border-radius:9999px; background:#e2e8f0; overflow:hidden;">
                <div id="strength-fill" style="height:100%; border-radius:9999px; transition:width 0.3s, background 0.3s; width:0%;"></div>
              </div>
              <span id="strength-label" style="font-size:0.7rem; font-weight:600; min-width:5rem; text-align:right;"></span>
            </div>
            <p id="password-error" style="display:none; align-items:center; gap:0.25rem; margin-top:0.375rem; font-size:0.75rem; color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span></span>
            </p>
          </div>

          <!-- Confirmar contraseña -->
          <div>
            <label for="confirm-password" style="display:block; font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:0.5rem;">Confirmar contraseña</label>
            <div style="position:relative;">
              <div style="position:absolute; left:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <input type="password" id="confirm-password" name="confirm-password" placeholder="••••••••"
                autocomplete="new-password"
                style="width:100%; box-sizing:border-box; border-radius:0.625rem; border:1.5px solid #e2e8f0; background:#fff; padding:0.75rem 3rem 0.75rem 2.625rem; font-size:0.9375rem; color:#1e293b; font-family:inherit; outline:none; transition:border-color 0.2s, box-shadow 0.2s;"
                onfocus="this.style.borderColor='#2563eb'; this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                aria-describedby="confirm-error"/>
              <button type="button" id="toggle-confirm"
                style="position:absolute; right:0.875rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#94a3b8; padding:0; display:flex; align-items:center;">
                <svg id="eye-icon-confirm" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <p id="confirm-error" style="display:none; align-items:center; gap:0.25rem; margin-top:0.375rem; font-size:0.75rem; color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span></span>
            </p>
          </div>

          <!-- Botón -->
          <button type="submit" id="submit-btn"
            style="display:flex; align-items:center; justify-content:center; gap:0.5rem; width:100%; border-radius:0.625rem; padding:0.875rem 1.5rem; border:none; cursor:pointer; color:#fff; font-size:1rem; font-weight:600; font-family:inherit; letter-spacing:-0.01em; background:linear-gradient(90deg,#1d4ed8 0%,#2563eb 50%,#3b82f6 100%); transition:transform 0.15s, box-shadow 0.2s; box-shadow:0 4px 14px -2px rgba(37,99,235,0.5); margin-top:0.25rem;"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 8px 20px -2px rgba(37,99,235,0.55)'"
            onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 14px -2px rgba(37,99,235,0.5)'">
            <svg id="btn-spinner" class="spinner hidden" fill="none" viewBox="0 0 24 24" width="18" height="18">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span id="btn-text">Solicitar acceso</span>
            <svg id="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>

        </form>

        <p style="margin-top:1.25rem; text-align:center; font-size:0.875rem; color:#64748b;">
          ¿Ya tienes cuenta?
          <a href="#/login" style="color:#2563eb; font-weight:600; text-decoration:none; margin-left:0.2rem;">Inicia sesión</a>
        </p>

      </div>
    </div>
  </div>
`;

const templatePending = (name) => /* html */ `
  <div style="display:flex; align-items:center; justify-content:center; min-height:100vh; padding:1rem; background:#f8fafc; font-family:'DM Sans',sans-serif;">
    <div style="position:fixed; inset:0; opacity:0.35; background-image:radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size:24px 24px; pointer-events:none;"></div>
    <div class="card-animate" style="position:relative; z-index:1; background:#fff; border-radius:1.5rem; padding:3rem 2.5rem; width:100%; max-width:24rem; text-align:center; box-shadow:0 20px 40px -8px rgba(37,99,235,0.14), 0 8px 16px -4px rgba(37,99,235,0.08);">
      <div style="position:relative; width:5rem; height:5rem; margin:0 auto 1.75rem; display:flex; align-items:center; justify-content:center;">
        <div class="pending-ring" style="position:absolute; inset:0; border-radius:50%; background:#dbeafe;"></div>
        <div style="position:relative; z-index:1; width:5rem; height:5rem; border-radius:50%; background:#eff6ff; border:2px solid #bfdbfe; display:flex; align-items:center; justify-content:center; color:#2563eb;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      </div>
      <p style="font-size:0.75rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#2563eb; margin:0 0 0.5rem;">Solicitud enviada</p>
      <h2 style="font-family:'Instrument Serif',serif; font-size:1.625rem; color:#0f172a; margin:0 0 1rem; line-height:1.3;">Próximamente podrás<br/>entrar a la aplicación</h2>
      <p style="font-size:0.9rem; color:#64748b; line-height:1.7; margin:0 0 1.75rem;">
        Hola <strong style="color:#0f172a;">${name}</strong>, tu cuenta fue creada.<br/>
        Un administrador autorizará tu acceso pronto.
      </p>
      <div style="display:inline-flex; align-items:center; gap:0.5rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9999px; padding:0.375rem 1rem; font-size:0.75rem; font-weight:600; color:#16a34a; margin-bottom:1.75rem;">
        <div class="status-pulse" style="width:0.5rem; height:0.5rem; border-radius:50%; background:#16a34a;"></div>
        Autorización pendiente
      </div>
      <a href="#/login" style="display:flex; align-items:center; justify-content:center; gap:0.5rem; width:100%; border-radius:0.625rem; padding:0.875rem; color:#fff; font-size:0.9375rem; font-weight:600; text-decoration:none; box-sizing:border-box; background:linear-gradient(90deg,#1d4ed8,#2563eb 50%,#3b82f6); box-shadow:0 4px 14px -2px rgba(37,99,235,0.5); margin-bottom:1rem;">
        Volver al inicio de sesión
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
      <p style="font-size:0.8125rem; color:#94a3b8; margin:0;">¿Tienes dudas? Contacta a tu administrador.</p>
    </div>
  </div>
`;

// ─── Responsive ───────────────────────────────────────────────────────────────
if (!document.getElementById("reg-responsive-style")) {
  const style = document.createElement("style");
  style.id = "reg-responsive-style";
  style.textContent = `
    @media (max-width: 768px) {
      .reg-brand { display: none !important; }
      .reg-mobile-logo { display: flex !important; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .reg-brand { width: 42% !important; padding: 2rem !important; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EYE_OPEN = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
const EYE_CLOSED = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`;

function getStrength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return [
    null,
    { label: "Muy débil", color: "#ef4444", width: "20%" },
    { label: "Débil", color: "#f97316", width: "40%" },
    { label: "Regular", color: "#eab308", width: "60%" },
    { label: "Fuerte", color: "#22c55e", width: "80%" },
    { label: "Muy fuerte", color: "#16a34a", width: "100%" },
  ][Math.max(1, s)];
}

function showError(input, errorEl, msg) {
  input.style.borderColor = "#ef4444";
  input.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.12)";
  errorEl.querySelector("span").textContent = msg;
  errorEl.style.display = "flex";
}
function clearError(input, errorEl) {
  input.style.borderColor = "#e2e8f0";
  input.style.boxShadow = "none";
  errorEl.style.display = "none";
}

// ─── bindEvents ───────────────────────────────────────────────────────────────
function bindEvents() {
  const form = document.getElementById("register-form");
  const fullnameInput = document.getElementById("fullname");
  const emailInput    = document.getElementById("email");
  const phoneInput    = document.getElementById("phone"); // campo de teléfono requerido por la API
  const deptSelect    = document.getElementById("department");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  const btnArrow = document.getElementById("btn-arrow");
  const btnSpinner = document.getElementById("btn-spinner");
  const strengthBar = document.getElementById("strength-bar");
  const strengthFill = document.getElementById("strength-fill");
  const strengthLabel = document.getElementById("strength-label");

  const validators = {
    fullname() {
      const v = fullnameInput.value.trim();
      const e = document.getElementById("fullname-error");
      if (!v) {
        showError(fullnameInput, e, "El nombre es requerido.");
        return false;
      }
      if (v.length < 3) {
        showError(fullnameInput, e, "Mínimo 3 caracteres.");
        return false;
      }
      clearError(fullnameInput, e);
      return true;
    },
    email() {
      const v = emailInput.value.trim();
      const e = document.getElementById("email-error");
      if (!v) {
        showError(emailInput, e, "El correo es requerido.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        showError(emailInput, e, "Correo inválido.");
        return false;
      }
      clearError(emailInput, e);
      return true;
    },
    phone() {
      const v = phoneInput.value.trim();
      const e = document.getElementById("phone-error");
      if (!v) {
        showError(phoneInput, e, "El teléfono es requerido.");
        return false;
      }
      clearError(phoneInput, e);
      return true;
    },
    department() {
      const e = document.getElementById("department-error");
      if (!deptSelect.value) {
        deptSelect.style.borderColor = "#ef4444";
        deptSelect.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.12)";
        e.querySelector("span").textContent = "Selecciona un departamento.";
        e.style.display = "flex";
        return false;
      }
      deptSelect.style.borderColor = "#e2e8f0";
      deptSelect.style.boxShadow = "none";
      e.style.display = "none";
      return true;
    },
    password() {
      const v = passwordInput.value;
      const e = document.getElementById("password-error");
      if (!v) {
        showError(passwordInput, e, "La contraseña es requerida.");
        return false;
      }
      if (v.length < 6) {
        showError(passwordInput, e, "Mínimo 6 caracteres.");
        return false;
      }
      clearError(passwordInput, e);
      return true;
    },
    confirm() {
      const v = confirmInput.value;
      const e = document.getElementById("confirm-error");
      if (!v) {
        showError(confirmInput, e, "Confirma tu contraseña.");
        return false;
      }
      if (v !== passwordInput.value) {
        showError(confirmInput, e, "Las contraseñas no coinciden.");
        return false;
      }
      clearError(confirmInput, e);
      return true;
    },
  };

  // Barra de fortaleza
  passwordInput.addEventListener("input", () => {
    const v = passwordInput.value;
    if (!v) {
      strengthBar.style.display = "none";
      return;
    }
    strengthBar.style.display = "flex";
    const s = getStrength(v);
    strengthFill.style.width = s.width;
    strengthFill.style.background = s.color;
    strengthLabel.textContent = s.label;
    strengthLabel.style.color = s.color;
    if (document.getElementById("password-error").style.display !== "none")
      validators.password();
  });

  // Toggle passwords
  document.getElementById("toggle-password").addEventListener("click", () => {
    const isPass = passwordInput.type === "password";
    passwordInput.type = isPass ? "text" : "password";
    document.getElementById("eye-icon-pass").innerHTML = isPass
      ? EYE_CLOSED
      : EYE_OPEN;
  });
  document.getElementById("toggle-confirm").addEventListener("click", () => {
    const isPass = confirmInput.type === "password";
    confirmInput.type = isPass ? "text" : "password";
    document.getElementById("eye-icon-confirm").innerHTML = isPass
      ? EYE_CLOSED
      : EYE_OPEN;
  });

  // Blur/input validators
  fullnameInput.addEventListener("blur", () => validators.fullname());
  emailInput.addEventListener("blur",    () => validators.email());
  phoneInput.addEventListener("blur",    () => validators.phone()); // validamos teléfono cuando el usuario sale del campo
  deptSelect.addEventListener("change",  () => validators.department());
  passwordInput.addEventListener("blur", () => validators.password());
  confirmInput.addEventListener("blur", () => validators.confirm());
  fullnameInput.addEventListener("input", () => {
    if (document.getElementById("fullname-error").style.display !== "none")
      validators.fullname();
  });
  emailInput.addEventListener("input", () => {
    if (document.getElementById("email-error").style.display !== "none")
      validators.email();
  });
  confirmInput.addEventListener("input", () => {
    if (document.getElementById("confirm-error").style.display !== "none")
      validators.confirm();
  });

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const valid = [
      validators.fullname(),
      validators.email(),
      validators.phone(),      // incluimos el teléfono en la validación antes de enviar
      validators.department(),
      validators.password(),
      validators.confirm(),
    ];
    if (valid.includes(false)) return;

    submitBtn.disabled = true;
    btnText.textContent = "Enviando solicitud...";
    if (btnArrow) btnArrow.style.display = "none";
    btnSpinner.classList.remove("hidden");

    try {
      // Enviamos los datos al backend. El servidor crea la cuenta con rol "visualizer"
      // y la deja inactiva hasta que el admin la apruebe.
      await apiRegister({
        name:         fullnameInput.value.trim(),
        email:        emailInput.value.trim(),
        phone:        phoneInput.value.trim(),      // requerido por la API
        password:     passwordInput.value,
        departmentId: deptSelect.value,             // UUID del departamento seleccionado
      });

      // Si llegamos aquí es porque el servidor respondió OK → mostramos la pantalla de espera
      const firstName = fullnameInput.value.trim().split(" ")[0];
      document.getElementById("app").innerHTML = templatePending(firstName);

    } catch (err) {
      // El servidor puede rechazar si el correo ya existe u otro dato es inválido
      showError(
        emailInput,
        document.getElementById("email-error"),
        err.message || "Este correo ya está registrado.",
      );
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = "Solicitar acceso";
      if (btnArrow) btnArrow.style.display = "";
      btnSpinner.classList.add("hidden");
    }
  });
}

export function initRegister() {
  document.getElementById("app").innerHTML = templateForm;
  bindEvents();
}
