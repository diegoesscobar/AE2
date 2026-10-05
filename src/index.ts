import { Simulador } from './modelos/Simulador.js';
import { Proceso } from './modelos/Proceso.js';

const simulador = new Simulador(1024, 3);

const p1 = new Proceso(1, 250, 6, { ticksCpuParaDisparo: 2, duracionBloqueo: 3 });
const p2 = new Proceso(2, 500, 4);
const p3 = new Proceso(3, 400, 8, { ticksCpuParaDisparo: 3, duracionBloqueo: 2 });

simulador.agregarProceso(p1);
simulador.agregarProceso(p2);
simulador.agregarProceso(p3);

console.log("INICIO DE LA SIMULACIÓN DE PROCESOS Y MEMORIA");

while (
  simulador.colaNuevos.length > 0 ||
  simulador.colaListos.length > 0 ||
  simulador.colaBloqueados.length > 0 ||
  simulador.procesoEjecutando !== null
) {
  simulador.ejecutarTick();

  const ejec = simulador.procesoEjecutando ? `P${simulador.procesoEjecutando.id}` : 'NINGUNO';
  const listos = simulador.colaListos.map(p => `P${p.id}`).join(', ') || 'Vacía';
  const bloq = simulador.colaBloqueados.map(p => `P${p.id}`).join(', ') || 'Vacía';

  console.log(`[Tick ${simulador.reloj}] CPU: ${ejec} | Listos: [${listos}] | Bloqueados: [${bloq}]`);
}

console.log("SIMULACIÓN FINALIZADA CON ÉXITO");