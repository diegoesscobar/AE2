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

    //Busca el primer bloque libre donde quepa el proceso (FIrs-Fit)
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
}