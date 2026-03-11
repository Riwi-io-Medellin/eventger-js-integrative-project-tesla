// src/pages/login.js

const template = /* html */`
  <div style="display:flex; min-height:100vh; font-family:'DM Sans',sans-serif;">

    <!-- Panel izquierdo -->
    <div class="login-brand" style="
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
          Gestión integral de<br/>eventos en<br/><em style="font-style:italic;">tiempo real</em>
        </h1>
        <p style="color:rgba(255,255,255,0.7); font-size:0.9375rem; line-height:1.7; max-width:22rem; margin:0;">
          Plataforma para la planificación, gestión y seguimiento de eventos con precisión milisegundo a milisegundo.
        </p>
      </div>

      <!-- Footer -->
      <div style="position:relative; z-index:1;">
        <p style="color:rgba(255,255,255,0.4); font-size:0.8125rem; margin:0;">© 2026 EventgerJS</p>
      </div>
    </div>

    <!-- Panel derecho -->
    <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#f8fafc; padding:2rem; position:relative; min-width:0;">
      <div style="position:absolute; inset:0; opacity:0.35; background-image:radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size:24px 24px; pointer-events:none;"></div>

      <div style="position:relative; z-index:1; width:100%; max-width:24rem;" class="card-animate">

        <!-- Logo móvil (solo visible en mobile) -->
        <div class="login-mobile-logo" style="display:none; align-items:center; gap:0.625rem; margin-bottom:2rem;">
          <div style="width:2.25rem; height:2.25rem; border-radius:0.625rem; background:#2563eb; display:flex; align-items:center; justify-content:center; color:#fff;" class="logo-ring">
            <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
          </div>
          <span style="font-weight:700; font-size:1.125rem; color:#0f172a; letter-spacing:-0.01em;">EventgerJS</span>
        </div>

        <!-- Encabezado -->
        <div style="margin-bottom:1.75rem;">
          <h2 style="font-size:1.625rem; font-weight:700; color:#0f172a; margin:0 0 0.375rem; letter-spacing:-0.02em;">Iniciar sesión</h2>
          <p style="color:#64748b; font-size:0.9375rem; margin:0;">Ingrese sus credenciales para acceder al sistema</p>
        </div>

        <!-- Formulario -->
        <form id="login-form" novalidate style="display:flex; flex-direction:column; gap:1.125rem;">

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

          <!-- Password -->
          <div>
            <label for="password" style="display:block; font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:0.5rem;">Contraseña</label>
            <div style="position:relative;">
              <div style="position:absolute; left:0.875rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <input type="password" id="password" name="password" placeholder="••••••••"
                autocomplete="current-password"
                style="width:100%; box-sizing:border-box; border-radius:0.625rem; border:1.5px solid #e2e8f0; background:#fff; padding:0.75rem 3rem 0.75rem 2.625rem; font-size:0.9375rem; color:#1e293b; font-family:inherit; outline:none; transition:border-color 0.2s, box-shadow 0.2s;"
                onfocus="this.style.borderColor='#2563eb'; this.style.boxShadow='0 0 0 3px rgba(37,99,235,0.12)'"
                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                aria-describedby="password-error"/>
              <button type="button" id="toggle-password"
                style="position:absolute; right:0.875rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#94a3b8; padding:0; display:flex; align-items:center;"
                aria-label="Mostrar/ocultar contraseña">
                <svg id="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <p id="password-error" style="display:none; align-items:center; gap:0.25rem; margin-top:0.375rem; font-size:0.75rem; color:#ef4444;" role="alert">
              <svg fill="currentColor" viewBox="0 0 20 20" width="12" height="12" style="flex-shrink:0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span></span>
            </p>
          </div>

          <!-- Botón -->
          <button type="submit" id="submit-btn"
            style="display:flex; align-items:center; justify-content:center; gap:0.5rem; width:100%; border-radius:0.625rem; padding:0.875rem 1.5rem; border:none; cursor:pointer; color:#fff; font-size:1rem; font-weight:600; font-family:inherit; letter-spacing:-0.01em; background:linear-gradient(90deg,#1d4ed8 0%,#2563eb 50%,#3b82f6 100%); transition:transform 0.15s, box-shadow 0.2s; box-shadow:0 4px 14px -2px rgba(37,99,235,0.5);"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 8px 20px -2px rgba(37,99,235,0.55)'"
            onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 14px -2px rgba(37,99,235,0.5)'">
            <svg id="btn-spinner" class="spinner hidden" fill="none" viewBox="0 0 24 24" width="18" height="18">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span id="btn-text">Ingresar</span>
            <svg id="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>

        </form>

        <!-- Links -->
        <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; margin-top:1.25rem;">
          <a href="#/forgot" style="font-size:0.875rem; color:#2563eb; text-decoration:none; font-weight:500;">¿Olvidó su contraseña?</a>
          <p style="font-size:0.875rem; color:#64748b; margin:0;">
            ¿No tiene cuenta?
            <a href="#/register" style="color:#2563eb; font-weight:600; text-decoration:none; margin-left:0.2rem;">Registrarse</a>
          </p>
        </div>

      </div>
    </div>
  </div>
`;

