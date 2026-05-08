# Configuración del Hardware

El corazón físico de SoberGuard consiste en un nodo sensor capaz de medir la concentración de gases en el ambiente, específicamente orientado a la detección de etanol.

## Componentes Necesarios

- **Microcontrolador:** ESP8266 (NodeMCU) o ESP32.
- **Sensor:** MQ135 (Sensor de Calidad de Aire / Gases).
- **Cables:** Jumpers para conexión.
- **Alimentación:** Cable Micro-USB.

## Conexión (Pinout)

Para el **ESP8266**:
- **MQ135 VCC** -> ESP8266 3.3V (o 5V si el módulo lo soporta).
- **MQ135 GND** -> ESP8266 GND.
- **MQ135 AO (Analog Output)** -> ESP8266 A0.

## Programación

El dispositivo utiliza el framework de Arduino. A continuación se muestra un resumen de la lógica implementada:

```cpp
// Fragmento del loop principal
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    int sensorValue = analogRead(A0);
    
    // Preparar el payload JSON
    String jsonPayload = "{\"value\":" + String(sensorValue) + ",\"deviceId\":\"esp8266_01\"}";
    
    // Enviar vía POST HTTP
    int httpResponseCode = http.POST(jsonPayload);
    // ... manejo de respuesta
  }
  delay(5000); // Intervalo de 5 segundos
}
```

### Consideraciones de Seguridad (SSL)
Dado que el servidor utiliza HTTPS (Render), los dispositivos ESP deben estar configurados para manejar conexiones seguras. En el código proporcionado, se utiliza `client.setInsecure()` para simplificar la conexión sin necesidad de cargar certificados raíz en la memoria limitada del microcontrolador.

## Calibración
El sensor MQ135 requiere un tiempo de pre-calentamiento (burn-in) de al menos 24-48 horas para lecturas precisas, y unos 2-3 minutos en cada encendido antes de proporcionar datos estables.
