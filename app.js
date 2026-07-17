<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚡ Lavadero Express - Panel de Control</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 flex flex-col justify-center items-center backdrop-burbujas">

    <div id="pantalla-login" class="w-full max-w-md bg-slate-900/90 p-6 rounded-2xl shadow-2xl space-y-6 border border-cyan-500/30 card-modulo">
        <div class="text-center space-y-2">
            <div class="inline-flex p-3 bg-cyan-500/10 rounded-full text-cyan-400 mb-2 animate-bounce">
                💧
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Lavadero Express
            </h1>
            <p class="text-sm text-slate-400">Selecciona tu perfil para ingresar al sistema</p>
        </div>

        <div class="space-y-4">
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Usuario</label>
                <select id="login-usuario" class="w-full bg-slate-950 text-slate-100 p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors">
                    <option value="Oscar">Oscar (Administrador)</option>
                    <option value="Jesus">Jesus</option>
                    <option value="Santiago">Santiago</option>
                    <option value="Andres">Andres</option>
                    <option value="Carlos">Carlos</option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Contraseña</label>
                <input id="login-password" type="password" placeholder="••••••••" class="w-full bg-slate-950 text-slate-100 p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors font-mono">
            </div>

            <button id="btn-ingresar" class="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 font-bold text-slate-950 rounded-lg transition-transform active:scale-95 shadow-lg shadow-cyan-500/20">
                Ingresar al Sistema
            </button>
        </div>
    </div>

    <div id="app-principal" class="w-full max-w-md hidden space-y-5 animate-fade-in">
        
        <header class="flex justify-between items-center bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div>
                <h3 id="nombre-usuario-activo" class="font-bold text-white text-base">Cargando...</h3>
                <p class="text-xs text-slate-400">Sesión Activa</p>
            </div>
            <button id="btn-cerrar-sesion" class="px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-md transition-colors border border-rose-500/20">
                Salir
            </button>
        </header>

        <main id="vista-empleado" class="space-y-5 hidden">
            <section class="grid grid-cols-3 gap-3">
                <div class="bg-slate-900/90 p-3 rounded-xl text-center border border-slate-800">
                    <p class="text-[10px] uppercase font-bold text-slate-500">Producido</p>
                    <p id="total-producido" class="text-sm font-black text-white">$0</p>
                </div>
                <div class="bg-emerald-500/5 p-3 rounded-xl text-center border border-emerald-500/10">
                    <p class="text-[10px] uppercase font-bold text-emerald-500">Mi Ganancia (40%)</p>
                    <p id="total-ganancia" class="text-sm font-black text-emerald-400">$0</p>
                </div>
                <div class="bg-rose-500/5 p-3 rounded-xl text-center border border-rose-500/10">
                    <p class="text-[10px] uppercase font-bold text-rose-500">Vales</p>
                    <p id="total-prestamos" class="text-sm font-black text-rose-400">$0</p>
                </div>
            </section>

            <section class="card-modulo bg-slate-900/90 p-5 rounded-xl shadow-md space-y-4 border border-slate-800">
                <h2 class="text-lg font-bold text-slate-200">🚗 Registrar Nuevo Lavado</h2>
                <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Vehículo / Tipo</label>
                            <select id="tipo" class="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-sm focus:outline-none">
                                <option value="15000">🏍️ Moto - $15.000</option>
                                <option value="25000">🚗 Carro - $25.000</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Placa</label>
                            <input id="placa" type="text" placeholder="ABC-123" class="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-sm font-mono focus:outline-none text-center font-bold">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Empleado Lavador</label>
                        <select id="lavador" class="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-sm focus:outline-none">
                            <option value="Jesus">Jesus</option>
                            <option value="Santiago">Santiago</option>
                            <option value="Andres">Andres</option>
                            <option value="Carlos">Carlos</option>
                        </select>
                    </div>
                    <button id="btn-registrar" class="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 font-bold text-slate-950 rounded-lg transition-transform active:scale-95 text-sm">
                        Registrar Lavado
                    </button>
                </div>
            </section>

            <section class="grid grid-cols-2 gap-3">
                <div class="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                    <h3 class="text-xs font-bold uppercase text-slate-400 mb-2">Vehículos Hoy</h3>
                    <div class="max-h-40 overflow-y-auto">
                        <table class="w-full text-xs">
                            <tbody id="tabla-vehiculos-empleado"></tbody>
                        </table>
                    </div>
                </div>
                <div class="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                    <h3 class="text-xs font-bold uppercase text-slate-400 mb-2">Vales Pedidos</h3>
                    <div class="max-h-40 overflow-y-auto">
                        <table class="w-full text-xs">
                            <tbody id="tabla-vales-empleado"></tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>

        <main id="vista-admin" class="space-y-5 hidden">
            <section class="card-modulo bg-slate-900/90 p-5 rounded-xl shadow-md space-y-4 border border-slate-800">
                <h2 class="text-lg font-bold text-slate-200">💰 Registrar Vale de Dinero</h2>
                <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Lavador</label>
                            <select id="lavador-vale" class="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-sm focus:outline-none">
                                <option value="Jesus">Jesus</option>
                                <option value="Santiago">Santiago</option>
                                <option value="Andres">Andres</option>
                                <option value="Carlos">Carlos</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Monto ($)</label>
                            <input id="monto-prestamo" type="number" placeholder="5000" class="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-sm focus:outline-none font-bold">
                        </div>
                    </div>
                    <button id="btn-prestamo" class="w-full py-2.5 bg-rose-500 hover:bg-rose-400 font-bold text-slate-950 rounded-lg transition-transform active:scale-95 text-sm">
                        Asignar Vale
                    </button>
                </div>
            </section>

            <section class="card-modulo bg-slate-900/90 p-5 rounded-xl shadow-md space-y-4 border border-slate-800">
                <h2 class="text-lg font-bold text-slate-200 flex items-center gap-2">
                    🏦 Caja General
                </h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-800/50 p-4 rounded-lg text-center border border-slate-700/50">
                        <p class="text-xs text-slate-400">Recaudo Bruto</p>
                        <p id="admin-caja-total" class="text-xl font-black text-white">$0</p>
                    </div>
                    <div class="bg-emerald-500/5 p-4 rounded-lg text-center border border-emerald-500/10">
                        <p class="text-xs text-emerald-400">Total Nómina (40%)</p>
                        <p id="admin-nomina-total" class="text-xl font-black text-emerald-400">$0</p>
                    </div>
                </div>
            </section>

            <section class="card-modulo bg-slate-900/80 p-5 rounded-xl shadow-md space-y-3 border border-slate-800">
                <h2 class="text-lg font-bold text-slate-200">👥 Liquidación del Personal</h2>
                <div id="lista-liquidacion" class="space-y-2"></div>
            </section>

            <button id="btn-finalizar" class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 py-3 rounded-lg text-slate-950 font-extrabold transition-transform active:scale-95 text-sm uppercase tracking-wide">
                🔒 Finalizar y Cerrar Caja de Hoy
            </button>
        </main>
    </div>

    <script src="app.js"></script>
</body>
</html>
