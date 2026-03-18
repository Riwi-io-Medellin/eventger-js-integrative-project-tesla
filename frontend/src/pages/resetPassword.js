// src/pages/resetPassword.js
import { resetPassword } from '../services/api.js';

if (!document.getElementById('reset-style')) {
  const style = document.createElement('style');
  style.id = 'reset-style';
  style.textContent = `
    @media (max-width: 768px) {
      .reset-brand { display: none !important; }
      .reset-mobile-logo { display: flex !important; }
    }
    .spinner { animation: spin 0.8s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .hidden { display: none !important; }
    .toggle-pw { background:none;border:none;cursor:pointer;color:#94a3b8;position:absolute;right:0.875rem;top:50%;transform:translateY(-50%);padding:0;display:flex;align-items:center; }
  `;
  document.head.appendChild(style);
}

// Lee el token del query string del hash: #/reset-password?token=xxx
function getTokenFromURL() {
  const hash = window.location.hash; // "#/reset-password?token=xxx"
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return null;
  return new URLSearchParams(hash.slice(qIndex)).get('token');
}

const template = /* html */`
  <div style="display:flex; min-height:100vh; font-family:'DM Sans',sans-serif;">

    <!-- Panel izquierdo -->
    <div class="reset-brand" style="
      position:relative; width:50%; min-height:100vh;
      display:flex; flex-direction:column; justify-content:space-between;
      padding:2.5rem; overflow:hidden;
      background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 35%, #2563eb 60%, #3b82f6 100%);
      flex-shrink:0;">
      <div style="position:absolute;top:-6rem;left:-4rem;width:22rem;height:22rem;border-radius:50%;background:rgba(255,255,255,0.06);pointer-events:none;"></div>
      <div style="position:absolute;top:8rem;right:-5rem;width:18rem;height:18rem;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>
      <div style="position:absolute;bottom:-4rem;left:30%;width:20rem;height:20rem;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>

      <div style="display:flex;align-items:center;gap:0.625rem;position:relative;z-index:1;">
        <div style="width:2.5rem;height:2.5rem;border-radius:0.625rem;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;">
          <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
        </div>
        <span style="color:#fff;font-weight:700;font-size:1.125rem;letter-spacing:-0.01em;">EventgerJS</span>
      </div>

      <div style="position:relative;z-index:1;">
        <h1 style="font-family:'Instrument Serif',serif;color:#fff;font-size:clamp(1.75rem,3vw,2.75rem);line-height:1.2;margin:0 0 1.25rem;font-weight:400;">
          Crea una nueva<br/>contraseña<br/><em style="font-style:italic;">segura</em>
        </h1>
        <p style="color:rgba(255,255,255,0.7);font-size:0.9375rem;line-height:1.7;max-width:22rem;margin:0;">
          Elige una contraseña que no hayas usado antes y que sea difícil de adivinar.
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
        <div class="reset-mobile-logo" style="display:none;align-items:center;gap:0.625rem;margin-bottom:2rem;">
          <div style="width:2.25rem;height:2.25rem;border-radius:0.625rem;background:#2563eb;display:flex;align-items:center;justify-content:center;color:#fff;">
            <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
          </div>
          <span style="font-weight:700;font-size:1.125rem;color:#0f172a;letter-spacing:-0.01em;">EventgerJS</span>
        </div>

        <!-- Token inválido -->
        <div id="reset-invalid" style="display:none;padding:1.25rem;background:#fef2f2;border:1.5px solid #fecaca;border-radius:0.75rem;text-align:center;">
          <svg fill="none" stroke="#ef4444" viewBox="0 0 24 24" width="28" height="28" style="margin:0 auto 0.5rem;display:block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          <p style="font-size:0.9375rem;font-weight:600;color:#dc2626;margin:0 0 0.25rem;">Enlace inválido o expirado</p>
          <p style="font-size:0.8125rem;color:#b91c1c;margin:0 0 1rem;">El enlace tiene una validez de 10 minutos. Solicita uno nuevo.</p>
          <a href="#/forgot" style="color:#2563eb;font-size:0.875rem;font-weight:600;text-decoration:none;">← Solicitar nuevo enlace</a>
        </div>

        <!-- Formulario -->
        <div id="reset-form-container">
          <div style="margin-bottom:1.75rem;">
            <h2 style="font-size:1.625rem;font-weight:700;color:#0f172a;margin:0 0 0.375rem;letter-spacing:-0.02em;">Nueva contraseña</h2>
            <p style="color:#64748b;font-size:0.9375rem;margin:0;">Ingresa y confirma tu nueva contraseña.</p>
          </div>

          <form id="reset-form" novalidate style="display:flex;flex-direction:column;gap:1.125rem;">

            <!-- Nueva contraseña -->
            <div>
              <label style="display:block;font-size:0.875rem;font-weight:600;color:#1e293b;margin-bottom:0.5rem;">Nueva contraseña</label>
              <div style="position:relative;">
                <div style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <input type="password" id="reset-pw" placeholder="Mínimo 8 caracteres" autocomplete="new-password"
                  style="width:100%;box-sizing:border-box;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;padding:0.75rem 2.75rem 0.75rem 2.625rem;font-size:0.9375rem;color:#1e293b;font-family:inherit;outline:none;transition:border-color 0.2s,box-shadow 0.2s;"
                  onfocus="this.style.borderColor='#2563eb';this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                  onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'"/>
                <button type="button" class="toggle-pw" data-target="reset-pw" title="Mostrar contraseña">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
              </div>
              <p id="reset-pw-err" style="display:none;align-items:center;gap:0.25rem;margin-top:0.375rem;font-size:0.75rem;color:#ef4444;" role="alert">
                <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                <span id="reset-pw-err-msg"></span>
              </p>
            </div>

            <!-- Confirmar contraseña -->
            <div>
              <label style="display:block;font-size:0.875rem;font-weight:600;color:#1e293b;margin-bottom:0.5rem;">Confirmar contraseña</label>
              <div style="position:relative;">
                <div style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <input type="password" id="reset-pw2" placeholder="Repite la contraseña" autocomplete="new-password"
                  style="width:100%;box-sizing:border-box;border-radius:0.625rem;border:1.5px solid #e2e8f0;background:#fff;padding:0.75rem 2.75rem 0.75rem 2.625rem;font-size:0.9375rem;color:#1e293b;font-family:inherit;outline:none;transition:border-color 0.2s,box-shadow 0.2s;"
                  onfocus="this.style.borderColor='#2563eb';this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                  onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'"/>
                <button type="button" class="toggle-pw" data-target="reset-pw2" title="Mostrar contraseña">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
              </div>
              <p id="reset-pw2-err" style="display:none;align-items:center;gap:0.25rem;margin-top:0.375rem;font-size:0.75rem;color:#ef4444;" role="alert">
                <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                <span id="reset-pw2-err-msg"></span>
              </p>
            </div>

            <!-- Botón -->
            <button type="submit" id="reset-submit-btn"
              style="display:flex;align-items:center;justify-content:center;gap:0.5rem;width:100%;border-radius:0.625rem;padding:0.875rem 1.5rem;border:none;cursor:pointer;color:#fff;font-size:1rem;font-weight:600;font-family:inherit;letter-spacing:-0.01em;background:linear-gradient(90deg,#1d4ed8 0%,#2563eb 50%,#3b82f6 100%);transition:transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 14px -2px rgba(37,99,235,0.5);"
              onmouseover="if(!this.disabled){this.style.transform='translateY(-1px)';this.style.boxShadow='0 8px 20px -2px rgba(37,99,235,0.55)'}"
              onmouseout="this.style.transform='';this.style.boxShadow='0 4px 14px -2px rgba(37,99,235,0.5)'">
              <svg id="reset-spinner" class="spinner hidden" fill="none" viewBox="0 0 24 24" width="18" height="18">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style="opacity:0.75"/>
              </svg>
              <span id="reset-btn-text">Cambiar contraseña</span>
            </button>

          </form>
        </div>

        <!-- Éxito -->
        <div id="reset-success" style="display:none;text-align:center;">
          <div style="width:4rem;height:4rem;border-radius:50%;background:#f0fdf4;border:2px solid #bbf7d0;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;">
            <svg fill="none" stroke="#16a34a" viewBox="0 0 24 24" width="28" height="28"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 style="font-size:1.5rem;font-weight:700;color:#0f172a;margin:0 0 0.5rem;">¡Contraseña actualizada!</h2>
          <p style="color:#64748b;font-size:0.9375rem;margin:0 0 1.5rem;">Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <a href="#/login" style="display:inline-flex;align-items:center;gap:0.5rem;background:#2563eb;color:#fff;text-decoration:none;border-radius:0.625rem;padding:0.75rem 1.5rem;font-size:0.9375rem;font-weight:600;">
            Ir al inicio de sesión
          </a>
        </div>

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

function bindEvents(token) {
  const form      = document.getElementById('reset-form');
  const pwEl      = document.getElementById('reset-pw');
  const pw2El     = document.getElementById('reset-pw2');
  const pwErr     = document.getElementById('reset-pw-err');
  const pw2Err    = document.getElementById('reset-pw2-err');
  const pwErrMsg  = document.getElementById('reset-pw-err-msg');
  const pw2ErrMsg = document.getElementById('reset-pw2-err-msg');
  const btn       = document.getElementById('reset-submit-btn');
  const btnText   = document.getElementById('reset-btn-text');
  const spinner   = document.getElementById('reset-spinner');
  const success   = document.getElementById('reset-success');
  const formCont  = document.getElementById('reset-form-container');

  // Toggle show/hide password
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  function showErr(el, msgEl, msg) {
    el.style.display = 'flex';
    msgEl.textContent = msg;
  }
  function clearErr(el) { el.style.display = 'none'; }

  pwEl.addEventListener('input',  () => clearErr(pwErr));
  pw2El.addEventListener('input', () => clearErr(pw2Err));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw  = pwEl.value;
    const pw2 = pw2El.value;
    let valid = true;

    if (!pw || pw.length < 8) {
      showErr(pwErr, pwErrMsg, 'La contraseña debe tener al menos 8 caracteres.');
      valid = false;
    }
    if (pw !== pw2) {
      showErr(pw2Err, pw2ErrMsg, 'Las contraseñas no coinciden.');
      valid = false;
    }
    if (!valid) return;

    btn.disabled = true;
    btnText.textContent = 'Guardando...';
    spinner.classList.remove('hidden');

    try {
      await resetPassword({ token, newPassword: pw });
      formCont.style.display = 'none';
      success.style.display = 'block';
    } catch (err) {
      showErr(pwErr, pwErrMsg, err.message || 'Ocurrió un error. Solicita un nuevo enlace.');
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Cambiar contraseña';
      spinner.classList.add('hidden');
    }
  });
}

export function initResetPassword() {
  document.getElementById('app').innerHTML = template;

  const token = getTokenFromURL();

  if (!token) {
    document.getElementById('reset-invalid').style.display = 'block';
    document.getElementById('reset-form-container').style.display = 'none';
    return;
  }

  bindEvents(token);
}
