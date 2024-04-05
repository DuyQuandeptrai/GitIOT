#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include "ArduinoJson.h"
#define LED D0
#define FAN D6                                                                                                                       
#define dhttype DHT11
#define dhtpin D4
#define ldrpin  A0
// WiFi
const char *ssid = "Quan";       // Enter your WiFi name
const char *password = "tumotdentam";  // Enter WiFi password
int ldrValue; 
// MQTT Broker
const char *mqtt_broker = "192.168.100.224";
const char *topicSensor = "sensor";
const char *topicled = "led";
const char *topicfan = "fan";
const char* notification = "thongbao";
const char* topicboth = "both";
const char *mqtt_username = "quan1234";
const char *mqtt_password = "quan1234";
const int mqtt_port = 3000;
bool ledState = false;
bool fanState = false;

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(dhtpin, dhttype);

void setup() {
  // Set software serial baud to 115200;
  dht.begin();
  Serial.begin(115200);
  delay(1000);  // Delay for stability

  // Connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to the WiFi network");

  // Setting LED pin as output
  pinMode(LED, OUTPUT);
  pinMode(FAN, OUTPUT);
  pinMode(ldrpin,INPUT);
  digitalWrite(LED, LOW);  // Turn off the LED initially
  digitalWrite(FAN, LOW); 

  // Connecting to an MQTT broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp8266-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Public EMQX MQTT broker connected");
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }

  // Publish and subscribe

  client.subscribe(topicled);
  client.subscribe(topicfan);
  client.subscribe(topicboth);
}
void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];  // Convert *byte to string
  }
  Serial.print(message);
  if (strcmp(topic, topicled) == 0) {
    if (message == "on" && !ledState) {
      digitalWrite(LED, HIGH);  // Turn on the LED
      ledState = true;
      client.publish(notification, "LED is turned on");
      ldrValue = analogRead(ldrpin); 
      
    }
    if (message == "off" && ledState) {
      digitalWrite(LED, LOW);  // Turn off the LED
      ledState = false;
       client.publish(notification, "LED is turned off");
    }

    // Tạo đối tượng JSON chứa trạng thái của LED và FAN
    DynamicJsonDocument ledFanDoc(256);
    ledFanDoc["LED"] = ledState ? "on" : "off";
    ledFanDoc["FAN"] = fanState ? "on" : "off";

    // Serialize đối tượng JSON thành chuỗi JSON
    String ledFanPayload;
    serializeJson(ledFanDoc, ledFanPayload);

    // Gửi chuỗi JSON
    client.publish(notification, ledFanPayload.c_str());
}

if (strcmp(topic, topicfan) == 0) {
    if (message == "on" && !fanState) {
      digitalWrite(FAN, HIGH);  // Turn on the FAN
      fanState = true;
      client.publish(notification, "FAN is turned on");
    }
    if (message == "off" && fanState) {
      digitalWrite(FAN, LOW);  // Turn off the FAN
      fanState = false;
      client.publish(notification, "FAN is turned off");
    }

    // Tạo đối tượng JSON chứa trạng thái của LED và FAN
    DynamicJsonDocument ledFanDoc(256);
    ledFanDoc["LED"] = ledState ? "on" : "off";
    ledFanDoc["FAN"] = fanState ? "on" : "off";

    // Serialize đối tượng JSON thành chuỗi JSON
    String ledFanPayload;
    serializeJson(ledFanDoc, ledFanPayload);

    // Gửi chuỗi JSON
    client.publish(notification, ledFanPayload.c_str());
}

if (strcmp(topic, topicboth) == 0) {
    if (message == "on") {
        digitalWrite(LED, HIGH);
        digitalWrite(FAN, HIGH);
        ledState = true;
        fanState = true;
        
        // Tạo một đối tượng JSON
        DynamicJsonDocument doc(256);
        doc["LED"] = "on";
        doc["FAN"] = "on";

        // Serialize đối tượng JSON thành một chuỗi JSON
        String payload;
        serializeJson(doc, payload);

        // Gửi chuỗi JSON
        client.publish(notification, payload.c_str());

    } else if (message == "off") {
        digitalWrite(LED, LOW);
        digitalWrite(FAN, LOW);
        ledState = false;
        fanState = false;

        // Tạo một đối tượng JSON
        DynamicJsonDocument doc(256);
        doc["LED"] = "off";
        doc["FAN"] = "off";

        // Serialize đối tượng JSON thành một chuỗi JSON
        String payload;
        serializeJson(doc, payload);

        // Gửi chuỗi JSON
        client.publish(notification, payload.c_str());
    }
}

  Serial.println();
  Serial.println("-----------------------");
}

void publishSensorData() {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
     int ldrValue = analogRead(ldrpin);
    if (!isnan(temp) && !isnan(hum)) {
        DynamicJsonDocument doc(256);
        doc["temperature"] = temp;
        doc["humidity"] = hum;
        doc["light"] = ldrValue;
        String payload;
        serializeJson(doc, payload);

        uint16_t packetId = client.publish(topicSensor, payload.c_str(), true);
        Serial.printf("Publishing on topic %s at QoS 1, packetId: %i", topicSensor, packetId);
        Serial.printf("Message: %s\n", payload.c_str());
    } else {
        Serial.println("Failed to read from DHT sensor!");
    }
}

unsigned long previousMillis = 0;   
const long interval = 3000;        

void loop() {
  client.loop();
  delay(500);  // Delay for a short period in each loop iteration
  unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        publishSensorData();
    }

}