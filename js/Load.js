let currentId = 25001; // ID inicial en 25001

document.addEventListener('DOMContentLoaded', function() {
    // Cargar leads del localStorage cuando se carga la página
    if (localStorage.getItem("leads")) {
        leads = JSON.parse(localStorage.getItem("leads"));
        
        // Actualizar el currentId al siguiente ID disponible y asegurarse de que tenga al menos 5 dígitos
        if (leads.length > 0) {
            currentId = Math.max(...leads.map(lead => lead.id)) + 1;
        }

        // Si el currentId es menor que 25001, ajustarlo para comenzar en 25001
        if (currentId < 25000) {
            currentId = 25001;
        }

        updateTable();
    }
});

// Función para abrir el explorador de archivos al presionar "Load"
document.getElementById('loadBtn').addEventListener('click', function() {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = '.csv';
    inputFile.style.display = 'none';
    document.body.appendChild(inputFile);
    inputFile.click();

    inputFile.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('filePath').value = file.name; // Muestra el nombre del archivo en el textbox
            readCSVFile(file); // Llama a la función para leer el archivo CSV
        }
    });
});

function readCSVFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const csvData = event.target.result;
        console.log(csvData); // Verificar que el archivo CSV se está leyendo correctamente
        parseCSV(csvData); // Llamar a la función para analizar los datos CSV
    };
    
    reader.readAsText(file);
}

// Función para analizar los datos CSV y crear los objetos Lead
function parseCSV(csvData) {
    Papa.parse(csvData, {
        complete: function(results) {
            leads = []; // Limpiar el arreglo de leads antes de llenarlo

            results.data.forEach(function(row) {
                if (row.length >= 4) {
                    const lead = new Lead(currentId, row[0], row[1], row[2], row[3]);
                    leads.push(lead);
                    currentId++; // Incrementar el ID después de cada inserción
                }
            });
            
            localStorage.setItem("leads", JSON.stringify(leads));
            updateTable(); // Llamar a la función para actualizar la tabla
        },
        header: false
    });
}

function updateTable() {
    const tableBody = document.getElementById('leadTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos datos

    leads.forEach(function(lead) {
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${lead.id}</td>
    <td>${lead.nombre}</td>
    <td>${lead.apellido}</td>
    <td>${lead.correo}</td>
    <td>${lead.whatsapp}</td>
    <td>${lead.funnel}</td>
    <td>${lead.curso}</td>
    <td>
        <button class="btn btn-warning btn-sm editBtn" data-id="${lead.id}">Editar</button>
        <button class="btn btn-danger btn-sm deleteBtn" data-id="${lead.id}">Eliminar</button>
        <a href="https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}?text=Hola%20${lead.nombre}%2C%20te%20contactamos%20desde%20nuestra%20plataforma%20para%20ofrecerte%20nuestro%20nuevo%20curso%20en%20${lead.curso}." target="_blank" class="btn btn-success btn-sm">WhatsApp</a>
    </td>
`;

        tableBody.appendChild(row);
    });

    // Delegar el evento de clic en el botón de editar
    document.getElementById('leadTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('editBtn')) {
            const leadId = event.target.getAttribute('data-id');
            editLead(leadId); // Llama a la función de editar
        }
    });

    // Delegar el evento de clic en el botón de eliminar
    document.getElementById('leadTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteBtn')) {
            const leadId = event.target.getAttribute('data-id');
            deleteLead(leadId); // Llama a la función de eliminar
        }
    });
}

// Función para editar un lead
function editLead(leadId) {
    const lead = leads.find(lead => lead.id == leadId);
    
    if (lead) {
        document.getElementById('editName').value = lead.nombre;
        document.getElementById('editLastName').value = lead.apellido;
        document.getElementById('editEmail').value = lead.correo;
        document.getElementById('editWhatsapp').value = lead.whatsapp;
        document.getElementById('editFunnel').value = lead.funnel;
        document.getElementById('editCurso').value = lead.curso;
        document.getElementById('editLeadId').value = lead.id;

        const editModal = new bootstrap.Modal(document.getElementById('editLeadModal'), {
            backdrop: false // Evita que la pantalla se oscurezca
        });
        editModal.show();
    } 
}

document.getElementById('saveChangesBtn').addEventListener('click', function() {
    const leadId = document.getElementById('editLeadId').value;
    const lead = leads.find(lead => lead.id == leadId);

    if (lead) {
        // Actualizar los datos del lead con los nuevos valores del modal
        lead.nombre = document.getElementById('editName').value;
        lead.apellido = document.getElementById('editLastName').value;
        lead.correo = document.getElementById('editEmail').value;
        lead.whatsapp = document.getElementById('editWhatsapp').value;
        lead.funnel = document.getElementById('editFunnel').value;
        lead.curso = document.getElementById('editCurso').value;

        // Guardar los leads actualizados en el localStorage
        localStorage.setItem('leads', JSON.stringify(leads));

        // Actualizar únicamente la fila editada
        const row = document.querySelector(`button[data-id="${leadId}"]`).parentNode.parentNode;
        row.innerHTML = `
            <td>${lead.id}</td>
            <td>${lead.nombre}</td>
            <td>${lead.apellido}</td>
            <td>${lead.correo}</td>
            <td>${lead.whatsapp}</td>
            <td>${lead.funnel}</td>
            <td>${lead.curso}</td>
            <td>
                <button class="btn btn-warning btn-sm editBtn" data-id="${lead.id}">Editar</button>
                <button class="btn btn-danger btn-sm deleteBtn" data-id="${lead.id}">Eliminar</button>
            </td>
        `;

        // Cerrar el modal de edición
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editLeadModal'));
        editModal.hide();
    }
});

// Función para eliminar un lead
function deleteLead(leadId) {
    if (confirm('¿Estás seguro de que deseas eliminar este lead?')) {
        leads = leads.filter(lead => lead.id != leadId);
        localStorage.setItem('leads', JSON.stringify(leads)); // Actualizar localStorage
        updateTable(); // Actualizar la tabla
    }
}

// Función para redirigir al usuario al presionar el botón "Home"
document.getElementById('homeBtn').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirige a la misma página
});

// Función para agregar un nuevo lead desde el formulario
document.getElementById('addLeadForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar que el formulario recargue la página

    // Obtener los valores del formulario
    const nombre = document.getElementById('newName').value;
    const apellido = document.getElementById('newLastName').value;
    const correo = document.getElementById('newEmail').value;
    const whatsapp = document.getElementById('newWhatsapp').value;
    const funnel = document.getElementById('newFunnel').value;  // Nuevo campo de Funnel
    const curso = document.getElementById('newCurso').value;    // Nuevo campo de Curso

    // Crear un nuevo lead y añadirlo al array leads
    const newLead = {
        id: currentId,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        whatsapp: whatsapp,
        funnel: funnel,  // Añadir funnel
        curso: curso     // Añadir curso
    };

    leads.push(newLead);
    currentId++;  // Incrementar el ID

    // Guardar los leads en el localStorage
    localStorage.setItem('leads', JSON.stringify(leads));

    // Limpiar el formulario
    document.getElementById('addLeadForm').reset();

    // Actualizar la tabla
    updateTable();
});
