const API_URL_LAVADOS = "https://6a52f3f278ecba6073e2e7dc.mockapi.io/lavados/carwash/v1/lavados";
const API_URL_PRESTAMOS = "https://6a52f49e78ecba6073e2e803.mockapi.io/prestamos/carwash/v1/prestamos";

// CORREGIDO: Sintaxis limpia con todas sus comas correspondientes
const usuariosAutorizados = {
    "oscar": "123456789",
    "jesus": "123456789",
    "santiago": "123456789",
    "carlos": "123456789",
    "andres": "123456789"
};

let usuarioLogueado = "";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('btn-ingresar').addEventListener('click', ejecutarLogin);
    document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);
    document.getElementById('btn-registrar').addEventListener('click', registrarLavado);
    document.getElementById('btn-prestamo').addEventListener('click', registrarPrestamo);
    document.getElementById('btn-finalizar').addEventListener('click', finalizarDia);
});

function ejecutarLogin() {
    const usuarioSeleccionado = document.getElementById('login-usuario').value;
    const contrasenaIngresada = document.getElementById('login-password').value;

    if (contrasenaIngresada === usuariosAutorizados[usuarioSeleccionado.toLowerCase()]) {
        usuarioLogueado = usuarioSeleccionado;
        
        document.getElementById('pantalla-login').classList.add('hidden');
        document.getElementById('app-principal').classList.remove('hidden');
        
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
    
    if(!placa) return alert("Por favor, escribe la placa.");

    const fechaActual = new Date().toLocaleString(); 

    const nuevoLavado = {
        fecha: fechaActual,
        placa: placa,
        tipo: valorSeleccionado <= 15000 ? "Moto" : "Carro",
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
        
        if (!respuesta.ok) throw new Error(`Error en servidor: ${respuesta.status}`);
        
        alert(`✅ Lavado registrado para ${lavador}. Valor: $${valorSeleccionado.toLocaleString()}`);
        document.getElementById('placa').value = ""; 
        actualizarPanel();
    } catch (error) {
        console.error("Error al guardar lavado:", error);
        alert("❌ No se pudo guardar el lavado. Revisa la conexión de MockAPI.");
    }
}

async function registrarPrestamo(evento) {
    if (evento && evento.preventDefault) evento.preventDefault();

    const monto = parseFloat(document.getElementById('monto-prestamo').value);
    const lavador = document.getElementById('lavador-vale').value;

    if(!monto || monto <= 0) return alert("Escribe un monto válido.");

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
        
        if (!respuesta.ok) throw new Error(`Error del servidor: ${respuesta.status}`);
        
        document.getElementById('monto-prestamo').value = "";
        alert(`💰 Vale de $${monto.toLocaleString()} asignado con éxito a ${lavador}`);
        actualizarPanel();
    } catch (error) {
        console.error("Error al guardar préstamo:", error);
        alert("❌ No se pudo guardar el vale.");
    }
}

async function actualizarPanel() {
    if (!usuarioLogueado) return;
    
    const lavadorActual = usuarioLogueado;

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
                <tr class="border-b border-slate-800 hover:bg-slate-800/30">
                    <td class="py-2.5 font-mono text-cyan-400 font-bold">${l.placa}</td>
                    <td class="py-2.5 text-right font-semibold">$${l.valor.toLocaleString()}</td>
                </tr>
            `;
        });
        if(filtrados.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="2" class="py-4 text-center text-slate-500 italic">No tienes vehículos registrados hoy</td></tr>`;
        }

        const tablaValesBody = document.getElementById('tabla-vales-empleado');
        tablaValesBody.innerHTML = "";
        misPrestamos.forEach(p => {
            const horaSimplificada = p.fecha.split(' ')[1] || p.fecha;
            tablaValesBody.innerHTML += `
                <tr class="border-b border-slate-800 hover:bg-slate-800/30">
                    <td class="py-2.5 text-slate-400 text-xs">${horaSimplificada}</td>
                    <td class="py-2.5 text-right font-semibold text-rose-400">-$${p.monto.toLocaleString()}</td>
                </tr>
            `;
        });
        if(misPrestamos.length === 0) {
            tablaValesBody.innerHTML = `<tr><td colspan="2" class="py-4 text-center text-slate-500 italic">No registras vales hoy</td></tr>`;
        }

        // 2. RENDERS VISTA ADMINISTRADOR (GLOBALES)
        let lavadosAbiertosGlobal = lavados.filter(l => l.estado === "Abierto");
        let cajaTotalGeneral = lavadosAbiertosGlobal.reduce((sum, l) => sum + l.valor, 0);
        let nominaTotalGeneral = cajaTotalGeneral * 0.40;

        document.getElementById('admin-caja-total').innerText = `$${cajaTotalGeneral.toLocaleString()}`;
        document.getElementById('admin-nomina-total').innerText = `$${nominaTotalGeneral.toLocaleString()}`;

        // CORREGIDO: Lista extendida para incluir a los nuevos muchachos
        const listaEmpleados = ["Jesus", "Santiago", "Carlos", "Andres"]; 
        const contenedorLiquidacion = document.getElementById('lista-liquidacion');
        contenedorLiquidacion.innerHTML = ""; 

        listaEmpleados.forEach(emp => {
            let lavadosEmp = lavados.filter(l => l.lavador === emp && l.estado === "Abierto");
            let totalEmp = lavadosEmp.reduce((sum, l) => sum + l.valor, 0) * 0.40;
            
            let prestamosEmp = prestamos.filter(p => p.lavador === emp);
            let totalPrestamosEmp = prestamosEmp.reduce((sum, p) => sum + p.monto, 0);
            
            let netoAPagar = totalEmp - totalPrestamosEmp;

            contenedorLiquidacion.innerHTML += `
                <div class="bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
                    <div>
                        <p class="font-bold text-white">${emp}</p>
                        <p class="text-xs text-slate-400">40%: $${totalEmp.toLocaleString()} | Vales: $${totalPrestamosEmp.toLocaleString()}</p>
                    </div>
                    <span class="text-sm font-black ${netoAPagar >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                        $${netoAPagar.toLocaleString()}
                    </span>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

async function finalizarDia() {
    if(confirm("¿Seguro que deseas finalizar el día? Se cerrarán todos los lavados abiertos.")) {
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
            alert("🔒 Caja y día finalizados con éxito.");
            actualizarPanel();
        } catch (error) {
            console.error("Error al cerrar el día:", error);
        }
    }
}
