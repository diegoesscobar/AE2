import { EstadoProceso } from './EstadoProceso.js';

export interface EventoES {
    ticksCpuParaDisparo: number; //Ticks de CPU consumidos antes de bloquearse
    duracionBloqueo: number; //Cuántos ticks permanece bloqueado
    }
    
    export class Proceso {
        public id: number;
        public tamanioMemoria: number;
        public tiempoCpuTotal: number;
        public tiempoCpuRestante: number;
        public estado: EstadoProceso;
        public quantumConsumido: number;
        public eventoES: EventoES | null;
        public tiempoBloqueRestante: number;

        constructor(
            id: number,
            tamanioMemoria: number,
            tiempoCpuTotal: number, 
            eventoES: EventoES | null = null
        ) {
            this.id = id;
            this.tamanioMemoria = tamanioMemoria;
            this.tiempoCpuTotal = tiempoCpuTotal;
            this.tiempoCpuRestante = tiempoCpuTotal;
            this.estado = EstadoProceso.NUEVO;
            this.quantumConsumido = 0;
            this.eventoES = eventoES;
            this.tiempoBloqueRestante = 0;
        }

        public cambiarEstado(nuevoEstado: EstadoProceso): void {
            this.estado = nuevoEstado;
        }

        public estaTerminado(): boolean {
            return this.tiempoCpuRestante === 0;
        }
}