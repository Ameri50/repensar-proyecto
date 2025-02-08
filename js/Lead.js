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
