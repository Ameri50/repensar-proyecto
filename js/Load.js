let idBase = 25001; // Código inicial

// Función para manejar la carga de archivo
function handleFileUpload() {
    let fileInput = document.getElementById('fileInput');
    let file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    let reader = new FileReader();
    
    reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        
        let sheetName = workbook.SheetNames[0]; // Tomar la primera hoja
        let sheet = workbook.Sheets[sheetName];

        let jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log("Datos cargados:", jsonData);

        // Mostrar los datos en la tabla
        mostrarDatosEnTabla(jsonData);
        
        // Crear encabezados de tabla dinámicamente (manteniendo los encabezados fijos)
        crearEncabezados();
    };

    reader.readAsArrayBuffer(file);
}

// Función para crear encabezados de la tabla
function crearEncabezados() {
    let thead = document.querySelector("table thead");
    thead.innerHTML = ""; // Limpiar los encabezados anteriores
    
    // Encabezados fijos
    let headers = ["ID", "Nombre", "Apellido", "Email", "WhatsApp", "Funnel", "Curso", "Acciones"];
    let tr = document.createElement("tr");

    headers.forEach(header => {
        let th = document.createElement("th");
        th.innerText = header; // Asignar el nombre de la columna
        tr.appendChild(th);
    });

    thead.appendChild(tr); // Agregar los encabezados a la tabla
}

// Función para mostrar los datos en la tabla
function mostrarDatosEnTabla(data) {
    let tbody = document.querySelector("table tbody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de agregar datos nuevos

    data.forEach((row, index) => {
        let tr = document.createElement("tr");

        // Agregar el código secuencial
        let tdCode = document.createElement("td");
        tdCode.innerText = idBase + index; // Código incrementado
        tr.appendChild(tdCode);

        // Crear celdas de tabla para cada columna (datos del archivo)
        Object.values(row).forEach((value, i) => {
            let td = document.createElement("td");
            
            // Si es la columna 'Funnel' o 'Curso', agregar botón de edición
            if (i === 5 || i === 6) {
                td.innerHTML = `
                    <span class="data">${value || ""}</span>
                    <input type="text" class="edit-input" value="${value || ""}" style="display: none;">
                    <button class="btn btn-warning btn-sm edit-btn">Editar</button>
                `;
            } else {
                td.innerText = value || ""; // Mostrar vacío si no hay valor
            }

            tr.appendChild(td);
        });

        // Agregar columna de acciones (editar, eliminar, WhatsApp)
        let tdActions = document.createElement("td");
        tdActions.innerHTML = `
            <button class="btn btn-warning btn-sm edit-btn">Editar</button>
            <button class="btn btn-danger btn-sm">Eliminar</button>
            <button class="btn btn-success btn-sm">WhatsApp</button>
        `;
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });

    // Lógica para editar Funnel y Curso
    document.querySelectorAll('.edit-btn').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            let tr = btn.closest('tr');
            let input = tr.querySelector('.edit-input');
            let span = tr.querySelector('.data');

            // Mostrar input de edición y ocultar el texto
            input.style.display = 'inline';
            span.style.display = 'none';

            // Cambiar botón de editar a guardar/cancelar
            btn.innerText = 'Guardar';
            btn.classList.remove('btn-warning');
            btn.classList.add('btn-success');
            
            // Cambiar la acción del botón a 'Guardar'
            btn.addEventListener('click', function() {
                span.innerText = input.value; // Actualizar el valor en la columna
                input.style.display = 'none';
                span.style.display = 'inline';
                btn.innerText = 'Editar';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-warning');
            });
        });
    });
}
