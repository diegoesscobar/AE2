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

  it('Debe reinstanciar y verificar propiedades básicas del simulador', () => {
    const simulador = new Simulador(512, 1);
    expect(simulador).toBeDefined();
    expect(simulador.reloj).toBe(0);
    expect(simulador.colaNuevos.length).toBe(0);
  });

  it('Debe ejecutar ticks consecutivos sin procesos sin fallar', () => {
    const simulador = new Simulador(1024, 2);
    simulador.ejecutarTick();
    simulador.ejecutarTick();
    expect(simulador.reloj).toBe(2);
  });
  describe('Pruebas para alcanzar 95%+ de cobertura en Simulador', () => {
  it('Debe completar el ciclo de vida de un proceso (CPU -> Finalizado) y liberar memoria', () => {
    const simulador = new Simulador(1024, 5);
    const proceso = new Proceso(10, 200, 2); // Proceso corto de 2 ticks
    simulador.agregarProceso(proceso);

    // Tick 1: Entra a CPU
    simulador.ejecutarTick();
    expect(simulador.procesoEjecutando?.id).toBe(10);

    // Tick 2: Termina ejecucion y libera memoria
    simulador.ejecutarTick();
    expect(simulador.procesoEjecutando).toBeNull();
  });

 it('Debe procesar la salida de la cola de bloqueados sin fallar', () => {
    const simulador = new Simulador(1024, 5);
    const eventoES = { ticksCpuParaDisparo: 1, duracionBloqueo: 1 };
    const proceso = new Proceso(20, 100, 4, eventoES);

    simulador.agregarProceso(proceso);

    // Tick 1: Pasa a CPU, dispara E/S y entra a colaBloqueados
    simulador.ejecutarTick();
    expect(simulador.colaBloqueados.length).toBe(1);

    // Tick 2: Se procesa el desbloqueo
    simulador.ejecutarTick();
    expect(simulador.colaBloqueados.length).toBe(0);
  });
  it("Debe mantener un proceso en colaNuevos si no hay suficiente memoria disponible", () => {
    const simulador = new Simulador(300, 2); // Solo 300 de memoria total
    const procesoGrande1 = new Proceso(1, 200, 5);
    const procesoGrande2 = new Proceso(2, 200, 5); // 200 + 200 = 400 > 300

    simulador.agregarProceso(procesoGrande1);
    simulador.agregarProceso(procesoGrande2);

    // Tick 1: Se asigna memoria al proceso 1, pero el proceso 2 no entra y queda en colaNuevos
    simulador.ejecutarTick();

    expect(simulador.procesoEjecutando?.id).toBe(1);
    expect(simulador.colaNuevos.length).toBe(1);
    expect(simulador.colaNuevos[0]?.id).toBe(2);
  });

  it("Debe liberar memoria y admitir el proceso en colaNuevos cuando termina el primero", () => {
    const simulador = new Simulador(300, 2);
    const proceso1 = new Proceso(1, 200, 2); // Dura solo 2 ticks
    const proceso2 = new Proceso(2, 200, 3);

    simulador.agregarProceso(proceso1);
    simulador.agregarProceso(proceso2);

    simulador.ejecutarTick(); // Tick 1: Proceso 1 en CPU
    simulador.ejecutarTick(); // Tick 2: Proceso 1 termina y libera memoria

    // Tick 3: Proceso 2 debe pasar de colaNuevos a CPU
    simulador.ejecutarTick();

    expect(simulador.procesoEjecutando?.id).toBe(2);
    expect(simulador.colaNuevos.length).toBe(0);
  });
  it("Debe reencolar en colaListos a un proceso que agota su quantum sin terminar de ejecutar", () => {
    const simulador = new Simulador(1000, 2); // Quantum = 2
    const procesoLargo = new Proceso(100, 200, 6); // Requiere 6 ticks

    simulador.agregarProceso(procesoLargo);

    simulador.ejecutarTick(); // Tick 1: Ejecuta 1/2 quantum
    simulador.ejecutarTick(); // Tick 2: Agota quantum, debe rotar

    expect(simulador.procesoEjecutando).toBeNull();
    expect(simulador.colaListos.length).toBe(1);
    expect(simulador.colaListos[0]?.id).toBe(100);
  });

  it("Debe mantener el orden FIFO en la colaListos al recibir multiples procesos", () => {
    const simulador = new Simulador(1000, 5);
    const p1 = new Proceso(1, 100, 3);
    const p2 = new Proceso(2, 100, 3);

    simulador.agregarProceso(p1);
    simulador.agregarProceso(p2);

    // Al ejecutarse el primer tick, p1 va a CPU y p2 debe estar primero en colaListos
    simulador.ejecutarTick();

    expect(simulador.procesoEjecutando?.id).toBe(1);
    expect(simulador.colaListos[0]?.id).toBe(2);
  });
  it("Debe avanzar el reloj del simulador aunque la cola de nuevos este vacia", () => {
    const simulador = new Simulador(1024, 3);
    // Ejecutamos ticks sin agregar ningun proceso
    // Esto deja sin ejecutar todas las ramas de asignacion de memoria y planificacion
    simulador.ejecutarTick();
    simulador.ejecutarTick();

    expect(simulador.reloj).toBe(2);
    expect(simulador.procesoEjecutando).toBeNull();
  });

  it("Debe mantener el estado inicial sin alteraciones si no se ejecutan ticks", () => {
    const simulador = new Simulador(512, 2);
    const proceso = new Proceso(99, 100, 4);

    simulador.agregarProceso(proceso);

    // Solo se agrega pero NO se llama a ejecutarTick()
    // Esto deja sin cubrir la logica de paso de NUEVO a EJECUTANDO/LISTO
    expect(simulador.reloj).toBe(0);
    expect(simulador.colaNuevos.length).toBe(1);
    expect(simulador.procesoEjecutando).toBeNull();
  });
});
