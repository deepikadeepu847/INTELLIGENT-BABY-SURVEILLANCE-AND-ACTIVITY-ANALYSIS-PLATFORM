/*
 * Arduino Uno Fan Controller
 * Part of the AI Child Safety System
 * 
 * Hardware:
 * - Arduino Uno
 * - DC Motor (Fan) connected to Pin 3 via Transistor/N-Channel MOSFET
 * - (Optional) Serial connection to ESP32 or PC Bridge
 */

const int FAN_PIN = 13;  // Digital Pin 3 (PWM capable)

void setup() {
  // Initialize Serial Communication
  Serial.begin(115200);
  
  // Set Fan Pin as Output
  pinMode(FAN_PIN, OUTPUT);
  
  // Start with fan OFF
  digitalWrite(FAN_PIN, LOW);
  
  Serial.println("Arduino Uno Fan Controller Started.");
  Serial.println("Send '1' for ON, '0' for OFF.");
}

void loop() {
  // Check if serial data is available
  if (Serial.available() > 0) {
    char command = Serial.read();

    if (command == '1') {
      digitalWrite(FAN_PIN, HIGH);
      Serial.println("STATUS: FAN_ON (Baby Detected)");
    } 
    else if (command == '0') {
      digitalWrite(FAN_PIN, LOW);
      Serial.println("STATUS: FAN_OFF (Baby Absent)");
    }
  }
}
