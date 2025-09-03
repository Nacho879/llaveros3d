// Variables globales
let pedidos = [];
let clientes = [];
let currentSection = 'dashboard';
let currentPage = 1;
const itemsPerPage = 10;

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

// Función para cargar datos del localStorage
function loadDataFromLocalStorage() {
    console.log('🔄 Cargando datos del localStorage...');
    
    // Cargar pedidos del localStorage
    const savedPedidos = localStorage.getItem('llavero3d_pedidos');
    if (savedPedidos) {
        try {
            pedidos = JSON.parse(savedPedidos);
            console.log('✅ Pedidos cargados:', pedidos.length);
        } catch (error) {
            console.error('❌ Error al cargar pedidos:', error);
            pedidos = [];
        }
    } else {
        console.log('ℹ️ No hay pedidos guardados');
    }
    
    // Cargar clientes del localStorage
    const savedClientes = localStorage.getItem('llavero3d_clientes');
    if (savedClientes) {
        try {
            clientes = JSON.parse(savedClientes);
            console.log('✅ Clientes cargados:', clientes.length);
        } catch (error) {
            console.error('❌ Error al cargar clientes:', error);
            clientes = [];
        }
    } else {
        console.log('ℹ️ No hay clientes guardados');
    }
    
    // Actualizar dashboard con los datos cargados
    updateDashboard();
}

// Función para mostrar secciones
function showSection(sectionName) {
    console.log('🔄 Cambiando a sección:', sectionName);
    
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Sección activada:', sectionName);
    } else {
        console.error('❌ Sección no encontrada:', sectionName);
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const targetLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    currentSection = sectionName;
    
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
            renderReports();
            break;
        default:
            console.log('⚠️ Sección no manejada:', sectionName);
    }
}

// Actualizar dashboard
function updateDashboard() {
    console.log('🔄 Actualizando dashboard...');
    
    const totalPedidos = pedidos.length;
    const pedidosNuevos = pedidos.filter(p => p.estado === 'Nuevo').length;
    const pedidosEnProceso = pedidos.filter(p => p.estado === 'En Proceso').length;
    const pedidosCompletados = pedidos.filter(p => p.estado === 'Completado').length;
    
    const totalClientes = clientes.length;
    const totalIngresos = pedidos.reduce((sum, p) => sum + (p.precio || 0), 0);
    
    console.log('📊 Estadísticas calculadas:', {
        totalPedidos,
        pedidosNuevos,
        pedidosEnProceso,
        pedidosCompletados,
        totalClientes,
        totalIngresos
    });
    
    // Actualizar estadísticas usando los IDs correctos del HTML
    const totalPedidosElement = document.getElementById('total-pedidos');
    const pedidosPendientesElement = document.getElementById('pedidos-pendientes');
    const pedidosCompletadosElement = document.getElementById('pedidos-completados');
    const ingresosTotalesElement = document.getElementById('ingresos-totales');
    
    console.log('🔍 Elementos encontrados:', {
        totalPedidosElement: !!totalPedidosElement,
        pedidosPendientesElement: !!pedidosPendientesElement,
        pedidosCompletadosElement: !!pedidosCompletadosElement,
        ingresosTotalesElement: !!ingresosTotalesElement
    });
    
    if (totalPedidosElement) {
        totalPedidosElement.textContent = totalPedidos;
        console.log('✅ total-pedidos actualizado');
    } else {
        console.error('❌ Elemento total-pedidos no encontrado');
    }
    
    if (pedidosPendientesElement) {
        pedidosPendientesElement.textContent = pedidosNuevos;
        console.log('✅ pedidos-pendientes actualizado');
    } else {
        console.error('❌ Elemento pedidos-pendientes no encontrado');
    }
    
    if (pedidosCompletadosElement) {
        pedidosCompletadosElement.textContent = pedidosCompletados;
        console.log('✅ pedidos-completados actualizado');
    } else {
        console.error('❌ Elemento pedidos-completados no encontrado');
    }
    
    if (ingresosTotalesElement) {
        ingresosTotalesElement.textContent = totalIngresos.toFixed(2) + '€';
        console.log('✅ ingresos-totales actualizado');
    } else {
        console.error('❌ Elemento ingresos-totales no encontrado');
    }
    
    // Actualizar gráfico de pedidos recientes
    console.log('🔄 Actualizando pedidos recientes...');
    renderRecentOrders();
    console.log('✅ Dashboard actualizado completamente');
}

