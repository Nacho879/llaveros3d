// Credenciales de acceso (ahora manejadas por la API)
const API_BASE = '/api/auth';

// Elementos del DOM
let loginForm, emailInput, passwordInput, errorMessage, errorText;
let loginOverlay, backofficeContent;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginOverlay();
    // checkExistingSession();
    showLogin();
});

// Inicializar elementos del login overlay
function initializeLoginOverlay() {
    loginForm = document.getElementById('loginForm');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    errorMessage = document.getElementById('errorMessage');
    errorText = document.getElementById('errorText');
    loginOverlay = document.getElementById('loginOverlay');
    backofficeContent = document.getElementById('backofficeContent');
    
    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    
    // Pre-llenar email si está guardado
    const savedEmail = localStorage.getItem('llavero3d_saved_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Focus en el primer campo
    emailInput.focus();
}

// Verificar sesión existente con la API
async function checkExistingSession() {
    try {
        const response = await fetch(`${API_BASE}/verify`);
        const data = await response.json();
        
        if (data.authenticated) {
            // Sesión válida, mostrar backoffice
            showBackoffice();
            return;
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }
    
    // No hay sesión válida, mostrar login
    showLogin();
}

// Mostrar overlay de login
function showLogin() {
    loginOverlay.classList.add('active');
    backofficeContent.style.display = 'none';
}

// Ocultar overlay de login y mostrar backoffice
function showBackoffice() {
    console.log('🔄 Mostrando backoffice...');
    
    // Ocultar login
    loginOverlay.style.display = 'none';
    
    // Mostrar contenido del backoffice
    const backofficeContent = document.querySelector('.admin-content');
    if (backofficeContent) {
        backofficeContent.style.display = 'block';
    }
    
    // Mostrar información del usuario
    displayUserInfo();
    
    // El backoffice ya se inicializa automáticamente en script.js
    // No necesitamos llamar a funciones adicionales aquí
    console.log('✅ Backoffice mostrado correctamente');
}

// Manejar el login con la API
async function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = document.getElementById('remember').checked;
    
    // Validar campos
    if (!email || !password) {
        showError('Por favor, completa todos los campos');
        return;
    }
    
    // Mostrar estado de carga
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    loginBtn.disabled = true;
    
    try {
        // Enviar login a la API
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, remember })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Login exitoso
            handleSuccessfulLogin(email, remember, data.user);
        } else {
            // Login fallido
            handleFailedLogin(data.error || 'Error en el login');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        handleFailedLogin('Error de conexión');
    } finally {
        // Restaurar botón
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

// Manejar login exitoso
function handleSuccessfulLogin(email, remember, user) {
    // Guardar email si se marca "recordar"
    if (remember) {
        localStorage.setItem('llavero3d_saved_email', email);
    } else {
        localStorage.removeItem('llavero3d_saved_email');
    }
    
    // Limpiar formulario
    loginForm.reset();
    
    // Mostrar mensaje de éxito
    showSuccess();
    
    // Mostrar backoffice después de 1 segundo
    setTimeout(() => {
        showBackoffice();
    }, 1000);
}

// Manejar login fallido
function handleFailedLogin(errorMessage) {
    // Mostrar error
    showError(errorMessage);
    
    // Limpiar contraseña
    passwordInput.value = '';
    passwordInput.focus();
    
    // Agitar el formulario
    loginForm.classList.add('shake');
    setTimeout(() => {
        loginForm.classList.remove('shake');
    }, 500);
}

// Mostrar error
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Mostrar éxito
function showSuccess() {
    // Crear mensaje de éxito temporal
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>¡Login exitoso! Accediendo al backoffice...</span>
    `;
    successDiv.style.cssText = `
        background: #c6f6d5;
        color: #2f855a;
        border-color: #9ae6b4;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border: 1px solid;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Mostrar información del usuario autenticado
async function displayUserInfo() {
    try {
        const response = await fetch(`${API_BASE}/verify`);
        const data = await response.json();
        
        if (data.authenticated && data.user) {
            const userEmailElement = document.getElementById('userEmail');
            if (userEmailElement) {
                userEmailElement.textContent = data.user.email;
            }
        }
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
    }
}

// Toggle de mostrar/ocultar contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

// Función global para logout con la API
async function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        try {
            // Enviar logout a la API
            await fetch(`${API_BASE}/logout`, {
                method: 'POST'
            });
            
            // Mostrar login
            showLogin();
            
            // Resetear estado del backoffice
            window.backofficeInitialized = false;
            
        } catch (error) {
            console.error('Error en logout:', error);
            // Aún así, mostrar login
            showLogin();
            window.backofficeInitialized = false;
        }
    }
}

// Añadir estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .shake {
        animation: shake 0.5s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
