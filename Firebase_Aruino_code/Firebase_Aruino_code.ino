#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#define FIREBASE_HOST "minhpart2-7ddad-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "2CqyAWeaVtkwpUsIQR4jrlpzOPQ1uOAyKb3L9gE8"
#define WIFI_SSID "Tang Thuong"
#define WIFI_PASSWORD "1234567890"
String fireStatus = "";

//Week Days
String weekDays[7] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};

//Month names
//String months[12] = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};

// Lấy h online từ ntpserver
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
int led = D0;
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(led, OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP Address is : ");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.setString("LED_STATUS", "OFF");
  timeClient.begin();
  // Múi giờ VN
  timeClient.setTimeOffset(7 * 3600);
}

void loop() {
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  // Giờ Phút Giây
  String formattedTime = timeClient.getFormattedTime();
  Serial.print("Formatted Time: ");
  Serial.println(formattedTime);
  //Thứ Ngày Tháng Năm
  String weekDay = weekDays[timeClient.getDay()]; // thứ
  struct tm *ptm = gmtime ((time_t *)&epochTime);
  int monthDay = ptm->tm_mday; // ngày
  int currentMonth = ptm->tm_mon + 1; // tháng
  int currentYear = ptm->tm_year + 1900; // năm
  String currentDate = String(currentYear) + "-" + String(currentMonth) + "-" + String(monthDay); // năm tháng ngày thứ
  Serial.println(currentDate);

  thietBiDieuKhienPK();
}

void thietBiDieuKhienPK() {
  fireStatus = Firebase.getString("LED_STATUS");
  if (fireStatus == "ON") {
    Serial.println("Led Turned ON");
    digitalWrite(LED_BUILTIN, LOW);
    digitalWrite(led, HIGH);
  }
  else if (fireStatus == "OFF") {
    Serial.println("Led Turned OFF");
    digitalWrite(LED_BUILTIN, HIGH);
    digitalWrite(led, LOW);
  }
  else {
    Serial.println("Kiểm tra kết nối! Vui lòng gửi ON/OFF đến LED");
  }
}
void thietBiDoPK(){
  
}
