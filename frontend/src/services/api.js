// src/services/api.js
// Este archivo es el "puente" entre el frontend y el backend.
// Todas las páginas que necesiten datos del servidor importan funciones de aquí.
// Así, si la URL del backend cambia, solo hay que editarla en UN lugar.

// ─── Configuración base ────────────────────────────────────────────────────────

// Dirección del servidor backend. Sin barra al final para poder concatenar rutas limpiamente.
const BASE_URL = 'https://icrd-backend.onrender.com';

// ─── Función central de peticiones ────────────────────────────────────────────

/**
 * Hace una petición HTTP al backend y devuelve los datos ya parseados.
 * Todas las demás funciones de este archivo la usan internamente.
 *
 * @param {string} endpoint  - La ruta a llamar, p.ej. "/auth/login"
 * @param {string} method    - El método HTTP: "GET", "POST", "PUT", "PATCH", "DELETE"
 * @param {object} body      - Los datos a enviar en el cuerpo (solo para POST/PUT/PATCH)
 * @param {boolean} auth     - Si es true, añade el token de sesión en los headers
 */
async function request(endpoint, method = 'GET', body = null, auth = false) {

    // Construimos los headers (las "etiquetas" que acompañan la petición)
    const headers = {
        'Content-Type': 'application/json', // le decimos al servidor que enviamos JSON
    };

    // Si la ruta está protegida, añadimos el token que guardamos al hacer login
    if (auth) {
        const token = localStorage.getItem('token'); // leemos el token guardado en el navegador
        if (token) {
            headers['Authorization'] = `Bearer ${token}`; // formato estándar: "Bearer <token>"
        }
    }

    // Armamos las opciones de la petición
    const options = { method, headers };

    // Solo añadimos body si hay datos que enviar (GET y DELETE no llevan body)
    if (body) {
        options.body = JSON.stringify(body); // convertimos el objeto JS a texto JSON
    }

    // Hacemos la petición con timeout de 20s para no quedar colgados
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 20000);
    let response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, { ...options, signal: controller.signal });
    } catch (fetchErr) {
        if (fetchErr.name === 'AbortError') throw new Error('La solicitud tardó demasiado. Intenta de nuevo.');
        throw fetchErr;
    } finally {
        clearTimeout(timeoutId);
    }

    // Si el servidor responde con un error (4xx o 5xx), lanzamos un error con el mensaje del servidor
    if (!response.ok) {
        // Intentamos leer el mensaje de error que envió el servidor
        const errorData = await response.json().catch(() => ({}));
        // Lanzamos el error para que el código que llamó esta función lo pueda capturar
        throw new Error(errorData.message || `Error ${response.status}`);
    }

    // Si la respuesta no tiene cuerpo (ej. DELETE exitoso con 204), retornamos null
    if (response.status === 204) return null;

    // Parseamos el JSON de respuesta y lo retornamos
    return response.json();
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
// Estas funciones no necesitan token porque son públicas (login y registro)

/**
 * Inicia sesión con email y contraseña.
 * El servidor devuelve el token y los datos del usuario.
 *
 * @param {{ email: string, password: string }} credentials
 */
export function login(credentials) {
    // POST /auth/login — sin auth porque todavía no tenemos token
    return request('/auth/login', 'POST', credentials, false);
}

/**
 * Registra un nuevo usuario. Su cuenta queda inactiva hasta que el admin la active.
 *
 * @param {{ name: string, email: string, phone: string, password: string, departmentId: string }} userData
 */
export function register(userData) {
    // POST /auth/register — ruta pública
    return request('/auth/register', 'POST', userData, false);
}

/**
 * Solicita un correo de restablecimiento de contraseña.
 *
 * @param {{ email: string }} data
 */
export function resetRequest(data) {
    // POST /auth/reset-request — envía el email al que llegar el enlace de reset
    return request('/auth/reset-request', 'POST', data, false);
}

/**
 * Cambia la contraseña usando el token que llegó por correo.
 *
 * @param {{ token: string, newPassword: string }} data
 */
export function resetPassword(data) {
    // POST /auth/reset-password — el token es el que viene en la URL del correo
    return request('/auth/reset-password', 'POST', data, false);
}

// ─── Usuarios ──────────────────────────────────────────────────────────────────
// Todas estas rutas requieren token (auth: true) y son solo para admin_gen

