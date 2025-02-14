// Clase Lead
class Lead {
    constructor(id, nombre, apellido, correo, whatsapp, funnel = "", course = "") {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.whatsapp = whatsapp;
        this.funnel = funnel;
        this.course = course;
    }

    // Método para generar una fila HTML para la tabla
    generateTableRow() {
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.nombre}</td>
                <td>${this.apellido}</td>
                <td>${this.correo}</td>
                <td>${this.whatsapp}</td>
                <td class="funnel">${this.funnel}</td>
                <td class="course">${this.course}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editLead(${this.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLead(${this.id})">Eliminar</button>
                    <button class="btn btn-success btn-sm" onclick="contactWhatsApp(${this.whatsapp})">WhatsApp</button>
                </td>
            </tr>
        `;
    }
    
}

// Array para almacenar los leads
const leads = [];

// Función para agregar un nuevo lead
function addLead(e) {
    e.preventDefault(); // Prevenir el envío real del formulario
    
    // Obtener los valores del formulario
    const id = leads.length + 1; // Generar un ID basado en la cantidad de leads
    const nombre = document.getElementById('newName').value;
    const apellido = document.getElementById('newLastName').value;
    const correo = document.getElementById('newEmail').value;
    const whatsapp = document.getElementById('newWhatsapp').value;
    const funnel = document.getElementById('newFunnel').value;
    const course = document.getElementById('newCurso').value;

    // Crear una nueva instancia de Lead
    const newLead = new Lead(id, nombre, apellido, correo, whatsapp, funnel, course);
    
    // Agregar el nuevo lead al array
    leads.push(newLead);

    // Mostrar el lead en la tabla
    displayLeads();

    // Limpiar el formulario
    document.getElementById('addLeadForm').reset();
}

// Función para mostrar los leads en la tabla
function displayLeads() {
    const leadsTableBody = document.getElementById('leadsTableBody');
    
    // Limpiar la tabla antes de agregar los nuevos datos
    leadsTableBody.innerHTML = '';

    // Agregar cada lead a la tabla
    leads.forEach(lead => {
        leadsTableBody.innerHTML += lead.generateTableRow();
    });
}

// Función para eliminar un lead
function deleteLead(id) {
    // Filtrar el lead a eliminar
    const leadIndex = leads.findIndex(lead => lead.id === id);
    if (leadIndex > -1) {
        leads.splice(leadIndex, 1);
    }
    
    // Volver a mostrar la tabla después de eliminar
    displayLeads();
}

// Función para editar un lead (por ahora solo muestra un mensaje)
function editLead(id) {
    alert(`Editar Lead con ID: ${id}`);
}

// Función para contactar a través de WhatsApp
function contactWhatsApp(whatsapp) {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
}

// Escuchar el evento de envío del formulario
document.getElementById('addLeadForm').addEventListener('submit', addLead);
