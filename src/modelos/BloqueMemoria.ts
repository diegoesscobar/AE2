import { Proceso } from "./Proceso.js";

export class BloqueMemoria {
    public direccionInicio: number;
    public tamanio: number;
    public proceso: Proceso | null;

    constructor(direccionInicio: number, tamanio: number, proceso: Proceso | null = null ) {
        this.direccionInicio = direccionInicio;
        this.tamanio = tamanio;
        this.proceso = proceso;
    }

    public estaLibre(): boolean {
        return this.proceso === null;
    }
}
