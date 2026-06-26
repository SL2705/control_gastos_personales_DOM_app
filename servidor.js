const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Archivo de datos
const ARCHIVO_DATOS = path.join(__dirname, 'datos', 'gastos.json');

// Función para leer datos
function leerDatos() {
    try {
        const data = fs.readFileSync(ARCHIVO_DATOS, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { usuario: null, gastos: [] };
    }
}

// Función para escribir datos
function escribirDatos(datos) {
    fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(datos, null, 2));
}

// Endpoints
app.post('/api/usuario', (req, res) => {
    const datos = leerDatos();
    const { nombre, fechaInicio, saldoInicial } = req.body;
    datos.usuario = { nombre, fechaInicio, saldoInicial, saldoActual: saldoInicial };
    escribirDatos(datos);
    res.json({ success: true, data: datos.usuario });
});

app.get('/api/usuario', (req, res) => {
    const datos = leerDatos();
    res.json(datos.usuario);
});

app.post('/api/gasto', (req, res) => {
    const datos = leerDatos();
    const { concepto, monto, categoria } = req.body;
    
    if (!datos.usuario) {
        return res.status(400).json({ success: false, message: 'No hay usuario registrado' });
    }
    
    if (datos.usuario.saldoActual < monto) {
        return res.status(400).json({ success: false, message: 'Saldo insuficiente' });
    }
    
    const nuevoGasto = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        concepto,
        monto,
        categoria
    };
    
    datos.gastos.push(nuevoGasto);
    datos.usuario.saldoActual -= monto;
    escribirDatos(datos);
    res.json({ success: true, data: nuevoGasto, saldoActual: datos.usuario.saldoActual });
});

app.get('/api/gastos', (req, res) => {
    const datos = leerDatos();
    res.json(datos.gastos);
});

app.delete('/api/gasto/:id', (req, res) => {
    const datos = leerDatos();
    const id = parseInt(req.params.id);
    const gastoIndex = datos.gastos.findIndex(g => g.id === id);
    
    if (gastoIndex === -1) {
        return res.status(404).json({ success: false, message: 'Gasto no encontrado' });
    }
    
    const gastoEliminado = datos.gastos.splice(gastoIndex, 1)[0];
    datos.usuario.saldoActual += gastoEliminado.monto;
    escribirDatos(datos);
    res.json({ success: true, saldoActual: datos.usuario.saldoActual });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});