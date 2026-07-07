const API_URL_LAVADOS = "http://192.168.40.19:3000/lavados";
const API_URL_PRESTAMOS = "http://192.168.40.19:3000/prestamos";

const usuariosAutorizados = {
    "oscar": "123456789",
    "jesus": "123456789",
    "santiago": "123456789"
};

let usuarioLogueado = "";
const mapeoLavadores = {
    "Jesus": "Juan",
    "Santiago": "Pedro"
};

document.addEventListener("DOMContentLoaded", () => {
    // Eventos de botones de sesión
    document.getElementById('btn-ingresar').addEventListener('click', ejecutarLogin);
    document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);
    
    // Acciones de administración
    document.getElementById('btn-registrar').addEventListener('click', registrarLavado);
    document.getElementById('btn-prestamo').addEventListener('click', registrarPrestamo);
    document.getElementById('btn-finalizar').addEventListener('click', finalizarDia);
});

function ejecutarLogin() {
    const usuarioSeleccionado = document.getElementById('login-usuario').value;
    const contrasenaIngresada = document.getElementById('login-password').value;

    if (contrasenaIngresada === usuariosAutorizados[usuarioSeleccionado.toLowerCase()]) {
        usuarioLogueado = usuarioSeleccionado;
        
        // Ocultar pantalla de login y mostrar app principal
        document.getElementById('pantalla-login').classList.add('hidden');
        document.getElementById('app-principal').classList.remove('hidden');
        
        // Colocar nombre en el encabezado
        document.getElementById('nombre-usuario-activo').innerText = usuarioLogueado === "Oscar" ? "Oscar (Administrador)" : `Empleado: ${usuarioLogueado}`;
        
        const vistaEmpleado = document.getElementById('vista-empleado');
        const vistaAdmin = document.getElementById('vista-admin');

        if (usuarioLogueado === "Oscar") {
            vistaEmpleado.classList.add('hidden');
            vistaAdmin.classList.remove('hidden');
        } else {
            vistaEmpleado.classList.remove('hidden');
            vistaAdmin.classList.add('hidden');
        }
        
        // Limpiar el campo de contraseña por seguridad
        document.getElementById('login-password').value = "";
        actualizarPanel();
    } else {
        alert("❌ Contraseña incorrecta. Acceso denegado.");
    }
}

function cerrarSesion() {
    usuarioLogueado = "";
    document.getElementById('app-principal').classList.add('hidden');
    document.getElementById('pantalla-login').classList.remove('hidden');
}

async function registrarLavado() {
    const placa = document.getElementById('placa').value.trim().toUpperCase();
    const valorSeleccionado = parseFloat(document.getElementById('tipo').value);
    const lavador = document.getElementById('lavador').value;
    
    if(!placa) return alert("Por favor, escribe la placa");

    const fechaActual = new Date().toLocaleString(); 

    const nuevoLavado = {
        fecha: fechaActual,
        placa: placa,
        tipo: `Lavado ($${valorSeleccionado.toLocaleString()})`,
        valor: valorSeleccionado,
        lavador: lavador,
        estado: "Abierto"
    };

    try {
        await fetch(API_URL_LAVADOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoLavado)
        });
        
        alert(`Lavado registrado para ${lavador}. Valor: $${valorSeleccionado.toLocaleString()}`);
        document.getElementById('placa').value = ""; 
        actualizarPanel();
    } catch (error) {
        console.error("Error al guardar lavado:", error);
    }
}

async function registrarPrestamo(evento) {
    // EVITA RECARGAR LA PÁGINA: Crucial para que no te eche de la sesión al hacer clic
    if (evento && evento.preventDefault) {
        evento.preventDefault();
    }

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
        
        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }
        
        document.getElementById('monto-prestamo').value = "";
        alert(`Vale de $${monto.toLocaleString()} asignado con éxito a ${lavador}`);
        actualizarPanel();
    } catch (error) {
        console.error("Error al guardar préstamo:", error);
        alert("⚠️ Error de conexión con la base de datos. Verifica que json-server esté corriendo.");
    }
}

