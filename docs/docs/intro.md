# Introducción a SoberGuard

Bienvenido a la documentación oficial de **SoberGuard**, un sistema integral diseñado para el monitoreo de niveles de alcohol y la mejora de la seguridad vial y personal mediante el uso de tecnologías IoT y web modernas.

## ¿Qué es SoberGuard?

SoberGuard combina hardware basado en microcontroladores (ESP8266/ESP32) con una plataforma web en tiempo real para detectar concentraciones de alcohol en el aliento y alertar visual y digitalmente sobre estados de intoxicación.

### Componentes del Proyecto

1.  **Hardware:** Utiliza sensores MQ135 para la detección de gases y microcontroladores para enviar datos vía Wi-Fi.
2.  **Backend:** Un servidor robusto construido con **Bun** y **ElysiaJS**, que gestiona la lógica de negocio, autenticación y comunicación en tiempo real vía WebSockets.
3.  **Frontend:** Un panel de control intuitivo desarrollado con **SvelteKit**, que ofrece visualización de datos en vivo y estadísticas históricas.

## Propósito de esta Documentación

Esta guía está diseñada para ayudar a desarrolladores, ingenieros de hardware y usuarios finales a comprender cómo está construido el sistema, cómo desplegarlo y cómo extender su funcionalidad.

---

### Comienza ahora
Explora las secciones laterales para aprender sobre:
- **Hardware:** Configuración del sensor y el microcontrolador.
- **Backend:** Arquitectura del servidor y API.
- **Frontend:** Uso del dashboard.
- **Flujo de Trabajo:** Cómo viaja el dato desde el sensor hasta tu pantalla.
