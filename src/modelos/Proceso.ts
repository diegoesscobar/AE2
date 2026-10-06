import { EstadoProceso } from './EstadoProceso.js';

export interface EventoES {
  ticksCpuParaDisparo: number;
  duracionBloqueo: number;
}

export class Proceso {
  private _id: number;
  private _tamanioMemoria: number;
  private _tiempoCpuTotal: number;
  private _tiempoCpuRestante: number;
  private _estado: EstadoProceso;
  private _quantumConsumido: number;
  private _eventoES: EventoES | null;
  private _tiempoBloqueoRestante: number;

  constructor(
    id: number,
    tamanioMemoria: number,
    tiempoCpuTotal: number,
    eventoES: EventoES | null = null
  ) {
    this._id = id;
    this._tamanioMemoria = tamanioMemoria;
    this._tiempoCpuTotal = tiempoCpuTotal;
    this._tiempoCpuRestante = tiempoCpuTotal;
    this._estado = EstadoProceso.NUEVO;
    this._quantumConsumido = 0;
    this._eventoES = eventoES;
    this._tiempoBloqueoRestante = 0;
  }

  public get id(): number {
    return this._id;
  }

  public get tamanioMemoria(): number {
    return this._tamanioMemoria;
  }

  public get tiempoCpuTotal(): number {
    return this._tiempoCpuTotal;
  }

  public get tiempoCpuRestante(): number {
    return this._tiempoCpuRestante;
  }

  public get estado(): EstadoProceso {
    return this._estado;
  }

  public get quantumConsumido(): number {
    return this._quantumConsumido;
  }

  public set quantumConsumido(valor: number) {
    this._quantumConsumido = valor;
  }

  public get eventoES(): EventoES | null {
    return this._eventoES;
  }

  public get tiempoBloqueoRestante(): number {
    return this._tiempoBloqueoRestante;
  }

  public cambiarEstado(nuevoEstado: EstadoProceso): void {
    this._estado = nuevoEstado;
  }

  public estaTerminado(): boolean {
    return this._tiempoCpuRestante === 0;
  }

  public incrementarQuantum(): void {
    this._quantumConsumido++;
  }

  public reiniciarQuantum(): void {
    this._quantumConsumido = 0;
  }

  public descontarCpu(): void {
    if (this._tiempoCpuRestante > 0) {
      this._tiempoCpuRestante--;
    }
  }

  /** Un tick de CPU: descuenta tiempo restante y suma quantum consumido. */
  public ejecutarTick(): void {
    this.descontarCpu();
    this.incrementarQuantum();
  }

  /** Un tick de espera en la cola de bloqueados. */
  public descontarBloqueo(): void {
    if (this._tiempoBloqueoRestante > 0) {
      this._tiempoBloqueoRestante--;
    }
  }

  /** Inicia el bloqueo por E/S y consume el evento (se dispara una sola vez). */
  public bloquearPorES(): void {
    if (!this._eventoES) return;
    this._tiempoBloqueoRestante = this._eventoES.duracionBloqueo;
    this._eventoES = null;
  }
}