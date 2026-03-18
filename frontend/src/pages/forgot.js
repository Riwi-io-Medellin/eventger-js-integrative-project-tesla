// src/pages/forgot.js
import { resetRequest } from '../services/api.js';

if (!document.getElementById('forgot-style')) {
  const style = document.createElement('style');
  style.id = 'forgot-style';
  style.textContent = `
    @media (max-width: 768px) {
      .forgot-brand { display: none !important; }
      .forgot-mobile-logo { display: flex !important; }
    }
    .spinner { animation: spin 0.8s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .hidden { display: none !important; }
  `;
  document.head.appendChild(style);
}

const template = /* html */`
  <div style="display:flex; min-height:100vh; font-family:'DM Sans',sans-serif;">

    <!-- Panel izquierdo -->
    <div class="forgot-brand" style="
      position:relative; width:50%; min-height:100vh;
      display:flex; flex-direction:column; justify-content:space-between;
      padding:2.5rem; overflow:hidden;
      background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 35%, #2563eb 60%, #3b82f6 100%);
      flex-shrink:0;">
      <div style="position:absolute;top:-6rem;left:-4rem;width:22rem;height:22rem;border-radius:50%;background:rgba(255,255,255,0.06);pointer-events:none;"></div>
      <div style="position:absolute;top:8rem;right:-5rem;width:18rem;height:18rem;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>
      <div style="position:absolute;bottom:-4rem;left:30%;width:20rem;height:20rem;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>

      <!-- Logo -->
      <div style="display:flex;align-items:center;gap:0.625rem;position:relative;z-index:1;">
        <div style="width:2.5rem;height:2.5rem;border-radius:0.625rem;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;">
          <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
        </div>
        <span style="color:#fff;font-weight:700;font-size:1.125rem;letter-spacing:-0.01em;">EventgerJS</span>
      </div>

      <!-- Texto central -->
      <div style="position:relative;z-index:1;">
        <h1 style="font-family:'Instrument Serif',serif;color:#fff;font-size:clamp(1.75rem,3vw,2.75rem);line-height:1.2;margin:0 0 1.25rem;font-weight:400;">
          Recupera el acceso<br/>a tu cuenta<br/><em style="font-style:italic;">fácilmente</em>
        </h1>
        <p style="color:rgba(255,255,255,0.7);font-size:0.9375rem;line-height:1.7;max-width:22rem;margin:0;">
          Te enviaremos un enlace seguro a tu correo para que puedas restablecer tu contraseña.
        </p>
      </div>

      <div style="position:relative;z-index:1;">
        <p style="color:rgba(255,255,255,0.4);font-size:0.8125rem;margin:0;">© 2026 EventgerJS</p>
      </div>
    </div>

    <!-- Panel derecho -->
    <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding:2rem;position:relative;min-width:0;">
      <div style="position:absolute;inset:0;opacity:0.35;background-image:radial-gradient(circle,#cbd5e1 1px,transparent 1px);background-size:24px 24px;pointer-events:none;"></div>

      <div style="position:relative;z-index:1;width:100%;max-width:24rem;">

        <!-- Logo móvil -->
        <div class="forgot-mobile-logo" style="display:none;align-items:center;gap:0.625rem;margin-bottom:2rem;">
          <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:#2563eb;display:flex;align-items:center;justify-content:center;color:#fff;">
            <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
          </div>
          <span style="font-weight:700;font-size:1.125rem;color:#0f172a;letter-spacing:-0.01em;">EventgerJS</span>
        </div>

        <!-- Encabezado -->
        <div style="margin-bottom:1.75rem;">
          <h2 style="font-size:1.625rem;font-weight:700;color:#0f172a;margin:0 0 0.375rem;letter-spacing:-0.02em;">¿Olvidaste tu contraseña?</h2>
          <p style="color:#64748b;font-size:0.9375rem;margin:0;">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>
        </div>

        <!-- Formulario -->
        <form id="forgot-form" novalidate style="display:flex;flex-direction:column;gap:1.125rem;">

          <!-- Email -->
          <div>
            <label for="forgot-email" style="display:block;font-size:0.875rem;font-weight:600;color:#1e293b;margin-bottom:0.5rem;">Correo electrónico</label>
            <div style="position:relative;">
              <div style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <input type="email" id="forgot-email" placeholder="correo@eventger.com" autocomplete="email"
                style="width:100%;box-sizing:border-box;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;padding:0.75rem 1rem 0.75rem 2.625rem;font-size:0.9375rem;color:#1e293b;font-family:inherit;outline:none;transition:border-color 0.2s,box-shadow 0.2s;"
                onfocus="this.style.borderColor='#2563eb';this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'"/>
            </div>
            <p id="forgot-email-err" style="display:none;align-items:center;gap:0.25rem;margin-top:0.375rem;font-size:0.75rem;color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span id="forgot-email-err-msg"></span>
            </p>
          </div>

          <!-- Botón -->
          <button type="submit" id="forgot-submit-btn"
            style="display:flex;align-items:center;justify-content:center;gap:0.5rem;width:100%;border-radius:0.625rem;padding:0.875rem 1.5rem;border:none;cursor:pointer;color:#fff;font-size:1rem;font-weight:600;font-family:inherit;letter-spacing:-0.01em;background:linear-gradient(90deg,#1d4ed8 0%,#2563eb 50%,#3b82f6 100%);transition:transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 14px -2px rgba(37,99,235,0.5);"
            onmouseover="if(!this.disabled){this.style.transform='translateY(-1px)';this.style.boxShadow='0 8px 20px -2px rgba(37,99,235,0.55)'}"
            onmouseout="this.style.transform='';this.style.boxShadow='0 4px 14px -2px rgba(37,99,235,0.5)'">
            <svg id="forgot-spinner" class="spinner hidden" fill="none" viewBox="0 0 24 24" width="18" height="18">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span id="forgot-btn-text">Enviar enlace</span>
          </button>

        </form>

        <!-- Banner de éxito (oculto hasta enviar) -->
        <div id="forgot-success" style="display:none;margin-top:1.25rem;padding:1rem 1.25rem;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:0.75rem;display:none;align-items:flex-start;gap:0.75rem;">
          <svg fill="none" stroke="#16a34a" viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0;margin-top:1px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <p style="font-size:0.875rem;font-weight:600;color:#15803d;margin:0 0 0.2rem;">Correo enviado</p>
            <p style="font-size:0.8125rem;color:#166534;margin:0;line-height:1.5;">Si el correo está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.</p>
          </div>
        </div>

        <!-- Link volver -->
        <p style="text-align:center;margin-top:1.5rem;font-size:0.875rem;color:#64748b;">
          <a href="#/login" style="color:#2563eb;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:0.35rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Volver al inicio de sesión
          </a>
        </p>

      </div>
    </div>
  </div>
`;

