import { describe, it, expect } from 'vitest';
import { Simulador } from '../src/modelos/Simulador.js';
import { Proceso } from '../src/modelos/Proceso.js';
import { EstadoProceso } from '../src/modelos/EstadoProceso.js';

describe("Pruebas para la clase Simulador", () => {
  it("Debe agregar un proceso y asignarle memoria en el primer tick", () => {
    const simulador = new Simulador(1000, 3);
    const proceso = new Proceso(1, 200, 5);

    simulador.agregarProceso(proceso);
    expect(simulador.colaNuevos.length).toBe(1);

    simulador.ejecutarTick();

    expect(simulador.reloj).toBe(1);
    expect(simulador.colaNuevos.length).toBe(0);
    expect(simulador.procesoEjecutando?.id).toBe(1);
    expect(proceso.estado).toBe(EstadoProceso.EJECUTANDO);
  });

  it("Debe alternar procesos por fin de quantum (Round Robin)", () => {
    const simulador = new Simulador(1000, 2);
    const proceso1 = new Proceso(1, 100, 5);
    const proceso2 = new Proceso(2, 100, 5);

    simulador.agregarProceso(proceso1);
    simulador.agregarProceso(proceso2);

    // Tick 1: proceso1 entra a CPU y consume 1 tick de quantum
    simulador.ejecutarTick();
    expect(simulador.procesoEjecutando?.id).toBe(1);

    // Tick 2: proceso1 cumple quantum (2/2) y pasa a LISTO
    simulador.ejecutarTick();
    expect(simulador.procesoEjecutando).toBeNull();
    expect(simulador.colaListos[0]?.id).toBe(2);
    expect(simulador.colaListos[1]?.id).toBe(1);

    // Tick 3: proceso2 toma la CPU
    simulador.ejecutarTick();
    expect(simulador.procesoEjecutando?.id).toBe(2);
  });

  it("Debe bloquear un proceso al cumplir su evento de E/S", () => {
    const simulador = new Simulador(1000, 5);
    const eventoES = { ticksCpuParaDisparo: 1, duracionBloqueo: 2 };
    const proceso1 = new Proceso(1, 100, 5, eventoES);

    simulador.agregarProceso(proceso1);

    // Tick 1: Ejecuta 1 tick, dispara E/S y pasa a BLOQUEADO
    simulador.ejecutarTick();

    expect(simulador.colaBloqueados.length).toBe(1);
    expect(simulador.colaBloqueados[0]?.estado).toBe(EstadoProceso.BLOQUEADO);
  });
});