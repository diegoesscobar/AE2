import { EstadoProceso } from './EstadoProceso.js';

export class Proceso {
    public id: number;
    public tamanioMemoria: number;
    public tiempoRestante: number;
    public prioridad: number;
    public estado: EstadoProceso;

    constructor(
        id: number, 
        tamanioMemoria: number, 
        tiempoRestante: number,
        prioridad: number = 1

    ) {
        this.id = id;
        this.tamanioMemoria = tamanioMemoria;
        this.tiempoRestante = tiempoRestante;
        this.prioridad = prioridad;
        this.estado = EstadoProceso.NUEVO;
    }

    public cambiarEstado(nuevoEstado: EstadoProceso) {
        this.estado = nuevoEstado;
    }
    public ejecutarCiclo(quantum: number): void {
        if (this.tiempoRestante > 0) {
            this.tiempoRestante = Math.max(0, this.tiempoRestante - quantum);
        }
        if (this.tiempoRestante === 0) {
            this.estado = EstadoProceso.TERMINADO;            
        }
    }

    public estaTerminado(): boolean {
        return this.estado === EstadoProceso.TERMINADO;
    }
}