// Renderizar tabla de pedidos
function renderPedidosTable() {
    console.log('🔄 Renderizando tabla de pedidos...');
    
    const tableBody = document.getElementById('pedidos-tbody');
    if (!tableBody) {
        console.error('❌ Elemento pedidos-tbody no encontrado');
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pedidosToShow = pedidos.slice(startIndex, endIndex);
    
    console.log(`📋 Mostrando pedidos ${startIndex + 1}-${Math.min(endIndex, pedidos.length)} de ${pedidos.length}`);
    
    tableBody.innerHTML = '';
    
    if (pedidosToShow.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No hay pedidos para mostrar</td></tr>';
        return;
    }
    
    pedidosToShow.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
            <td>${pedido.nombre}</td>
            <td>${pedido.email}</td>
            <td>${pedido.cantidad}</td>
            <td>${pedido.precio ? pedido.precio.toFixed(2) : '0.00'}€</td>
            <td>
                <select onchange="updatePedidoStatus('${pedido.id}', this.value)">
                    <option value="Nuevo" ${pedido.estado === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
                    <option value="En Proceso" ${pedido.estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                    <option value="Completado" ${pedido.estado === 'Completado' ? 'selected' : ''}>Completado</option>
                    <option value="Cancelado" ${pedido.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td>
                <button onclick="viewPedidoDetails('${pedido.id}')" class="btn btn-sm btn-primary">Ver</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    renderPagination();
    console.log('✅ Tabla de pedidos renderizada');
}

// Renderizar tabla de clientes
function renderClientesTable() {
    console.log('🔄 Renderizando tabla de clientes...');
    
    const clientsGrid = document.getElementById('clients-grid');
    if (!clientsGrid) {
        console.error('❌ Elemento clients-grid no encontrado');
        return;
    }
    
    clientsGrid.innerHTML = '';
    
    if (clientes.length === 0) {
        clientsGrid.innerHTML = '<p class="text-center">No hay clientes para mostrar</p>';
        return;
    }
    
    clientes.forEach(cliente => {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        clientCard.innerHTML = `
            <h4>${cliente.nombre || 'Sin nombre'}</h4>
            <p><strong>Email:</strong> ${cliente.email || 'Sin email'}</p>
            <p><strong>Teléfono:</strong> ${cliente.telefono || 'Sin teléfono'}</p>
            <p><strong>Ciudad:</strong> ${cliente.ciudad || 'Sin ciudad'}</p>
            <p><strong>Total Pedidos:</strong> ${cliente.totalPedidos || 0}</p>
            <p><strong>Total Gastado:</strong> ${(cliente.totalGastado || 0).toFixed(2)}€</p>
        `;
        clientsGrid.appendChild(clientCard);
    });
    
    console.log('✅ Tabla de clientes renderizada');
}

// Renderizar reportes
function renderReports() {
    console.log('🔄 Renderizando reportes...');
    
    const topProducts = document.getElementById('top-products');
    const recurringClients = document.getElementById('recurring-clients');
    
    if (topProducts) {
        topProducts.innerHTML = getTopProducts();
        console.log('✅ Top productos actualizado');
    } else {
        console.error('❌ Elemento top-products no encontrado');
    }
    
    if (recurringClients) {
        recurringClients.innerHTML = getRecurringClients();
        console.log('✅ Clientes recurrentes actualizado');
    } else {
        console.error('❌ Elemento recurring-clients no encontrado');
    }
    
    console.log('✅ Reportes renderizados');
}

// Funciones auxiliares
function updatePedidoStatus(pedidoId, newStatus) {
    console.log(`🔄 Actualizando estado del pedido ${pedidoId} a ${newStatus}`);
    
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.estado = newStatus;
        localStorage.setItem('llavero3d_pedidos', JSON.stringify(pedidos));
        updateDashboard();
        console.log('✅ Estado del pedido actualizado');
    } else {
        console.error('❌ Pedido no encontrado:', pedidoId);
    }
}

function viewPedidoDetails(pedidoId) {
    console.log(`🔄 Mostrando detalles del pedido ${pedidoId}`);
    
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        console.error('❌ Pedido no encontrado:', pedidoId);
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Detalles del Pedido ${pedido.id}</h2>
            <div class="pedido-details">
                <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString()}</p>
                <p><strong>Cliente:</strong> ${pedido.nombre}</p>
                <p><strong>Email:</strong> ${pedido.email}</p>
                <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
                <p><strong>Dirección:</strong> ${pedido.direccion}, ${pedido.ciudad}</p>
                <p><strong>Cantidad:</strong> ${pedido.cantidad}</p>
                <p><strong>Tamaño:</strong> ${pedido.tamaño}</p>
                <p><strong>Estilo:</strong> ${pedido.estilo}</p>
                <p><strong>Forma:</strong> ${pedido.forma}</p>
                <p><strong>Color:</strong> ${pedido.color}</p>
                <p><strong>Notas:</strong> ${pedido.notasPedido || 'Sin notas'}</p>
                <p><strong>Precio:</strong> ${pedido.precio ? pedido.precio.toFixed(2) : '0.00'}€</p>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    console.log('✅ Modal de detalles mostrado');
}

function renderRecentOrders() {
    const recentOrdersContainer = document.getElementById('recent-pedidos');
    if (!recentOrdersContainer) {
        console.error('❌ Elemento recent-pedidos no encontrado');
        return;
    }
    
    const recentOrders = pedidos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p class="text-center">No hay pedidos recientes</p>';
        return;
    }
    
    recentOrdersContainer.innerHTML = recentOrders.map(pedido => `
        <div class="recent-order">
            <div class="order-info">
                <strong>${pedido.id}</strong>
                <span>${pedido.nombre}</span>
            </div>
            <div class="order-status ${pedido.estado.toLowerCase().replace(' ', '-')}">
                ${pedido.estado}
            </div>
        </div>
    `).join('');
    
    console.log('✅ Pedidos recientes actualizados');
}

function renderPagination() {
    const totalPages = Math.ceil(pedidos.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        console.error('❌ Elemento pagination no encontrado');
        return;
    }
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})">Anterior</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
    }
    
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})">Siguiente</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    console.log(`🔄 Cambiando a página ${page}`);
    currentPage = page;
    renderPedidosTable();
}