// ─── Responsive ───────────────────────────────────────────────────────────────
if (!document.getElementById('login-responsive-style')) {
  const style = document.createElement('style');
  style.id = 'login-responsive-style';
  style.textContent = `
    @media (max-width: 768px) {
      .login-brand { display: none !important; }
      .login-mobile-logo { display: flex !important; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .login-brand { width: 42% !important; padding: 2rem !important; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Lógica ───────────────────────────────────────────────────────────────────
function bindEvents() {
  const form          = document.getElementById('login-form');
  const emailInput    = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError    = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const togglePass    = document.getElementById('toggle-password');
  const eyeIcon       = document.getElementById('eye-icon');
  const submitBtn     = document.getElementById('submit-btn');
  const btnText       = document.getElementById('btn-text');
  const btnArrow      = document.getElementById('btn-arrow');
  const btnSpinner    = document.getElementById('btn-spinner');

  const EYE_OPEN   = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
  const EYE_CLOSED = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`;

  function showError(input, errorEl, msg) {
    input.style.borderColor = '#ef4444';
    input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.12)';
    errorEl.querySelector('span').textContent = msg;
    errorEl.style.display = 'flex';
  }
  function clearError(input, errorEl) {
    input.style.borderColor = '#e2e8f0';
    input.style.boxShadow   = 'none';
    errorEl.style.display   = 'none';
  }
  function validateEmail() {
    const v = emailInput.value.trim();
    if (!v)                                     { showError(emailInput, emailError, 'El correo es requerido.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { showError(emailInput, emailError, 'Ingresa un correo válido.'); return false; }
    clearError(emailInput, emailError); return true;
  }
  function validatePassword() {
    const v = passwordInput.value;
    if (!v)           { showError(passwordInput, passwordError, 'La contraseña es requerida.'); return false; }
    if (v.length < 6) { showError(passwordInput, passwordError, 'Mínimo 6 caracteres.'); return false; }
    clearError(passwordInput, passwordError); return true;
  }

  togglePass.addEventListener('click', () => {
    const isPass = passwordInput.type === 'password';
    passwordInput.type = isPass ? 'text' : 'password';
    eyeIcon.innerHTML  = isPass ? EYE_CLOSED : EYE_OPEN;
  });

  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);
  emailInput.addEventListener('input',    () => { if (emailError.style.display !== 'none')    validateEmail(); });
  passwordInput.addEventListener('input', () => { if (passwordError.style.display !== 'none') validatePassword(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateEmail() | !validatePassword()) return;
    submitBtn.disabled = true;
    btnText.textContent = 'Ingresando...';
    if (btnArrow) btnArrow.style.display = 'none';
    btnSpinner.classList.remove('hidden');
    try {
      // 🔌 const data = await api.login({ email, password });
      await new Promise(r => setTimeout(r, 1500));
      window.location.hash = '#/dashboard';
    } catch (err) {
      showError(emailInput, emailError, 'Credenciales incorrectas.');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Ingresar';
      if (btnArrow) btnArrow.style.display = '';
      btnSpinner.classList.add('hidden');
    }
  });
}

export function initLogin() {
  document.getElementById('app').innerHTML = template;
  bindEvents();
}