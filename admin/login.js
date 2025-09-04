// Configuración de login
const ADMIN_EMAIL = 'admin@llavero3d.com';
const ADMIN_PASSWORD = 'Nacho1992!';

// Elementos del DOM
let loginOverlay, backofficeContent, loginForm, errorMessage;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Sistema de login inicializado');
    
    // Obtener elementos
    loginOverlay = document.getElementById('loginOverlay');
    backofficeContent = document.getElementById('backofficeContent');
    loginForm = document.getElementById('loginForm');
    errorMessage = document.getElementById('errorMessage');
    
    // Configurar eventos
    setupLoginEvents();
    
    // Verificar sesión existente
    checkExistingSession();
});

function setupLoginEvents() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function checkExistingSession() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        const userEmail = sessionStorage.getItem('adminUserEmail');
        if (userEmail) {
            showBackoffice(userEmail);
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('🔐 Intentando login:', email);
    
    // Validar credenciales
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log('✅ Login exitoso');
        
        // Guardar sesión
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUserEmail', email);
        
        // Mostrar backoffice
        showBackoffice(email);
        
    } else {
        console.log('❌ Credenciales incorrectas');
        showError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
}

function showBackoffice(userEmail) {
    console.log('🏢 Mostrando backoffice para:', userEmail);
    
    // Ocultar login
    if (loginOverlay) {
        loginOverlay.classList.remove('active');
    }
    
    // Mostrar backoffice
    if (backofficeContent) {
        backofficeContent.style.display = 'block';
        backofficeContent.classList.add('active');
    }
    
    // Actualizar info del usuario
    const userInfoElement = document.getElementById('userEmail');
    if (userInfoElement) {
        userInfoElement.textContent = userEmail;
    }
    
    // Inicializar el backoffice
    if (typeof initializeAdmin === 'function') {
        initializeAdmin();
    }
}

function showError(message) {
    if (errorMessage) {
        const errorText = document.getElementById('errorText');
        if (errorText) {
            errorText.textContent = message;
        }
        errorMessage.style.display = 'block';
        
        // Ocultar error después de 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

function logout() {
    console.log('🚪 Cerrando sesión');
    
    // Limpiar sesión
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUserEmail');
    
    // Ocultar backoffice
    if (backofficeContent) {
        backofficeContent.style.display = 'none';
        backofficeContent.classList.remove('active');
    }
    
    // Mostrar login
    if (loginOverlay) {
        loginOverlay.classList.add('active');
    }
    
    // Limpiar formulario
    if (loginForm) {
        loginForm.reset();
    }
    
    // Ocultar error
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput && toggleBtn) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
        }
    }
}

// Función global para logout (llamada desde HTML)
window.logout = logout;
window.togglePassword = togglePassword;
