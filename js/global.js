// Función para guardar en localStorage
export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Función para cargar desde localStorage
export function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Función para generar un código único
export function generateCode() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Enviar mensaje a WhatsApp
export function contactWhatsApp(phone, message = "¡Hola! Estoy interesado.") {
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
}
