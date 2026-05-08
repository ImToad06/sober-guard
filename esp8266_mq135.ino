#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://sober-guard.onrender.com/api/sensor";
const char* deviceId = "esp8266_unit_01";

// --- Hardware Pins ---
#define MQ135_PIN A0
#define LED_PIN LED_BUILTIN // Note: LED_BUILTIN is usually active-low on ESP8266

// --- MQ135 Calibration for Ethanol (Alcohol) ---
// Power regression curve: PPM = a * (Rs/R0)^b
const float a = 77.255;
const float b = -3.18;

const float RL = 1.0; // Load resistance of the module (typically 1k or 10k, but ratio cancels out units)
float R0 = 1.0;       // Calibrated base resistance in clean air

void calibrateR0() {
  Serial.print("Calibrating MQ135 (ensure sensor is in FRESH AIR)...");
  float rs_sum = 0;
  
  // Take 100 samples to average
  for (int i = 0; i < 100; i++) {
    int adc = analogRead(MQ135_PIN);
    // ESP8266 ADC is 10-bit (0-1023)
    // Prevent division by zero if adc is somehow 0
    if (adc == 0) adc = 1; 
    
    float rs = RL * ((1023.0 / (float)adc) - 1.0);
    rs_sum += rs;
    delay(50);
  }
  
  float rs_avg = rs_sum / 100.0;
  // In fresh, clean air, the ratio of Rs/R0 for MQ135 is approximately 3.6
  R0 = rs_avg / 3.6;
  
  Serial.println(" Done!");
  Serial.print("Calibrated R0 value: ");
  Serial.println(R0);
}

float getEthanolPPM() {
  int adc = analogRead(MQ135_PIN);
  if (adc == 0) return 0.0;
  
  float rs = RL * ((1023.0 / (float)adc) - 1.0);
  float ratio = rs / R0;
  
  // Calculate PPM using the formula: PPM = a * (Rs/R0)^b
  float ppm = a * pow(ratio, b);
  return ppm;
}

void setup() {
  Serial.begin(115200);
  
  pinMode(LED_PIN, OUTPUT);
  // Built-in LED on ESP8266 (e.g. NodeMCU, Wemos D1 Mini) is typically ACTIVE-LOW
  digitalWrite(LED_PIN, HIGH); // Start with LED OFF

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  
  // Calibrate sensor at startup
  calibrateR0();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float ethanolPpm = getEthanolPPM();
    
    Serial.print("Ethanol PPM: ");
    Serial.println(ethanolPpm);

    WiFiClientSecure client;
    // Render uses HTTPS. setInsecure() allows connection without providing a root certificate
    client.setInsecure(); 
    
    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"value\":" + String(ethanolPpm, 2) + ",\"deviceId\":\"" + String(deviceId) + "\"}";
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      String response = http.getString();
      Serial.println("Server response: " + response);
      
      // Check if the server told us to turn on the LED
      if (response.indexOf("\"turnOnLed\":true") > 0) {
        Serial.println("Turning on LED as requested by server...");
        // Turn ON the built-in LED (Active-LOW)
        digitalWrite(LED_PIN, LOW); 
        delay(1000); // Keep LED on for 1 second
        digitalWrite(LED_PIN, HIGH); // Turn OFF
      }
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }
  
  delay(5000); // Send data every 5 seconds
}
