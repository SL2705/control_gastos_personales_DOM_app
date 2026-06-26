// Manipulación del DOM
const DOM = {
    formUsuario: document.getElementById('form-usuario'),
    formGasto: document.getElementById('form-gasto'),
    nombre: document.getElementById('nombre'),
    fechaInicio: document.getElementById('fecha-inicio'),
    saldoInicial: document.getElementById('saldo-inicial'),
    infoUsuario: document.getElementById('info-usuario'),
    usuarioNombre: document.getElementById('usuario-nombre'),
    usuarioFecha: document.getElementById('usuario-fecha'),
    usuarioSaldoInicial: document.getElementById('usuario-saldo-inicial'),
    usuarioSaldoActual: document.getElementById('usuario-saldo-actual'),
    concepto: document.getElementById('concepto'),
    monto: document.getElementById('monto'),
    categoria: document.getElementById('categoria'),
    cuerpoTabla: document.getElementById('cuerpo-tabla'),
    mensaje: document.getElementById('mensaje')
};

// Estado de la aplicación
const estado = {
    usuario: null,
    saldoActual: 0
};

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo = 'success') {
    DOM.mensaje.textContent = texto;
    DOM.mensaje.className = tipo;
    DOM.mensaje.classList.remove('hidden');
    setTimeout(() => {
        DOM.mensaje.classList.add('hidden');
    }, 5000);
}

// Función para cargar datos del usuario
async function cargarUsuario() {
    try {
        const respuesta = await fetch('/api/usuario');
        const usuario = await respuesta.json();
        if (usuario) {
            estado.usuario = usuario;
            estado.saldoActual = usuario.saldoActual;
            mostrarUsuario(usuario);
            cargarGastos();
        }
    } catch (error) {
        console.error('Error al cargar usuario:', error);
    }
}

// Función para mostrar usuario
function mostrarUsuario(usuario) {
    DOM.infoUsuario.classList.remove('hidden');
    DOM.usuarioNombre.textContent = usuario.nombre;
    DOM.usuarioFecha.textContent = new Date(usuario.fechaInicio).toLocaleString();
    DOM.usuarioSaldoInicial.textContent = usuario.saldoInicial.toFixed(2);
    DOM.usuarioSaldoActual.textContent = usuario.saldoActual.toFixed(2);
    DOM.formUsuario.classList.add('hidden');
}

// Función para cargar gastos
async function cargarGastos() {
    try {
        const respuesta = await fetch('/api/gastos');
        const gastos = await respuesta.json();
        renderizarGastos(gastos);
    } catch (error) {
        console.error('Error al cargar gastos:', error);
    }
}

// Función para renderizar gastos en tabla
function renderizarGastos(gastos) {
    DOM.cuerpoTabla.innerHTML = '';
    gastos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    gastos.forEach(gasto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${new Date(gasto.fecha).toLocaleString()}</td>
            <td>${gasto.concepto}</td>
            <td>${gasto.categoria}</td>
            <td>$${gasto.monto.toFixed(2)}</td>
            <td><button class="btn-eliminar" data-id="${gasto.id}">Eliminar</button></td>
        `;
        DOM.cuerpoTabla.appendChild(fila);
    });
    
    // Agregar event listeners a botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarGasto);
    });
}

// Evento para formulario de usuario
DOM.formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre: DOM.nombre.value,
        fechaInicio: DOM.fechaInicio.value,
        saldoInicial: parseFloat(DOM.saldoInicial.value)
    };
    
    try {
        const respuesta = await fetch('/api/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();
        if (resultado.success) {
            estado.usuario = resultado.data;
            estado.saldoActual = resultado.data.saldoActual;
            mostrarUsuario(resultado.data);
            mostrarMensaje('Usuario registrado exitosamente');
        }
    } catch (error) {
        mostrarMensaje('Error al registrar usuario', 'error');
    }
});

// Evento para formulario de gastos
DOM.formGasto.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!estado.usuario) {
        mostrarMensaje('Primero registra tus datos de usuario', 'error');
        return;
    }
    
    const gasto = {
        concepto: DOM.concepto.value,
        monto: parseFloat(DOM.monto.value),
        categoria: DOM.categoria.value
    };
    
    try {
        const respuesta = await fetch('/api/gasto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gasto)
        });
        const resultado = await respuesta.json();
        if (resultado.success) {
            estado.saldoActual = resultado.saldoActual;
            DOM.usuarioSaldoActual.textContent = resultado.saldoActual.toFixed(2);
            cargarGastos();
            DOM.formGasto.reset();
            mostrarMensaje('Gasto registrado exitosamente');
        } else {
            mostrarMensaje(resultado.message, 'error');
        }
    } catch (error) {
        mostrarMensaje('Error al registrar gasto', 'error');
    }
});

// Función para eliminar gasto
async function eliminarGasto(e) {
    const id = e.target.dataset.id;
    try {
        const respuesta = await fetch(`/api/gasto/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();
        if (resultado.success) {
            estado.saldoActual = resultado.saldoActual;
            DOM.usuarioSaldoActual.textContent = resultado.saldoActual.toFixed(2);
            cargarGastos();
            mostrarMensaje('Gasto eliminado exitosamente');
        }
    } catch (error) {
        mostrarMensaje('Error al eliminar gasto', 'error');
    }
}

// Inicializar aplicación
cargarUsuario();