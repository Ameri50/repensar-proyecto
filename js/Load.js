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
            document.getElementById('filePath').value = file.name;
            readCSVFile(file);
        }
    });
});

function readCSVFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const csvData = event.target.result;
        parseCSV(csvData);
    };
    
    reader.readAsText(file);
}

function parseCSV(csvData) {
    Papa.parse(csvData, {
        complete: function(results) {
            leads = []; 

            results.data.forEach(function(row) {
                if (row.length >= 4) {
                    const lead = new Lead(currentId, row[0], row[1], row[2], row[3]);
                    leads.push(lead);
                    currentId++;
                }
            });
            
            localStorage.setItem("leads", JSON.stringify(leads));
            updateTable();
        },
        header: false
    });
}

function updateTable() {
    const tableBody = document.getElementById('leadTableBody');
    tableBody.innerHTML = ''; 

    leads.forEach(function(lead) {
        const row = document.createElement('tr');
        const message = `Hola%20${lead.nombre}%2C%20te%20contactamos%20desde%20nuestra%20plataforma.%20Por%20favor%2C%20ayúdanos%20respondiendo%20estas%20preguntas%20para%20mejorar%20nuestro%20servicio%3A%0A1.%20%C2%BFC%C3%B3mo%20descubri%C3%B3%20nuestra%20p%C3%A1gina%3F%20%5BRespuesta%5D%0A2.%20%C2%BFQu%C3%A9%20le%20ha%20llamado%20la%20atenci%C3%B3n%20de%20nuestro%20servicio%3F%20%5BRespuesta%5D%0A3.%20%C2%BFCu%C3%A1les%20son%20los%20criterios%20m%C3%A1s%20importantes%20para%20tomar%20su%20decisi%C3%B3n%3F%20%5BRespuesta%5D%0A4.%20%C2%BFPodemos%20agendar%20una%20llamada%20para%20finalizar%20detalles%20y%20proceder%20con%20la%20suscripci%C3%B3n%3F%20%5BRespuesta%5D%0A5.%20%C2%BFCu%C3%A1l%20es%20su%20curso%20de%20inter%C3%A9s%3F%20%5BRespuesta%5D`;
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
                <a href="https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}?text=${message}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm">WhatsApp</a>
                <button class="btn btn-light btn-sm confirmation-button" id="confirmationStatus-${lead.id}" data-id="${lead.id}">En Proceso</button>
            </td>
            <td>${lead.response1 || ''}</td>
            <td>${lead.response2 || ''}</td>
            <td>${lead.response3 || ''}</td>
            <td>${lead.response4 || ''}</td>
            <td>${lead.response5 || ''}</td>
        `;

        tableBody.appendChild(row);
    });
}


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
            backdrop: false
        });
        editModal.show();
    } 
}

document.getElementById('saveChangesBtn').addEventListener('click', function() {
    const leadId = document.getElementById('editLeadId').value;
    const lead = leads.find(lead => lead.id == leadId);

    if (lead) {
        lead.nombre = document.getElementById('editName').value;
        lead.apellido = document.getElementById('editLastName').value;
        lead.correo = document.getElementById('editEmail').value;
        lead.whatsapp = document.getElementById('editWhatsapp').value;
        lead.funnel = document.getElementById('editFunnel').value;
        lead.curso = document.getElementById('editCurso').value;

        localStorage.setItem('leads', JSON.stringify(leads));

        const row = document.querySelector(`button[data-id="${leadId}"]`).parentNode.parentNode;
        row.cells[1].textContent = lead.nombre;
        row.cells[2].textContent = lead.apellido;
        row.cells[3].textContent = lead.correo;
        row.cells[4].textContent = lead.whatsapp;
        row.cells[5].textContent = lead.funnel;
        row.cells[6].textContent = lead.curso;

        const editModal = bootstrap.Modal.getInstance(document.getElementById('editLeadModal'));
        editModal.hide();
    }
});

function deleteLead(leadId) {
    if (confirm('¿Estás seguro de que deseas eliminar este lead?')) {
        leads = leads.filter(lead => lead.id != leadId);
        localStorage.setItem('leads', JSON.stringify(leads));
        updateTable();
    }
}

document.getElementById('addLeadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('newName').value;
    const apellido = document.getElementById('newLastName').value;
    const correo = document.getElementById('newEmail').value;
    const whatsapp = document.getElementById('newWhatsapp').value;
    const funnel = document.getElementById('newFunnel').value;
    const curso = document.getElementById('newCurso').value;

    const newLead = {
        id: currentId,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        whatsapp: whatsapp,
        funnel: funnel,
        curso: curso
    };

    leads.push(newLead);
    currentId++;
    localStorage.setItem('leads', JSON.stringify(leads));
    updateTable();

    document.getElementById('addLeadForm').reset();
});