function bindEvents() {
  const form     = document.getElementById('forgot-form');
  const emailEl  = document.getElementById('forgot-email');
  const errEl    = document.getElementById('forgot-email-err');
  const errMsg   = document.getElementById('forgot-email-err-msg');
  const btn      = document.getElementById('forgot-submit-btn');
  const btnText  = document.getElementById('forgot-btn-text');
  const spinner  = document.getElementById('forgot-spinner');
  const success  = document.getElementById('forgot-success');

  function showErr(msg) {
    emailEl.style.borderColor = '#ef4444';
    emailEl.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.12)';
    errMsg.textContent = msg;
    errEl.style.display = 'flex';
  }
  function clearErr() {
    emailEl.style.borderColor = '#e2e8f0';
    emailEl.style.boxShadow   = 'none';
    errEl.style.display = 'none';
  }

  emailEl.addEventListener('input', clearErr);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();

    if (!email) { showErr('El correo es requerido.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('Ingresa un correo válido.'); return; }

    btn.disabled = true;
    btnText.textContent = 'Enviando...';
    spinner.classList.remove('hidden');

    try {
      await resetRequest({ email });
      form.style.display = 'none';
      success.style.display = 'flex';
    } catch (err) {
      showErr(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Enviar enlace';
      spinner.classList.add('hidden');
    }
  });
}

export function initForgot() {
  document.getElementById('app').innerHTML = template;
  bindEvents();
}
