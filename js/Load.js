// Almacenar usuarios
let users = [];
let idBase = 25001; // Código inicial

// Cargar datos cuando la página esté lista
document.addEventListener("DOMContentLoaded", () => {
    loadCSVData(); // Cargar datos de localStorage o predeterminados

    // Escuchar la selección de archivo CSV
    document.getElementById("fileInput").addEventListener("change", handleFileSelect, false);

    // Delegar eventos para editar y eliminar usuarios
    document.querySelector("#leadsTableBody").addEventListener("click", function (event) {
        const id = parseInt(event.target.getAttribute("data-id"));
        if (event.target.classList.contains("btn-editar")) editUser(id);
        if (event.target.classList.contains("btn-eliminar")) deleteUser(id);
    });

    // Manejar el guardado de cambios en el modal de edición
    document.getElementById("saveChangesBtn").addEventListener("click", saveUserChanges);

    // Escuchar entrada de búsqueda
    document.getElementById("searchInput").addEventListener("input", filterUsers);

    // Escuchar el evento del botón de carga de archivo
    document.getElementById('upload-section').addEventListener('click', handleFileUpload);
});

// Filtrar usuarios en la tabla
function filterUsers() {
    let filter = this.value.toLowerCase();
    document.querySelectorAll("#leadsTableBody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
    });
}

// Manejar la subida de archivos CSV
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            users = parseCSV(e.target.result);
            saveToLocalStorage(); // Guardar en localStorage
            loadUsers(users);
        };
        reader.readAsText(file);
    } else {
        alert("Por favor seleccione un archivo CSV válido.");
    }
}

// Convertir texto CSV a array de usuarios
function parseCSV(csvText) {
    return csvText.split("\n").filter(row => row.trim() !== "").map(row => {
        const cols = row.split(",").map(col => col.trim());
        return {
            code: generateCode(),
            firstName: cols[0] || "",
            lastName: cols[1] || "",
            email: cols[2] || "",
            whatsapp: cols[3] || "",
            funnel: cols[4] || "Funnel process",
            course: cols[5] || "Course process"
        };
    });
}

// Generar código secuencial de usuario
function generateCode() {
    let lastCode = localStorage.getItem("lastUserCode");
    let newCode = lastCode ? parseInt(lastCode) + 1 : idBase;
    localStorage.setItem("lastUserCode", newCode);
    return newCode;
}

// Cargar usuarios en la tabla
function loadUsers(users) {
    const tableBody = document.querySelector("#leadsTableBody");
    tableBody.innerHTML = ""; // Limpiar tabla

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.code}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.whatsapp}</td>
            <td class="funnel">
                <span class="data">${user.funnel}</span>
                <input type="text" class="edit-input" value="${user.funnel}" style="display: none;">
            </td>
            <td class="course">
                <span class="data">${user.course}</span>
                <input type="text" class="edit-input" value="${user.course}" style="display: none;">
            </td>
            <td>
                <button class="btn btn-warning btn-sm btn-editar" data-id="${user.code}">Editar</button>
                <button class="btn btn-danger btn-sm btn-eliminar" data-id="${user.code}">Eliminar</button>
                <button class="btn btn-success btn-sm whatsapp-btn" data-id="${user.whatsapp}">WhatsApp</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    habilitarEdicion();
    habilitarEliminar();
}

// Guardar usuarios en localStorage
function saveToLocalStorage() {
    localStorage.setItem("usersData", JSON.stringify(users));
}

// Cargar datos guardados de localStorage
function loadCSVData() {
    const savedUsers = localStorage.getItem("usersData");
    if (savedUsers) {
        users = JSON.parse(savedUsers);
        loadUsers(users);
    }
}

// Habilitar edición en las columnas 'Funnel' y 'Curso'
function habilitarEdicion() {
    document.querySelectorAll('.btn-editar').forEach((btn) => {
        btn.addEventListener('click', function () {
            let tr = btn.closest('tr');
            let inputs = tr.querySelectorAll('.edit-input');
            let spans = tr.querySelectorAll('.data');

            inputs.forEach((input, index) => {
                let span = spans[index];
                if (input.style.display === 'none') {
                    input.style.display = 'inline';
                    span.style.display = 'none';
                    btn.innerText = 'Guardar';
                    btn.classList.remove('btn-warning');
                    btn.classList.add('btn-success');
                } else {
                    span.innerText = input.value;
                    input.style.display = 'none';
                    span.style.display = 'inline';
                    btn.innerText = 'Editar';
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-warning');
                }
            });
        });
    });
}

// Eliminar usuario de la tabla
function habilitarEliminar() {
    document.querySelectorAll('.btn-eliminar').forEach((btn) => {
        btn.addEventListener('click', function () {
            let id = parseInt(btn.getAttribute('data-id'));
            users = users.filter(user => user.code !== id);
            saveToLocalStorage();
            loadUsers(users);
        });
    });
}

// Función para contactar a través de WhatsApp
function contactWhatsApp(whatsapp) {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
}

// Guardar cambios de usuario
function saveUserChanges() {
    const id = parseInt(document.getElementById("saveChangesBtn").getAttribute("data-id"));
    const user = users.find(u => u.code === id);
    if (user) {
        user.firstName = document.getElementById("nameInput").value;
        user.lastName = document.getElementById("lastnameInput").value;
        user.email = document.getElementById("emailInput").value;
        user.whatsapp = document.getElementById("whatsappInput").value;
        user.funnel = document.getElementById("funnelInput").value;
        user.course = document.getElementById("coursesInput").value;

        saveToLocalStorage(); // Guardar cambios
        loadUsers(users);

        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    }
}
