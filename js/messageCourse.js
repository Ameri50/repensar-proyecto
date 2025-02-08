// Cargar datos cuando se inicia la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del localStorage si existen
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
        courses = JSON.parse(storedCourses);
        actualizarTabla();
    }

    // Configurar el evento submit del formulario
    document.getElementById('courseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarCourse();
    });
});

// Función para guardar un nuevo course o actualizar uno existente
function guardarCourse() {
    const descripcion = document.getElementById('descripcion').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (editingId === null) {
        // Nuevo course
        const id = courses.length > 0 ? Math.max(...courses.map(f => f.id)) + 1 : 1;
        const newCourse = new Course(id, descripcion, mensaje);
        courses.push(newCourse);
    } else {
        // Actualizar Course existente
        const index = courses.findIndex(f => f.id === editingId);
        if (index !== -1) {
            courses[index] = new Course(editingId, descripcion, mensaje);
        }
    }

    // Guardar en localStorage
    localStorage.setItem('courses', JSON.stringify(courses));
    
    // Actualizar la tabla y limpiar el formulario
    actualizarTabla();
    limpiarFormulario();
    
    // Mostrar mensaje de éxito
    mostrarNotificacion(editingId === null ? 'Mensaje agregado correctamente' : 'Mensaje actualizado correctamente');
}

// Función para editar un course
function editarCourse(id) {
    const course = courses.find(f => f.id === id);
    if (course) {
        editingId = id;
        document.getElementById('courseId').value = course.id;
        document.getElementById('descripcion').value = course.descripcion;
        document.getElementById('mensaje').value = course.mensaje;
        document.querySelector('button[type="submit"]').textContent = 'Actualizar';
    }
}

// Función para eliminar un course
function eliminarCourse(id) {
    if (confirm('¿Está seguro de eliminar este mensaje?')) {
        courses = courses.filter(f => f.id !== id);
        localStorage.setItem('courses', JSON.stringify(courses));
        actualizarTabla();
        mostrarNotificacion('Mensaje eliminado correctamente');
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    editingId = null;
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
}

// Función para actualizar la tabla
function actualizarTabla() {
    const tbody = document.getElementById('courseTableBody');
    tbody.innerHTML = '';

    courses.forEach(course => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${course.id}</td>
            <td>${course.descripcion}</td>
            <td>${course.mensaje}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editarCourse(${course.id})">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarCourse(${course.id})">
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