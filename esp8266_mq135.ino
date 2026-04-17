#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://sober-guard.onrender.com/api/sensor";
const char* deviceId = "esp8266_unit_01";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    // Render uses HTTPS. setInsecure() allows the ESP to connect 
    // without needing to store the SSL root certificate.
    client.setInsecure(); 
    
    HTTPClient http;

    int sensorValue = analogRead(A0);
    
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"value\":" + String(sensorValue) + ",\"deviceId\":\"" + String(deviceId) + "\"}";
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  
  delay(5000); // Send data every 5 seconds
}
