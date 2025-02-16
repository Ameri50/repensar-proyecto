import { addLead, deleteLead, displayLeads, leads } from "./Lead.js";

// Mostrar los leads al cargar la página
document.addEventListener("DOMContentLoaded", displayLeads);

// Manejar el formulario para agregar leads
const addLeadForm = document.getElementById("addLeadForm");
const saveLeadBtn = document.getElementById("saveLeadBtn");

saveLeadBtn.addEventListener("click", () => {
    addLead(addLeadForm);
});

// Manejar acciones en la tabla (editar, eliminar, WhatsApp)
document.getElementById("leadsTableBody").addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("btn-eliminar")) {
        if (confirm("¿Seguro que deseas eliminar este lead?")) {
            deleteLead(id);
        }
    }

    if (e.target.classList.contains("whatsapp-btn")) {
        const phone = e.target.dataset.phone;
        window.open(`https://wa.me/${phone}`, "_blank");
    }
});
