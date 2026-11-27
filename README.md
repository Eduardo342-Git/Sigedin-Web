# SIGEDIN Académico — Rol Estudiante (Vue 3 + Vite)

Proyecto fuente editable en **Vue 3 + Vite + Vue Router** que replica la interfaz y arquitectura de **SIGEDIN Académico** para el **Rol Estudiante** (Institución Universitaria del Putumayo) con datos ficticios de demostración (`src/data/mockData.js`) y soporte de tema claro/oscuro persistente en `localStorage`.

## Requisitos previos
- Node.js 18 o superior
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```

Para generar el build de producción:

```bash
npm run build
```

## Estructura principal
- `src/layouts/MainLayout.vue`: barra superior, menú lateral de estudiante, selector de tema y botón flotante de valoración.
- `src/views/`: vistas académicas del estudiante (`InicioView`, `MatriculaView`, `PlanEstudiosView`, `NotasBoletinView`, `CursosGradoView`, `BienestarView`, `PropuestaGradoView`, `HorasSocialesView`, `EvaluacionDocenteView`, `ServiciosView`).
- `src/data/mockData.js`: datos ficticios para demostración.
- `src/assets/styles/`: variables CSS de tema claro/oscuro y estilos base.
