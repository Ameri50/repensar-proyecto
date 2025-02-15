// Almacenar usuarios
let users = [];
let idBase = 25001; // Código inicial

// Cargar datos cuando la página esté lista
document.addEventListener("DOMContentLoaded", () => {
    loadCSVData(); // Cargar datos de localStorage o predeterminados

    // Escuchar la selección de archivo CSV
    document.getElementById("fileInput").addEventListener("change", handleFileSelect, false);

    // Delegar eventos para editar, eliminar y contactar usuarios
    document.querySelector("#leadsTableBody")?.addEventListener("click", function (event) {
        const id = parseInt(event.target.getAttribute("data-id"));
        
        if (event.target.classList.contains("btn-editar")) editUser(id);
        if (event.target.classList.contains("btn-eliminar")) deleteUser(id);
        if (event.target.classList.contains("whatsapp-btn")) {
            const phone = event.target.getAttribute("data-id");
            if (phone) contactWhatsApp(phone);
        }
    });

    // Manejar el guardado de cambios en el modal de edición
    document.getElementById("saveChangesBtn").addEventListener("click", saveUserChanges);

    // Escuchar entrada de búsqueda
    document.getElementById("searchInput").addEventListener("input", filterUsers);
});

// Filtrar usuarios en la tabla
function filterUsers() {
    let filter = this.value.toLowerCase();
    document.querySelectorAll("#leadsTableBody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
    });
}

// Manejar la subida de archivos CSV o Excel
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (file.name.endsWith(".csv")) {
        reader.onload = (e) => {
            users = parseCSV(e.target.result);
            saveToLocalStorage();
            loadUsers(users);
        };
        reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            users = parseExcel(jsonData);
            saveToLocalStorage();
            loadUsers(users);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("Por favor seleccione un archivo CSV o Excel válido.");
    }
}

// Convertir datos de Excel a array de usuarios
function parseExcel(data) {
    return data.slice(1).map(row => ({
        code: generateCode(),
        firstName: row[0] || "",
        lastName: row[1] || "",
        email: row[2] || "",
        whatsapp: row[3] || "",
        funnel: row[4] || "Funnel process",
        course: row[5] || "Course process"
    }));
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
    if (!tableBody) return; // Evitar error si la tabla no existe

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

// Función para contactar a través de WhatsApp
function contactWhatsApp(whatsapp) {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
}

function editUser(id) {
    id = parseInt(id); // Convertir a número
    const user = users.find(u => u.code === id);
    
    if (user) {
        document.getElementById("nameInput").value = user.firstName;
        document.getElementById("lastnameInput").value = user.lastName;
        document.getElementById("emailInput").value = user.email;
        document.getElementById("whatsappInput").value = user.whatsapp;
        document.getElementById("funnelInput").value = user.funnel;
        document.getElementById("coursesInput").value = user.course;

        // Guardar el ID del usuario en el botón de guardar cambios
        document.getElementById("saveChangesBtn").setAttribute("data-id", id);

        // Abrir el modal de edición
        new bootstrap.Modal(document.getElementById("editModal")).show();
    } else {
        alert("Usuario no encontrado.");
    }
}

// Guardar cambios en el usuario editado
function saveUserChanges() {
    const id = parseInt(document.getElementById("saveChangesBtn").getAttribute("data-id"));
    
    if (isNaN(id)) {
        alert("Error: No se encontró el usuario.");
        return;
    }

    // Buscar usuario en el array
    const userIndex = users.findIndex(u => u.code === id);
    if (userIndex !== -1) {
        // Actualizar datos del usuario
        users[userIndex].firstName = document.getElementById("nameInput").value;
        users[userIndex].lastName = document.getElementById("lastnameInput").value;
        users[userIndex].email = document.getElementById("emailInput").value;
        users[userIndex].whatsapp = document.getElementById("whatsappInput").value;
        users[userIndex].funnel = document.getElementById("funnelInput").value;
        users[userIndex].course = document.getElementById("coursesInput").value;

        // Guardar en localStorage
        saveToLocalStorage();

        // Recargar la tabla con los datos actualizados
        loadUsers(users);

        // Cerrar el modal correctamente
        const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        if (modal) modal.hide();
    } else {
        alert("No se encontró el usuario en la lista.");
    }
}


// Eliminar usuario
function deleteUser(id) {
    users = users.filter(user => user.code !== id);
    saveToLocalStorage();
    loadUsers(users);
}

// Guardar cambios de usuario
// (This function is already defined earlier in the code, so this duplicate definition is removed)
