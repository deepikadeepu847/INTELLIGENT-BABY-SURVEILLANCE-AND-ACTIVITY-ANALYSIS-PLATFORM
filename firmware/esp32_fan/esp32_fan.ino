#include <WiFi.h>
#include <WebSocketsClient.h>

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* server_url = "guardian-ai-backend.yourdomain.com"; // Your Node.js server
const int server_port = 5000;
const char* roomId = "demo-room-123";

// --- Hardware ---
#define FAN_PIN           12 // Using GPIO 12 for the DC Motor/Fan

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("[WS] Disconnected!");
      break;
    case WStype_CONNECTED:
      Serial.println("[WS] Fan Module Connected to server");
      // Initial identification
      webSocket.sendTXT("{\"type\":\"device-init\", \"deviceId\":\"esp32-fan-01\", \"roomId\":\"" + String(roomId) + "\"}");
      break;
    case WStype_TEXT:
      Serial.printf("[WS] Message: %s\n", payload);
      String msg = String((char*)payload);
      
      // Listen for fan-control commands from the server
      if (msg.indexOf("\"type\":\"fan-control\"") != -1) {
        if (msg.indexOf("\"state\":\"on\"") != -1) {
          digitalWrite(FAN_PIN, HIGH);
          Serial.println("[FAN] Motor ON (Baby Present)");
        } else if (msg.indexOf("\"state\":\"off\"") != -1) {
          digitalWrite(FAN_PIN, LOW);
          Serial.println("[FAN] Motor OFF (Baby Absent)");
        }
      }
      break;
  }
}

void setup() {
  Serial.begin(115200);
  
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(FAN_PIN, LOW); // Start with fan off

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // WebSocket initialization
  webSocket.begin(server_url, server_port, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); // Reconnect every 5 seconds if connection is lost
}

void loop() {
  webSocket.loop();
}
