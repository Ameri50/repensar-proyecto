# Historias de Usuario

## Historia de Usuario: Cargar leads desde un archivo CSV

Como *administrador del sistema*  
Quiero *poder cargar una lista de leads desde un archivo CSV*  
Para *agilizar la incorporación de nuevos usuarios al sistema*.

### Criterios de Aceptación

1. Dado que tengo un archivo CSV con datos de leads (nombre, apellido, correo y WhatsApp),  
   Cuando subo el archivo al sistema,  
   Entonces los datos se cargan correctamente en la tabla de usuarios.
2. Dado que el archivo CSV tiene un formato incorrecto,  
   Cuando intento cargarlo,  
   Entonces el sistema muestra un mensaje de error y no carga los datos.

### Notas Técnicas

- *Componentes necesarios*: Formulario de carga de archivos, validador de CSV, tabla de usuarios.
- *Modelos de datos*: Lead (nombre, apellido, correo, WhatsApp).
- *Interacciones*: Integración con el backend para procesar el archivo CSV.

---

## Historia de Usuario: Enviar mensajes predeterminados en WhatsApp

Como *agente de ventas*  
Quiero *poder enviar mensajes predeterminados a los leads*  
Para *responder rápidamente y personalizar la comunicación*.

### Criterios de Aceptación

1. Dado que selecciono un lead de la lista,  
   Cuando hago clic en "Enviar mensaje",  
   Entonces se abre WhatsApp con un mensaje predeterminado.
2. Dado que el mensaje predeterminado no es adecuado,  
   Cuando edito el mensaje antes de enviarlo,  
   Entonces el mensaje modificado se envía correctamente.

### Notas Técnicas

- *Componentes necesarios*: Botón de envío, integración con la API de WhatsApp, editor de mensajes.
- *Modelos de datos*: PlantillaMensaje (contenido, etapa del Course).
- *Interacciones*: Llamada a la API de WhatsApp para abrir el chat con el mensaje predefinido.

---

## Historia de Usuario: Etiquetar leads según su etapa en el Course

Como *coordinador de ventas*  
Quiero *poder etiquetar a los leads según su etapa en el Course*  
Para *realizar un seguimiento más organizado y efectivo*.

### Criterios de Aceptación

1. Dado que un lead ha sido contactado,  
   Cuando selecciono la opción "Etiquetar como contactado",  
   Entonces el lead se marca con la etiqueta correspondiente.
2. Dado que un lead ha mostrado interés en un curso,  
   Cuando selecciono la opción "Etiquetar por curso",  
   Entonces el lead se asocia con el curso correspondiente.

### Notas Técnicas

- *Componentes necesarios*: Menú de etiquetas, selector de cursos, tabla de usuarios.
- *Modelos de datos*: Etiqueta (nombre, tipo), Curso (nombre, descripción).
- *Interacciones*: Actualización de la base de datos con las etiquetas asignadas.

---

## Historia de Usuario: Ver estadísticas de mensajes enviados

Como *gerente de ventas*  
Quiero *poder ver estadísticas de los mensajes enviados*  
Para *evaluar el desempeño del equipo y tomar decisiones basadas en datos*.

### Criterios de Aceptación

1. Dado que se han enviado mensajes a los leads,  
   Cuando accedo a la página de estadísticas,  
   Entonces veo un gráfico con el número de mensajes enviados y respuestas recibidas.
2. Dado que quiero filtrar los datos por fecha,  
   Cuando selecciono un rango de fechas,  
   Entonces las estadísticas se actualizan para mostrar solo los datos de ese período.

### Notas Técnicas

- *Componentes necesarios*: Gráficos interactivos, filtros de fecha, base de datos de mensajes.
- *Modelos de datos*: Mensaje (fecha, contenido, estado), Respuesta (fecha, contenido).
- *Interacciones*: Consultas a la base de datos para generar reportes en tiempo real.

---

## Historia de Usuario: Crear y editar plantillas de mensajes

Como *administrador del sistema*  
Quiero *poder crear y editar plantillas de mensajes predeterminados*  
Para *adaptar la comunicación a diferentes etapas del Course*.

### Criterios de Aceptación

1. Dado que necesito una nueva plantilla,  
   Cuando ingreso el contenido y selecciono la etapa del Course,  
   Entonces la plantilla se guarda y está disponible para su uso.
2. Dado que una plantilla necesita actualización,  
   Cuando edito su contenido,  
   Entonces los cambios se guardan y se aplican en los próximos envíos.

### Notas Técnicas

- *Componentes necesarios*: Formulario de creación/edición de plantillas, lista de plantillas.
- *Modelos de datos*: PlantillaMensaje (contenido, etapa del Course).
- *Interacciones*: Validación del contenido antes de guardar la plantilla.

---

## Historia de Usuario: Registrar mensajes enviados automáticamente

Como *agente de ventas*  
Quiero *que el sistema registre automáticamente los mensajes enviados*  
Para *tener un historial de las interacciones con cada lead*.

### Criterios de Aceptación

1. Dado que envío un mensaje a un lead,  
   Cuando el mensaje se envía correctamente,  
   Entonces el sistema registra la acción en el historial del lead.
2. Dado que un mensaje no se pudo enviar,  
   Cuando ocurre un error,  
   Entonces el sistema registra el intento fallido y muestra una notificación.

### Notas Técnicas

- *Componentes necesarios*: Registro de mensajes, notificaciones de errores.
- *Modelos de datos*: Mensaje (fecha, contenido, estado).
- *Interacciones*: Llamada a la API de WhatsApp y registro en la base de datos.

---