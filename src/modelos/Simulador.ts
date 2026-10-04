import { Proceso } from './Proceso.js';
import { EstadoProceso } from './EstadoProceso.js';
import { Memoria } from './Memoria.js';

export class Simulador {
  public reloj: number;
  public quantum: number;
  public memoria: Memoria;
  public colaNuevos: Proceso[];
  public colaListos: Proceso[];
  public colaBloqueados: Proceso[];
  public procesoEjecutando: Proceso | null;
  public procesosTerminados: Proceso[];

  constructor(tamanioMemoria: number, quantum: number) {
    this.reloj = 0;
    this.quantum = quantum;
    this.memoria = new Memoria(tamanioMemoria);
    this.colaNuevos = [];
    this.colaListos = [];
    this.colaBloqueados = [];
    this.procesoEjecutando = null;
    this.procesosTerminados = [];
  }

  public agregarProceso(proceso: Proceso): void {
    proceso.cambiarEstado(EstadoProceso.NUEVO);
    this.colaNuevos.push(proceso);
  }

  public ejecutarTick(): void {
    this.reloj++;

    this.intentarAsignarMemoria();

    this.procesarBloqueados();

    this.procesarCPU();
  }

  private intentarAsignarMemoria(): void {
    const pendientes = [...this.colaNuevos];
    this.colaNuevos = [];

    for (const proceso of pendientes) {
      if (this.memoria.asignarProceso(proceso)) {
        proceso.cambiarEstado(EstadoProceso.LISTO);
        this.colaListos.push(proceso);
      } else {
        proceso.cambiarEstado(EstadoProceso.ESPERANDO_MEMORIA);
        this.colaNuevos.push(proceso);
      }
    }
  }

  private procesarBloqueados(): void {
    const queSiguenBloqueados: Proceso[] = [];

    for (const proceso of this.colaBloqueados) {
      proceso.tiempoBloqueoRestante--;
      if (proceso.tiempoBloqueoRestante <= 0) {
        proceso.cambiarEstado(EstadoProceso.LISTO);
        this.colaListos.push(proceso);
      } else {
        queSiguenBloqueados.push(proceso);
      }
    }

    this.colaBloqueados = queSiguenBloqueados;
  }

  private procesarCPU(): void {
    if (!this.procesoEjecutando && this.colaListos.length > 0) {
      this.procesoEjecutando = this.colaListos.shift()!;
      this.procesoEjecutando.cambiarEstado(EstadoProceso.EJECUTANDO);
      this.procesoEjecutando.quantumConsumido = 0;
    }

    if (!this.procesoEjecutando) return;

    const p = this.procesoEjecutando;
    p.tiempoCpuRestante--;
    p.quantumConsumido++;

    if (p.estaTerminado()) {
      p.cambiarEstado(EstadoProceso.TERMINADO);
      this.memoria.liberarProceso(p.id);
      this.procesosTerminados.push(p);
      this.procesoEjecutando = null;
      return;
    }

    if (p.eventoES && (p.tiempoCpuTotal - p.tiempoCpuRestante) === p.eventoES.ticksCpuParaDisparo) {
      p.cambiarEstado(EstadoProceso.BLOQUEADO);
      p.tiempoBloqueoRestante = p.eventoES.duracionBloqueo;
      p.eventoES = null;
      this.colaBloqueados.push(p);
      this.procesoEjecutando = null;
      return;
    }

    if (p.quantumConsumido >= this.quantum) {
      p.cambiarEstado(EstadoProceso.LISTO);
      p.quantumConsumido = 0;
      this.colaListos.push(p);
      this.procesoEjecutando = null;
    }
  }
}