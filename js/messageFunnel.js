// Cargar datos cuando se inicia la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del localStorage si existen
    const storedFunnels = localStorage.getItem('funnels');
    if (storedFunnels) {
        funnels = JSON.parse(storedFunnels);
        actualizarTabla();
    }

    // Configurar el evento submit del formulario
    document.getElementById('funnelForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarFunnel();
    });
});

// Función para guardar un nuevo funnel o actualizar uno existente
function guardarFunnel() {
    const descripcion = document.getElementById('descripcion').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (editingId === null) {
        // Nuevo funnel
        const id = funnels.length > 0 ? Math.max(...funnels.map(f => f.id)) + 1 : 1;
        const newFunnel = new Funnel(id, descripcion, mensaje);
        funnels.push(newFunnel);
    } else {
        // Actualizar funnel existente
        const index = funnels.findIndex(f => f.id === editingId);
        if (index !== -1) {
            funnels[index] = new Funnel(editingId, descripcion, mensaje);
        }
    }

    // Guardar en localStorage
    localStorage.setItem('funnels', JSON.stringify(funnels));
    
    // Actualizar la tabla y limpiar el formulario
    actualizarTabla();
    limpiarFormulario();
    
    // Mostrar mensaje de éxito
    mostrarNotificacion(editingId === null ? 'Mensaje agregado correctamente' : 'Mensaje actualizado correctamente');
}

// Función para editar un funnel
function editarFunnel(id) {
    const funnel = funnels.find(f => f.id === id);
    if (funnel) {
        editingId = id;
        document.getElementById('funnelId').value = funnel.id;
        document.getElementById('descripcion').value = funnel.descripcion;
        document.getElementById('mensaje').value = funnel.mensaje;
        document.querySelector('button[type="submit"]').textContent = 'Actualizar';
    }
}

// Función para eliminar un funnel
function eliminarFunnel(id) {
    if (confirm('¿Está seguro de eliminar este mensaje?')) {
        funnels = funnels.filter(f => f.id !== id);
        localStorage.setItem('funnels', JSON.stringify(funnels));
        actualizarTabla();
        mostrarNotificacion('Mensaje eliminado correctamente');
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    editingId = null;
    document.getElementById('funnelForm').reset();
    document.getElementById('funnelId').value = '';
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
}

// Función para actualizar la tabla
function actualizarTabla() {
    const tbody = document.getElementById('funnelTableBody');
    tbody.innerHTML = '';

    funnels.forEach(funnel => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${funnel.id}</td>
            <td>${funnel.descripcion}</td>
            <td>${funnel.mensaje}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editarFunnel(${funnel.id})">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarFunnel(${funnel.id})">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    // Aquí podrías implementar un sistema de notificaciones más elaborado
    alert(mensaje);
}

// Función para validar el formulario antes de enviar
function validarFormulario() {
    const descripcion = document.getElementById('descripcion').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    if (!descripcion || !mensaje) {
        mostrarNotificacion('Por favor complete todos los campos');
        return false;
    }
    return true;
}