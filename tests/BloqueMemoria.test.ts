import {describe, it, expect} from "vitest";
import { BloqueMemoria } from "../src/modelos/BloqueMemoria.js";
import { Proceso } from "../src/modelos/Proceso.js";

describe ("Pruebas para la clase BLoqueMemoria", () => {
    it("Debe crearse libre por defecto", () => {
        const bloque = new BloqueMemoria (0, 256);
    
    expect (bloque.direccionInicio).toBe(0);
    expect (bloque.tamanio).toBe(256);
    expect (bloque.proceso).toBeNull();
    expect (bloque.estaLibre()).toBe(true);
    });

    it("Debe indicar que no está libre cuando tieen un proceso asignado", () => {
        const proceso = new Proceso (1, 128, 5);
        const bloque = new BloqueMemoria (0, 256, proceso);

        expect(bloque.estaLibre()).toBe(false);
        expect(bloque.proceso).toBe(proceso);
    });
})
