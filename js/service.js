// Función para enviar mensajes de WhatsApp
function sendMessage(number) {
    const message = "Hola, te estoy contactando desde nuestro sistema de mensajes.";
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Función para cargar y procesar el archivo CSV
document.getElementById('loadCsvBtn').addEventListener('click', function () {
    const csvFileInput = document.getElementById('csvFileInput').files[0];

    if (csvFileInput) {
        Papa.parse(csvFileInput, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;
                const contactTable = document.getElementById('contactTable');

                // Limpiar la tabla
                contactTable.innerHTML = '';

                // Iterar sobre los datos y agregar filas a la tabla
                data.forEach(contact => {
                    const row = document.createElement('tr');

                    // Crear las celdas de la tabla
                    const nameCell = document.createElement('td');
                    nameCell.textContent = contact.Nombre;

                    const lastNameCell = document.createElement('td');
                    lastNameCell.textContent = contact.Apellido;

                    const whatsappCell = document.createElement('td');
                    whatsappCell.textContent = contact.WhatsApp;

                    const actionCell = document.createElement('td');
                    const sendBtn = document.createElement('button');
                    sendBtn.textContent = 'Enviar WhatsApp';
                    sendBtn.className = 'btn btn-success';
                    sendBtn.onclick = function () {
                        sendMessage(contact.WhatsApp);
                    };
                    actionCell.appendChild(sendBtn);

                    // Agregar celdas a la fila
                    row.appendChild(nameCell);
                    row.appendChild(lastNameCell);
                    row.appendChild(whatsappCell);
                    row.appendChild(actionCell);

                    // Agregar la fila a la tabla
                    contactTable.appendChild(row);
                });
            }
        });
    } else {
        alert('Por favor, selecciona un archivo CSV.');
    }
});