/**
 * Obtiene la lista de usuarios. Se pueden filtrar con parámetros opcionales.
 * Máximo 50 usuarios por llamada.
 *
 * @param {{ isActive?: boolean, departmentId?: string, roleName?: string }} filters
 */
export function getUsers(filters = {}) {
    // Convertimos el objeto de filtros en una query string: ?isActive=true&roleName=visualizer
    const params = new URLSearchParams(filters).toString();
    const query  = params ? `?${params}` : ''; // si no hay filtros, la query queda vacía
    // GET /user — ruta protegida
    return request(`/user${query}`, 'GET', null, true);
}

/**
 * Obtiene usuarios paginados (por "hojas").
 *
 * @param {{ page?: number, limit?: number }} pagination
 */
export function getUsersBySheet(pagination = {}) {
    const params = new URLSearchParams(pagination).toString();
    const query  = params ? `?${params}` : '';
    // GET /user/sheet — paginación
    return request(`/user/sheet${query}`, 'GET', null, true);
}

/**
 * Obtiene los datos completos de un usuario por su ID (formato UUID).
 *
 * @param {string} id
 */
export function getUserById(id) {
    // GET /user/:id
    return request(`/user/${id}`, 'GET', null, true);
}

/**
 * Crea un usuario directamente desde el panel de admin.
 * A diferencia del registro público, aquí el admin puede asignar rol.
 *
 * @param {{ name: string, email: string, password: string, departmentId: string, phone: string, roleName: string }} userData
 */
export function createUser(userData) {
    // POST /user
    return request('/user', 'POST', userData, true);
}

/**
 * Actualiza TODOS los campos de un usuario (reemplaza todo).
 *
 * @param {string} id
 * @param {{ name: string, email: string, departmentId: string, roleName: string, phone: string, isActive: boolean }} userData
 */
export function updateUser(id, userData) {
    // PUT /user/:id
    return request(`/user/${id}`, 'PUT', userData, true);
}

/**
 * Actualiza solo los campos que se envíen (actualización parcial).
 * Los campos se pasan como query params en la URL.
 *
 * @param {string} id
 * @param {{ name?: string, email?: string, isActive?: boolean, phone?: string, departmentId?: string, roleName?: string }} fields
 */
export function patchUser(id, fields) {
    const params = new URLSearchParams(fields).toString();
    // PATCH /user/:id?campo=valor
    return request(`/user/${id}?${params}`, 'PATCH', null, true);
}

/**
 * Elimina un usuario permanentemente.
 *
 * @param {string} id
 */
export function deleteUser(id) {
    // DELETE /user/:id
    return request(`/user/${id}`, 'DELETE', null, true);
}

// ─── Disciplinas ───────────────────────────────────────────────────────────────

export function getDisciplines() {
    // GET /discipline — ruta pública, no requiere token
    return request('/discipline', 'GET', null, false);
}

// ─── Departamentos ─────────────────────────────────────────────────────────────

export function getDepartments() {
    // GET /department — ruta pública, no requiere token
    return request('/department', 'GET', null, false);
}

// ─── Eventos ───────────────────────────────────────────────────────────────────

/**
 * Obtiene eventos. Sin filtros devuelve los 15 más próximos.
 *
 * @param {{ isActive?: string, scenarioId?: string, spaceId?: string, disciplineId?: string, creatorId?: string }} filters
 */
export function getEvents(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const query  = params ? `?${params}` : '';
    // GET /event
    return request(`/event${query}`, 'GET', null, true);
}

/**
 * Obtiene los eventos que ocurren dentro de un rango de fechas.
 *
 * @param {string} startDate  - Fecha de inicio (formato ISO: "2025-06-01")
 * @param {string} finishDate - Fecha de fin
 */
export function getEventsByLapse(startDate, finishDate) {
    // GET /event/by-lapse?startDate=...&finishDate=...
    return request(`/event/by-lapse?startDate=${startDate}&finishDate=${finishDate}`, 'GET', null, true);
}

/**
 * Obtiene todos los datos de un evento por su ID.
 *
 * @param {string} id
 */
export function getEventById(id) {
    // GET /event/:id
    return request(`/event/${id}`, 'GET', null, true);
}

