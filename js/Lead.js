import { saveToLocalStorage, loadFromLocalStorage, generateCode } from "./global.js";

// Clase Lead
export class Lead {
    constructor(id, firstName, lastName, email, whatsapp, funnel = "Funnel process", course = "Course process") {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.whatsapp = whatsapp;
        this.funnel = funnel;
        this.course = course;
    }

    // Generar fila de la tabla
    generateTableRow() {
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.firstName}</td>
                <td>${this.lastName}</td>
                <td>${this.email}</td>
                <td>${this.whatsapp}</td>
                <td>${this.funnel}</td>
                <td>${this.course}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar" data-id="${this.id}">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${this.id}">Eliminar</button>
                    <button class="btn btn-success btn-sm whatsapp-btn" data-phone="${this.whatsapp}">WhatsApp</button>
                </td>
            </tr>
        `;
    }
}

// Cargar leads desde localStorage
export let leads = loadFromLocalStorage("leads");

// Guardar leads en localStorage
export function saveLeads() {
    saveToLocalStorage("leads", leads);
}

// Mostrar los leads en la tabla
export function displayLeads() {
    const tableBody = document.getElementById("leadsTableBody");
    tableBody.innerHTML = leads.map(lead => new Lead(
        lead.id, lead.firstName, lead.lastName, lead.email, lead.whatsapp, lead.funnel, lead.course
    ).generateTableRow()).join("");
}

// Agregar un nuevo lead
export function addLead(form) {
    const newLead = new Lead(
        generateCode(),
        form.newName.value,
        form.newLastName.value,
        form.newEmail.value,
        form.newWhatsapp.value,
        form.newFunnel.value,
        form.newCurso.value
    );

    leads.push(newLead);
    saveLeads();
    displayLeads();
    form.reset();
}

// Eliminar un lead por ID
export function deleteLead(id) {
    const index = leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
        leads.splice(index, 1);
        saveLeads();
        displayLeads();
    }
}
