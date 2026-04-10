# SoberGuard - Sistema de Monitoreo de Alcohol en Tiempo Real

**Nombres:** Sebastian Pulido, Juan Camilo Reyes, Randy Zapata  
**Grupo:** 13

## SoberGuard

SoberGuard es una solución integral de hardware y software diseñada para el monitoreo de niveles de alcohol en tiempo real, enfocada en entornos donde la seguridad es crítica. El sistema utiliza sensores electroquímicos para detectar la presencia de alcohol en el aire y transmite estos datos de forma inalámbrica a una plataforma centralizada para su análisis y visualización inmediata.

## Características Principales

- **Monitoreo en Tiempo Real:** Visualización instantánea de lecturas mediante WebSockets.
- **Panel de Control (Dashboard):** Interfaz intuitiva con gráficas de tendencias e indicadores estadísticos.
- **Histórico de Datos:** Registro completo de lecturas almacenado en base de datos para auditoría.
- **Seguridad:** Sistema de autenticación robusto basado en JSON Web Tokens (JWT).
- **Escalabilidad:** Arquitectura basada en microservicios y contenedores Docker.

## Cómo ejecutar el proyecto localmente

Para levantar todo el entorno de desarrollo (Backend, Frontend y MongoDB), ejecute:

```bash
docker-compose up --build
```
