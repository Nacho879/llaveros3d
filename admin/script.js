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

// Función para mostrar secciones
function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
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
    }
}

// Actualizar dashboard
function updateDashboard() {
    const totalPedidos = pedidos.length;
    const pedidosNuevos = pedidos.filter(p => p.estado === 'Nuevo').length;
    const pedidosEnProceso = pedidos.filter(p => p.estado === 'En Proceso').length;
    const pedidosCompletados = pedidos.filter(p => p.estado === 'Completado').length;
    
    const totalClientes = clientes.length;
    const totalIngresos = pedidos.reduce((sum, p) => sum + (p.precio || 0), 0);
    
    // Actualizar estadísticas
    document.getElementById('totalPedidos').textContent = totalPedidos;
    document.getElementById('pedidosNuevos').textContent = pedidosNuevos;
    document.getElementById('pedidosEnProceso').textContent = pedidosEnProceso;
    document.getElementById('pedidosCompletados').textContent = pedidosCompletados;
    document.getElementById('totalClientes').textContent = totalClientes;
    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2) + '€';
    
    // Actualizar gráfico de pedidos recientes
    renderRecentOrders();
}

// Renderizar tabla de pedidos
function renderPedidosTable() {
    const tableBody = document.getElementById('pedidosTableBody');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pedidosToShow = pedidos.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pedidosToShow.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
            <td>${pedido.nombre}</td>
            <td>${pedido.email}</td>
            <td>${pedido.cantidad}</td>
            <td>${pedido.precio.toFixed(2)}€</td>
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
}

// Renderizar tabla de clientes
function renderClientesTable() {
    const tableBody = document.getElementById('clientesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.ciudad}</td>
            <td>${cliente.totalPedidos}</td>
            <td>${cliente.totalGastado.toFixed(2)}€</td>
        `;
        tableBody.appendChild(row);
    });
}

// Renderizar reportes
function renderReports() {
    const reportsContainer = document.getElementById('reportsContainer');
    if (!reportsContainer) return;
    
    // Estadísticas por mes
    const monthlyStats = getMonthlyStats();
    
    reportsContainer.innerHTML = `
        <div class="report-card">
            <h3>Estadísticas Mensuales</h3>
            <div class="chart-container">
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>
        
        <div class="report-card">
            <h3>Top Productos</h3>
            <div class="top-products">
                ${getTopProducts()}
            </div>
        </div>
    `;
}

// Funciones auxiliares
function updatePedidoStatus(pedidoId, newStatus) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.estado = newStatus;
        localStorage.setItem('llavero3d_pedidos', JSON.stringify(pedidos));
        updateDashboard();
    }
}

function viewPedidoDetails(pedidoId) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;
    
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
                <p><strong>Precio:</strong> ${pedido.precio.toFixed(2)}€</p>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function renderRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    if (!recentOrdersContainer) return;
    
    const recentOrders = pedidos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);
    
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
}

function renderPagination() {
    const totalPages = Math.ceil(pedidos.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
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
    currentPage = page;
    renderPedidosTable();
}

function getMonthlyStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return pedidos.filter(pedido => {
        const pedidoDate = new Date(pedido.fecha);
        return pedidoDate.getMonth() === currentMonth && pedidoDate.getFullYear() === currentYear;
    });
}

function getTopProducts() {
    const productStats = {};
    pedidos.forEach(pedido => {
        const key = `${pedido.forma}-${pedido.tamaño}`;
        productStats[key] = (productStats[key] || 0) + pedido.cantidad;
    });
    
    return Object.entries(productStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([product, count]) => `<div class="product-stat">${product}: ${count} unidades</div>`)
        .join('');
}

// Inicialización
function initializeAdmin() {
    console.log('Backoffice inicializado');
    
    // Configurar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Mostrar dashboard por defecto
    showSection('dashboard');
}

// Manejo de navegación por hash
function handleHashNavigation() {
    const hash = window.location.hash.substring(1);
    const sectionToActivate = hash || 'dashboard';
    showSection(sectionToActivate);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadDataFromLocalStorage();
    handleHashNavigation();
});

// Escuchar cambios en el hash
window.addEventListener('hashchange', handleHashNavigation);
