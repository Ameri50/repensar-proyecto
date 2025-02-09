class Lead {
    constructor(id, nombre, apellido, correo, whatsapp, funnel = "", course = "", Actions = "") {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.whatsapp = whatsapp;
        this.funnel = funnel; // Valor vacío para Funnel
        this.course = course; // Valor vacío para Course
        this.Actions = Actions;
    }
}

// Función para mostrar los resultados de la encuesta
function mostrarResultadosEncuesta(respuestas) {
    const surveyResultsDiv = document.getElementById('surveyResults');
    
    // Limpiar el contenido existente
    surveyResultsDiv.innerHTML = '';

    // Crear y agregar nuevo contenido basado en las respuestas
    const resultsHTML = `
        <p><strong>Nombre:</strong> ${respuestas.nombre}</p>
        <p><strong>Apellido:</strong> ${respuestas.apellido}</p>
        <p><strong>Correo:</strong> ${respuestas.correo}</p>
        <p><strong>WhatsApp:</strong> ${respuestas.whatsapp}</p>
        <p><strong>Funnel:</strong> ${respuestas.funnel}</p>
        <p><strong>Curso:</strong> ${respuestas.curso}</p>
    `;
    
    surveyResultsDiv.innerHTML = resultsHTML;
}

// Simulación de captura de respuestas (ejemplo)
document.getElementById('addLeadForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío real del formulario
    
    // Capturar los valores ingresados por el usuario
    const respuestas = {
        nombre: document.getElementById('newName').value,
        apellido: document.getElementById('newLastName').value,
        correo: document.getElementById('newEmail').value,
        whatsapp: document.getElementById('newWhatsapp').value,
        funnel: document.getElementById('newFunnel').value,
        curso: document.getElementById('newCurso').value
    };

    // Mostrar los resultados de la encuesta en el contenedor
    mostrarResultadosEncuesta(respuestas);
});

