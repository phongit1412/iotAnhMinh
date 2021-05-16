#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <DHT.h>

// Set these to run example.
#define FIREBASE_HOST "minhpart2-7ddad-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "2CqyAWeaVtkwpUsIQR4jrlpzOPQ1uOAyKb3L9gE8"
#define WIFI_SSID "Tang Thuong"
#define WIFI_PASSWORD "1234567890"

#define DHTPIN D2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup()
{
  Serial.begin(115200);
  dht.begin();                                                  //reads dht sensor data

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println();
  Serial.print("Connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());                               //prints local IP address
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);                 // connect to the firebase

}

void loop()
{
  float h = dht.readHumidity();                                 // Read Humidity
  float t = dht.readTemperature();                              // Read temperature

  if (isnan(h) || isnan(t))                                     // Checking sensor working
  {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  Serial.print("Humidity: ");
  Serial.print(h);
  String fireHumid = String(h) + String("%");                   //Humidity integer to string conversion

  Serial.print("%  Temperature: "); 
  Serial.print(t);
  Serial.println("°C ");
  String fireTemp = String(t) + String("°C");                  //Temperature integer to string conversion
  delay(5000);


  Firebase.pushString("/DHT11/Humidity", fireHumid);            //setup path to send Humidity readings
  Firebase.pushString("/DHT11/Temperature", fireTemp);         //setup path to send Temperature readings
  if (Firebase.failed())
  {

    Serial.print("pushing /logs failed:");
    Serial.println(Firebase.error());
    return;
  }
}
