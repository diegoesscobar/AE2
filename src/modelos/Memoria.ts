import { BloqueMemoria } from "./BloqueMemoria.js";
import { Proceso } from "./Proceso.js";

export class Memoria {
    public tamanioTotal: number;
    public bloques: BloqueMemoria[];

    constructor(tamanioTotal: number = 1024) {
        this.tamanioTotal = tamanioTotal;
        //Inicializamos la memoria con un único bloque libre que abarca todo el tamaño
        this.bloques = [new BloqueMemoria(0, tamanioTotal)]; 
    }

    //Busca el primer bloque libre donde quepa el proceso (First-Fit)
    public buscarBloqueLibre(proceso: Proceso): BloqueMemoria | null {
        const bloqueEncontrado = this.bloques.find(
            (bloque) => bloque.estaLibre() && bloque.tamanio >= proceso.tamanioMemoria

        )
        return bloqueEncontrado || null;
        }
    //Asignamos un proceso a un bloque libre y divide el blqoue si sobra espacio
    public asignarProceso(proceso: Proceso): boolean {
        const bloque = this.buscarBloqueLibre(proceso);
        if (!bloque) return false; //No hay bloque libre suficiente

        const indice = this.bloques.indexOf(bloque);
        const tamanioSobrante = bloque.tamanio - proceso.tamanioMemoria;

        //Asignamos el proceso al bloque
        bloque.proceso = proceso;
        bloque.tamanio = proceso.tamanioMemoria;

        //Si sobra espacio, creamos un nuevo bloque libre con el resto
        if (tamanioSobrante > 0) {
            const nuevoBloque = new BloqueMemoria(
                bloque.direccionInicio + proceso.tamanioMemoria,
                tamanioSobrante
            );
            this.bloques.splice(indice + 1, 0, nuevoBloque);
        }
        return true;    
    }   
        //Libera la memoria ocupada por un proceso dado su id
        public liberarProceso(idProceso: number): boolean {
            const bloque = this.bloques.find(b => !b.estaLibre() && b.proceso?.id === idProceso);
            if (!bloque) return false;

            bloque.proceso = null;
            this.consolidarBloques();
            return true;
        }

        //Fusiona bloques libres contiguos para evitar la fragmentación externa
        public consolidarBloques(): void {
            for(let i = 0; i < this.bloques.length - 1; i++) {
                const bloqueActual = this.bloques[i]!;
                const bloqueSiguiente = this.bloques[i + 1]!;

                if (bloqueActual.estaLibre() && bloqueSiguiente.estaLibre()) {
                    bloqueActual.tamanio += bloqueSiguiente.tamanio;
                    this.bloques.splice(i + 1, 1);
                    i--; //Volvemos a verificarr el bloque fusionado con el siguiente
                }
            }
        }
    }   