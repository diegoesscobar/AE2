import { describe, it, expect } from 'vitest';
import { Proceso } from '../src/modelos/Proceso.js';
import { EstadoProceso } from '../src/modelos/EstadoProceso.js';

describe("Pruebas para la clase Proceso", () => {
  it("Debe crear un proceso con estado inicial NUEVO y contadores correctos", () => {
    const proceso = new Proceso(1, 200, 10);

    expect(proceso.id).toBe(1);
    expect(proceso.tamanioMemoria).toBe(200);
    expect(proceso.tiempoCpuTotal).toBe(10);
    expect(proceso.tiempoCpuRestante).toBe(10);
    expect(proceso.estado).toBe(EstadoProceso.NUEVO);
    expect(proceso.quantumConsumido).toBe(0);
    expect(proceso.estaTerminado()).toBe(false);
  });

  it("Debe permitir asignar un evento de E/S opcional", () => {
    const evento = { ticksCpuParaDisparo: 3, duracionBloqueo: 5 };
    const proceso = new Proceso(2, 100, 8, evento);

    expect(proceso.eventoES).toEqual(evento);
    expect(proceso.tiempoBloqueRestante).toBe(0);
  });
});