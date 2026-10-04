# AE2 - Simulador de Procesos y Gestión de Memoria

Diego Gerónimo Escobar

Simulador de administración de procesos y asignación de memoria dinámica implementado en TypeScript y Node.js.

## Características
- **Planificación de CPU:** Round-Robin con Quantum configurable.
- **Gestión de Memoria:** Contigua con algoritmo First-Fit y coalescencia de bloques libres.
- **Transiciones de Estado:** Manejo de colas de Nuevos, Listos, Bloqueados por E/S y Terminados.

## Requisitos
- Node.js (v18+)
- npm

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar la simulación principal
npm start

# Ejecutar la suite de pruebas unitarias
npm test