#include <WiFi.h>
#include <HTTPClient.h>

// ================== WiFi Config ==================
#define WIFI_SSID     "..."              
#define WIFI_PASSWORD "0673624052"       

// ================== Firestore Config ==================
#define PROJECT_ID "iot-control-system-c099c"

// ================== LED Pin Config ==================
#define LED1 5   // GPIO5
#define LED2 18
#define LED3 19

// ================== Device ID ==================
String device1 = "dv001";
String device2 = "dv002";
String device3 = "dv003";

unsigned long lastMillis = 0;

// ================== Hàm đọc Firestore ==================
void checkAndSetLED(String deviceId, int pin) {
  String url = "https://firestore.googleapis.com/v1/projects/";
  url += PROJECT_ID;
  url += "/databases/(default)/documents/devices/";
  url += deviceId;

  HTTPClient http;
  http.begin(url);

  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    Serial.println("== Payload Firestore ==");
    Serial.println(payload);

    if (payload.indexOf("\"booleanValue\": true") != -1) {
      digitalWrite(pin, HIGH);
      Serial.println(deviceId + " => ON");
    } else if (payload.indexOf("\"booleanValue\": false") != -1) {
      digitalWrite(pin, LOW);
      Serial.println(deviceId + " => OFF");
    } else {
      Serial.println(deviceId + " => không thấy field status!");
    }

  } else {
    Serial.print("HTTP GET error: ");
    Serial.println(httpCode);
  }
  http.end();
}

void setup() {
  Serial.begin(115200);

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Kết nối WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
}

void loop() {
  if (millis() - lastMillis > 1000) { // 1s đọc Firestore 1 lần
    lastMillis = millis();

    checkAndSetLED(device1, LED1);
    checkAndSetLED(device2, LED2);
    checkAndSetLED(device3, LED3);
  }
}
