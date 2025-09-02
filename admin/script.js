// Verificar autenticación antes de inicializar
function checkAuth() {
    const isAuthenticated = localStorage.getItem("llaveros3d_authenticated");
    const sessionExpiry = localStorage.getItem("llaveros3d_session_expiry");
    
    if (isAuthenticated !== "true" || !sessionExpiry) {
        redirectToLogin();
        return false;
    }
    
    const now = Date.now();
    if (now >= parseInt(sessionExpiry)) {
        clearSession();
        redirectToLogin();
        return false;
    }
    
    return true;
}

// Redirigir al login
function redirectToLogin() {
    window.location.href = "login.html";
}

// Limpiar sesión
function clearSession() {
    localStorage.removeItem("llaveros3d_authenticated");
    localStorage.removeItem("llaveros3d_user_email");
    localStorage.removeItem("llaveros3d_session_expiry");
}
// Variables globales
let pedidos = [];
// let clientes = [];
// let currentSection = 'dashboard';
// let currentPage = 1;
// const itemsPerPage = 10;
// 
// // Inicialización
// Función para cargar datos del localStorage
function loadDataFromLocalStorage() {
    // Cargar pedidos del localStorage
    const savedPedidos = localStorage.getItem('llavero3d_pedidos');
    if (savedPedidos) {
        try {
            pedidos = JSON.parse(savedPedidos);
            console.log('Pedidos cargados:', pedidos.length);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            pedidos = [];
        }
    }
    
    // Cargar clientes del localStorage
    const savedClientes = localStorage.getItem('llavero3d_clientes');
    if (savedClientes) {
        try {
            clientes = JSON.parse(savedClientes);
            console.log('Clientes cargados:', clientes.length);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            clientes = [];
        }
    }
    
    // Actualizar dashboard con los datos cargados
    updateDashboard();
}
