// Datos de ejemplo si no existen en localStorage
function initializeSampleData() {
    if (!localStorage.getItem('leads')) {
        const sampleLeads = [
            new Lead(1, 'Juan', 'Pérez', 'juan@example.com', '1234567890', 1, 'Marketing Digital'),
            new Lead(2, 'María', 'García', 'maria@example.com', '0987654321', 2, 'Diseño Web'),
            new Lead(3, 'Carlos', 'Rodríguez', 'carlos@example.com', '5555555555', 3, 'SEO'),
            new Lead(4, 'Ana', 'López', 'ana@example.com', '6666666666', 1, 'Desarrollo Web'),
            new Lead(5, 'Juan', 'Pérez', 'juan@example.com', '1234567890', 2, 'Marketing Digital'),
            new Lead(6, 'María', 'García', 'maria@example.com', '0987654321', 2, 'Diseño Web'),
            new Lead(7, 'Carlos', 'Rodríguez', 'carlos@example.com', '5555555555', 4, 'SEO'),
            new Lead(8, 'Ana', 'López', 'ana@example.com', '6666666666', 4, 'Desarrollo Web')
        ];
        localStorage.setItem('leads', JSON.stringify(sampleLeads));
    }

    if (!localStorage.getItem('funnels')) {
        const sampleFunnels = [
            new Funnel(1, 'Awareness', 'Conocimiento inicial'),
            new Funnel(2, 'Interest', 'Interés demostrado'),
            new Funnel(3, 'Consideration', 'Evaluando opciones'),
            new Funnel(4, 'Conversion', 'Listo para comprar')
        ];
        localStorage.setItem('funnels', JSON.stringify(sampleFunnels));
    }
}

// Función para procesar datos y crear gráfico de embudo
function createFunnelChart() {
    initializeSampleData();

    const leads = JSON.parse(localStorage.getItem('leads'));
    const funnels = JSON.parse(localStorage.getItem('funnels'));

    // Contar frecuencia de funnels
    let funnelCounts = funnels.map(f => 
        leads.filter(lead => lead.funnel === f.id).length
    );

    funnelCounts=[17,34,25,19];
    console.log(funnelCounts);

    const ctx = document.getElementById('funnelChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut', // 'bar', 'line', 'pie', 'doughnut'
        data: {
            labels: funnels.map(f => f.descripcion),
            datasets: [{
                data: funnelCounts,
                backgroundColor: [
                    'rgba(15, 15, 15, 0.62)',  // Blue shades
                    'rgba(6, 45, 77, 0.72)',
                    'rgba(112, 180, 235, 0.6)',
                    'rgba(221, 227, 231, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Leads per funnel stage'
                }
            }
        }
    });
}

// Configurar botón de inicio
document.addEventListener('DOMContentLoaded', () => {
    // Crear gráfico
    createFunnelChart();

});