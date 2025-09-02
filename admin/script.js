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
// document.addEventListener('DOMContentLoaded', function() {
//     initializeAdmin();
//     setupNavigation();
//     // loadSampleData();
//     updateDashboard();
//     setupEventListeners();
// });
// 
// // Inicializar el admin
// function initializeAdmin() {
//     console.log('Backoffice inicializado');
//     
//     // Cargar datos del localStorage si existen
//     const savedPedidos = localStorage.getItem('llaveros3d_pedidos');
//     const savedClientes = localStorage.getItem('llaveros3d_clientes');
//     
//     if (savedPedidos) {
//         pedidos = JSON.parse(savedPedidos);
//     }
//     
//     if (savedClientes) {
//         clientes = JSON.parse(savedClientes);
//     }
// }
// 
// // Configurar navegación
// function setupNavigation() {
//     const navLinks = document.querySelectorAll('.nav-link');
//     
//     navLinks.forEach(link => {
//         link.addEventListener('click', function(e) {
//             e.preventDefault();
//             const section = this.getAttribute('data-section');
//             showSection(section);
//         });
//     });
// }
// 
// // Mostrar sección
// function showSection(sectionName) {
//     // Ocultar todas las secciones
//     document.querySelectorAll('.admin-section').forEach(section => {
//         section.classList.remove('active');
//     });
//     
//     // Mostrar la sección seleccionada
//     document.getElementById(sectionName).classList.add('active');
//     
//     // Actualizar navegación activa
//     document.querySelectorAll('.nav-link').forEach(link => {
//         link.classList.remove('active');
//     });
//     
//     document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
//     
//     currentSection = sectionName;
//     
//     // Cargar datos específicos de la sección
//     switch(sectionName) {
//         case 'dashboard':
//             updateDashboard();
//             break;
//         case 'pedidos':
//             renderPedidosTable();
//             break;
//         case 'clientes':
//             renderClientesGrid();
//             break;
//         case 'reportes':
//             renderReportes();
//             break;
//     }
// }
// 
// // Configurar event listeners
// function setupEventListeners() {
//     // Búsqueda de pedidos
//     const searchInput = document.getElementById('search-pedidos');
//     if (searchInput) {
//         searchInput.addEventListener('input', function() {
//             filterPedidos();
//         });
//     }
//     
//     // Filtros
//     const filterStatus = document.getElementById('filter-status');
//     if (filterStatus) {
//         filterStatus.addEventListener('change', filterPedidos);
//     }
//     
//     const filterDate = document.getElementById('filter-date');
//     if (filterDate) {
//         filterDate.addEventListener('change', filterPedidos);
//     }
// }
// 
// // Cargar datos de ejemplo
// // function loadSampleData() {
// //     if (pedidos.length === 0) {
// //         pedidos = [
// //             {
// //                 id: 'P001',
// //                 fecha: '2024-09-02',
// //                 cliente: 'Juan Pérez',
// //                 empresa: 'TechCorp S.L.',
// //                 email: 'juan@techcorp.com',
// //                 telefono: '+34 600 123 456',
// //                 producto: 'Llavero Redondo',
// //                 forma: 'redondo',
// //                 estilo: 'estandar',
// //                 tamaño: 'mediano',
// //                 color: 'negro',
// //                 cantidad: 50,
// //                 precio: 60.00,
// //                 estado: 'nuevo',
// //                 notas: 'Logo corporativo en alto relieve',
// //                 imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9nbzwvdGV4dD4KPC9zdmc+'
// //             },
// //             {
// //                 id: 'P002',
// //                 fecha: '2024-09-01',
// //                 cliente: 'María García',
// //                 empresa: 'Inmobiliaria Nova',
// //                 email: 'maria@novainmo.com',
// //                 telefono: '+34 600 789 012',
// //                 producto: 'Llavero Rectangular',
// //                 forma: 'rectangular',
// //                 estilo: 'premium',
// //                 tamaño: 'grande',
// //                 color: 'azul',
// //                 cantidad: 100,
// //                 precio: 120.00,
// //                 estado: 'en-proceso',
// //                 notas: 'Diseño personalizado para evento corporativo',
// //                 imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9nbzwvdGV4dD4KPC9zdmc+'
// //             },
// //             {
// //                 id: 'P003',
// //                 fecha: '2024-08-30',
// //                 cliente: 'Carlos López',
// //                 empresa: 'Marketing Plus',
// //                 email: 'carlos@marketingplus.es',
// //                 telefono: '+34 600 345 678',
// //                 producto: 'Llavero Píldora',
// //                 forma: 'pildora',
// //                 estilo: 'estandar',
// //                 tamaño: 'pequeño',
// //                 color: 'blanco',
// //                 cantidad: 75,
// //                 precio: 90.00,
// //                 estado: 'completado',
// //                 notas: 'Para regalo de Navidad a clientes',
// //                 imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9nbzwvdGV4dD4KPC9zdmc+'
// //             }
// //         ];
// //         
// //         // Guardar en localStorage
// //         localStorage.setItem('llaveros3d_pedidos', JSON.stringify(pedidos));
// //     }
// //     
// //     if (clientes.length === 0) {
// //         clientes = [
// //             {
// //                 id: 'C001',
// //                 nombre: 'Juan Pérez',
// //                 empresa: 'TechCorp S.L.',
// //                 email: 'juan@techcorp.com',
// //                 telefono: '+34 600 123 456',
// //                 pedidos: 3,
// //                 totalGastado: 180.00,
// //                 ultimoPedido: '2024-09-02'
// //             },
// //             {
// //                 id: 'C002',
// //                 nombre: 'María García',
// //                 empresa: 'Inmobiliaria Nova',
// //                 email: 'maria@novainmo.com',
// //                 telefono: '+34 600 789 012',
// //                 pedidos: 2,
// //                 totalGastado: 150.00,
// //                 ultimoPedido: '2024-09-01'
// //             },
// //             {
// //                 id: 'C003',
// //                 nombre: 'Carlos López',
// //                 empresa: 'Marketing Plus',
// //                 email: 'carlos@marketingplus.es',
// //                 telefono: '+34 600 345 678',
// //                 pedidos: 1,
// //                 totalGastado: 90.00,
// //                 ultimoPedido: '2024-08-30'
// //             }
// //         ];
// //         
// //         // Guardar en localStorage
// //         localStorage.setItem('llaveros3d_clientes', JSON.stringify(clientes));
// //     }
// // }
// 
// // Actualizar dashboard
// function updateDashboard() {
//     updateStats();
//     updateRecentPedidos();
//     updateChart();
// }
// 
// // Actualizar estadísticas
// function updateStats() {
//     const totalPedidos = pedidos.length;
//     const pedidosPendientes = pedidos.filter(p => ['nuevo', 'en-proceso', 'produccion'].includes(p.estado)).length;
//     const pedidosCompletados = pedidos.filter(p => ['completado', 'enviado'].includes(p.estado)).length;
//     const ingresosTotales = pedidos.reduce((sum, p) => sum + p.precio, 0);
//     
//     document.getElementById('total-pedidos').textContent = totalPedidos;
//     document.getElementById('pedidos-pendientes').textContent = pedidosPendientes;
//     document.getElementById('pedidos-completados').textContent = pedidosCompletados;
//     document.getElementById('ingresos-totales').textContent = ingresosTotales.toFixed(2) + '€';
// }
// 
// // Actualizar pedidos recientes
// function updateRecentPedidos() {
//     const recentContainer = document.getElementById('recent-pedidos');
//     const recentPedidos = pedidos.slice(0, 5);
//     
//     recentContainer.innerHTML = recentPedidos.map(pedido => `
//         <div class="recent-pedido">
//             <div class="pedido-info">
//                 <strong>${pedido.id}</strong> - ${pedido.cliente} (${pedido.empresa})
//             </div>
//             <div class="pedido-status">
//                 <span class="status-badge status-${pedido.estado}">${pedido.estado}</span>
//             </div>
//             <div class="pedido-amount">
//                 ${pedido.cantidad} uds - ${pedido.precio.toFixed(2)}€
//             </div>
//         </div>
//     `).join('');
// }
// 
// // Actualizar gráfico
// function updateChart() {
//     const canvas = document.getElementById('pedidos-chart');
//     if (!canvas) return;
//     
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;
//     
//     // Limpiar canvas
//     ctx.clearRect(0, 0, width, height);
//     
//     // Datos de ejemplo (pedidos por mes)
//     const data = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];
//     const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
//     
//     const maxValue = Math.max(...data);
//     const barWidth = width / data.length;
//     
//     // Dibujar barras
//     ctx.fillStyle = '#667eea';
//     data.forEach((value, index) => {
//         const barHeight = (value / maxValue) * (height - 40);
//         const x = index * barWidth + barWidth * 0.1;
//         const y = height - barHeight - 20;
//         
//         ctx.fillRect(x, y, barWidth * 0.8, barHeight);
//         
//         // Texto del mes
//         ctx.fillStyle = '#718096';
//         ctx.font = '12px Arial';
//         ctx.textAlign = 'center';
//         ctx.fillText(months[index], x + barWidth * 0.4, height - 5);
//         
//         // Valor
//         ctx.fillStyle = '#2d3748';
//         ctx.fillText(value, x + barWidth * 0.4, y - 5);
//         
//         ctx.fillStyle = '#667eea';
//     });
// }
// 
// // Renderizar tabla de pedidos
// function renderPedidosTable() {
//     const tbody = document.getElementById('pedidos-tbody');
//     if (!tbody) return;
//     
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const pedidosToShow = pedidos.slice(startIndex, endIndex);
//     
//     tbody.innerHTML = pedidosToShow.map(pedido => `
//         <tr>
//             <td><strong>${pedido.id}</strong></td>
//             <td>${formatDate(pedido.fecha)}</td>
//             <td>${pedido.cliente}</td>
//             <td>${pedido.empresa}</td>
//             <td>${pedido.producto}</td>
//             <td>${pedido.cantidad}</td>
//             <td>${pedido.precio.toFixed(2)}€</td>
//             <td>
//                 <span class="status-badge status-${pedido.estado}">${pedido.estado}</span>
//             </td>
//             <td>
//                 <div class="action-buttons">
//                     <button class="btn btn-primary btn-small" onclick="viewPedido('${pedido.id}')">
//                         <i class="fas fa-eye"></i>
//                     </button>
//                     <button class="btn btn-secondary btn-small" onclick="editPedido('${pedido.id}')">
//                         <i class="fas fa-edit"></i>
//                     </button>
//                 </div>
//             </td>
//         </tr>
//     `).join('');
//     
//     renderPagination();
// }
// 
// // Renderizar paginación
// function renderPagination() {
//     const pagination = document.getElementById('pagination');
//     if (!pagination) return;
//     
//     const totalPages = Math.ceil(pedidos.length / itemsPerPage);
//     
//     let paginationHTML = '';
//     
//     // Botón anterior
//     if (currentPage > 1) {
//         paginationHTML += `<button onclick="changePage(${currentPage - 1})">Anterior</button>`;
//     }
//     
//     // Páginas
//     for (let i = 1; i <= totalPages; i++) {
//         if (i === currentPage) {
//             paginationHTML += `<button class="active">${i}</button>`;
//         } else {
//             paginationHTML += `<button onclick="changePage(${i})">${i}</button>`;
//         }
//     }
//     
//     // Botón siguiente
//     if (currentPage < totalPages) {
//         paginationHTML += `<button onclick="changePage(${currentPage + 1})">Siguiente</button>`;
//     }
//     
//     pagination.innerHTML = paginationHTML;
// }
// 
// // Cambiar página
// function changePage(page) {
//     currentPage = page;
//     renderPedidosTable();
// }
// 
// // Filtrar pedidos
// function filterPedidos() {
//     const searchTerm = document.getElementById('search-pedidos').value.toLowerCase();
//     const statusFilter = document.getElementById('filter-status').value;
//     const dateFilter = document.getElementById('filter-date').value;
//     
//     let filteredPedidos = pedidos.filter(pedido => {
//         // Búsqueda por texto
//         const matchesSearch = 
//             pedido.cliente.toLowerCase().includes(searchTerm) ||
//             pedido.empresa.toLowerCase().includes(searchTerm) ||
//             pedido.id.toLowerCase().includes(searchTerm);
//         
//         // Filtro por estado
//         const matchesStatus = !statusFilter || pedido.estado === statusFilter;
//         
//         // Filtro por fecha
//         let matchesDate = true;
//         if (dateFilter) {
//             const pedidoDate = new Date(pedido.fecha);
//             const today = new Date();
//             
//             switch(dateFilter) {
//                 case 'hoy':
//                     matchesDate = pedidoDate.toDateString() === today.toDateString();
//                     break;
//                 case 'semana':
//                     const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
//                     matchesDate = pedidoDate >= weekAgo;
//                     break;
//                 case 'mes':
//                     matchesDate = pedidoDate.getMonth() === today.getMonth() && 
//                                 pedidoDate.getFullYear() === today.getFullYear();
//                     break;
//                 case 'trimestre':
//                     const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
//                     matchesDate = pedidoDate >= quarterAgo;
//                     break;
//             }
//         }
//         
//         return matchesSearch && matchesStatus && matchesDate;
//     });
//     
//     // Actualizar tabla con resultados filtrados
//     renderFilteredPedidos(filteredPedidos);
// }
// 
// // Renderizar pedidos filtrados
// function renderFilteredPedidos(filteredPedidos) {
//     const tbody = document.getElementById('pedidos-tbody');
//     if (!tbody) return;
//     
//     tbody.innerHTML = filteredPedidos.map(pedido => `
//         <tr>
//             <td><strong>${pedido.id}</strong></td>
//             <td>${formatDate(pedido.fecha)}</td>
//             <td>${pedido.cliente}</td>
//             <td>${pedido.empresa}</td>
//             <td>${pedido.producto}</td>
//             <td>${pedido.cantidad}</td>
//             <td>${pedido.precio.toFixed(2)}€</td>
//             <td>
//                 <span class="status-badge status-${pedido.estado}">${pedido.estado}</span>
//             </td>
//             <td>
//                 <div class="action-buttons">
//                     <button class="btn btn-primary btn-small" onclick="viewPedido('${pedido.id}')">
//                         <i class="fas fa-eye"></i>
//                     </button>
//                     <button class="btn btn-secondary btn-small" onclick="editPedido('${pedido.id}')">
//                         <i class="fas fa-edit"></i>
//                     </button>
//                 </div>
//             </td>
//         </tr>
//     `).join('');
// }
// 
// // Ver pedido
// function viewPedido(pedidoId) {
//     const pedido = pedidos.find(p => p.id === pedidoId);
//     if (!pedido) return;
//     
//     const modal = document.getElementById('pedido-modal');
//     const modalBody = document.getElementById('modal-body');
//     
//     modalBody.innerHTML = `
//         <div class="pedido-details">
//             <div class="detail-row">
//                 <strong>ID:</strong> ${pedido.id}
//             </div>
//             <div class="detail-row">
//                 <strong>Fecha:</strong> ${formatDate(pedido.fecha)}
//             </div>
//             <div class="detail-row">
//                 <strong>Cliente:</strong> ${pedido.cliente}
//             </div>
//             <div class="detail-row">
//                 <strong>Empresa:</strong> ${pedido.empresa}
//             </div>
//             <div class="detail-row">
//                 <strong>Email:</strong> ${pedido.email}
//             </div>
//             <div class="detail-row">
//                 <strong>Teléfono:</strong> ${pedido.telefono}
//             </div>
//             <div class="detail-row">
//                 <strong>Producto:</strong> ${pedido.producto}
//             </div>
//             <div class="detail-row">
//                 <strong>Forma:</strong> ${pedido.forma}
//             </div>
//             <div class="detail-row">
//                 <strong>Estilo:</strong> ${pedido.estilo}
//             </div>
//             <div class="detail-row">
//                 <strong>Tamaño:</strong> ${pedido.tamaño}
//             </div>
//             <div class="detail-row">
//                 <strong>Color:</strong> ${pedido.color}
//             </div>
//             <div class="detail-row">
//                 <strong>Cantidad:</strong> ${pedido.cantidad}
//             </div>
//             <div class="detail-row">
//                 <strong>Precio:</strong> ${pedido.precio.toFixed(2)}€
//             </div>
//             <div class="detail-row">
//                 <strong>Estado:</strong> 
//                 <select id="pedido-status" class="status-select">
//                     <option value="nuevo" ${pedido.estado === 'nuevo' ? 'selected' : ''}>Nuevo</option>
//                     <option value="en-proceso" ${pedido.estado === 'en-proceso' ? 'selected' : ''}>En Proceso</option>
//                     <option value="produccion" ${pedido.estado === 'produccion' ? 'selected' : ''}>En Producción</option>
//                     <option value="completado" ${pedido.estado === 'completado' ? 'selected' : ''}>Completado</option>
//                     <option value="enviado" ${pedido.estado === 'enviado' ? 'selected' : ''}>Enviado</option>
//                     <option value="cancelado" ${pedido.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
//                 </select>
//             </div>
//             <div class="detail-row">
//                 <strong>Notas:</strong> ${pedido.notas || 'Sin notas'}
//             </div>
//             <div class="detail-row">
//                 <strong>Imagen:</strong>
//                 <div class="pedido-image">
//                     <img src="${pedido.imagen}" alt="Logo del cliente" style="max-width: 200px; max-height: 200px;">
//                 </div>
//             </div>
//         </div>
//     `;
//     
//     modal.style.display = 'block';
// }
// 
// // Editar pedido
// function editPedido(pedidoId) {
//     viewPedido(pedidoId); // Por ahora, usar la misma función
// }
// 
// // Guardar cambios del pedido
// function savePedido() {
//     const pedidoId = document.querySelector('.pedido-details .detail-row:first-child strong').nextSibling.textContent.trim();
//     const newStatus = document.getElementById('pedido-status').value;
//     
//     const pedido = pedidos.find(p => p.id === pedidoId);
//     if (pedido) {
//         pedido.estado = newStatus;
//         
//         // Guardar en localStorage
//         localStorage.setItem('llaveros3d_pedidos', JSON.stringify(pedidos));
//         
//         // Actualizar dashboard y tabla
//         updateDashboard();
//         renderPedidosTable();
//         
//         // Cerrar modal
//         closeModal();
//         
//         // Mostrar mensaje de éxito
//         showMessage('Pedido actualizado correctamente', 'success');
//     }
// }
// 
// // Cerrar modal
// function closeModal() {
//     const modal = document.getElementById('pedido-modal');
//     modal.style.display = 'none';
// }
// 
// // Renderizar grid de clientes
// function renderClientesGrid() {
//     const grid = document.getElementById('clients-grid');
//     if (!grid) return;
//     
//     grid.innerHTML = clientes.map(cliente => `
//         <div class="client-card">
//             <h3>${cliente.nombre}</h3>
//             <div class="client-info">
//                 <p><strong>Empresa:</strong> ${cliente.empresa}</p>
//                 <p><strong>Email:</strong> ${cliente.email}</p>
//                 <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
//                 <p><strong>Total pedidos:</strong> ${cliente.pedidos}</p>
//                 <p><strong>Total gastado:</strong> ${cliente.totalGastado.toFixed(2)}€</p>
//                 <p><strong>Último pedido:</strong> ${formatDate(cliente.ultimoPedido)}</p>
//             </div>
//         </div>
//     `).join('');
// }
// 
// // Renderizar reportes
// function renderReportes() {
//     // Por ahora, solo mostrar mensaje
//     const reportsGrid = document.querySelector('.reports-grid');
//     if (reportsGrid) {
//         reportsGrid.innerHTML = `
//             <div class="report-card">
//                 <h3>Reportes en desarrollo</h3>
//                 <p>Los reportes detallados estarán disponibles próximamente.</p>
//             </div>
//         `;
//     }
// }
// 
// // Utilidades
// function formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('es-ES', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// }
// 
// function showMessage(message, type = 'info') {
//     // Crear elemento de mensaje
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `message message-${type}`;
//     messageDiv.textContent = message;
//     
//     // Añadir al body
//     document.body.appendChild(messageDiv);
//     
//     // Mostrar
//     setTimeout(() => messageDiv.classList.add('show'), 100);
//     
//     // Ocultar después de 3 segundos
//     setTimeout(() => {
//         messageDiv.classList.remove('show');
//         setTimeout(() => messageDiv.remove(), 300);
//     }, 3000);
// }
// 
// // Logout
// function logout() {
//     if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
//         // Por ahora, solo redirigir a la página principal
//         window.location.href = '../index.html';
//     }
// }
// 
// // Cerrar modal al hacer clic fuera
// window.onclick = function(event) {
//     const modal = document.getElementById('pedido-modal');
//     if (event.target === modal) {
//         closeModal();
//     }
// }
// 
// // Mostrar información del usuario autenticado
// function displayUserInfo() {
//     const userEmail = localStorage.getItem("llaveros3d_user_email");
//     const userEmailElement = document.getElementById("userEmail");
//     
//     if (userEmailElement && userEmail) {
//         userEmailElement.textContent = userEmail;
//     }
// }
