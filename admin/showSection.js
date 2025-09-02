// Función para mostrar secciones del admin
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName).classList.add('active');
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    currentSection = sectionName;
    
    // Cargar datos específicos de la sección
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'pedidos':
            renderPedidosTable();
            break;
        case 'clientes':
            renderClientesTable();
            break;
        case 'reportes':
            updateReportes();
            break;
        default:
            updateDashboard();
    }
}
