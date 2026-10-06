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

  /** true cuando no queda ningún proceso por atender. */
  public haTerminado(): boolean {
    return (
      this.colaNuevos.length === 0 &&
      this.colaListos.length === 0 &&
      this.colaBloqueados.length === 0 &&
      this.procesoEjecutando === null
    );
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
      proceso.descontarBloqueo(); // antes: proceso.tiempoBloqueoRestante--
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
      const siguiente = this.colaListos.shift();
      if (siguiente) {
        this.procesoEjecutando = siguiente;
        siguiente.cambiarEstado(EstadoProceso.EJECUTANDO);
        siguiente.reiniciarQuantum(); // antes: quantumConsumido = 0
      }
    }

    if (!this.procesoEjecutando) return;

    const p = this.procesoEjecutando;

    // antes: p.tiempoCpuRestante--; p.quantumConsumido++;
    p.ejecutarTick();

    if (p.estaTerminado()) {
      p.cambiarEstado(EstadoProceso.TERMINADO);
      this.memoria.liberarProceso(p.id);
      this.procesosTerminados.push(p);
      this.procesoEjecutando = null;
      return;
    }

    if (
      p.eventoES &&
      p.tiempoCpuTotal - p.tiempoCpuRestante === p.eventoES.ticksCpuParaDisparo
    ) {
      p.cambiarEstado(EstadoProceso.BLOQUEADO);
      // antes: tiempoBloqueoRestante = duracionBloqueo; eventoES = null
      p.bloquearPorES();
      this.colaBloqueados.push(p);
      this.procesoEjecutando = null;
      return;
    }

    if (p.quantumConsumido >= this.quantum) {
      p.cambiarEstado(EstadoProceso.LISTO);
      p.reiniciarQuantum(); // antes: quantumConsumido = 0
      this.colaListos.push(p);
      this.procesoEjecutando = null;
    }
  }
}