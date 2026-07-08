// URLs reales de MockAPI
const API_URL_LAVADOS = "https://6a4886c6a033dcb98d64a1f0.mockapi.io/lavados"; 
const API_URL_PRESTAMOS = "https://6a4887b3a033dcb98d64a283.mockapi.io/prestamos"; 

// Base de datos de usuarios
const usuariosAutorizados = {
    "oscar": "123456789",
    "jesus": "123456789",
    "santiago": "123456789"
};

let usuarioLogueado = "";

document.addEventListener("DOMContentLoaded", () => {
    // Escuchar los botones
    document.getElementById('btn-ingresar').addEventListener('click', ejecutarLogin);
    document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);
    document.getElementById('btn-registrar').addEventListener('click', registrarLavado);
    document.getElementById('btn-prestamo').addEventListener('click', registrarPrestamo);
    document.getElementById('btn-finalizar').addEventListener('click', finalizarDia);
});

function ejecutarLogin() {
    const usuarioIngresado = document.getElementById('login-usuario').value.trim().toLowerCase();
    const contrasenaIngresada = document.getElementById('login-password').value.trim();

    if (usuariosAutorizados[usuarioIngresado] && usuariosAutorizados[usuarioIngresado] === contrasenaIngresada) {
        usuarioLogueado = usuarioIngresado;
        
        document.getElementById('pantalla-login').classList.add('hidden');
        document.getElementById('app-principal').classList.remove('hidden');
        
        const nombreMostrar = usuarioLogueado.charAt(0).toUpperCase() + usuarioLogueado.slice(1);
        document.getElementById('nombre-usuario-activo').innerText = usuarioLogueado === "oscar" ? "Oscar (Admin)" : `Empleado: ${nombreMostrar}`;
        
        const vistaEmpleado = document.getElementById('vista-empleado');
        const vistaAdmin = document.getElementById('vista-admin');

        if (usuarioLogueado === "oscar") {
            vistaEmpleado.classList.add('hidden');
            vistaAdmin.classList.remove('hidden');
        } else {
            vistaEmpleado.classList.remove('hidden');
            vistaAdmin.classList.add('hidden');
            
            // Auto-seleccionar al lavador en el menú desplegable si es empleado
            const lavadorSelect = document.getElementById('lavador');
            lavadorSelect.value = usuarioLogueado === "jesus" ? "Juan" : "Pedro";
            lavadorSelect.disabled = true; // Para que no registre a nombre del otro
        }
        
        document.getElementById('login-password').value = "";
        actualizarPanel();
    } else {
        alert("❌ Usuario o contraseña incorrectos.");
    }
}

function cerrarSesion() {
    usuarioLogueado = "";
    document.getElementById('app-principal').classList.add('hidden');
    document.getElementById('pantalla-login').classList.remove('hidden');
    document.getElementById('login-usuario').value = "";
}

async function registrarLavado() {
    const placa = document.getElementById('placa').value.trim().toUpperCase();
    const valorSeleccionado = parseFloat(document.getElementById('tipo').value);
    const lavador = document.getElementById('lavador').value;
    
    if(!placa) return alert("Por favor, escribe la placa");

    const nuevoLavado = {
        fecha: new Date().toLocaleString(),
        placa: placa,
        tipo: `Lavado ($${valorSeleccionado.toLocaleString()})`,
        valor: valorSeleccionado,
        lavador: lavador,
        estado: "Abierto"
    };

    try {
        const respuesta = await fetch(API_URL_LAVADOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoLavado)
        });
        
        if (!respuesta.ok) throw new Error("Fallo al guardar en internet");
        
        alert("✅ Lavado guardado correctamente");
        document.getElementById('placa').value = ""; 
        actualizarPanel();
    } catch (error) {
        alert("❌ Error: Verifica tu conexión a internet o la configuración de MockAPI.");
    }
}

async function registrarPrestamo() {
    const monto = parseFloat(document.getElementById('monto-prestamo').value);
    const lavador = document.getElementById('lavador').value;

    if(!monto || monto <= 0) return alert("Escribe un monto válido");

    const nuevoPrestamo = {
        fecha: new Date().toLocaleString(),
        lavador: lavador,
        monto: monto
    };

    try {
        const respuesta = await fetch(API_URL_PRESTAMOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPrestamo)
        });
        
        if (!respuesta.ok) throw new Error("Fallo al guardar en internet");
        
        alert("✅ Vale guardado correctamente");
        document.getElementById('monto-prestamo').value = "";
        actualizarPanel();
    } catch (error) {
        alert("❌ Error al guardar el vale.");
    }
}

async function actualizarPanel() {
    if (!usuarioLogueado) return;
    
    const lavadorReal = usuarioLogueado === "jesus" ? "Juan" : (usuarioLogueado === "santiago" ? "Pedro" : null);

    try {
        const [resLavados, resPrestamos] = await Promise.all([
            fetch(API_URL_LAVADOS),
            fetch(API_URL_PRESTAMOS)
        ]);
        
        const lavados = await resLavados.json();
        const prestamos = await resPrestamos.json();

        if (usuarioLogueado !== "oscar") {
            // VISTA EMPLEADO
            const misLavados = Array.isArray(lavados) ? lavados.filter(l => l.lavador === lavadorReal && l.estado === "Abierto") : [];
            const misVales = Array.isArray(
