// Función para manejar navegación por hash
function handleHashNavigation() {
    const hash = window.location.hash.substring(1); // Remover el #
    
    if (hash && ['dashboard', 'pedidos', 'clientes', 'reportes'].includes(hash)) {
        showSection(hash);
    } else {
        // Si no hay hash o es inválido, mostrar dashboard por defecto
        showSection('dashboard');
    }
}

// Listener para cambios de hash
window.addEventListener('hashchange', handleHashNavigation);

// Listener para carga inicial de la página
document.addEventListener('DOMContentLoaded', function() {
    // Manejar navegación por hash al cargar la página
    handleHashNavigation();
    
    // Configurar navegación
    setupNavigation();
});

// Función para configurar navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Cambiar el hash de la URL
            window.location.hash = section;
            
            // Mostrar la sección
            showSection(section);
        });
    });
}
