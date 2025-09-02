// Credenciales de acceso
const VALID_CREDENTIALS = {
    email: 'Admin@llaveros3d.com',
    password: 'Nacho1992!'
};

// Elementos del DOM
let loginForm, emailInput, passwordInput, errorMessage, errorText;
let loginOverlay, backofficeContent;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginOverlay();
    checkExistingSession();
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
    const savedEmail = localStorage.getItem('llaveros3d_saved_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Focus en el primer campo
    emailInput.focus();
}

// Verificar sesión existente
function checkExistingSession() {
    const isAuthenticated = localStorage.getItem('llaveros3d_authenticated');
    const sessionExpiry = localStorage.getItem('llaveros3d_session_expiry');
    
    if (isAuthenticated === 'true' && sessionExpiry) {
        const now = Date.now();
        if (now < parseInt(sessionExpiry)) {
            // Sesión válida, mostrar backoffice
            showBackoffice();
            return;
        } else {
            // Sesión expirada, limpiar
            clearSession();
        }
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
    loginOverlay.classList.remove('active');
    backofficeContent.style.display = 'block';
    
    // Mostrar información del usuario
    displayUserInfo();
    
    // Inicializar backoffice si no se ha hecho
    if (typeof initializeAdmin === 'function' && !window.backofficeInitialized) {
        initializeAdmin();
        setupNavigation();
        loadSampleData();
        updateDashboard();
        setupEventListeners();
        window.backofficeInitialized = true;
    }
}

// Manejar el login
function handleLogin(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = document.getElementById('remember').checked;
    
    // Validar campos
    if (!email || !password) {
        showError('Por favor, completa todos los campos');
        return;
    }
    
    // Validar credenciales
    if (validateCredentials(email, password)) {
        // Login exitoso
        handleSuccessfulLogin(email, remember);
    } else {
        // Login fallido
        handleFailedLogin();
    }
}

// Validar credenciales
function validateCredentials(email, password) {
    // Comparar con las credenciales válidas (case-insensitive para email)
    return email.toLowerCase() === VALID_CREDENTIALS.email.toLowerCase() && 
           password === VALID_CREDENTIALS.password;
}

// Manejar login exitoso
function handleSuccessfulLogin(email, remember) {
    // Mostrar estado de carga
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    loginBtn.disabled = true;
    
    // Simular delay de autenticación
    setTimeout(() => {
        // Guardar sesión
        saveSession(email, remember);
        
        // Limpiar formulario
        loginForm.reset();
        
        // Mostrar mensaje de éxito
        showSuccess();
        
        // Mostrar backoffice después de 1 segundo
        setTimeout(() => {
            showBackoffice();
        }, 1000);
        
    }, 1500);
}

// Manejar login fallido
function handleFailedLogin() {
    // Mostrar error
    showError('Email o contraseña incorrectos');
    
    // Limpiar contraseña
    passwordInput.value = '';
    passwordInput.focus();
    
    // Agitar el formulario
    loginForm.classList.add('shake');
    setTimeout(() => {
        loginForm.classList.remove('shake');
    }, 500);
    
    // Incrementar contador de intentos fallidos
    incrementFailedAttempts();
}

// Guardar sesión
function saveSession(email, remember) {
    const now = Date.now();
    const sessionDuration = remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 días o 1 día
    const expiry = now + sessionDuration;
    
    localStorage.setItem('llaveros3d_authenticated', 'true');
    localStorage.setItem('llaveros3d_user_email', email);
    localStorage.setItem('llaveros3d_session_expiry', expiry.toString());
    
    // Guardar email si se marca "recordar"
    if (remember) {
        localStorage.setItem('llaveros3d_saved_email', email);
    } else {
        localStorage.removeItem('llaveros3d_saved_email');
    }
    
    console.log('Sesión iniciada para:', email);
}

// Limpiar sesión
function clearSession() {
    localStorage.removeItem('llaveros3d_authenticated');
    localStorage.removeItem('llaveros3d_user_email');
    localStorage.removeItem('llaveros3d_session_expiry');
    console.log('Sesión limpiada');
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
function displayUserInfo() {
    const userEmail = localStorage.getItem('llaveros3d_user_email');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userEmailElement && userEmail) {
        userEmailElement.textContent = userEmail;
    }
}

// Incrementar contador de intentos fallidos
function incrementFailedAttempts() {
    const attempts = parseInt(localStorage.getItem('llaveros3d_failed_attempts') || '0') + 1;
    localStorage.setItem('llaveros3d_failed_attempts', attempts.toString());
    
    // Si hay muchos intentos fallidos, mostrar advertencia
    if (attempts >= 5) {
        showError('Demasiados intentos fallidos. Por favor, espera unos minutos antes de intentar de nuevo.');
        
        // Bloquear temporalmente (5 minutos)
        setTimeout(() => {
            localStorage.removeItem('llaveros3d_failed_attempts');
        }, 5 * 60 * 1000);
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

// Función global para logout
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        clearSession();
        showLogin();
        
        // Resetear estado del backoffice
        window.backofficeInitialized = false;
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