async function actualizarPanel() {
    if (!usuarioLogueado) return;
    const lavadorActual = mapeoLavadores[usuarioLogueado] || "Juan";

    try {
        const resLavados = await fetch(API_URL_LAVADOS);
        const lavados = await resLavados.json();

        const resPrestamos = await fetch(API_URL_PRESTAMOS);
        const prestamos = await resPrestamos.json();

        // 1. RENDERS VISTA EMPLEADO
        let filtrados = lavados.filter(l => l.lavador === lavadorActual && l.estado === "Abierto");
        let totalProducido = filtrados.reduce((sum, l) => sum + l.valor, 0);
        let gananciaEmpleado = totalProducido * 0.40;

        let misPrestamos = prestamos.filter(p => p.lavador === lavadorActual);
        let totalMisPrestamos = misPrestamos.reduce((sum, p) => sum + p.monto, 0);

        document.getElementById('total-producido').innerText = `$${totalProducido.toLocaleString()}`;
        document.getElementById('total-ganancia').innerText = `$${gananciaEmpleado.toLocaleString()}`;
        document.getElementById('total-prestamos').innerText = `$${totalMisPrestamos.toLocaleString()}`;

        const tablaBody = document.getElementById('tabla-vehiculos-empleado');
        tablaBody.innerHTML = "";
        filtrados.forEach(l => {
            tablaBody.innerHTML += `
                <tr class="border-b border-gray-800">
                    <td class="py-2 font-mono text-green-400 font-bold">${l.placa}</td>
                    <td class="py-2 text-right font-semibold">$${l.valor.toLocaleString()}</td>
                </tr>
            `;
        });
        if(filtrados.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="2" class="py-4 text-center text-gray-500 italic">No tienes vehículos registrados hoy</td></tr>`;
        }

        const tablaValesBody = document.getElementById('tabla-vales-empleado');
        tablaValesBody.innerHTML = "";
        misPrestamos.forEach(p => {
            tablaValesBody.innerHTML += `
                <tr class="border-b border-gray-800">
                    <td class="py-2 text-gray-400 text-xs">${p.fecha}</td>
                    <td class="py-2 text-right font-semibold text-red-400">$${p.monto.toLocaleString()}</td>
                </tr>
            `;
        });
        if(misPrestamos.length === 0) {
            tablaValesBody.innerHTML = `<tr><td colspan="2" class="py-4 text-center text-gray-500 italic">No registras vales solicitados hoy</td></tr>`;
        }

        // 2. RENDERS VISTA ADMINISTRADOR (GLOBALES)
        let lavadosAbiertosGlobal = lavados.filter(l => l.estado === "Abierto");
        let cajaTotalGeneral = lavadosAbiertosGlobal.reduce((sum, l) => sum + l.valor, 0);
        let nominaTotalGeneral = cajaTotalGeneral * 0.40;

        document.getElementById('admin-caja-total').innerText = `$${cajaTotalGeneral.toLocaleString()}`;
        document.getElementById('admin-nomina-total').innerText = `$${nominaTotalGeneral.toLocaleString()}`;

        const listaEmpleados = ["Juan", "Pedro"]; 
        const contenedorLiquidacion = document.getElementById('lista-liquidacion');
        contenedorLiquidacion.innerHTML = ""; 

        listaEmpleados.forEach(emp => {
            let lavadosEmp = lavados.filter(l => l.lavador === emp && l.estado === "Abierto");
            let totalEmp = lavadosEmp.reduce((sum, l) => sum + l.valor, 0) * 0.40;
            
            let prestamosEmp = prestamos.filter(p => p.lavador === emp);
            let totalPrestamosEmp = prestamosEmp.reduce((sum, p) => sum + p.monto, 0);
            
            let netoAPagar = totalEmp - totalPrestamosEmp;

            contenedorLiquidacion.innerHTML += `
                <div class="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p class="font-bold text-white">${emp} ${emp === 'Juan' ? '(Jesús)' : '(Santiago)'}</p>
                        <p class="text-xs text-gray-400">40%: $${totalEmp.toLocaleString()} | Vales: $${totalPrestamosEmp.toLocaleString()}</p>
                    </div>
                    <span class="text-sm font-bold ${netoAPagar >= 0 ? 'text-green-400' : 'text-red-400'}">
                        Neto: $${netoAPagar.toLocaleString()}
                    </span>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

async function finalizarDia() {
    if(confirm("¿Seguro que deseas finalizar el día? Se archivarán todos los lavados abiertos.")) {
        try {
            const resLavados = await fetch(API_URL_LAVADOS);
            const lavados = await resLavados.json();

            for (let lavado of lavados) {
                if (lavado.estado === "Abierto") {
                    await fetch(`${API_URL_LAVADOS}/${lavado.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ estado: "Finalizado" })
                    });
                }
            }
            alert("Día finalizado con éxito. Caja en ceros para mañana.");
            actualizarPanel();
        } catch (error) {
            console.error("Error al cerrar el día:", error);
        }
    }
}