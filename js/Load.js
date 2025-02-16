import { generateCode } from "./global.js";
import { Lead, leads, saveLeads, displayLeads } from "./Lead.js";

// Evento para cargar archivos
document.getElementById("fileInput").addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // Procesar CSV
    if (file.name.endsWith(".csv")) {
        reader.onload = (e) => {
            const csvData = Papa.parse(e.target.result, { header: false }).data;
            processRows(csvData.slice(1)); // Saltar la primera fila (encabezados)
        };
        reader.readAsText(file);

    // Procesar Excel (.xls, .xlsx)
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Primera hoja
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            processRows(jsonData.slice(1)); // Saltar encabezados
        };
        reader.readAsArrayBuffer(file);

    } else {
        alert("Por favor, seleccione un archivo CSV o Excel válido.");
    }
}

// Procesar filas de CSV o Excel y agregar leads
function processRows(rows) {
    rows.forEach(row => {
        if (row.length >= 5) {
            leads.push(new Lead(
                generateCode(),
                row[0] || "",    // Nombre
                row[1] || "",    // Apellido
                row[2] || "",    // Email
                row[3] || "",    // WhatsApp
                row[4] || "Funnel process", // Funnel
                row[5] || "Course process"  // Curso
            ));
        }
    });

    saveLeads();
    displayLeads();
    alert("¡Archivo cargado exitosamente!");
}
