# Control de Gastos Personales

Aplicación web profesional para el registro y control de gastos personales, con validación de saldo y almacenamiento en servidor local.

## Descripción

La aplicación permite a los usuarios registrar y controlar sus gastos personales mediante un sistema que valida el saldo disponible. Los usuarios pueden ingresar su nombre, fecha/hora de inicio y saldo inicial, luego registrar gastos que se muestran en una tabla interactiva. El sistema verifica automáticamente si el gasto excede el saldo disponible y muestra mensajes de error cuando corresponda.

## Características

- Registro de datos del usuario (nombre, fecha/hora inicio, saldo inicial)
- Registro de gastos con concepto, monto y categoría
- Validación automática de saldo disponible
- Visualización de gastos en tabla ordenada cronológicamente
- Actualización dinámica del saldo restante
- Mensajes de confirmación y error
- Diseño minimalista con colores profesionales
- Interfaz responsiva
- Almacenamiento persistente en servidor local
- Intercambio asíncrono de datos (AJAX/Fetch)

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js con Express
- pnpm (gestor de paquetes)
- JSON para almacenamiento

## Funcionamiento

1. El usuario ingresa su nombre, fecha/hora de inicio y saldo inicial
2. El sistema guarda los datos del usuario en el servidor
3. El usuario registra gastos con concepto, monto y categoría
4. El sistema verifica si el gasto excede el saldo disponible
5. Si hay saldo suficiente, el gasto se registra y se actualiza la tabla
6. Si el gasto excede el saldo, se muestra un mensaje de error
7. Los gastos se muestran en orden cronológico descendente
8. El saldo restante se actualiza automáticamente

## Manipulación del DOM

La aplicación utiliza las siguientes técnicas de manipulación del DOM:

- **Selección**: `document.getElementById()`, `document.querySelector()`
- **Creación**: `document.createElement()`, `document.createTextNode()`
- **Inserción**: `appendChild()`, `insertBefore()`
- **Eliminación**: `removeChild()`, `remove()`
- **Actualización**: `textContent`, `innerHTML`, `value`
- **Modificación**: `classList.add()`, `classList.remove()`, `style`
- **Eventos**: `addEventListener()` para submit, click, change
- **Fetch API**: Para comunicación asíncrona con el servidor

## Autor

Victorino Triana Leonardo Antonio
