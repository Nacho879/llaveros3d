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
