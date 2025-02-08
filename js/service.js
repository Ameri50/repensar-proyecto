let currentEditIndex = null;

document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('contactsData');

    if (storedData) {
        const data = JSON.parse(storedData);
        renderContactTable(data);
    }
});

document.getElementById('loadCsvBtn').addEventListener('click', () => {
    const csvFile = document.getElementById('csvFileInput').files[0];

    if (csvFile) {
        Papa.parse(csvFile, {
            header: true,
            complete: function(results) {
                const data = results.data.map(contact => [
                    contact.Nombre,
                    contact.Apellido,
                    contact.Email,
                    contact.WhatsApp,
                    contact.Funnel,
                    contact.Curso
                ]);

                // Guardar los datos en localStorage
                localStorage.setItem('contactsData', JSON.stringify(data));
                renderContactTable(data);
            },
            error: function(error) {
                console.error("Error al leer el archivo CSV: ", error);
            }
        });
    } else {
        alert("Por favor, selecciona un archivo CSV.");
    }
});

function renderContactTable(data) {
    const tableBody = document.getElementById('contactTable');
    tableBody.innerHTML = '';  // Limpiar tabla existente

    data.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>  <!-- ID -->
            <td>${contact[0]}</td>  <!-- Nombre -->
            <td>${contact[1]}</td>  <!-- Apellido -->
            <td>${contact[2]}</td>  <!-- Email -->
            <td>${contact[3]}</td>  <!-- WhatsApp -->
            <td>${contact[4]}</td>  <!-- Funnel -->
            <td>${contact[5]}</td>  <!-- Curso -->
            <td>
                <button class="btn btn-primary btn-sm" onclick="editContact(${index})" data-bs-toggle="modal" data-bs-target="#editContactModal">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteContact(${index})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editContact(index) {
    const data = JSON.parse(localStorage.getItem('contactsData'));

    // Guardar el índice del contacto que se está editando
    currentEditIndex = index;

    // Cargar los datos en el modal de edición
    const contact = data[index];
    document.getElementById('editName').value = contact[0];
    document.getElementById('editLastName').value = contact[1];
    document.getElementById('editEmail').value = contact[2];
    document.getElementById('editWhatsapp').value = contact[3];
    document.getElementById('editFunnel').value = contact[4];
    document.getElementById('editCurso').value = contact[5];
}

document.getElementById('saveChangesBtn').addEventListener('click', () => {
    const data = JSON.parse(localStorage.getItem('contactsData'));

    // Actualizar los datos con los nuevos valores del formulario del modal
    data[currentEditIndex][0] = document.getElementById('editName').value;
    data[currentEditIndex][1] = document.getElementById('editLastName').value;
    data[currentEditIndex][2] = document.getElementById('editEmail').value;
    data[currentEditIndex][3] = document.getElementById('editWhatsapp').value;
    data[currentEditIndex][4] = document.getElementById('editFunnel').value;
    data[currentEditIndex][5] = document.getElementById('editCurso').value;

    // Guardar cambios en localStorage
    localStorage.setItem('contactsData', JSON.stringify(data));

    // Volver a renderizar la tabla con los datos actualizados
    renderContactTable(data);

    // Cerrar el modal de edición
    const editContactModal = bootstrap.Modal.getInstance(document.getElementById('editContactModal'));
    editContactModal.hide();
});

function deleteContact(index) {
    let data = JSON.parse(localStorage.getItem('contactsData'));

    // Eliminar el contacto seleccionado
    data.splice(index, 1);

    // Actualizar los datos en localStorage
    localStorage.setItem('contactsData', JSON.stringify(data));

    // Volver a renderizar la tabla
    renderContactTable(data);
}