function getTopProducts() {
    const productStats = {};
    pedidos.forEach(pedido => {
        const key = `${pedido.forma}-${pedido.tamaño}`;
        productStats[key] = (productStats[key] || 0) + pedido.cantidad;
    });
    
    if (Object.keys(productStats).length === 0) {
        return '<p class="text-center">No hay datos de productos</p>';
    }
    
    return Object.entries(productStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([product, count]) => `<div class="product-stat">${product}: ${count} unidades</div>`)
        .join('');
}

function getRecurringClients() {
    const clientStats = {};
    pedidos.forEach(pedido => {
        if (!clientStats[pedido.email]) {
            clientStats[pedido.email] = {
                nombre: pedido.nombre,
                totalPedidos: 0,
                totalGastado: 0
            };
        }
        clientStats[pedido.email].totalPedidos++;
        clientStats[pedido.email].totalGastado += pedido.precio || 0;
    });
    
    const recurringClients = Object.entries(clientStats)
        .filter(([, stats]) => stats.totalPedidos > 1)
        .sort(([,a], [,b]) => b.totalPedidos - a.totalPedidos)
        .slice(0, 5);
    
    if (recurringClients.length === 0) {
        return '<p class="text-center">No hay clientes recurrentes</p>';
    }
    
    return recurringClients.map(([email, stats]) => `
        <div class="client-stat">
            <strong>${stats.nombre}</strong><br>
            ${stats.totalPedidos} pedidos - ${stats.totalGastado.toFixed(2)}€
        </div>
    `).join('');
}

// Inicialización
function initializeAdmin() {
    console.log('🚀 Backoffice inicializando...');
    
    // Configurar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            console.log('🖱️ Click en navegación:', section);
            showSection(section);
        });
    });
    
    // Mostrar dashboard por defecto
    showSection('dashboard');
    console.log('✅ Backoffice inicializado correctamente');
}

// Manejo de navegación por hash
function handleHashNavigation() {
    const hash = window.location.hash.substring(1);
    const sectionToActivate = hash || 'dashboard';
    console.log('🔗 Navegación por hash:', sectionToActivate);
    showSection(sectionToActivate);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, inicializando backoffice...');
    initializeAdmin();
    loadDataFromLocalStorage();
    handleHashNavigation();
});

// Escuchar cambios en el hash
window.addEventListener('hashchange', handleHashNavigation);
