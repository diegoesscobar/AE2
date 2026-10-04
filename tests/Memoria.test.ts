import {describe, it, expect, beforeEach } from 'vitest';
import { Memoria } from '../src/modelos/Memoria.js';
import { Proceso } from '../src/modelos/Proceso.js';

describe("Pruebas para la clase Memoria", () => {
    let memoria: Memoria;

    beforeEach(() => {
        //Inicializamos una memoria limpia de 1024 KB antes de cada tests
        memoria = new Memoria(1024);
    });
    
    it("Debe asignar un proceso y dividir la memoria (particionado dinamico)", () => {
        const proceso = new Proceso(1, 200,10);
        const resultado = memoria.asignarProceso(proceso);

        expect(resultado).toBe(true);
        expect(memoria.bloques.length).toBe(2); //Se debe dividir en 2 bloques

        //Primer bloque: Ocupado por el proceso 200 KB
        expect(memoria.bloques[0]!.proceso).toBe(proceso);
        expect(memoria.bloques[0]!.tamanio).toBe(200);
        expect(memoria.bloques[0]!.estaLibre()).toBe(false);

        //Segundo bloque: Libre con los 820 KB restantes
        expect(memoria.bloques[1]!.direccionInicio).toBe(200);
        expect(memoria.bloques[1]!.tamanio).toBe(824);
        expect(memoria.bloques[1]!.estaLibre()).toBe(true);
    });

    it("Debe retornar false si el proceso excede la memoria disponible", () => {
        const procesoGrande = new Proceso(2, 2048, 10);
        const resultado = memoria.asignarProceso(procesoGrande);

        expect(resultado).toBe(false);
        expect(memoria.bloques.length).toBe(1); //No se debe dividir la memoria
    });

    it("Debe liberar un proceso y consolidar bloques libres contiguos", () => {
        const proceso1 = new Proceso(1, 200, 10);
        const proceso2 = new Proceso(2,300,10);

        memoria.asignarProceso(proceso1);
        memoria.asignarProceso(proceso2);

        //Quedan 3 bloques: proceso1 (200), proceso2 (300), libre (524)
        expect(memoria.bloques.length).toBe(3);

        const liberado = memoria.liberarProceso(1);
        expect(liberado).toBe(true);

        //Al liberar el proceso 2, los bloques libres contiguos se deben consolidar en 1 solo bloque libre de 1024 KB
        memoria.liberarProceso(2);
        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0]!.estaLibre()).toBe(true);
        expect(memoria.bloques[0]!.tamanio).toBe(1024);
    });

    it("Debe retornar false si se intenta liberar un proceso inexistente", () => {
        const resultado = memoria.liberarProceso(99);
        expect(resultado).toBe(false);
    });
});