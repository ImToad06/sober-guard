#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
// Based on the esp8266 script, using the same Render backend
const char* serverUrl = "https://sober-guard.onrender.com/api/sensor";
const char* deviceId = "esp32_unit_01";

// --- Hardware Pins ---
// Note: MQ135 analog out must be stepped down to max 3.3V for the ESP32!
#define MQ135_PIN 34 // ADC pin on ESP32
#define LED_PIN 2    // Built-in LED on most ESP32 boards (Adjust if yours uses a different pin)

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
    // ESP32 ADC is 12-bit (0-4095)
    // Prevent division by zero if adc is somehow 0
    if (adc == 0) adc = 1; 
    
    float rs = RL * ((4095.0 / (float)adc) - 1.0);
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
  
  float rs = RL * ((4095.0 / (float)adc) - 1.0);
  float ratio = rs / R0;
  
  // Calculate PPM using the formula: PPM = a * (Rs/R0)^b
  float ppm = a * pow(ratio, b);
  return ppm;
}

void setup() {
  Serial.begin(115200);
  
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Start with LED off

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  
  // Calibrate sensor at startup
  // Note: MQ sensors typically need a 24-48h burn-in time for accurate permanent readings.
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

    // Construct JSON payload matching the backend API requirement { value, deviceId }
    String jsonPayload = "{\"value\":" + String(ethanolPpm, 2) + ",\"deviceId\":\"" + String(deviceId) + "\"}";
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      // Read the response from the server
      String response = http.getString();
      Serial.println("Server response: " + response);
      
      // Check if the server told us to turn on the LED
      // Look for "turnOnLed":true in the JSON response
      if (response.indexOf("\"turnOnLed\":true") > 0) {
        Serial.println("Turning on LED as requested by server...");
        digitalWrite(LED_PIN, HIGH);
        delay(1000); // Keep LED on for 1 second
        digitalWrite(LED_PIN, LOW);
      }
    } else {
      Serial.print("HTTP Error code: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }
  
  delay(5000); // Wait 5 seconds before the next reading
}
