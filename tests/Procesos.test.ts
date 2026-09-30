import {describe, it, expect} from 'vitest';
import { Proceso } from '../src/modelos/Proceso.js';
import { EstadoProceso } from '../src/modelos/EstadoProceso.js';

describe ("Pruebas para la clase Proceso", () => {
    it("Debe crearse en estado NUEVO y con sus atributos correctos", () => {
        const proceso = new Proceso(1, 256, 10, 2);
    
    expect(proceso.id).toBe(1);
    expect(proceso.tamanioMemoria).toBe(256);
    expect(proceso.tiempoRestante).toBe(10);
    expect(proceso.prioridad).toBe(2);
    expect(proceso.estado).toBe(EstadoProceso.NUEVO);
    });

    it("Debe desocntar tiempo restante al ejecutor un ciclo y no pasar de cero", () => {
        const proceso = new Proceso (2, 128, 3);

        //Ejecutar el quantum en 2
        proceso.ejecutarCiclo(2);
        expect(proceso.tiempoRestante).toBe(1);
        expect(proceso.estaTerminado()).toBe(false);

        //Ejecutar otro quantum de 2; no debe quedar en -1 sino en 0
        proceso.ejecutarCiclo(2);
        expect(proceso.tiempoRestante).toBe(0);
        expect(proceso.estado).toBe(EstadoProceso.TERMINADO);
        expect(proceso.estaTerminado()).toBe(true);
    });
})
