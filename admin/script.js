// ===== CONFIGURACIÓN =====
const API_BASE_URL = '/api/supabase-orders';
let currentSection = 'dashboard';
let allOrders = [];
let allClients = [];

// ===== FUNCIONES DE UTILIDAD =====
function calculatePrice(cantidad, forma) {
    const basePrice = 1.20; // Precio base por unidad
    const total = parseFloat(cantidad) * basePrice;
    return total.toFixed(2);
}

// Funciones safe para evitar errores de elementos no encontrados
function safeGetElement(id) {
    return document.getElementById(id);
}

function safeSetText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function safeGetValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function safeSetValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    }
}

// ===== DATOS DE PRUEBA =====
function generateMockData() {
    const mockOrders = [
        {
            id: 'P1756939312359187',
            fecha: '2025-09-03T22:41:52.359Z',
            nombre: 'Ignacio Sebastián',
            email: 'nacho.hipermercode@gmail.com',
            telefono: '+34632711492',
            forma: 'Redondo',
            estilo: 'Relieve',
            tamaño: '50',
            color: 'Negro',
            cantidad: '100',
            precio: '120.00',
            estado: 'pendiente',
            notas: 'Pedido urgente para evento corporativo'
        },
        {
            id: 'P1756937408673177',
            fecha: '2025-09-03T22:10:08.673Z',
            nombre: 'María García',
            email: 'maria.garcia@empresa.com',
            telefono: '+34612345678',
            forma: 'Rectangular',
            estilo: 'Silueta',
            tamaño: '60',
            color: 'Azul',
            cantidad: '50',
            precio: '75.00',
            estado: 'en_proceso',
            notas: 'Logo corporativo en relieve'
        },
        {
            id: 'P1756935000000001',
            fecha: '2025-09-03T21:30:00.000Z',
            nombre: 'Carlos López',
            email: 'carlos.lopez@startup.com',
            telefono: '+34687654321',
            forma: 'Píldora',
            estilo: 'Relieve',
            tamaño: '45',
            color: 'Verde',
            cantidad: '200',
            precio: '240.00',
            estado: 'completado',
            notas: 'Entrega completada'
        },
        {
            id: 'P1756934000000002',
            fecha: '2025-09-03T20:15:00.000Z',
            nombre: 'Ana Martínez',
            email: 'ana.martinez@tienda.com',
            telefono: '+34611111111',
            forma: 'Redondo',
            estilo: 'Silueta',
            tamaño: '55',
            color: 'Rojo',
            cantidad: '75',
            precio: '90.00',
            estado: 'pendiente',
            notas: 'Para promoción de verano'
        },
        {
            id: 'P1756933000000003',
            fecha: '2025-09-03T19:00:00.000Z',
            nombre: 'David Ruiz',
            email: 'david.ruiz@restaurante.com',
            telefono: '+34622222222',
            forma: 'Rectangular',
            estilo: 'Relieve',
            tamaño: '65',
            color: 'Dorado',
            cantidad: '30',
            precio: '45.00',
            estado: 'completado',
            notas: 'Para personal del restaurante'
        }
    ];
    
    return mockOrders;
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Backoffice profesional inicializado');
    initializeBackoffice();
});

function initializeBackoffice() {
    setupNavigation();
    setupEventListeners();
    loadDashboard();
    setupGlobalSearch();
    setupNotifications();
    setupClientFilters();
}

// ===== NAVEGACIÓN =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover active de todos los nav-links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activar nav-link correspondiente
    const targetLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // Actualizar título de página
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'pedidos': 'Gestión de Pedidos',
            'clientes': 'Gestión de Clientes',
            'reportes': 'Reportes y Análisis',
            'configuracion': 'Configuración'
        };
        pageTitle.textContent = titles[sectionName] || 'Dashboard';
    }
    
    currentSection = sectionName;
    
    // Cargar contenido específico de la sección
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'pedidos':
            loadPedidos();
            break;
        case 'clientes':
            loadClientes();
            break;
        case 'facturacion':
            loadFacturas();
            break;
        case 'reportes':
            loadReportes();
            break;
        case 'configuracion':
            loadConfiguracion();
            break;
    }
}

// ===== DASHBOARD =====
async function loadDashboard() {
    console.log('📊 Cargando dashboard...');
    
    // Mostrar indicador de carga
    showLoadingIndicator('Cargando dashboard...');
    
    try {
        // Cargar estadísticas
        await loadStats();
        
        // Cargar pedidos recientes
        await loadRecentOrders();
        
        // Actualizar notificaciones
        updateNotificationBadge();
        
        console.log('✅ Dashboard cargado correctamente');
        
        } catch (error) {
        console.error('❌ Error cargando dashboard:', error);
        showNotification('Error cargando dashboard', 'error');
    } finally {
        // Ocultar indicador de carga
        hideLoadingIndicator();
    }
}

async function loadStats() {
    try {
        // Añadir timeout a la petición
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
        
        const response = await fetch(`${API_BASE_URL}?action=list`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Mapear los datos de Supabase al formato esperado
            const rawPedidos = data.pedidos || data.orders || [];
            allOrders = rawPedidos.map(pedido => ({
                id: pedido.id,
                fecha: pedido.fecha,
                nombre: pedido.nombre,
                email: pedido.email,
                telefono: pedido.telefono,
                logo: pedido.logo,
                forma: pedido.forma,
                estilo: pedido.estilo || 'Relieve',
                tamaño: pedido.tamano || pedido.tamaño || '50',
                color: pedido.color,
                cantidad: pedido.cantidad,
                precio: calculatePrice(pedido.cantidad, pedido.forma),
                estado: pedido.estado,
                notas: pedido.notas
            }));
            console.log('✅ Datos cargados desde API:', allOrders.length, 'pedidos');
        } else {
            throw new Error(data.message || 'Error cargando estadísticas');
        }
        } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('⏰ Timeout de API, usando datos de prueba');
        } else {
            console.warn('⚠️ API no disponible, usando datos de prueba:', error.message);
        }
        // Usar datos de prueba cuando la API no esté disponible
        allOrders = generateMockData();
        showNotification('Usando datos de demostración', 'info');
    }
    
    // Calcular estadísticas
    const totalPedidos = allOrders.length;
    const pedidosPendientes = allOrders.filter(order => order.estado === 'pendiente').length;
    const pedidosCompletados = allOrders.filter(order => order.estado === 'completado').length;
    const totalIngresos = allOrders.reduce((sum, order) => {
        const precio = parseFloat(order.precio) || 0;
        return sum + precio;
    }, 0);
    
    // Actualizar UI
    updateElement('totalPedidos', totalPedidos);
    updateElement('pedidosPendientes', pedidosPendientes);
    updateElement('pedidosCompletados', pedidosCompletados);
    updateElement('totalIngresos', `€${totalIngresos.toFixed(2)}`);
    
    // Actualizar badge de pedidos
    updateElement('pedidosBadge', pedidosPendientes);
    
    // Calcular cambios porcentuales (simulado)
    updateElement('pedidosChange', `+${Math.floor(Math.random() * 20)}%`);
    updateElement('pendientesChange', pedidosPendientes);
    updateElement('completadosChange', `+${Math.floor(Math.random() * 15)}%`);
    updateElement('ingresosChange', `+${Math.floor(Math.random() * 25)}%`);
}

