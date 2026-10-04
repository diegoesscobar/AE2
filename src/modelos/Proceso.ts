import { EstadoProceso } from './EstadoProceso.js';

export interface EventoES {
  ticksCpuParaDisparo: number;
  duracionBloqueo: number;
}

export class Proceso {
  public id: number;
  public tamanioMemoria: number;
  public tiempoCpuTotal: number;
  public tiempoCpuRestante: number;
  public estado: EstadoProceso;
  public quantumConsumido: number;
  public eventoES: EventoES | null;
  public tiempoBloqueoRestante: number;

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
    this.tiempoBloqueoRestante = 0;
  }

  public cambiarEstado(nuevoEstado: EstadoProceso): void {
    this.estado = nuevoEstado;
  }

  public estaTerminado(): boolean {
    return this.tiempoCpuRestante === 0;
  }
}