import { BloqueMemoria } from "./BloqueMemoria.js";
import { Proceso } from "./Proceso.js";

export class Memoria {
    public tamanioTotal: number;
    public bloques: BloqueMemoria[];

    constructor(tamanioTotal: number = 1024) {
        this.tamanioTotal = tamanioTotal;
        this.bloques = [new BloqueMemoria(0, tamanioTotal)]; 
    }

    public buscarBloqueLibre(proceso: Proceso): BloqueMemoria | null {
        const bloqueEncontrado = this.bloques.find(
            (bloque) => bloque.estaLibre() && bloque.tamanio >= proceso.tamanioMemoria

        )
        return bloqueEncontrado || null;
        }

    public asignarProceso(proceso: Proceso): boolean {
        const bloque = this.buscarBloqueLibre(proceso);
        if (!bloque) return false; //No hay bloque libre suficiente

        const indice = this.bloques.indexOf(bloque);
        const tamanioSobrante = bloque.tamanio - proceso.tamanioMemoria;

        
        bloque.proceso = proceso;
        bloque.tamanio = proceso.tamanioMemoria;

        
        if (tamanioSobrante > 0) {
            const nuevoBloque = new BloqueMemoria(
                bloque.direccionInicio + proceso.tamanioMemoria,
                tamanioSobrante
            );
            this.bloques.splice(indice + 1, 0, nuevoBloque);
        }
        return true;    
    }   
        
        public liberarProceso(idProceso: number): boolean {
            const bloque = this.bloques.find(b => !b.estaLibre() && b.proceso?.id === idProceso);
            if (!bloque) return false;

            bloque.proceso = null;
            this.consolidarBloques();
            return true;
        }

        
        public consolidarBloques(): void {
            for(let i = 0; i < this.bloques.length - 1; i++) {
                const bloqueActual = this.bloques[i]!;
                const bloqueSiguiente = this.bloques[i + 1]!;

                if (bloqueActual.estaLibre() && bloqueSiguiente.estaLibre()) {
                    bloqueActual.tamanio += bloqueSiguiente.tamanio;
                    this.bloques.splice(i + 1, 1);
                    i--;
                }
            }
        }
    }   