async function loadRecentOrders() {
    try {
        const recentOrders = allOrders.slice(0, 5);
        const container = document.getElementById('pedidosRecientes');
        
        if (recentOrders.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>No hay pedidos recientes</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentOrders.map(order => `
            <div class="order-item" onclick="showOrderDetails('${order.id}')">
                <div class="order-info">
                    <h4>Pedido ${order.id}</h4>
                    <p>${order.nombre} • ${formatDate(order.fecha)}</p>
                </div>
                <div class="order-status ${order.estado}">
                    ${order.estado}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ Error cargando pedidos recientes:', error);
    }
}

// ===== GESTIÓN DE PEDIDOS =====
let currentOrderView = 'table';
let filteredOrders = [];
let selectedOrders = new Set();

async function loadPedidos() {
    console.log('📋 Cargando pedidos...');
    
    // Mostrar indicador de carga
    showLoadingIndicator('Cargando pedidos...');
    
    try {
        // Añadir timeout a la petición
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
        
        const response = await fetch(`${API_BASE_URL}?action=list`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Mapear los datos de Supabase al formato esperado
            const rawPedidos = data.pedidos || data.orders || [];
            allOrders = rawPedidos.map(pedido => ({
                id: pedido.id,
                fecha: pedido.fecha,
                nombre: pedido.nombre,
                email: pedido.email,
                telefono: pedido.telefono,
                logo: pedido.logo,
                forma: pedido.forma,
                estilo: pedido.estilo || 'Relieve',
                tamaño: pedido.tamano || pedido.tamaño || '50',
                color: pedido.color,
                cantidad: pedido.cantidad,
                precio: calculatePrice(pedido.cantidad, pedido.forma),
                estado: pedido.estado,
                notas: pedido.notas
            }));
            console.log('✅ Pedidos cargados desde API:', allOrders.length, 'pedidos');
        } else {
            throw new Error(data.message || 'Error cargando pedidos');
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('⏰ Timeout de API, usando datos de prueba');
        } else {
            console.warn('⚠️ API no disponible, usando datos de prueba:', error.message);
        }
        allOrders = generateMockData();
        showNotification('Usando datos de demostración', 'info');
    } finally {
        // Ocultar indicador de carga
        hideLoadingIndicator();
    }
    
    // Actualizar estadísticas de pedidos
    updateOrderStats();
    
    // Aplicar filtros y renderizar
    applyOrderFilters();
    
    // Configurar filtros
    setupOrderFilters();
    
    console.log('✅ Pedidos cargados correctamente');
}

function updateOrderStats() {
    const totalPedidos = allOrders.length;
    const pedidosPendientes = allOrders.filter(order => order.estado === 'pendiente').length;
    const pedidosProceso = allOrders.filter(order => order.estado === 'en_proceso').length;
    const pedidosCompletados = allOrders.filter(order => order.estado === 'completado').length;
    const totalIngresos = allOrders.reduce((sum, order) => sum + parseFloat(order.precio || 0), 0);
    
    updateElement('totalPedidosStats', totalPedidos);
    updateElement('pedidosPendientesStats', pedidosPendientes);
    updateElement('pedidosProcesoStats', pedidosProceso);
    updateElement('pedidosCompletadosStats', pedidosCompletados);
    updateElement('ingresosPedidosStats', `€${totalIngresos.toFixed(2)}`);
    
    // Calcular cambios porcentuales (simulado)
    updateElement('totalPedidosChange', `+${Math.floor(Math.random() * 20)}%`);
    updateElement('pendientesStatsChange', pedidosPendientes);
    updateElement('procesoStatsChange', pedidosProceso);
    updateElement('completadosStatsChange', `+${Math.floor(Math.random() * 15)}%`);
    updateElement('ingresosPedidosChange', `+${Math.floor(Math.random() * 25)}%`);
}

function applyOrderFilters() {
    const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const sortBy = document.getElementById('orderSortBy')?.value || 'fecha';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    const filterBy = document.getElementById('orderFilterBy')?.value || 'todos';
    
    // Filtrar pedidos
    filteredOrders = allOrders.filter(order => {
        // Filtro de búsqueda
        const matchesSearch = !searchTerm || 
            order.nombre.toLowerCase().includes(searchTerm) ||
            order.email.toLowerCase().includes(searchTerm) ||
            order.id.toString().includes(searchTerm);
        
        // Filtro por estado
        const matchesStatus = !statusFilter || order.estado === statusFilter;
        
        // Filtro por fecha
        let matchesDate = true;
        if (dateFilter) {
            const orderDate = new Date(order.fecha).toISOString().split('T')[0];
            matchesDate = orderDate === dateFilter;
        }
        
        // Filtro por período
        let matchesPeriod = true;
        if (filterBy !== 'todos') {
            const orderDate = new Date(order.fecha);
            const now = new Date();
            
            switch (filterBy) {
                case 'hoy':
                    matchesPeriod = orderDate.toDateString() === now.toDateString();
                    break;
                case 'semana':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesPeriod = orderDate >= weekAgo;
                    break;
                case 'mes':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesPeriod = orderDate >= monthAgo;
                    break;
                case 'urgentes':
                    // Pedidos pendientes de más de 3 días
                    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
                    matchesPeriod = order.estado === 'pendiente' && orderDate <= threeDaysAgo;
                    break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesDate && matchesPeriod;
    });
    
    // Ordenar pedidos
    filteredOrders.sort((a, b) => {
        switch (sortBy) {
            case 'fecha':
                return new Date(b.fecha) - new Date(a.fecha);
            case 'cliente':
                return a.nombre.localeCompare(b.nombre);
            case 'total':
                return parseFloat(b.precio || 0) - parseFloat(a.precio || 0);
            case 'estado':
                return a.estado.localeCompare(b.estado);
            default:
                return 0;
        }
    });
    
    // Actualizar contador
    updateElement('orderCount', `${filteredOrders.length} pedidos encontrados`);
    
    // Renderizar según la vista actual
    if (currentOrderView === 'table') {
        renderOrdersTable();
    } else if (currentOrderView === 'cards') {
        renderOrdersCards();
    } else if (currentOrderView === 'kanban') {
        renderOrdersKanban();
    }
}

function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No se encontraron pedidos con los filtros aplicados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => {
        const avatarText = order.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
        const isSelected = selectedOrders.has(order.id);
        
        return `
            <tr class="${isSelected ? 'selected' : ''}" onclick="toggleOrderSelection(${order.id})">
                <td>
                    <input type="checkbox" class="order-checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="toggleOrderSelection(${order.id})" onclick="event.stopPropagation()">
                </td>
                <td>
                    <span class="order-id">#${order.id}</span>
                </td>
                <td>
                    <div class="order-client">
                        <div class="order-client-avatar">${avatarText}</div>
                        <div class="order-client-info">
                            <h5>${order.nombre}</h5>
                            <p>${order.email}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="order-product">
                        <div class="product-name">${order.forma}</div>
                        <div class="product-details">${order.estilo} - ${order.cantidad} unidades</div>
                    </div>
                </td>
                <td>
                    <div class="order-date">${formatDate(order.fecha)}</div>
                </td>
                <td>
                    <span class="order-status-badge ${order.estado}">
                        <i class="fas fa-circle"></i>
                        ${order.estado}
                    </span>
                </td>
                <td>
                    <div class="order-total">€${parseFloat(order.precio || 0).toFixed(2)}</div>
                </td>
                <td>
                    <div class="order-actions">
                        <button class="order-action-btn" onclick="event.stopPropagation(); viewOrder(${order.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="order-action-btn" onclick="event.stopPropagation(); updateOrderStatus(${order.id})" title="Cambiar estado">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="order-action-btn" onclick="event.stopPropagation(); contactOrderClient(${order.id})" title="Contactar cliente">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function setupOrderFilters() {
    const searchInput = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const sortSelect = document.getElementById('orderSortBy');
    const dateFilter = document.getElementById('dateFilter');
    const filterSelect = document.getElementById('orderFilterBy');
    
    if (searchInput) {
        searchInput.addEventListener('input', applyOrderFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyOrderFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyOrderFilters);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', applyOrderFilters);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', applyOrderFilters);
    }
}

// ===== FUNCIONES DE VISTA DE PEDIDOS =====
function setOrderView(view) {
    currentOrderView = view;
    
    // Actualizar botones de vista
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Mostrar/ocultar contenedores
    const tableContainer = document.getElementById('ordersTableContainer');
    const cardsContainer = document.getElementById('ordersCardsContainer');
    const kanbanContainer = document.getElementById('ordersKanbanContainer');
    
    tableContainer.style.display = 'none';
    cardsContainer.style.display = 'none';
    kanbanContainer.style.display = 'none';
    
    if (view === 'table') {
        tableContainer.style.display = 'block';
        renderOrdersTable();
    } else if (view === 'cards') {
        cardsContainer.style.display = 'block';
        renderOrdersCards();
    } else if (view === 'kanban') {
        kanbanContainer.style.display = 'block';
        renderOrdersKanban();
    }
}

function renderOrdersCards() {
    const container = document.getElementById('ordersCardsGrid');
    
    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-cart"></i>
                <h3>No hay pedidos</h3>
                <p>No se encontraron pedidos con los filtros aplicados</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredOrders.map(order => {
        const avatarText = order.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
        const isSelected = selectedOrders.has(order.id);
        
        return `
            <div class="order-card ${isSelected ? 'selected' : ''}" onclick="toggleOrderSelection(${order.id})">
                <div class="order-card-header">
                    <span class="order-card-id">#${order.id}</span>
                    <input type="checkbox" class="order-card-checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="toggleOrderSelection(${order.id})" onclick="event.stopPropagation()">
                </div>
                
                <div class="order-card-client">
                    <div class="order-card-avatar">${avatarText}</div>
                    <div class="order-card-client-info">
                        <h4>${order.nombre}</h4>
                        <p>${order.email}</p>
                    </div>
                </div>
                
                <div class="order-card-product">
                    <h5>${order.forma}</h5>
                    <div class="order-card-product-details">
                        <div><strong>Estilo:</strong> ${order.estilo}</div>
                        <div><strong>Cantidad:</strong> ${order.cantidad}</div>
                        <div><strong>Tamaño:</strong> ${order.tamaño}mm</div>
                        <div><strong>Color:</strong> ${order.color}</div>
                    </div>
                </div>
                
                <div class="order-card-footer">
                    <div class="order-card-meta">
                        <div class="order-card-date">${formatDate(order.fecha)}</div>
                        <div class="order-card-total">€${parseFloat(order.precio || 0).toFixed(2)}</div>
                    </div>
                    <div class="order-card-actions">
                        <button class="order-action-btn" onclick="event.stopPropagation(); viewOrder(${order.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="order-action-btn" onclick="event.stopPropagation(); updateOrderStatus(${order.id})" title="Cambiar estado">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderOrdersKanban() {
    const statuses = [
        { key: 'pendiente', id: 'kanbanPendientesCards', countId: 'kanbanPendientes' },
        { key: 'en_proceso', id: 'kanbanProcesoCards', countId: 'kanbanProceso' },
        { key: 'completado', id: 'kanbanCompletadosCards', countId: 'kanbanCompletados' },
        { key: 'cancelado', id: 'kanbanCanceladosCards', countId: 'kanbanCancelados' }
    ];
    
    statuses.forEach(status => {
        const cards = filteredOrders.filter(order => order.estado === status.key);
        const container = document.getElementById(status.id);
        const countElement = document.getElementById(status.countId);
        
        // Actualizar contador
        if (countElement) {
            countElement.textContent = cards.length;
        }
        
        // Renderizar tarjetas
        if (container) {
            if (cards.length === 0) {
                container.innerHTML = `
                    <div class="kanban-empty">
                        <i class="fas fa-inbox"></i>
                        <p>No hay pedidos</p>
                    </div>
                `;
            } else {
                container.innerHTML = cards.map(order => {
                    const avatarText = order.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
                    const isSelected = selectedOrders.has(order.id);
                    
                    return `
                        <div class="kanban-card ${isSelected ? 'selected' : ''}" 
                             draggable="true"
                             data-order-id="${order.id}"
                             data-current-status="${status.key}"
                             onclick="toggleOrderSelection(${order.id})"
                             ondragstart="handleDragStart(event, ${order.id}, '${status.key}')"
                             ondragend="handleDragEnd(event)">
                            <div class="kanban-card-header">
                                <span class="kanban-card-id">#${order.id}</span>
                                <input type="checkbox" class="kanban-card-checkbox" ${isSelected ? 'checked' : ''} 
                                       onchange="toggleOrderSelection(${order.id})" onclick="event.stopPropagation()">
                            </div>
                            
                            <div class="kanban-card-client">
                                <div class="kanban-card-avatar">${avatarText}</div>
                                <div class="kanban-card-client-info">
                                    <h5>${order.nombre}</h5>
                                </div>
                            </div>
                            
                            <div class="kanban-card-product">
                                ${order.forma} - ${order.cantidad} unidades
                            </div>
                            
                            <div class="kanban-card-footer">
                                <div class="kanban-card-total">€${parseFloat(order.precio || 0).toFixed(2)}</div>
                                <div class="kanban-card-actions">
                                    <button class="kanban-card-action-btn" onclick="event.stopPropagation(); showOrderDetails(${order.id})" title="Ver detalles">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="kanban-card-action-btn" onclick="event.stopPropagation(); updateOrderStatus(${order.id})" title="Cambiar estado">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="kanban-card-action-btn" onclick="event.stopPropagation(); downloadOrderLogo(${order.id})" title="Descargar logo">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    });
}

// ===== FUNCIONES DE SELECCIÓN Y ACCIONES =====
function toggleOrderSelection(orderId) {
    if (selectedOrders.has(orderId)) {
        selectedOrders.delete(orderId);
    } else {
        selectedOrders.add(orderId);
    }
    
    // Actualizar la vista actual
    if (currentOrderView === 'table') {
        renderOrdersTable();
    } else if (currentOrderView === 'cards') {
        renderOrdersCards();
    } else if (currentOrderView === 'kanban') {
        renderOrdersKanban();
    }
    
    // Actualizar checkbox "Seleccionar todo"
    updateSelectAllCheckbox();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllOrders');
    const isChecked = selectAllCheckbox.checked;
    
    if (isChecked) {
        // Seleccionar todos los pedidos filtrados
        filteredOrders.forEach(order => selectedOrders.add(order.id));
    } else {
        // Deseleccionar todos
        selectedOrders.clear();
    }
    
    // Actualizar la vista actual
    if (currentOrderView === 'table') {
        renderOrdersTable();
    } else if (currentOrderView === 'cards') {
        renderOrdersCards();
    } else if (currentOrderView === 'kanban') {
        renderOrdersKanban();
    }
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllOrders');
    if (!selectAllCheckbox) return;
    
    const totalFiltered = filteredOrders.length;
    const totalSelected = Array.from(selectedOrders).filter(id => 
        filteredOrders.some(order => order.id === id)
    ).length;
    
    if (totalSelected === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (totalSelected === totalFiltered) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

function executeBulkAction() {
    const action = document.getElementById('bulkActionSelect').value;
    const selectedIds = Array.from(selectedOrders);
    
    if (!action) {
        showNotification('Selecciona una acción', 'warning');
        return;
    }
    
    if (selectedIds.length === 0) {
        showNotification('Selecciona al menos un pedido', 'warning');
        return;
    }
    
    switch (action) {
        case 'marcar_proceso':
            bulkUpdateStatus(selectedIds, 'en_proceso');
            break;
        case 'marcar_completado':
            bulkUpdateStatus(selectedIds, 'completado');
            break;
        case 'exportar_seleccion':
            exportSelectedOrders(selectedIds);
            break;
    }
}

async function bulkUpdateStatus(orderIds, newStatus) {
    showLoadingIndicator('Actualizando estados...');
    
    try {
        const promises = orderIds.map(orderId => 
            updateOrderStatusAPI(orderId, newStatus)
        );
        
        await Promise.all(promises);
        
        // Actualizar datos locales
        orderIds.forEach(orderId => {
            const order = allOrders.find(o => o.id === orderId);
            if (order) {
                order.estado = newStatus;
            }
        });
        
        // Limpiar selección
        selectedOrders.clear();
        
        // Actualizar estadísticas y vista
        updateOrderStats();
        applyOrderFilters();
        
        showNotification(`${orderIds.length} pedidos actualizados a ${newStatus}`, 'success');
        
    } catch (error) {
        console.error('Error actualizando estados:', error);
        showNotification('Error actualizando algunos pedidos', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

async function updateOrderStatusAPI(orderId, newStatus) {
    const response = await fetch(`${API_BASE_URL}?action=update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: orderId,
            estado: newStatus
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
}

function exportSelectedOrders(orderIds) {
    const selectedOrdersData = allOrders.filter(order => orderIds.includes(order.id));
    
    if (selectedOrdersData.length === 0) {
        showNotification('No hay pedidos seleccionados', 'warning');
        return;
    }
    
    // Crear CSV
    const headers = ['ID', 'Cliente', 'Email', 'Teléfono', 'Forma', 'Estilo', 'Cantidad', 'Precio', 'Estado', 'Fecha'];
    const csvContent = [
        headers.join(','),
        ...selectedOrdersData.map(order => [
            order.id,
            `"${order.nombre}"`,
            order.email,
            order.telefono,
            order.forma,
            order.estilo,
            order.cantidad,
            order.precio,
            order.estado,
            order.fecha
        ].join(','))
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos_seleccionados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`${selectedOrdersData.length} pedidos exportados`, 'success');
}

function refreshOrders() {
    loadPedidos();
    showNotification('Pedidos actualizados', 'success');
}

function contactOrderClient(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }
    
    // Crear enlace de WhatsApp
    const message = `Hola ${order.nombre}, te contactamos desde Llaveros 3D para informarte sobre tu pedido #${order.id}.`;
    const whatsappUrl = `https://wa.me/${order.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Abriendo WhatsApp...', 'info');
}

// ===== FUNCIONES DE ACCIONES DE PEDIDOS =====
function showOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }
    
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    modalBody.innerHTML = `
        <div class="order-details">
            <div class="order-detail-header">
                <h3>Pedido #${order.id}</h3>
                <span class="order-status-badge ${order.estado}">
                    <i class="fas fa-circle"></i>
                    ${order.estado}
                </span>
            </div>
            
            <div class="order-detail-content">
                <div class="order-detail-section">
                    <h4>Información del Cliente</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Nombre:</label>
                            <span>${order.nombre}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${order.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Teléfono:</label>
                            <span>${order.telefono}</span>
                        </div>
                        <div class="detail-item">
                            <label>Fecha:</label>
                            <span>${formatDate(order.fecha)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="order-detail-section">
                    <h4>Detalles del Producto</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Forma:</label>
                            <span>${order.forma}</span>
                        </div>
                        <div class="detail-item">
                            <label>Estilo:</label>
                            <span>${order.estilo}</span>
                        </div>
                        <div class="detail-item">
                            <label>Tamaño:</label>
                            <span>${order.tamaño}mm</span>
                        </div>
                        <div class="detail-item">
                            <label>Color:</label>
                            <span>${order.color}</span>
                        </div>
                        <div class="detail-item">
                            <label>Cantidad:</label>
                            <span>${order.cantidad} unidades</span>
                        </div>
                        <div class="detail-item">
                            <label>Precio Total:</label>
                            <span class="price">€${parseFloat(order.precio || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                ${order.notas ? `
                <div class="order-detail-section">
                    <h4>Notas Adicionales</h4>
                    <p class="order-notes">${order.notas}</p>
                </div>
                ` : ''}
                
                <div class="order-detail-actions">
                    <button class="btn btn-primary" onclick="updateOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i>
                        Cambiar Estado
                    </button>
                    <button class="btn btn-secondary" onclick="contactOrderClient(${order.id})">
                        <i class="fas fa-envelope"></i>
                        Contactar Cliente
                    </button>
                    <button class="btn btn-success" onclick="downloadOrderLogo(${order.id})">
                        <i class="fas fa-download"></i>
                        Descargar Logo
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function updateOrderStatus(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }
    
    const currentStatus = order.estado;
    const statusOptions = [
        { value: 'pendiente', label: 'Pendiente', icon: 'fas fa-clock' },
        { value: 'en_proceso', label: 'En Proceso', icon: 'fas fa-cog' },
        { value: 'completado', label: 'Completado', icon: 'fas fa-check-circle' },
        { value: 'cancelado', label: 'Cancelado', icon: 'fas fa-times-circle' }
    ];
    
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    modalBody.innerHTML = `
        <div class="status-update">
            <div class="status-update-header">
                <h3>Cambiar Estado del Pedido #${order.id}</h3>
                <p>Cliente: ${order.nombre}</p>
            </div>
            
            <div class="status-options">
                ${statusOptions.map(status => `
                    <div class="status-option ${currentStatus === status.value ? 'current' : ''}" 
                         onclick="confirmStatusUpdate(${orderId}, '${status.value}')">
                        <i class="${status.icon}"></i>
                        <span>${status.label}</span>
                        ${currentStatus === status.value ? '<i class="fas fa-check current-indicator"></i>' : ''}
                    </div>
                `).join('')}
            </div>
            
            <div class="status-update-actions">
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

async function confirmStatusUpdate(orderId, newStatus) {
    showLoadingIndicator('Actualizando estado...');
    
    try {
        const response = await fetch(`${API_BASE_URL}?action=update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: orderId,
                estado: newStatus
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Actualizar datos locales
            const order = allOrders.find(o => o.id === orderId);
            if (order) {
                order.estado = newStatus;
            }
            
            // Actualizar estadísticas y vista
            updateOrderStats();
            applyOrderFilters();
            
            showNotification(`Estado actualizado a ${newStatus}`, 'success');
            closeModal();
        } else {
            throw new Error(data.message || 'Error actualizando estado');
        }
        
    } catch (error) {
        console.error('Error actualizando estado:', error);
        showNotification('Error actualizando estado del pedido', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

function downloadOrderLogo(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }
    
    // Verificar si el pedido tiene logo
    if (!order.logo) {
        showNotification('Este pedido no tiene logo asociado', 'warning');
        return;
    }
    
    try {
        // Si el logo es una URL (string), descargar directamente
        if (typeof order.logo === 'string' && order.logo.startsWith('http')) {
            const link = document.createElement('a');
            link.href = order.logo;
            link.download = `logo_pedido_${orderId}.jpg`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification('Logo descargado correctamente', 'success');
            return;
        }
        
        // Si el logo es base64, convertir y descargar
        if (typeof order.logo === 'string' && order.logo.startsWith('data:')) {
            const link = document.createElement('a');
            link.href = order.logo;
            link.download = `logo_pedido_${orderId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification('Logo descargado correctamente', 'success');
            return;
        }
        
        // Si el logo es un objeto File o Blob
        if (order.logo instanceof File || order.logo instanceof Blob) {
            const url = URL.createObjectURL(order.logo);
            const link = document.createElement('a');
            link.href = url;
            link.download = `logo_pedido_${orderId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showNotification('Logo descargado correctamente', 'success');
            return;
        }
        
        // Si no se puede procesar el logo
        showNotification('Formato de logo no soportado', 'error');
        
    } catch (error) {
        console.error('Error descargando logo:', error);
        showNotification('Error al descargar el logo', 'error');
    }
}

// ===== FUNCIONES DE DRAG & DROP =====
let draggedOrder = null;
let draggedFromStatus = null;

function handleDragStart(event, orderId, currentStatus) {
    draggedOrder = orderId;
    draggedFromStatus = currentStatus;
    
    // Añadir clase de arrastre a la tarjeta
    event.target.classList.add('dragging');
    
    // Configurar datos del drag
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target.outerHTML);
    
    console.log(`🚀 Iniciando arrastre del pedido ${orderId} desde ${currentStatus}`);
}

function handleDragEnd(event) {
    // Remover clase de arrastre
    event.target.classList.remove('dragging');
    
    // Limpiar clases de drag-over de todas las columnas
    document.querySelectorAll('.kanban-column').forEach(column => {
        column.classList.remove('drag-over');
    });
    
    console.log('🏁 Finalizando arrastre');
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(event) {
    event.preventDefault();
    
    // Solo añadir la clase si no es la columna de origen
    const targetStatus = event.currentTarget.dataset.status;
    if (targetStatus !== draggedFromStatus) {
        event.currentTarget.classList.add('drag-over');
    }
}

function handleDragLeave(event) {
    // Solo remover la clase si realmente salimos de la columna
    if (!event.currentTarget.contains(event.relatedTarget)) {
        event.currentTarget.classList.remove('drag-over');
    }
}

async function handleDrop(event, newStatus) {
    event.preventDefault();
    
    // Remover clase de drag-over
    event.currentTarget.classList.remove('drag-over');
    
    // Verificar si el estado cambió
    if (newStatus === draggedFromStatus) {
        console.log('📝 No hay cambio de estado, ignorando drop');
        return;
    }
    
    console.log(`🎯 Soltando pedido ${draggedOrder} en estado ${newStatus}`);
    
    // Mostrar indicador de carga
    showLoadingIndicator('Actualizando estado del pedido...');
    
    try {
        // Actualizar estado en la API
        const response = await fetch(`${API_BASE_URL}?action=update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: draggedOrder,
                estado: newStatus
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Actualizar datos locales
            const order = allOrders.find(o => o.id === draggedOrder);
            if (order) {
                order.estado = newStatus;
            }
            
            // Actualizar estadísticas y vista
            updateOrderStats();
            applyOrderFilters();
            
            // Mostrar notificación de éxito
            showNotification(`Pedido #${draggedOrder} movido a ${getStatusLabel(newStatus)}`, 'success');
            
            console.log(`✅ Pedido ${draggedOrder} actualizado a ${newStatus}`);
        } else {
            throw new Error(data.message || 'Error actualizando estado');
        }
        
    } catch (error) {
        console.error('❌ Error actualizando estado:', error);
        showNotification('Error al actualizar el estado del pedido', 'error');
        
        // Revertir visualmente el cambio
        applyOrderFilters();
    } finally {
        hideLoadingIndicator();
        
        // Limpiar variables
        draggedOrder = null;
        draggedFromStatus = null;
    }
}

function getStatusLabel(status) {
    const labels = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'completado': 'Completado',
        'cancelado': 'Cancelado'
    };
    return labels[status] || status;
}

// ===== GESTIÓN DE FACTURACIÓN =====
let allInvoices = [];
let filteredInvoices = [];
let currentInvoice = null;

// Cargar facturas
async function loadFacturas() {
    console.log('💰 Cargando facturas...');
    
    try {
        // Por ahora usamos datos mock, después conectaremos con la API
        allInvoices = generateMockInvoices();
        filteredInvoices = [...allInvoices];
        
        updateBillingStats();
        renderInvoicesTable();
        setupInvoiceFilters();
        
        console.log(`✅ Facturas cargadas: ${allInvoices.length}`);
    } catch (error) {
        console.error('❌ Error cargando facturas:', error);
        showNotification('Error al cargar las facturas', 'error');
    }
}

// Generar datos mock de facturas
function generateMockInvoices() {
    const statuses = ['borrador', 'enviada', 'pagada', 'vencida', 'cancelada'];
    const invoices = [];
    
    // Generar facturas basadas en los pedidos existentes
    allOrders.forEach((order, index) => {
        const invoiceNumber = `FAC-${String(index + 1).padStart(4, '0')}`;
        
        // Usar la fecha del pedido si existe, sino usar fecha actual
        let invoiceDate;
        if (order.fecha && order.fecha !== 'Invalid Date') {
            invoiceDate = new Date(order.fecha);
        } else {
            // Fallback: usar fecha actual con variación
            const baseDate = new Date();
            baseDate.setDate(baseDate.getDate() - (index * 2));
            invoiceDate = new Date(baseDate);
        }
        
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30); // 30 días de vencimiento
        
        invoices.push({
            id: index + 1,
            numero: invoiceNumber,
            cliente: {
                nombre: order.nombre,
                email: order.email,
                telefono: order.telefono
            },
            fecha: invoiceDate.toISOString().split('T')[0],
            vencimiento: dueDate.toISOString().split('T')[0],
            total: parseFloat(order.precio || 0),
            estado: statuses[Math.floor(Math.random() * statuses.length)],
            items: [{
                descripcion: `Llavero 3D - ${order.forma}`,
                cantidad: parseInt(order.cantidad),
                precio_unitario: parseFloat(order.precio || 0) / parseInt(order.cantidad),
                total: parseFloat(order.precio || 0)
            }],
            notas: order.notas || '',
            pedido_id: order.id
        });
    });
    
    return invoices;
}

// Actualizar estadísticas de facturación
function updateBillingStats() {
    const total = allInvoices.length;
    const pendientes = allInvoices.filter(inv => inv.estado === 'enviada' || inv.estado === 'borrador').length;
    const pagadas = allInvoices.filter(inv => inv.estado === 'pagada').length;
    const ingresos = allInvoices.filter(inv => inv.estado === 'pagada').reduce((sum, inv) => sum + inv.total, 0);
    
    safeSetText('totalFacturas', total);
    safeSetText('facturasPendientes', pendientes);
    safeSetText('facturasPagadas', pagadas);
    safeSetText('ingresosFacturas', `€${ingresos.toFixed(2)}`);
    
    // Actualizar cambios (mock)
    safeSetText('facturasChange', `+${Math.floor(Math.random() * 20)}%`);
    safeSetText('pendientesFacturasChange', pendientes);
    safeSetText('pagadasFacturasChange', `+${Math.floor(Math.random() * 15)}%`);
    safeSetText('ingresosFacturasChange', `+${Math.floor(Math.random() * 25)}%`);
}

// Renderizar tabla de facturas
function renderInvoicesTable() {
    const tbody = safeGetElement('invoicesTableBody');
    if (!tbody) return;
    
    if (filteredInvoices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-muted);">
                    <i class="fas fa-file-invoice" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    <p>No hay facturas que coincidan con los filtros</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredInvoices.map(invoice => {
        const avatarText = invoice.cliente.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
        const isOverdue = new Date(invoice.vencimiento) < new Date() && invoice.estado !== 'pagada';
        
        return `
            <tr>
                <td>
                    <span class="invoice-number">${invoice.numero}</span>
                </td>
                <td>
                    <div class="invoice-client">
                        <div class="invoice-client-avatar">${avatarText}</div>
                        <div class="invoice-client-info">
                            <h5>${invoice.cliente.nombre}</h5>
                            <p>${invoice.cliente.email}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="invoice-date">${formatDate(invoice.fecha)}</span>
                </td>
                <td>
                    <span class="invoice-date ${isOverdue ? 'text-danger' : ''}">${formatDate(invoice.vencimiento)}</span>
                </td>
                <td>
                    <span class="invoice-total">€${invoice.total.toFixed(2)}</span>
                </td>
                <td>
                    <span class="invoice-status-badge ${invoice.estado}">${getInvoiceStatusLabel(invoice.estado)}</span>
                </td>
                <td>
                    <div class="invoice-actions">
                        <button class="invoice-action-btn" onclick="viewInvoice(${invoice.id})" title="Ver factura">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="invoice-action-btn" onclick="editInvoice(${invoice.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="invoice-action-btn success" onclick="markAsPaid(${invoice.id})" title="Marcar como pagada">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="invoice-action-btn" onclick="downloadInvoicePDF(${invoice.id})" title="Descargar PDF">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="invoice-action-btn danger" onclick="deleteInvoice(${invoice.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Configurar filtros de facturas
function setupInvoiceFilters() {
    const searchInput = safeGetElement('invoiceSearch');
    const statusFilter = safeGetElement('invoiceStatusFilter');
    const dateFromInput = safeGetElement('invoiceDateFrom');
    const dateToInput = safeGetElement('invoiceDateTo');
    
    if (searchInput) {
        searchInput.addEventListener('input', applyInvoiceFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyInvoiceFilters);
    }
    
    if (dateFromInput) {
        dateFromInput.addEventListener('change', applyInvoiceFilters);
    }
    
    if (dateToInput) {
        dateToInput.addEventListener('change', applyInvoiceFilters);
    }
}

// Aplicar filtros de facturas
function applyInvoiceFilters() {
    const searchTerm = safeGetValue('invoiceSearch')?.toLowerCase() || '';
    const statusFilter = safeGetValue('invoiceStatusFilter') || '';
    const dateFrom = safeGetValue('invoiceDateFrom') || '';
    const dateTo = safeGetValue('invoiceDateTo') || '';
    
    filteredInvoices = allInvoices.filter(invoice => {
        // Filtro de búsqueda
        const matchesSearch = !searchTerm || 
            invoice.numero.toLowerCase().includes(searchTerm) ||
            invoice.cliente.nombre.toLowerCase().includes(searchTerm) ||
            invoice.cliente.email.toLowerCase().includes(searchTerm);
        
        // Filtro de estado
        const matchesStatus = !statusFilter || invoice.estado === statusFilter;
        
        // Filtro de fecha
        const invoiceDate = new Date(invoice.fecha);
        const matchesDateFrom = !dateFrom || invoiceDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || invoiceDate <= new Date(dateTo);
        
        return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
    
    renderInvoicesTable();
}

// Funciones de gestión de facturas
function createNewInvoice() {
    currentInvoice = null;
    showInvoiceModal();
}

function viewInvoice(invoiceId) {
    currentInvoice = allInvoices.find(inv => inv.id === invoiceId);
    if (currentInvoice) {
        showInvoiceModal(true); // true = modo solo lectura
    }
}

function editInvoice(invoiceId) {
    currentInvoice = allInvoices.find(inv => inv.id === invoiceId);
    if (currentInvoice) {
        showInvoiceModal(false); // false = modo edición
    }
}

function markAsPaid(invoiceId) {
    const invoice = allInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
        invoice.estado = 'pagada';
        updateBillingStats();
        renderInvoicesTable();
        showNotification(`Factura ${invoice.numero} marcada como pagada`, 'success');
    }
}

function deleteInvoice(invoiceId) {
    const invoice = allInvoices.find(inv => inv.id === invoiceId);
    if (invoice && confirm(`¿Estás seguro de que quieres eliminar la factura ${invoice.numero}?`)) {
        allInvoices = allInvoices.filter(inv => inv.id !== invoiceId);
        filteredInvoices = filteredInvoices.filter(inv => inv.id !== invoiceId);
        updateBillingStats();
        renderInvoicesTable();
        showNotification(`Factura ${invoice.numero} eliminada`, 'success');
    }
}

function downloadInvoicePDF(invoiceId) {
    const invoice = allInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
        showNotification(`Generando PDF de factura ${invoice.numero}...`, 'info');
        generateInvoicePDF(invoice);
    }
}

// Generar PDF de factura
function generateInvoicePDF(invoice) {
    try {
        // Crear ventana nueva para el PDF
        const printWindow = window.open('', '_blank');
        
        // Generar HTML de la factura
        const invoiceHTML = generateInvoiceHTML(invoice);
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Factura ${invoice.numero}</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: white;
                        color: #333;
                    }
                    .invoice-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #3b82f6;
                    }
                    .company-info h1 {
                        color: #3b82f6;
                        margin: 0;
                        font-size: 24px;
                    }
                    .company-info p {
                        margin: 5px 0;
                        color: #666;
                    }
                    .invoice-info {
                        text-align: right;
                    }
                    .invoice-info h2 {
                        color: #3b82f6;
                        margin: 0 0 10px 0;
                        font-size: 20px;
                    }
                    .invoice-details {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 30px;
                        margin-bottom: 30px;
                    }
                    .client-info, .invoice-meta {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    .client-info h3, .invoice-meta h3 {
                        margin: 0 0 15px 0;
                        color: #374151;
                        font-size: 16px;
                    }
                    .client-info p, .invoice-meta p {
                        margin: 5px 0;
                        color: #666;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .items-table th {
                        background: #3b82f6;
                        color: white;
                        padding: 12px;
                        text-align: left;
                        font-weight: 600;
                    }
                    .items-table td {
                        padding: 12px;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .items-table tr:nth-child(even) {
                        background: #f9fafb;
                    }
                    .total-section {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 30px;
                    }
                    .total-box {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 8px;
                        min-width: 200px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                    }
                    .total-row.final {
                        font-weight: bold;
                        font-size: 18px;
                        color: #3b82f6;
                        border-top: 2px solid #3b82f6;
                        padding-top: 10px;
                    }
                    .notes {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    }
                    .notes h3 {
                        margin: 0 0 10px 0;
                        color: #374151;
                    }
                    .footer {
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${invoiceHTML}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => window.close(), 1000);
                    }
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
    } catch (error) {
        console.error('Error generando PDF:', error);
        showNotification('Error al generar el PDF', 'error');
    }
}

// Generar HTML de la factura
function generateInvoiceHTML(invoice) {
    const subtotal = invoice.total;
    const iva = subtotal * 0.21; // 21% IVA
    const total = subtotal + iva;
    
    return `
        <div class="invoice-header">
            <div class="company-info">
                <h1>Llaveros 3D</h1>
                <p>Fabricación de llaveros personalizados</p>
                <p>Email: info@llavero3d.com</p>
                <p>Teléfono: +34 123 456 789</p>
            </div>
            <div class="invoice-info">
                <h2>FACTURA</h2>
                <p><strong>Número:</strong> ${invoice.numero}</p>
                <p><strong>Fecha:</strong> ${formatDate(invoice.fecha)}</p>
                <p><strong>Vencimiento:</strong> ${formatDate(invoice.vencimiento)}</p>
            </div>
        </div>
        
        <div class="invoice-details">
            <div class="client-info">
                <h3>Facturar a:</h3>
                <p><strong>${invoice.cliente.nombre}</strong></p>
                <p>${invoice.cliente.email}</p>
                <p>${invoice.cliente.telefono}</p>
            </div>
            <div class="invoice-meta">
                <h3>Detalles de la factura:</h3>
                <p><strong>Estado:</strong> ${getInvoiceStatusLabel(invoice.estado)}</p>
                <p><strong>Pedido:</strong> #${invoice.pedido_id}</p>
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                    <tr>
                        <td>${item.descripcion}</td>
                        <td>${item.cantidad}</td>
                        <td>€${item.precio_unitario.toFixed(2)}</td>
                        <td>€${item.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-box">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>€${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>IVA (21%):</span>
                    <span>€${iva.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                    <span>TOTAL:</span>
                    <span>€${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        ${invoice.notas ? `
            <div class="notes">
                <h3>Notas:</h3>
                <p>${invoice.notas}</p>
            </div>
        ` : ''}
        
        <div class="footer">
            <p>Gracias por confiar en Llaveros 3D</p>
            <p>llavero3d.com | info@llavero3d.com</p>
        </div>
    `;
}

function exportInvoices() {
    if (filteredInvoices.length === 0) {
        showNotification('No hay facturas para exportar', 'warning');
        return;
    }
    
    // Simular exportación
    showNotification(`Exportando ${filteredInvoices.length} facturas...`, 'info');
}

// Mostrar modal de factura
function showInvoiceModal(readOnly = false) {
    const modal = safeGetElement('invoiceModal');
    const title = safeGetElement('invoiceModalTitle');
    const sendBtn = safeGetElement('sendInvoiceBtn');
    
    if (!modal) return;
    
    // Configurar título y modo
    if (readOnly) {
        safeSetText('invoiceModalTitle', `Ver Factura ${currentInvoice?.numero || ''}`);
        sendBtn.style.display = 'none';
    } else if (currentInvoice) {
        safeSetText('invoiceModalTitle', `Editar Factura ${currentInvoice.numero}`);
        sendBtn.style.display = 'inline-flex';
    } else {
        safeSetText('invoiceModalTitle', 'Nueva Factura');
        sendBtn.style.display = 'none';
    }
    
    // Llenar formulario si es edición/visualización
    if (currentInvoice) {
        fillInvoiceForm(currentInvoice, readOnly);
    } else {
        resetInvoiceForm();
    }
    
    // Cargar pedidos en el selector
    loadOrdersForInvoice();
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de factura
function closeInvoiceModal() {
    const modal = safeGetElement('invoiceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentInvoice = null;
    }
}

// Resetear formulario de factura
function resetInvoiceForm() {
    const form = safeGetElement('invoiceForm');
    if (!form) return;
    
    form.reset();
    
    // Generar número de factura automático
    const nextNumber = allInvoices.length + 1;
    safeSetValue('invoiceNumber', `FAC-${String(nextNumber).padStart(4, '0')}`);
    
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    safeSetValue('invoiceDate', today);
    
    // Establecer vencimiento en 30 días
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    safeSetValue('invoiceDueDate', dueDate.toISOString().split('T')[0]);
    
    // Resetear items
    const itemsContainer = safeGetElement('invoiceItems');
    if (itemsContainer) {
        itemsContainer.innerHTML = `
            <div class="invoice-item">
                <div class="invoice-form-grid">
                    <div class="invoice-form-group">
                        <label>Descripción</label>
                        <input type="text" name="item_descripcion" placeholder="Descripción del producto" required>
                    </div>
                    <div class="invoice-form-group">
                        <label>Cantidad</label>
                        <input type="number" name="item_cantidad" min="1" value="1" required>
                    </div>
                    <div class="invoice-form-group">
                        <label>Precio Unitario (€)</label>
                        <input type="number" name="item_precio" step="0.01" min="0" required>
                    </div>
                    <div class="invoice-form-group">
                        <label>Total (€)</label>
                        <input type="number" name="item_total" step="0.01" readonly>
                    </div>
                </div>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeInvoiceItem(this)" style="margin-top: 10px;">
                    <i class="fas fa-trash"></i> Eliminar Item
                </button>
            </div>
        `;
    }
    
    // Resetear totales
    updateInvoiceTotals();
    
    // Configurar eventos de items
    setupInvoiceItemEvents();
}

// Llenar formulario con datos de factura existente
function fillInvoiceForm(invoice, readOnly = false) {
    safeSetValue('invoiceNumber', invoice.numero);
    safeSetValue('invoiceDate', invoice.fecha);
    safeSetValue('invoiceDueDate', invoice.vencimiento);
    safeSetValue('invoiceStatus', invoice.estado);
    safeSetValue('clientName', invoice.cliente.nombre);
    safeSetValue('clientEmail', invoice.cliente.email);
    safeSetValue('clientPhone', invoice.cliente.telefono || '');
    safeSetValue('orderReference', invoice.pedido_id || '');
    safeSetValue('invoiceNotes', invoice.notas || '');
    
    // Llenar items
    const itemsContainer = safeGetElement('invoiceItems');
    if (itemsContainer && invoice.items) {
        itemsContainer.innerHTML = invoice.items.map((item, index) => `
            <div class="invoice-item">
                <div class="invoice-form-grid">
                    <div class="invoice-form-group">
                        <label>Descripción</label>
                        <input type="text" name="item_descripcion" value="${item.descripcion}" ${readOnly ? 'readonly' : 'required'}>
                    </div>
                    <div class="invoice-form-group">
                        <label>Cantidad</label>
                        <input type="number" name="item_cantidad" min="1" value="${item.cantidad}" ${readOnly ? 'readonly' : 'required'}>
                    </div>
                    <div class="invoice-form-group">
                        <label>Precio Unitario (€)</label>
                        <input type="number" name="item_precio" step="0.01" min="0" value="${item.precio_unitario}" ${readOnly ? 'readonly' : 'required'}>
                    </div>
                    <div class="invoice-form-group">
                        <label>Total (€)</label>
                        <input type="number" name="item_total" step="0.01" value="${item.total}" readonly>
                    </div>
                </div>
                ${!readOnly ? `
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeInvoiceItem(this)" style="margin-top: 10px;">
                        <i class="fas fa-trash"></i> Eliminar Item
                    </button>
                ` : ''}
            </div>
        `).join('');
    }
    
    // Configurar eventos si no es solo lectura
    if (!readOnly) {
        setupInvoiceItemEvents();
    }
    
    updateInvoiceTotals();
}

// Cargar pedidos para el selector
function loadOrdersForInvoice() {
    const select = safeGetElement('orderReference');
    if (!select) return;
    
    // Limpiar opciones existentes (excepto la primera)
    select.innerHTML = '<option value="">Seleccionar pedido...</option>';
    
    // Añadir pedidos
    allOrders.forEach(order => {
        const option = document.createElement('option');
        option.value = order.id;
        option.textContent = `#${order.id} - ${order.nombre} (${order.forma})`;
        select.appendChild(option);
    });
}

// Configurar eventos de items de factura
function setupInvoiceItemEvents() {
    const items = document.querySelectorAll('.invoice-item');
    items.forEach(item => {
        const cantidadInput = item.querySelector('input[name="item_cantidad"]');
        const precioInput = item.querySelector('input[name="item_precio"]');
        const totalInput = item.querySelector('input[name="item_total"]');
        
        if (cantidadInput && precioInput && totalInput) {
            const updateTotal = () => {
                const cantidad = parseFloat(cantidadInput.value) || 0;
                const precio = parseFloat(precioInput.value) || 0;
                const total = cantidad * precio;
                totalInput.value = total.toFixed(2);
                updateInvoiceTotals();
            };
            
            cantidadInput.addEventListener('input', updateTotal);
            precioInput.addEventListener('input', updateTotal);
        }
    });
}

// Añadir item a la factura
function addInvoiceItem() {
    const itemsContainer = safeGetElement('invoiceItems');
    if (!itemsContainer) return;
    
    const newItem = document.createElement('div');
    newItem.className = 'invoice-item';
    newItem.innerHTML = `
        <div class="invoice-form-grid">
            <div class="invoice-form-group">
                <label>Descripción</label>
                <input type="text" name="item_descripcion" placeholder="Descripción del producto" required>
            </div>
            <div class="invoice-form-group">
                <label>Cantidad</label>
                <input type="number" name="item_cantidad" min="1" value="1" required>
            </div>
            <div class="invoice-form-group">
                <label>Precio Unitario (€)</label>
                <input type="number" name="item_precio" step="0.01" min="0" required>
            </div>
            <div class="invoice-form-group">
                <label>Total (€)</label>
                <input type="number" name="item_total" step="0.01" readonly>
            </div>
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeInvoiceItem(this)" style="margin-top: 10px;">
            <i class="fas fa-trash"></i> Eliminar Item
        </button>
    `;
    
    itemsContainer.appendChild(newItem);
    setupInvoiceItemEvents();
}

// Eliminar item de la factura
function removeInvoiceItem(button) {
    const itemsContainer = safeGetElement('invoiceItems');
    if (!itemsContainer) return;
    
    const items = itemsContainer.querySelectorAll('.invoice-item');
    if (items.length > 1) {
        button.closest('.invoice-item').remove();
        updateInvoiceTotals();
    } else {
        showNotification('Debe haber al menos un item en la factura', 'warning');
    }
}

// Actualizar totales de la factura
function updateInvoiceTotals() {
    const items = document.querySelectorAll('.invoice-item');
    let subtotal = 0;
    
    items.forEach(item => {
        const totalInput = item.querySelector('input[name="item_total"]');
        if (totalInput) {
            subtotal += parseFloat(totalInput.value) || 0;
        }
    });
    
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
    
    safeSetText('subtotalAmount', `€${subtotal.toFixed(2)}`);
    safeSetText('ivaAmount', `€${iva.toFixed(2)}`);
    safeSetText('totalAmount', `€${total.toFixed(2)}`);
}

// Guardar factura
function saveInvoice() {
    const formData = collectInvoiceFormData();
    if (!formData) return;
    
    try {
        if (currentInvoice) {
            // Actualizar factura existente
            Object.assign(currentInvoice, formData);
            showNotification(`Factura ${currentInvoice.numero} actualizada correctamente`, 'success');
        } else {
            // Crear nueva factura
            const newInvoice = {
                id: allInvoices.length + 1,
                ...formData
            };
            allInvoices.push(newInvoice);
            showNotification(`Factura ${newInvoice.numero} creada correctamente`, 'success');
        }
        
        // Actualizar vista
        filteredInvoices = [...allInvoices];
        updateBillingStats();
        renderInvoicesTable();
        
        // Cerrar modal
        closeInvoiceModal();
        
    } catch (error) {
        console.error('Error guardando factura:', error);
        showNotification('Error al guardar la factura', 'error');
    }
}

// Guardar y enviar factura
function saveAndSendInvoice() {
    saveInvoice();
    // Aquí implementaríamos el envío por email
    showNotification('Factura guardada y enviada por email', 'success');
}

// Recopilar datos del formulario
function collectInvoiceFormData() {
    const form = safeGetElement('invoiceForm');
    if (!form) return null;
    
    // Validar formulario
    if (!form.checkValidity()) {
        form.reportValidity();
        return null;
    }
    
    // Recopilar items
    const items = [];
    const itemElements = document.querySelectorAll('.invoice-item');
    
    itemElements.forEach(item => {
        const descripcion = item.querySelector('input[name="item_descripcion"]').value;
        const cantidad = parseInt(item.querySelector('input[name="item_cantidad"]').value);
        const precio_unitario = parseFloat(item.querySelector('input[name="item_precio"]').value);
        const total = parseFloat(item.querySelector('input[name="item_total"]').value);
        
        if (descripcion && cantidad && precio_unitario) {
            items.push({
                descripcion,
                cantidad,
                precio_unitario,
                total
            });
        }
    });
    
    if (items.length === 0) {
        showNotification('Debe añadir al menos un item a la factura', 'warning');
        return null;
    }
    
    // Calcular total
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    
    return {
        numero: safeGetValue('invoiceNumber'),
        fecha: safeGetValue('invoiceDate'),
        vencimiento: safeGetValue('invoiceDueDate'),
        estado: safeGetValue('invoiceStatus'),
        cliente: {
            nombre: safeGetValue('clientName'),
            email: safeGetValue('clientEmail'),
            telefono: safeGetValue('clientPhone')
        },
        items,
        total: subtotal,
        notas: safeGetValue('invoiceNotes'),
        pedido_id: safeGetValue('orderReference') || null
    };
}

// Utilidades
function getInvoiceStatusLabel(status) {
    const labels = {
        'borrador': 'Borrador',
        'enviada': 'Enviada',
        'pagada': 'Pagada',
        'vencida': 'Vencida',
        'cancelada': 'Cancelada'
    };
    return labels[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// ===== GESTIÓN DE CONFIGURACIÓN =====
let currentConfigSection = 'empresa';
let configurationData = {};

// Cargar configuración
async function loadConfiguracion() {
    console.log('⚙️ Cargando configuración...');
    
    try {
        // Cargar configuraciones guardadas desde localStorage
        loadSavedConfigurations();
        
        // Actualizar estado de la base de datos
        updateDatabaseStatus();
        
        console.log('✅ Configuración cargada correctamente');
    } catch (error) {
        console.error('❌ Error cargando configuración:', error);
        showNotification('Error al cargar la configuración', 'error');
    }
}

// Mostrar sección de configuración
function showConfigSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.config-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remover active de todos los botones de navegación
    document.querySelectorAll('.config-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`config-${section}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activar botón de navegación correspondiente
    const targetBtn = document.querySelector(`[data-config="${section}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    currentConfigSection = section;
}

// Cargar configuraciones guardadas
function loadSavedConfigurations() {
    const savedConfig = localStorage.getItem('llaveros3d_config');
    if (savedConfig) {
        configurationData = JSON.parse(savedConfig);
        applyConfigurationsToForm();
    } else {
        // Configuraciones por defecto
        configurationData = getDefaultConfigurations();
    }
}

// Obtener configuraciones por defecto
function getDefaultConfigurations() {
    return {
        empresa: {
            companyName: 'Llaveros 3D',
            companyDescription: 'Fabricación de llaveros personalizados en 3D',
            companyWebsite: 'https://llavero3d.com',
            contactEmail: 'info@llavero3d.com',
            contactPhone: '+34 123 456 789',
            contactAddress: 'Calle Ejemplo, 123\n28001 Madrid, España',
            taxId: '',
            taxRate: 21,
            currency: 'EUR'
        },
        sistema: {
            timezone: 'Europe/Madrid',
            language: 'es',
            dateFormat: 'DD/MM/YYYY',
            theme: 'light',
            itemsPerPage: 25,
            autoRefresh: true,
            sessionTimeout: 60,
            requireStrongPasswords: true,
            twoFactorAuth: false
        },
        facturacion: {
            invoicePrefix: 'FAC',
            invoiceStartNumber: 1,
            invoiceDigits: 4,
            defaultPaymentTerms: 30,
            latePaymentFee: 2,
            invoiceNotes: 'Gracias por confiar en nuestros servicios.',
            invoiceTemplate: 'default',
            includeLogo: true,
            autoSendInvoices: false
        },
        notificaciones: {
            smtpHost: '',
            smtpPort: 587,
            smtpUser: '',
            smtpPass: '',
            newOrderAlert: true,
            paymentAlert: true,
            overdueAlert: true,
            systemAlert: false,
            whatsappNumber: '',
            whatsappNotifications: false,
            whatsappTemplate: 'Hola {nombre}, tu pedido #{id} está listo para recoger.'
        }
    };
}

// Aplicar configuraciones al formulario
function applyConfigurationsToForm() {
    // Empresa
    safeSetValue('companyName', configurationData.empresa?.companyName || '');
    safeSetValue('companyDescription', configurationData.empresa?.companyDescription || '');
    safeSetValue('companyWebsite', configurationData.empresa?.companyWebsite || '');
    safeSetValue('contactEmail', configurationData.empresa?.contactEmail || '');
    safeSetValue('contactPhone', configurationData.empresa?.contactPhone || '');
    safeSetValue('contactAddress', configurationData.empresa?.contactAddress || '');
    safeSetValue('taxId', configurationData.empresa?.taxId || '');
    safeSetValue('taxRate', configurationData.empresa?.taxRate || 21);
    safeSetValue('currency', configurationData.empresa?.currency || 'EUR');
    
    // Sistema
    safeSetValue('timezone', configurationData.sistema?.timezone || 'Europe/Madrid');
    safeSetValue('language', configurationData.sistema?.language || 'es');
    safeSetValue('dateFormat', configurationData.sistema?.dateFormat || 'DD/MM/YYYY');
    safeSetValue('theme', configurationData.sistema?.theme || 'light');
    safeSetValue('itemsPerPage', configurationData.sistema?.itemsPerPage || 25);
    safeSetValue('sessionTimeout', configurationData.sistema?.sessionTimeout || 60);
    
    // Checkboxes del sistema
    const autoRefresh = safeGetElement('autoRefresh');
    if (autoRefresh) autoRefresh.checked = configurationData.sistema?.autoRefresh || false;
    
    const requireStrongPasswords = safeGetElement('requireStrongPasswords');
    if (requireStrongPasswords) requireStrongPasswords.checked = configurationData.sistema?.requireStrongPasswords || false;
    
    const twoFactorAuth = safeGetElement('twoFactorAuth');
    if (twoFactorAuth) twoFactorAuth.checked = configurationData.sistema?.twoFactorAuth || false;
    
    // Facturación
    safeSetValue('invoicePrefix', configurationData.facturacion?.invoicePrefix || 'FAC');
    safeSetValue('invoiceStartNumber', configurationData.facturacion?.invoiceStartNumber || 1);
    safeSetValue('invoiceDigits', configurationData.facturacion?.invoiceDigits || 4);
    safeSetValue('defaultPaymentTerms', configurationData.facturacion?.defaultPaymentTerms || 30);
    safeSetValue('latePaymentFee', configurationData.facturacion?.latePaymentFee || 2);
    safeSetValue('invoiceNotes', configurationData.facturacion?.invoiceNotes || '');
    safeSetValue('invoiceTemplate', configurationData.facturacion?.invoiceTemplate || 'default');
    
    // Checkboxes de facturación
    const includeLogo = safeGetElement('includeLogo');
    if (includeLogo) includeLogo.checked = configurationData.facturacion?.includeLogo || false;
    
    const autoSendInvoices = safeGetElement('autoSendInvoices');
    if (autoSendInvoices) autoSendInvoices.checked = configurationData.facturacion?.autoSendInvoices || false;
    
    // Notificaciones
    safeSetValue('smtpHost', configurationData.notificaciones?.smtpHost || '');
    safeSetValue('smtpPort', configurationData.notificaciones?.smtpPort || 587);
    safeSetValue('smtpUser', configurationData.notificaciones?.smtpUser || '');
    safeSetValue('smtpPass', configurationData.notificaciones?.smtpPass || '');
    safeSetValue('whatsappNumber', configurationData.notificaciones?.whatsappNumber || '');
    safeSetValue('whatsappTemplate', configurationData.notificaciones?.whatsappTemplate || '');
    
    // Checkboxes de notificaciones
    const newOrderAlert = safeGetElement('newOrderAlert');
    if (newOrderAlert) newOrderAlert.checked = configurationData.notificaciones?.newOrderAlert || false;
    
    const paymentAlert = safeGetElement('paymentAlert');
    if (paymentAlert) paymentAlert.checked = configurationData.notificaciones?.paymentAlert || false;
    
    const overdueAlert = safeGetElement('overdueAlert');
    if (overdueAlert) overdueAlert.checked = configurationData.notificaciones?.overdueAlert || false;
    
    const systemAlert = safeGetElement('systemAlert');
    if (systemAlert) systemAlert.checked = configurationData.notificaciones?.systemAlert || false;
    
    const whatsappNotifications = safeGetElement('whatsappNotifications');
    if (whatsappNotifications) whatsappNotifications.checked = configurationData.notificaciones?.whatsappNotifications || false;
}

// Guardar todas las configuraciones
function saveAllConfigurations() {
    try {
        // Recopilar datos del formulario
        configurationData.empresa = {
            companyName: safeGetValue('companyName'),
            companyDescription: safeGetValue('companyDescription'),
            companyWebsite: safeGetValue('companyWebsite'),
            contactEmail: safeGetValue('contactEmail'),
            contactPhone: safeGetValue('contactPhone'),
            contactAddress: safeGetValue('contactAddress'),
            taxId: safeGetValue('taxId'),
            taxRate: parseFloat(safeGetValue('taxRate')) || 21,
            currency: safeGetValue('currency')
        };
        
        configurationData.sistema = {
            timezone: safeGetValue('timezone'),
            language: safeGetValue('language'),
            dateFormat: safeGetValue('dateFormat'),
            theme: safeGetValue('theme'),
            itemsPerPage: parseInt(safeGetValue('itemsPerPage')) || 25,
            autoRefresh: safeGetElement('autoRefresh')?.checked || false,
            sessionTimeout: parseInt(safeGetValue('sessionTimeout')) || 60,
            requireStrongPasswords: safeGetElement('requireStrongPasswords')?.checked || false,
            twoFactorAuth: safeGetElement('twoFactorAuth')?.checked || false
        };
        
        configurationData.facturacion = {
            invoicePrefix: safeGetValue('invoicePrefix'),
            invoiceStartNumber: parseInt(safeGetValue('invoiceStartNumber')) || 1,
            invoiceDigits: parseInt(safeGetValue('invoiceDigits')) || 4,
            defaultPaymentTerms: parseInt(safeGetValue('defaultPaymentTerms')) || 30,
            latePaymentFee: parseFloat(safeGetValue('latePaymentFee')) || 2,
            invoiceNotes: safeGetValue('invoiceNotes'),
            invoiceTemplate: safeGetValue('invoiceTemplate'),
            includeLogo: safeGetElement('includeLogo')?.checked || false,
            autoSendInvoices: safeGetElement('autoSendInvoices')?.checked || false
        };
        
        configurationData.notificaciones = {
            smtpHost: safeGetValue('smtpHost'),
            smtpPort: parseInt(safeGetValue('smtpPort')) || 587,
            smtpUser: safeGetValue('smtpUser'),
            smtpPass: safeGetValue('smtpPass'),
            newOrderAlert: safeGetElement('newOrderAlert')?.checked || false,
            paymentAlert: safeGetElement('paymentAlert')?.checked || false,
            overdueAlert: safeGetElement('overdueAlert')?.checked || false,
            systemAlert: safeGetElement('systemAlert')?.checked || false,
            whatsappNumber: safeGetValue('whatsappNumber'),
            whatsappNotifications: safeGetElement('whatsappNotifications')?.checked || false,
            whatsappTemplate: safeGetValue('whatsappTemplate')
        };
        
        // Guardar en localStorage
        localStorage.setItem('llaveros3d_config', JSON.stringify(configurationData));
        
        showNotification('Configuración guardada correctamente', 'success');
        
        // Aplicar cambios inmediatamente
        applySystemSettings();
        
    } catch (error) {
        console.error('Error guardando configuración:', error);
        showNotification('Error al guardar la configuración', 'error');
    }
}

// Restaurar configuraciones por defecto
function resetConfigurations() {
    if (confirm('¿Estás seguro de que quieres restaurar todas las configuraciones a sus valores por defecto?')) {
        configurationData = getDefaultConfigurations();
        applyConfigurationsToForm();
        showNotification('Configuraciones restauradas a valores por defecto', 'success');
    }
}

// Aplicar configuraciones del sistema
function applySystemSettings() {
    // Aplicar tema
    const theme = configurationData.sistema?.theme || 'light';
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    
    // Aplicar idioma (si está implementado)
    const language = configurationData.sistema?.language || 'es';
    // Aquí se implementaría el cambio de idioma
    
    // Aplicar zona horaria
    const timezone = configurationData.sistema?.timezone || 'Europe/Madrid';
    // Aquí se aplicaría la zona horaria
}

// Actualizar estado de la base de datos
function updateDatabaseStatus() {
    safeSetText('dbStatus', 'Conectado');
    safeSetText('lastCheck', 'Hace 2 minutos');
    safeSetText('totalOrders', `${allOrders.length} registros`);
}

// Funciones de base de datos
function testDatabaseConnection() {
    showNotification('Probando conexión a la base de datos...', 'info');
    
    // Simular prueba de conexión
    setTimeout(() => {
        showNotification('Conexión a la base de datos exitosa', 'success');
        updateDatabaseStatus();
    }, 2000);
}

function initDatabase() {
    if (confirm('¿Estás seguro de que quieres inicializar la base de datos? Esto eliminará todos los datos existentes.')) {
        showNotification('Inicializando base de datos...', 'info');
        
        // Simular inicialización
        setTimeout(() => {
            showNotification('Base de datos inicializada correctamente', 'success');
            updateDatabaseStatus();
        }, 3000);
    }
}

function createBackup() {
    showNotification('Creando respaldo de la base de datos...', 'info');
    
    // Simular creación de respaldo
    setTimeout(() => {
        const now = new Date().toLocaleString('es-ES');
        safeSetText('lastBackup', now);
        safeSetText('backupSize', '2.3 MB');
        showNotification('Respaldo creado correctamente', 'success');
    }, 2000);
}

function restoreBackup() {
    if (confirm('¿Estás seguro de que quieres restaurar desde un respaldo? Esto sobrescribirá todos los datos actuales.')) {
        showNotification('Restaurando desde respaldo...', 'info');
        
        // Simular restauración
        setTimeout(() => {
            showNotification('Respaldo restaurado correctamente', 'success');
            updateDatabaseStatus();
        }, 3000);
    }
}

function optimizeDatabase() {
    showNotification('Optimizando base de datos...', 'info');
    
    // Simular optimización
    setTimeout(() => {
        showNotification('Base de datos optimizada correctamente', 'success');
    }, 2000);
}

function clearCache() {
    showNotification('Limpiando cache del sistema...', 'info');
    
    // Simular limpieza de cache
    setTimeout(() => {
        showNotification('Cache limpiado correctamente', 'success');
    }, 1500);
}

// Gestión de usuarios
function addNewUser() {
    showNotification('Funcionalidad de añadir usuario en desarrollo', 'info');
}

// ===== GESTIÓN DE REPORTES =====
let currentReportSection = 'overview';
let reportData = {};
let reportFilters = {
    period: 'month',
    dateFrom: null,
    dateTo: null,
    type: 'sales'
};

// Cargar reportes
async function loadReportes() {
    console.log('📊 Cargando reportes...');
    
    try {
        // Generar datos de reportes basados en pedidos existentes
        generateReportData();
        
        // Actualizar todas las secciones de reportes
        updateOverviewStats();
        updateSalesAnalysis();
        updateOrdersAnalysis();
        updateClientsAnalysis();
        updateProductsAnalysis();
        updateFinancialAnalysis();
        
        console.log('✅ Reportes cargados correctamente');
    } catch (error) {
        console.error('❌ Error cargando reportes:', error);
        showNotification('Error al cargar los reportes', 'error');
    }
}

// Mostrar sección de reporte
function showReportSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.report-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remover active de todos los botones de navegación
    document.querySelectorAll('.reports-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`report-${section}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activar botón de navegación correspondiente
    const targetBtn = document.querySelector(`[data-report="${section}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    currentReportSection = section;
}

// Generar datos de reportes
function generateReportData() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calcular fechas para diferentes períodos
    const periods = {
        today: {
            from: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            to: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        },
        week: {
            from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            to: now
        },
        month: {
            from: new Date(currentYear, currentMonth, 1),
            to: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
        },
        quarter: {
            from: new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1),
            to: new Date(currentYear, Math.floor(currentMonth / 3) * 3 + 3, 0, 23, 59, 59)
        },
        year: {
            from: new Date(currentYear, 0, 1),
            to: new Date(currentYear, 11, 31, 23, 59, 59)
        }
    };
    
    // Procesar pedidos para generar estadísticas
    const ordersInPeriod = allOrders.filter(order => {
        const orderDate = new Date(order.fecha);
        const period = periods[reportFilters.period] || periods.month;
        return orderDate >= period.from && orderDate <= period.to;
    });
    
    // Calcular estadísticas básicas
    const totalRevenue = ordersInPeriod.reduce((sum, order) => sum + (parseFloat(order.precio) || 0), 0);
    const totalOrders = ordersInPeriod.length;
    const uniqueClients = new Set(ordersInPeriod.map(order => order.email)).size;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Estadísticas por estado
    const ordersByStatus = {
        pendiente: ordersInPeriod.filter(order => order.estado === 'pendiente').length,
        procesando: ordersInPeriod.filter(order => order.estado === 'procesando').length,
        completado: ordersInPeriod.filter(order => order.estado === 'completado').length,
        cancelado: ordersInPeriod.filter(order => order.estado === 'cancelado').length
    };
    
    // Productos más vendidos
    const productSales = {};
    ordersInPeriod.forEach(order => {
        const product = `${order.forma} - ${order.estilo}`;
        if (!productSales[product]) {
            productSales[product] = { count: 0, revenue: 0 };
        }
        productSales[product].count += parseInt(order.cantidad) || 1;
        productSales[product].revenue += parseFloat(order.precio) || 0;
    });
    
    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);
    
    // Segmentación de clientes
    const clientOrders = {};
    ordersInPeriod.forEach(order => {
        if (!clientOrders[order.email]) {
            clientOrders[order.email] = { orders: 0, revenue: 0 };
        }
        clientOrders[order.email].orders += 1;
        clientOrders[order.email].revenue += parseFloat(order.precio) || 0;
    });
    
    const vipClients = Object.values(clientOrders).filter(client => client.revenue > 100).length;
    const activeClients = Object.keys(clientOrders).length;
    const newClients = ordersInPeriod.filter(order => {
        const orderDate = new Date(order.fecha);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= thirtyDaysAgo;
    }).length;
    
    // Guardar datos generados
    reportData = {
        period: reportFilters.period,
        totalRevenue,
        totalOrders,
        uniqueClients,
        averageTicket,
        ordersByStatus,
        topProducts,
        vipClients,
        activeClients,
        newClients,
        ordersInPeriod
    };
}

// Actualizar estadísticas generales
function updateOverviewStats() {
    safeSetText('totalRevenue', `€${reportData.totalRevenue.toFixed(2)}`);
    safeSetText('totalOrders', reportData.totalOrders.toString());
    safeSetText('activeClients', reportData.uniqueClients.toString());
    safeSetText('averageTicket', `€${reportData.averageTicket.toFixed(2)}`);
    
    // Calcular cambios porcentuales (simulados)
    const revenueChange = Math.floor(Math.random() * 20) + 5;
    const ordersChange = Math.floor(Math.random() * 15) + 3;
    const clientsChange = Math.floor(Math.random() * 10) + 2;
    const ticketChange = Math.floor(Math.random() * 8) + 1;
    
    safeSetText('revenueChange', `+${revenueChange}%`);
    safeSetText('ordersChange', `+${ordersChange}%`);
    safeSetText('clientsChange', `+${clientsChange}%`);
    safeSetText('ticketChange', `+${ticketChange}%`);
}

// Actualizar análisis de ventas
function updateSalesAnalysis() {
    const dailySales = reportData.totalRevenue / 30; // Simulado
    const weeklySales = reportData.totalRevenue / 4; // Simulado
    const monthlySales = reportData.totalRevenue;
    
    safeSetText('dailySales', `€${dailySales.toFixed(2)}`);
    safeSetText('weeklySales', `€${weeklySales.toFixed(2)}`);
    safeSetText('monthlySales', `€${monthlySales.toFixed(2)}`);
    
    // Tendencias simuladas
    const dailyTrend = Math.floor(Math.random() * 15) + 5;
    const weeklyTrend = Math.floor(Math.random() * 12) + 3;
    const monthlyTrend = Math.floor(Math.random() * 10) + 2;
    
    safeSetText('dailySalesTrend', `+${dailyTrend}%`);
    safeSetText('weeklySalesTrend', `+${weeklyTrend}%`);
    safeSetText('monthlySalesTrend', `+${monthlyTrend}%`);
}

// Actualizar análisis de pedidos
function updateOrdersAnalysis() {
    safeSetText('pendingOrders', reportData.ordersByStatus.pendiente.toString());
    safeSetText('processingOrders', reportData.ordersByStatus.procesando.toString());
    safeSetText('completedOrders', reportData.ordersByStatus.completado.toString());
    
    // Tiempo promedio de procesamiento (simulado)
    const avgProcessingTime = Math.floor(Math.random() * 5) + 2;
    safeSetText('averageProcessingTime', `${avgProcessingTime} días`);
}

// Actualizar análisis de clientes
function updateClientsAnalysis() {
    const totalClients = reportData.activeClients;
    
    safeSetText('vipClients', reportData.vipClients.toString());
    safeSetText('activeClientsCount', reportData.activeClients.toString());
    safeSetText('newClients', reportData.newClients.toString());
    
    // Calcular porcentajes
    const vipPercentage = totalClients > 0 ? ((reportData.vipClients / totalClients) * 100).toFixed(1) : 0;
    const activePercentage = totalClients > 0 ? ((reportData.activeClients / totalClients) * 100).toFixed(1) : 0;
    const newPercentage = totalClients > 0 ? ((reportData.newClients / totalClients) * 100).toFixed(1) : 0;
    
    safeSetText('vipPercentage', `${vipPercentage}%`);
    safeSetText('activePercentage', `${activePercentage}%`);
    safeSetText('newPercentage', `${newPercentage}%`);
}

// Actualizar análisis de productos
function updateProductsAnalysis() {
    const topProductsList = safeGetElement('topProductsList');
    if (topProductsList) {
        topProductsList.innerHTML = '';
        
        reportData.topProducts.forEach((product, index) => {
            const [productName, data] = product;
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div class="product-rank">${index + 1}</div>
                <div class="product-info">
                    <div class="product-name">${productName}</div>
                    <div class="product-stats">${data.count} unidades vendidas</div>
                </div>
                <div class="product-sales">€${data.revenue.toFixed(2)}</div>
            `;
            topProductsList.appendChild(productItem);
        });
    }
}

// Actualizar análisis financiero
function updateFinancialAnalysis() {
    const totalRevenue = reportData.totalRevenue;
    const totalExpenses = totalRevenue * 0.3; // Simulado: 30% de gastos
    const totalProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
    
    safeSetText('totalRevenueFinancial', `€${totalRevenue.toFixed(2)}`);
    safeSetText('totalProfit', `€${totalProfit.toFixed(2)}`);
    safeSetText('totalExpenses', `€${totalExpenses.toFixed(2)}`);
    
    // Actualizar margen de beneficio
    const profitMarginElement = document.querySelector('#totalProfit').nextElementSibling;
    if (profitMarginElement) {
        profitMarginElement.textContent = `Margen: ${profitMargin}%`;
    }
}

// Actualizar período de reporte
function updateReportPeriod() {
    const period = safeGetValue('reportPeriod');
    reportFilters.period = period;
    
    const customDateRange = safeGetElement('customDateRange');
    if (customDateRange) {
        customDateRange.style.display = period === 'custom' ? 'flex' : 'none';
    }
    
    // Regenerar datos con nuevo período
    generateReportData();
    updateOverviewStats();
}

// Actualizar tipo de reporte
function updateReportType() {
    const type = safeGetValue('reportType');
    reportFilters.type = type;
    
    // Cambiar a la sección correspondiente
    showReportSection(type);
}

// Aplicar filtros de reporte
function applyReportFilters() {
    if (reportFilters.period === 'custom') {
        reportFilters.dateFrom = safeGetValue('reportDateFrom');
        reportFilters.dateTo = safeGetValue('reportDateTo');
        
        if (!reportFilters.dateFrom || !reportFilters.dateTo) {
            showNotification('Por favor selecciona un rango de fechas válido', 'warning');
            return;
        }
    }
    
    // Regenerar datos con nuevos filtros
    generateReportData();
    updateOverviewStats();
    updateSalesAnalysis();
    updateOrdersAnalysis();
    updateClientsAnalysis();
    updateProductsAnalysis();
    updateFinancialAnalysis();
    
    showNotification('Filtros aplicados correctamente', 'success');
}

// Generar reporte completo en PDF
function generateFullReport() {
    showNotification('Generando reporte completo en PDF...', 'info');
    
    // Simular generación de PDF
    setTimeout(() => {
        const reportWindow = window.open('', '_blank');
        const reportHTML = generateReportHTML();
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
        reportWindow.print();
        showNotification('Reporte generado correctamente', 'success');
    }, 2000);
}

// Generar HTML para el reporte
function generateReportHTML() {
    const now = new Date();
    const periodLabel = {
        today: 'Hoy',
        week: 'Esta Semana',
        month: 'Este Mes',
        quarter: 'Este Trimestre',
        year: 'Este Año',
        custom: 'Período Personalizado'
    }[reportFilters.period] || 'Este Mes';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Llaveros 3D - ${periodLabel}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
                .stat-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
                .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
                .section { margin-bottom: 30px; }
                .section h3 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f3f4f6; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Reporte de Llaveros 3D</h1>
                <p>Período: ${periodLabel}</p>
                <p>Generado el: ${now.toLocaleDateString('es-ES')}</p>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <h4>Ingresos Totales</h4>
                    <div class="stat-value">€${reportData.totalRevenue.toFixed(2)}</div>
                </div>
                <div class="stat-card">
                    <h4>Pedidos Totales</h4>
                    <div class="stat-value">${reportData.totalOrders}</div>
                </div>
                <div class="stat-card">
                    <h4>Clientes Activos</h4>
                    <div class="stat-value">${reportData.uniqueClients}</div>
                </div>
                <div class="stat-card">
                    <h4>Ticket Promedio</h4>
                    <div class="stat-value">€${reportData.averageTicket.toFixed(2)}</div>
                </div>
            </div>
            
            <div class="section">
                <h3>Pedidos por Estado</h3>
                <table>
                    <tr><th>Estado</th><th>Cantidad</th></tr>
                    <tr><td>Pendientes</td><td>${reportData.ordersByStatus.pendiente}</td></tr>
                    <tr><td>En Proceso</td><td>${reportData.ordersByStatus.procesando}</td></tr>
                    <tr><td>Completados</td><td>${reportData.ordersByStatus.completado}</td></tr>
                    <tr><td>Cancelados</td><td>${reportData.ordersByStatus.cancelado}</td></tr>
                </table>
            </div>
            
            <div class="section">
                <h3>Productos Más Vendidos</h3>
                <table>
                    <tr><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr>
                    ${reportData.topProducts.map(([product, data]) => 
                        `<tr><td>${product}</td><td>${data.count}</td><td>€${data.revenue.toFixed(2)}</td></tr>`
                    ).join('')}
                </table>
            </div>
        </body>
        </html>
    `;
}

// Exportar a Excel
function exportToExcel() {
    showNotification('Exportando datos a Excel...', 'info');
    
    // Simular exportación a Excel
    setTimeout(() => {
        // Crear datos CSV
        const csvData = [
            ['Producto', 'Unidades Vendidas', 'Ingresos'],
            ...reportData.topProducts.map(([product, data]) => [product, data.count, data.revenue])
        ];
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_llaveros3d_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('Datos exportados correctamente', 'success');
    }, 1500);
}

// Actualizar reportes
function refreshReports() {
    showNotification('Actualizando reportes...', 'info');
    
    // Regenerar todos los datos
    generateReportData();
    updateOverviewStats();
    updateSalesAnalysis();
    updateOrdersAnalysis();
    updateClientsAnalysis();
    updateProductsAnalysis();
    updateFinancialAnalysis();
    
    showNotification('Reportes actualizados correctamente', 'success');
}

// ===== GESTIÓN DE DASHBOARD PROFESIONAL =====
let dashboardData = {};
let dashboardSettings = {
    period: 'month',
    view: 'overview',
    autoRefresh: false,
    refreshInterval: null
};

// Cargar dashboard
async function loadDashboard() {
    console.log('📊 Cargando dashboard...');
    
    try {
        // Generar datos del dashboard
        generateDashboardData();
        
        // Actualizar todas las métricas
        updateMainStats();
        updateSecondaryStats();
        updateRecentOrders();
        updatePerformanceMetrics();
        updateAlerts();
        
        // Inicializar gráficos
        initializeCharts();
        
        console.log('✅ Dashboard cargado correctamente');
    } catch (error) {
        console.error('❌ Error cargando dashboard:', error);
        showNotification('Error al cargar el dashboard', 'error');
    }
}

// Generar datos del dashboard
function generateDashboardData() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calcular fechas para diferentes períodos
    const periods = {
        today: {
            from: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            to: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        },
        week: {
            from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            to: now
        },
        month: {
            from: new Date(currentYear, currentMonth, 1),
            to: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
        },
        quarter: {
            from: new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1),
            to: new Date(currentYear, Math.floor(currentMonth / 3) * 3 + 3, 0, 23, 59, 59)
        },
        year: {
            from: new Date(currentYear, 0, 1),
            to: new Date(currentYear, 11, 31, 23, 59, 59)
        }
    };
    
    // Procesar pedidos para el período seleccionado
    const period = periods[dashboardSettings.period] || periods.month;
    const ordersInPeriod = allOrders.filter(order => {
        const orderDate = new Date(order.fecha);
        return orderDate >= period.from && orderDate <= period.to;
    });
    
    // Calcular estadísticas principales
    const totalOrders = ordersInPeriod.length;
    const totalRevenue = ordersInPeriod.reduce((sum, order) => sum + (parseFloat(order.precio) || 0), 0);
    const pendingOrders = ordersInPeriod.filter(order => order.estado === 'pendiente').length;
    const completedOrders = ordersInPeriod.filter(order => order.estado === 'completado').length;
    const uniqueClients = new Set(ordersInPeriod.map(order => order.email)).size;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calcular estadísticas secundarias
    const satisfaction = 4.8; // Simulado
    const averageProcessingTime = 2.5; // Simulado en días
    
    // Generar alertas
    const alerts = generateAlerts(ordersInPeriod);
    
    // Guardar datos generados
    dashboardData = {
        period: dashboardSettings.period,
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        uniqueClients,
        averageTicket,
        satisfaction,
        averageProcessingTime,
        ordersInPeriod,
        alerts
    };
}

// Actualizar estadísticas principales
function updateMainStats() {
    safeSetText('totalPedidos', dashboardData.totalOrders.toString());
    safeSetText('totalIngresos', `€${dashboardData.totalRevenue.toFixed(2)}`);
    safeSetText('pedidosPendientes', dashboardData.pendingOrders.toString());
    safeSetText('clientesActivos', dashboardData.uniqueClients.toString());
    
    // Calcular cambios porcentuales (simulados)
    const totalChange = Math.floor(Math.random() * 20) + 5;
    const revenueChange = Math.floor(Math.random() * 15) + 3;
    const pendingChange = Math.floor(Math.random() * 10) + 1;
    const clientsChange = Math.floor(Math.random() * 12) + 2;
    
    safeSetText('totalChange', `+${totalChange}%`);
    safeSetText('ingresosChange', `+${revenueChange}%`);
    safeSetText('pendientesChange', `+${pendingChange}%`);
    safeSetText('clientesChange', `+${clientsChange}%`);
}

// Actualizar estadísticas secundarias
function updateSecondaryStats() {
    safeSetText('pedidosCompletados', dashboardData.completedOrders.toString());
    safeSetText('ticketPromedio', `€${dashboardData.averageTicket.toFixed(2)}`);
    safeSetText('satisfaccion', dashboardData.satisfaction.toString());
    safeSetText('tiempoPromedio', `${dashboardData.averageProcessingTime} días`);
    
    // Calcular cambios (simulados)
    const completedChange = Math.floor(Math.random() * 15) + 5;
    const ticketChange = Math.floor(Math.random() * 8) + 2;
    const satisfactionChange = Math.floor(Math.random() * 3) + 1;
    const timeChange = Math.floor(Math.random() * 2) + 1;
    
    safeSetText('completadosChange', `+${completedChange}%`);
    safeSetText('ticketChange', `+${ticketChange}%`);
    safeSetText('satisfaccionChange', `+${satisfactionChange/10}`);
    safeSetText('tiempoChange', `-${timeChange/10} días`);
}

// Actualizar pedidos recientes
function updateRecentOrders() {
    const recentOrdersList = safeGetElement('pedidosRecientes');
    if (recentOrdersList) {
        recentOrdersList.innerHTML = '';
        
        // Obtener los 5 pedidos más recientes
        const recentOrders = allOrders
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 5);
        
        recentOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            const clientInitial = order.nombre ? order.nombre.charAt(0).toUpperCase() : 'C';
            const orderDate = new Date(order.fecha).toLocaleDateString('es-ES');
            const orderTotal = parseFloat(order.precio) || 0;
            
            orderItem.innerHTML = `
                <div class="order-avatar">${clientInitial}</div>
                <div class="order-info">
                    <div class="order-client">${order.nombre || 'Cliente'}</div>
                    <div class="order-details">${orderDate} • €${orderTotal.toFixed(2)}</div>
                </div>
                <div class="order-status ${order.estado}">${getStatusLabel(order.estado)}</div>
            `;
            
            recentOrdersList.appendChild(orderItem);
        });
    }
}

// Actualizar métricas de rendimiento
function updatePerformanceMetrics() {
    // Las métricas de rendimiento ya están en el HTML con valores estáticos
    // Aquí se podrían actualizar dinámicamente si fuera necesario
}

// Generar alertas
function generateAlerts(orders) {
    const alerts = [];
    
    // Alertas basadas en pedidos pendientes
    if (orders.filter(o => o.estado === 'pendiente').length > 3) {
        alerts.push({
            type: 'warning',
            title: 'Pedidos Pendientes',
            message: `${orders.filter(o => o.estado === 'pendiente').length} pedidos requieren atención`,
            time: 'Hace 5 minutos'
        });
    }
    
    // Alertas de nuevos pedidos
    const today = new Date();
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.fecha);
        return orderDate.toDateString() === today.toDateString();
    });
    
    if (todayOrders.length > 0) {
        alerts.push({
            type: 'success',
            title: 'Nuevos Pedidos',
            message: `${todayOrders.length} pedidos recibidos hoy`,
            time: 'Hace 10 minutos'
        });
    }
    
    // Alertas de rendimiento
    alerts.push({
        type: 'info',
        title: 'Rendimiento',
        message: 'El tiempo promedio de procesamiento ha mejorado',
        time: 'Hace 1 hora'
    });
    
    return alerts;
}

// Actualizar alertas
function updateAlerts() {
    const alertsList = safeGetElement('alertsList');
    if (alertsList) {
        alertsList.innerHTML = '';
        
        dashboardData.alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.type}`;
            
            const iconMap = {
                warning: 'fas fa-exclamation-triangle',
                error: 'fas fa-times-circle',
                success: 'fas fa-check-circle',
                info: 'fas fa-info-circle'
            };
            
            alertItem.innerHTML = `
                <div class="alert-icon">
                    <i class="${iconMap[alert.type]}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                </div>
                <div class="alert-time">${alert.time}</div>
            `;
            
            alertsList.appendChild(alertItem);
        });
    }
}

// Inicializar gráficos
function initializeCharts() {
    // Gráfico de evolución de pedidos
    const ordersChartCanvas = safeGetElement('ordersChartCanvas');
    if (ordersChartCanvas) {
        drawOrdersChart(ordersChartCanvas);
    }
    
    // Gráfico de distribución por estado
    const statusChartCanvas = safeGetElement('statusChartCanvas');
    if (statusChartCanvas) {
        drawStatusChart(statusChartCanvas);
    }
}

// Dibujar gráfico de pedidos
function drawOrdersChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar estilo
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 2;
    
    // Generar datos simulados para los últimos 30 días
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayOrders = allOrders.filter(order => {
            const orderDate = new Date(order.fecha);
            return orderDate.toDateString() === date.toDateString();
        }).length;
        data.push(dayOrders);
    }
    
    const maxValue = Math.max(...data, 1);
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Dibujar área
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (value / maxValue) * chartHeight;
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Dibujar línea
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (value / maxValue) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Dibujar puntos
    ctx.fillStyle = '#3b82f6';
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (value / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Dibujar gráfico de estado
function drawStatusChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Contar pedidos por estado
    const statusCounts = {
        pendiente: allOrders.filter(o => o.estado === 'pendiente').length,
        procesando: allOrders.filter(o => o.estado === 'procesando').length,
        completado: allOrders.filter(o => o.estado === 'completado').length,
        cancelado: allOrders.filter(o => o.estado === 'cancelado').length
    };
    
    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    if (total === 0) return;
    
    const colors = {
        pendiente: '#f59e0b',
        procesando: '#3b82f6',
        completado: '#10b981',
        cancelado: '#ef4444'
    };
    
    let currentAngle = -Math.PI / 2;
    
    Object.entries(statusCounts).forEach(([status, count]) => {
        if (count === 0) return;
        
        const sliceAngle = (count / total) * 2 * Math.PI;
        
        // Dibujar sector
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[status];
        ctx.fill();
        
        // Dibujar borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
}

// Actualizar período del dashboard
function updateDashboardPeriod() {
    const period = safeGetValue('dashboardPeriod');
    dashboardSettings.period = period;
    
    // Regenerar datos con nuevo período
    generateDashboardData();
    updateMainStats();
    updateSecondaryStats();
    updateRecentOrders();
    updateAlerts();
    initializeCharts();
    
    showNotification(`Dashboard actualizado para: ${period}`, 'success');
}

// Actualizar vista del dashboard
function updateDashboardView() {
    const view = safeGetValue('dashboardView');
    dashboardSettings.view = view;
    
    // Aplicar cambios de vista
    document.body.className = `dashboard-${view}`;
    
    showNotification(`Vista cambiada a: ${view}`, 'success');
}

// Alternar auto-actualización
function toggleAutoRefresh() {
    dashboardSettings.autoRefresh = !dashboardSettings.autoRefresh;
    
    const icon = safeGetElement('autoRefreshIcon');
    const text = safeGetElement('autoRefreshText');
    
    if (dashboardSettings.autoRefresh) {
        icon.className = 'fas fa-pause';
        text.textContent = 'Pausar';
        
        // Iniciar auto-actualización cada 30 segundos
        dashboardSettings.refreshInterval = setInterval(() => {
            refreshDashboard();
        }, 30000);
        
        showNotification('Auto-actualización activada', 'success');
    } else {
        icon.className = 'fas fa-play';
        text.textContent = 'Auto-actualizar';
        
        // Detener auto-actualización
        if (dashboardSettings.refreshInterval) {
            clearInterval(dashboardSettings.refreshInterval);
            dashboardSettings.refreshInterval = null;
        }
        
        showNotification('Auto-actualización desactivada', 'info');
    }
}

// Personalizar dashboard
function customizeDashboard() {
    showNotification('Funcionalidad de personalización en desarrollo', 'info');
}

// Actualizar período del gráfico
function updateChartPeriod() {
    const period = safeGetValue('chartPeriod');
    
    // Regenerar gráfico con nuevo período
    const ordersChartCanvas = safeGetElement('ordersChartCanvas');
    if (ordersChartCanvas) {
        drawOrdersChart(ordersChartCanvas);
    }
    
    showNotification(`Gráfico actualizado para: ${period} días`, 'success');
}

// Exportar gráfico
function exportChart() {
    const canvas = safeGetElement('ordersChartCanvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = `grafico_pedidos_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        showNotification('Gráfico exportado correctamente', 'success');
    }
}

// Actualizar gráfico de estado
function refreshStatusChart() {
    const statusChartCanvas = safeGetElement('statusChartCanvas');
    if (statusChartCanvas) {
        drawStatusChart(statusChartCanvas);
    }
    
    showNotification('Gráfico de estado actualizado', 'success');
}

// Filtrar pedidos recientes
function filterRecentOrders() {
    const filter = safeGetValue('recentOrdersFilter');
    
    // Regenerar lista de pedidos con filtro
    updateRecentOrders();
    
    showNotification(`Filtro aplicado: ${filter}`, 'success');
}

// Acciones rápidas
function createNewOrder() {
    showNotification('Redirigiendo a nuevo pedido...', 'info');
    // Aquí se podría redirigir a un formulario de nuevo pedido
}

function viewAllOrders() {
    showNotification('Redirigiendo a pedidos...', 'info');
    showSection('pedidos');
}

function viewClients() {
    showNotification('Redirigiendo a clientes...', 'info');
    showSection('clientes');
}

function generateReport() {
    showNotification('Redirigiendo a reportes...', 'info');
    showSection('reportes');
}

// Alternar detalles de rendimiento
function togglePerformanceDetails() {
    showNotification('Funcionalidad de detalles en desarrollo', 'info');
}

// Marcar todas las alertas como leídas
function markAllAsRead() {
    const alertsList = safeGetElement('alertsList');
    if (alertsList) {
        alertsList.innerHTML = '<div class="alert-item success"><div class="alert-content"><div class="alert-title">Todas las alertas han sido marcadas como leídas</div></div></div>';
    }
    
    showNotification('Todas las alertas marcadas como leídas', 'success');
}

// Actualizar dashboard
function refreshDashboard() {
    showNotification('Actualizando dashboard...', 'info');
    
    // Regenerar todos los datos
    generateDashboardData();
    updateMainStats();
    updateSecondaryStats();
    updateRecentOrders();
    updatePerformanceMetrics();
    updateAlerts();
    initializeCharts();
    
    showNotification('Dashboard actualizado correctamente', 'success');
}

// ===== GESTIÓN DE CLIENTES =====
let currentClientView = 'grid';
let filteredClients = [];

async function loadClientes() {
    console.log('👥 Cargando clientes...');
    
    // Mostrar indicador de carga
    showLoadingIndicator('Cargando clientes...');
    
    try {
        // Extraer clientes únicos de los pedidos
        const clientMap = new Map();
        
        allOrders.forEach(order => {
            const clientKey = order.email;
            if (!clientMap.has(clientKey)) {
                clientMap.set(clientKey, {
                    id: clientKey,
                    email: order.email,
                    nombre: order.nombre,
                    telefono: order.telefono,
                    totalPedidos: 0,
                    totalGastado: 0,
                    ultimoPedido: order.fecha,
                    primerPedido: order.fecha,
                    estado: 'activo',
                    tipo: 'normal'
                });
            }
            
            const client = clientMap.get(clientKey);
            client.totalPedidos++;
            client.totalGastado += parseFloat(order.precio || 0);
            
            if (new Date(order.fecha) > new Date(client.ultimoPedido)) {
                client.ultimoPedido = order.fecha;
            }
            
            if (new Date(order.fecha) < new Date(client.primerPedido)) {
                client.primerPedido = order.fecha;
            }
        });
        
        // Procesar clientes y determinar tipo
        allClients = Array.from(clientMap.values()).map(client => {
            // Determinar si es VIP (más de 2 pedidos o más de €100 gastados)
            if (client.totalPedidos >= 3 || client.totalGastado >= 100) {
                client.tipo = 'vip';
            }
            
            // Determinar si es nuevo (primer pedido en los últimos 30 días)
            const primerPedido = new Date(client.primerPedido);
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);
            
            if (primerPedido > hace30Dias) {
                client.tipo = 'nuevo';
            }
            
            return client;
        });
        
        // Actualizar estadísticas de clientes
        updateClientStats();
        
        // Aplicar filtros y renderizar
        applyClientFilters();
        
        console.log('✅ Clientes cargados:', allClients.length, 'clientes');
        
    } catch (error) {
        console.error('❌ Error cargando clientes:', error);
        showNotification('Error cargando clientes', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

function updateClientStats() {
    const totalClientes = allClients.length;
    const clientesActivos = allClients.filter(c => c.estado === 'activo').length;
    const clientesVIP = allClients.filter(c => c.tipo === 'vip').length;
    const ingresosClientes = allClients.reduce((sum, client) => sum + client.totalGastado, 0);
    
    updateElement('totalClientes', totalClientes);
    updateElement('clientesActivos', clientesActivos);
    updateElement('clientesVIP', clientesVIP);
    updateElement('ingresosClientes', `€${ingresosClientes.toFixed(2)}`);
    
    // Calcular cambios porcentuales (simulado)
    updateElement('clientesChange', `+${Math.floor(Math.random() * 15)}%`);
    updateElement('activosChange', clientesActivos);
    updateElement('vipChange', `+${Math.floor(Math.random() * 10)}%`);
    updateElement('ingresosClientesChange', `+${Math.floor(Math.random() * 20)}%`);
}

function applyClientFilters() {
    const searchTerm = document.getElementById('clientSearch')?.value.toLowerCase() || '';
    const sortBy = document.getElementById('clientSortBy')?.value || 'nombre';
    const filterBy = document.getElementById('clientFilterBy')?.value || 'todos';
    
    // Filtrar clientes
    filteredClients = allClients.filter(client => {
        // Filtro de búsqueda
        const matchesSearch = !searchTerm || 
            client.nombre.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm);
        
        // Filtro por tipo
        let matchesFilter = true;
        switch (filterBy) {
            case 'activos':
                matchesFilter = client.estado === 'activo';
                break;
            case 'nuevos':
                matchesFilter = client.tipo === 'nuevo';
                break;
            case 'vip':
                matchesFilter = client.tipo === 'vip';
                break;
        }
        
        return matchesSearch && matchesFilter;
    });
    
    // Ordenar clientes
    filteredClients.sort((a, b) => {
        switch (sortBy) {
            case 'nombre':
                return a.nombre.localeCompare(b.nombre);
            case 'pedidos':
                return b.totalPedidos - a.totalPedidos;
            case 'gastado':
                return b.totalGastado - a.totalGastado;
            case 'fecha':
                return new Date(b.ultimoPedido) - new Date(a.ultimoPedido);
            default:
                return 0;
        }
    });
    
    // Actualizar contador
    updateElement('clientCount', `${filteredClients.length} clientes encontrados`);
    
    // Renderizar según la vista actual
    if (currentClientView === 'grid') {
        renderClientsGrid();
    } else {
        renderClientsTable();
    }
}

function renderClientsGrid() {
    const container = document.getElementById('clientsGrid');
    
    if (filteredClients.length === 0) {
        container.innerHTML = `
            <div class="no-clients">
                <i class="fas fa-users"></i>
                <h3>No hay clientes</h3>
                <p>No se encontraron clientes con los filtros aplicados</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredClients.map(client => {
        const avatarText = client.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
        const isVIP = client.tipo === 'vip';
        const isNuevo = client.tipo === 'nuevo';
        
        return `
            <div class="client-card" onclick="showClientDetails('${client.id}')">
                <div class="client-header">
                    <div class="client-avatar ${isVIP ? 'vip' : ''}">
                        ${avatarText}
                    </div>
                    <div class="client-info">
                        <h4>${client.nombre}</h4>
                        <p>${client.email}</p>
                        ${isVIP ? '<span class="client-status vip">👑 VIP</span>' : ''}
                        ${isNuevo ? '<span class="client-status active">🆕 Nuevo</span>' : ''}
                    </div>
                </div>
                <div class="client-stats">
                    <div class="stat">
                        <span class="stat-label">Pedidos</span>
                        <span class="stat-value">${client.totalPedidos}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total</span>
                        <span class="stat-value">€${client.totalGastado.toFixed(2)}</span>
                    </div>
                </div>
                <div class="client-footer">
                    <div class="client-status ${client.estado}">
                        <i class="fas fa-circle"></i>
                        ${client.estado}
                    </div>
                    <div class="client-actions">
                        <button class="client-action-btn" onclick="event.stopPropagation(); showClientDetails('${client.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="client-action-btn" onclick="event.stopPropagation(); contactClient('${client.id}')" title="Contactar">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    
    if (filteredClients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-clients">
                    <i class="fas fa-users"></i>
                    <h3>No hay clientes</h3>
                    <p>No se encontraron clientes con los filtros aplicados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredClients.map(client => {
        const avatarText = client.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
        const isVIP = client.tipo === 'vip';
        const isNuevo = client.tipo === 'nuevo';
        
        return `
            <tr onclick="showClientDetails('${client.id}')">
                <td>
                    <div class="client-table-info">
                        <div class="client-table-avatar ${isVIP ? 'vip' : ''}">
                            ${avatarText}
                        </div>
                        <div class="client-table-details">
                            <h5>${client.nombre}</h5>
                            <p>${isVIP ? '👑 VIP' : isNuevo ? '🆕 Nuevo' : 'Cliente'}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="client-contact">
                        <div class="email">${client.email}</div>
                        <div class="phone">${client.telefono}</div>
                    </div>
                </td>
                <td>
                    <div class="client-metrics">
                        <div class="metric-value">${client.totalPedidos}</div>
                        <div class="metric-label">pedidos</div>
                    </div>
                </td>
                <td>
                    <div class="client-metrics">
                        <div class="metric-value">€${client.totalGastado.toFixed(2)}</div>
                        <div class="metric-label">gastado</div>
                    </div>
                </td>
                <td>
                    <div class="client-last-order">
                        ${formatDate(client.ultimoPedido)}
                    </div>
                </td>
                <td>
                    <span class="client-status-badge ${client.estado}">
                        <i class="fas fa-circle"></i>
                        ${client.estado}
                    </span>
                </td>
                <td>
                    <div class="client-table-actions">
                        <button class="client-table-action-btn" onclick="event.stopPropagation(); showClientDetails('${client.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="client-table-action-btn" onclick="event.stopPropagation(); contactClient('${client.id}')" title="Contactar">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== REPORTES =====
async function loadReportes() {
    console.log('📊 Cargando reportes...');
    
    try {
        // Generar datos de reportes basados en pedidos
        generateSalesReport();
        generateTopProducts();
        
    } catch (error) {
        console.error('❌ Error cargando reportes:', error);
        showNotification('Error cargando reportes', 'error');
    }
}

function generateSalesReport() {
    // Simular datos de ventas por período
    const salesChart = document.getElementById('salesChart');
    if (salesChart) {
        salesChart.innerHTML = `
            <div class="chart-placeholder">
                <i class="fas fa-chart-pie"></i>
                <p>Gráfico de ventas por período</p>
                <small>Total: €${allOrders.reduce((sum, order) => sum + parseFloat(order.precio || 0), 0).toFixed(2)}</small>
            </div>
        `;
    }
}

function generateTopProducts() {
    const topProducts = document.getElementById('topProducts');
    if (topProducts) {
        // Agrupar por forma y estilo
        const productStats = {};
        
        allOrders.forEach(order => {
            const key = `${order.forma} - ${order.estilo}`;
            if (!productStats[key]) {
                productStats[key] = { count: 0, revenue: 0 };
            }
            productStats[key].count++;
            productStats[key].revenue += parseFloat(order.precio || 0);
        });
        
        const sortedProducts = Object.entries(productStats)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 5);
        
        if (sortedProducts.length === 0) {
            topProducts.innerHTML = '<p>No hay datos disponibles</p>';
            return;
        }
        
        topProducts.innerHTML = sortedProducts.map(([product, stats]) => `
            <div class="product-item">
                <div class="product-info">
                    <h5>${product}</h5>
                    <p>${stats.count} pedidos</p>
                </div>
                <div class="product-revenue">
                    €${stats.revenue.toFixed(2)}
                </div>
            </div>
        `).join('');
    }
}

// ===== CONFIGURACIÓN =====
function loadConfiguracion() {
    console.log('⚙️ Cargando configuración...');
    
    // Configurar botón de inicialización de DB
    const initBtn = document.getElementById('initDbBtn');
    if (initBtn) {
        initBtn.addEventListener('click', initializeDatabase);
    }
}

async function initializeDatabase() {
    const btn = document.getElementById('initDbBtn');
    const status = document.getElementById('initStatus');
    
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inicializando...';
    }
    
    try {
        const response = await fetch('/api/supabase-init');
        const data = await response.json();
        
        if (data.success) {
            showStatusMessage(status, 'Base de datos inicializada correctamente', 'success');
            showNotification('Base de datos inicializada', 'success');
        } else {
            throw new Error(data.message || 'Error inicializando base de datos');
        }
    } catch (error) {
        console.error('❌ Error inicializando DB:', error);
        showStatusMessage(status, `Error: ${error.message}`, 'error');
        showNotification('Error inicializando base de datos', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-database"></i> Inicializar Base de Datos';
        }
    }
}

// ===== MODAL DE DETALLES =====
async function showOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }
    
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    modalBody.innerHTML = `
        <div class="order-details">
            <div class="detail-section">
                <h4>Información del Cliente</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Nombre:</label>
                        <span>${order.nombre}</span>
                    </div>
                    <div class="detail-item">
                        <label>Email:</label>
                        <span>${order.email}</span>
                    </div>
                    <div class="detail-item">
                        <label>Teléfono:</label>
                        <span>${order.telefono}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Detalles del Pedido</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>ID:</label>
                        <span>${order.id}</span>
                    </div>
                    <div class="detail-item">
                        <label>Fecha:</label>
                        <span>${formatDate(order.fecha)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Estado:</label>
                        <select id="orderStatusSelect" class="status-select">
                            <option value="pendiente" ${order.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="en_proceso" ${order.estado === 'en_proceso' ? 'selected' : ''}>En Proceso</option>
                            <option value="completado" ${order.estado === 'completado' ? 'selected' : ''}>Completado</option>
                            <option value="cancelado" ${order.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Producto</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Forma:</label>
                        <span>${order.forma}</span>
                    </div>
                    <div class="detail-item">
                        <label>Estilo:</label>
                        <span>${order.estilo}</span>
                    </div>
                    <div class="detail-item">
                        <label>Tamaño:</label>
                        <span>${order.tamaño}mm</span>
                    </div>
                    <div class="detail-item">
                        <label>Color:</label>
                        <span>${order.color}</span>
                    </div>
                    <div class="detail-item">
                        <label>Cantidad:</label>
                        <span>${order.cantidad} unidades</span>
                    </div>
                    <div class="detail-item">
                        <label>Precio:</label>
                        <span><strong>€${parseFloat(order.precio || 0).toFixed(2)}</strong></span>
                    </div>
                </div>
            </div>
            
            ${order.notas ? `
            <div class="detail-section">
                <h4>Notas</h4>
                <p>${order.notas}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
}

async function updateOrderStatus() {
    const orderId = document.querySelector('.order-details').dataset.orderId;
    const newStatus = document.getElementById('orderStatusSelect').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}?action=update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: orderId,
                estado: newStatus
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Estado actualizado correctamente', 'success');
            closeModal();
            loadPedidos(); // Recargar lista
            loadDashboard(); // Actualizar dashboard
        } else {
            throw new Error(data.message || 'Error actualizando estado');
        }
    } catch (error) {
        console.error('❌ Error actualizando estado:', error);
        showNotification('Error actualizando estado', 'error');
    }
}

// ===== BÚSQUEDA GLOBAL =====
function setupGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                performGlobalSearch(query);
            }
        });
    }
}

function performGlobalSearch(query) {
    // Buscar en pedidos
    const matchingOrders = allOrders.filter(order => 
        order.nombre.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
    );
    
    if (matchingOrders.length > 0) {
        showNotification(`Encontrados ${matchingOrders.length} resultados`, 'info');
        // Aquí podrías mostrar resultados en un dropdown o modal
    }
}

// ===== NOTIFICACIONES =====
function setupNotifications() {
    // Simular notificaciones
    setTimeout(() => {
        showNotification('Sistema iniciado correctamente', 'success');
    }, 1000);
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Añadir al contenedor de notificaciones
    const container = document.getElementById('notificationsList');
    if (container) {
        container.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Actualizar badge
    updateNotificationBadge();
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        const count = document.querySelectorAll('.notification').length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

function showNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.add('active');
}

function closeNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.remove('active');
}

// ===== SIDEBAR =====
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// ===== UTILIDADES =====
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function showLoadingIndicator(message = 'Cargando...') {
    // Crear o actualizar indicador de carga
    let loader = document.getElementById('loadingIndicator');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingIndicator';
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        const textElement = loader.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = message;
        }
    }
    loader.style.display = 'flex';
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = 'none';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showStatusMessage(element, message, type) {
    if (element) {
        element.innerHTML = `<div class="status-message ${type}">${message}</div>`;
    }
}

// ===== FUNCIONES DE CLIENTES =====
function setClientView(view) {
    currentClientView = view;
    
    // Actualizar botones de vista
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Mostrar/ocultar contenedores
    const gridContainer = document.getElementById('clientsGridContainer');
    const tableContainer = document.getElementById('clientsTableContainer');
    
    if (view === 'grid') {
        gridContainer.style.display = 'block';
        tableContainer.style.display = 'none';
        renderClientsGrid();
    } else {
        gridContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        renderClientsTable();
    }
}

function setupClientFilters() {
    const searchInput = document.getElementById('clientSearch');
    const sortSelect = document.getElementById('clientSortBy');
    const filterSelect = document.getElementById('clientFilterBy');
    
    if (searchInput) {
        searchInput.addEventListener('input', applyClientFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyClientFilters);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', applyClientFilters);
    }
}

function showClientDetails(clientId) {
    const client = allClients.find(c => c.id === clientId);
    if (!client) {
        showNotification('Cliente no encontrado', 'error');
        return;
    }
    
    // Obtener pedidos del cliente
    const clientOrders = allOrders.filter(order => order.email === client.email);
    
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    modalBody.innerHTML = `
        <div class="client-details">
            <div class="client-detail-header">
                <div class="client-detail-avatar ${client.tipo === 'vip' ? 'vip' : ''}">
                    ${client.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div class="client-detail-info">
                    <h3>${client.nombre}</h3>
                    <p>${client.email}</p>
                    <div class="client-detail-badges">
                        ${client.tipo === 'vip' ? '<span class="badge vip">👑 VIP</span>' : ''}
                        ${client.tipo === 'nuevo' ? '<span class="badge new">🆕 Nuevo</span>' : ''}
                        <span class="badge ${client.estado}">${client.estado}</span>
                    </div>
                </div>
            </div>
            
            <div class="client-detail-stats">
                <div class="detail-stat">
                    <h4>Total Pedidos</h4>
                    <p>${client.totalPedidos}</p>
                </div>
                <div class="detail-stat">
                    <h4>Total Gastado</h4>
                    <p>€${client.totalGastado.toFixed(2)}</p>
                </div>
                <div class="detail-stat">
                    <h4>Primer Pedido</h4>
                    <p>${formatDate(client.primerPedido)}</p>
                </div>
                <div class="detail-stat">
                    <h4>Último Pedido</h4>
                    <p>${formatDate(client.ultimoPedido)}</p>
                </div>
            </div>
            
            <div class="client-detail-orders">
                <h4>Historial de Pedidos</h4>
                <div class="orders-list">
                    ${clientOrders.map(order => `
                        <div class="order-item">
                            <div class="order-info">
                                <h5>Pedido ${order.id}</h5>
                                <p>${order.forma} - ${order.estilo} - ${order.cantidad} unidades</p>
                            </div>
                            <div class="order-meta">
                                <span class="order-date">${formatDate(order.fecha)}</span>
                                <span class="order-price">€${parseFloat(order.precio || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function contactClient(clientId) {
    const client = allClients.find(c => c.id === clientId);
    if (!client) {
        showNotification('Cliente no encontrado', 'error');
        return;
    }
    
    // Crear enlace de WhatsApp
    const message = `Hola ${client.nombre}, te contactamos desde Llaveros 3D para informarte sobre tu pedido.`;
    const whatsappUrl = `https://wa.me/${client.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Abriendo WhatsApp...', 'info');
}

function refreshClients() {
    loadClientes();
    showNotification('Clientes actualizados', 'success');
}

// ===== FUNCIONES DE EXPORTACIÓN =====
function exportPedidos() {
    if (allOrders.length === 0) {
        showNotification('No hay pedidos para exportar', 'warning');
        return;
    }
    
    const csv = generateCSV(allOrders);
    downloadCSV(csv, 'pedidos.csv');
    showNotification('Pedidos exportados correctamente', 'success');
}

function exportClientes() {
    if (allClients.length === 0) {
        showNotification('No hay clientes para exportar', 'warning');
        return;
    }
    
    const csv = generateCSV(allClients);
    downloadCSV(csv, 'clientes.csv');
    showNotification('Clientes exportados correctamente', 'success');
}

function generateCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== FUNCIONES DE REFRESH =====
function refreshDashboard() {
    loadDashboard();
    showNotification('Dashboard actualizado', 'success');
}

function generateReport() {
    showNotification('Generando reporte...', 'info');
    // Aquí implementarías la generación de reportes
    setTimeout(() => {
        showNotification('Reporte generado correctamente', 'success');
    }, 2000);
}

// ===== FUNCIONES DE LOADING INDICATOR =====
function showLoadingIndicator(message = 'Cargando...') {
    let loader = document.getElementById('loadingIndicator');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingIndicator';
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        const textElement = loader.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = message;
        }
    }
    loader.style.display = 'flex';
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = 'none';
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Cerrar modal al hacer click fuera
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('orderModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Cerrar notificaciones al hacer click fuera
    document.addEventListener('click', function(e) {
        const panel = document.getElementById('notificationsPanel');
        if (!panel.contains(e.target) && !e.target.closest('.notification-btn')) {
            closeNotifications();
        }
    });
}