/**
 * Crea un nuevo evento.
 *
 * @param {{ title: string, description: string, startDate: string, finishDate: string, isActive: boolean, disciplineId: string, scenarioId: string, spaceId: string, creatorId: string }} eventData
 */
export function createEvent(eventData) {
    // POST /event — solo admin_spa y event_creator
    return request('/event', 'POST', eventData, true);
}

/**
 * Reemplaza todos los datos de un evento.
 *
 * @param {string} id
 * @param {object} eventData
 */
export function updateEvent(id, eventData) {
    // PUT /event/:id
    return request(`/event/${id}`, 'PUT', eventData, true);
}

/**
 * Actualiza solo los campos enviados de un evento.
 *
 * @param {string} id
 * @param {object} fields - Los campos a actualizar como query params
 */
export function patchEvent(id, fields) {
    const params = new URLSearchParams(fields).toString();
    // PATCH /event/:id?campo=valor
    return request(`/event/${id}?${params}`, 'PATCH', null, true);
}

/**
 * Elimina un evento.
 *
 * @param {string} id
 */
export function deleteEvent(id) {
    // DELETE /event/:id
    return request(`/event/${id}`, 'DELETE', null, true);
}

// ─── Espacios ──────────────────────────────────────────────────────────────────
// Todos requieren token. Crear/editar/eliminar solo admin_gen y admin_spa.

/** Obtiene todos los espacios deportivos. */
export function getSpaces() {
    // GET /space
    return request('/space', 'GET', null, true);
}

/**
 * Crea un nuevo espacio.
 * @param {{ name: string, description: string, status: string, scenarioId: string }} data
 */
export function createSpace(data) {
    // POST /space
    return request('/space', 'POST', data, true);
}

/**
 * Actualiza todos los datos de un espacio.
 * @param {string} id
 * @param {{ name: string, description: string, status: string, scenarioId: string }} data
 */
export function updateSpace(id, data) {
    // PUT /space/:id
    return request(`/space/${id}`, 'PUT', data, true);
}

/**
 * Actualiza solo el estado de un espacio (activo/inactivo).
 * @param {string} id
 * @param {{ status: string }} data
 */
export function patchSpace(id, data) {
    // PATCH /space/:id
    return request(`/space/${id}`, 'PATCH', data, true);
}

/** Elimina un espacio. */
export function deleteSpace(id) {
    // DELETE /space/:id
    return request(`/space/${id}`, 'DELETE', null, true);
}

// ─── Escenarios ────────────────────────────────────────────────────────────────
// Solo admin_gen y admin_spa pueden ver y gestionar escenarios.

/** Obtiene todos los escenarios (complejos deportivos). */
export function getScenarios() {
    // GET /scenario
    return request('/scenario', 'GET', null, true);
}

/**
 * Crea un nuevo escenario.
 * @param {{ name: string, location: string }} data
 */
export function createScenario(data) {
    // POST /scenario
    return request('/scenario', 'POST', data, true);
}

/**
 * Actualiza todos los datos de un escenario.
 * @param {string} id
 * @param {{ name: string, location: string }} data
 */
export function updateScenario(id, data) {
    // PUT /scenario/:id
    return request(`/scenario/${id}`, 'PUT', data, true);
}

/** Elimina un escenario. */
export function deleteScenario(id) {
    // DELETE /scenario/:id
    return request(`/scenario/${id}`, 'DELETE', null, true);
}


// ─── Perfil ────────────────────────────────────────────────────────────────────

/**
 * Obtiene los eventos creados por un usuario específico.
 * Se usa en la página de perfil para mostrar el historial de eventos del usuario.
 * @param {string} userId
 */
export function getEventsByUser(userId) {
    // GET /profile/:id — no requiere token según las rutas del backend
    return request(`/profile/${userId}`, 'GET', null, false);
}

// ─── Notificaciones ────────────────────────────────────────────────────────────

/**
 * Obtiene todas las notificaciones de un usuario.
 * @param {string} userId
 */
export function getNotifications(userId) {
    // GET /notification/:id
    return request(`/notification/${userId}`, 'GET', null, true);
}

/**
 * Marca una notificación como leída.
 * @param {string} notifId
 */
export function markNotificationRead(notifId) {
    // PATCH /notification/:id
    return request(`/notification/${notifId}`, 'PATCH', null, true);
}
