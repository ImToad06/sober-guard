# Interfaz de Usuario (Frontend)

El frontend de SoberGuard es una Aplicación de Una Sola Página (SPA) reactiva construida con **SvelteKit**.

## Tecnologías

- **SvelteKit:** Framework para la construcción de interfaces de usuario con un enfoque en el rendimiento mediante la compilación de componentes.
- **Tailwind CSS:** Para un diseño moderno, responsivo y rápido de desarrollar.
- **Lucide Svelte:** Set de iconos consistentes.
- **WebSockets:** Para recibir actualizaciones en vivo sin necesidad de refrescar la página.

## Vistas Principales

### 1. Dashboard (Panel de Control)
La vista central donde se visualizan los niveles de alcohol en tiempo real. Incluye gráficos dinámicos que se actualizan automáticamente cada vez que el sensor reporta un nuevo valor.

### 2. Autenticación (Login/Signup)
Páginas dedicadas para la gestión de acceso de usuarios, asegurando que solo el personal autorizado pueda ver los datos críticos.

### 3. Estadísticas
Una sección para analizar el comportamiento histórico de los sensores, identificando patrones de uso o alertas recurrentes.

## Estado en Tiempo Real

El cliente de Svelte se conecta al endpoint `/ws` del backend al cargar el dashboard. Utiliza una suscripción de WebSocket para escuchar eventos de tipo `new_reading`, actualizando el estado local de la aplicación instantáneamente.
