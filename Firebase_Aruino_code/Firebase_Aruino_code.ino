#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <DHT.h>

// Khai báo host và key secrets
#define FIREBASE_HOST "minhpart2-7ddad-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "tJfhVPAbiocvoOCDf5iGWDYfQc89U06jEBhli5rg"
// Khai báo tên và pass WIFI
#define WIFI_SSID "Tang Thuong"
#define WIFI_PASSWORD "1234567890"

// Khai báo LED
int led = D0;
String fireStatus = "";

// Khai báo biến với thư viện DHT
#define DHTPIN D1
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Khai báo light photodiod
#define LIGHTPIN 0 // Analog A0

// Khai báo PIR HC-SR501
#define PIRPIN D2
int motion_st = 0;

//Week Days trong tuần
String weekDays[7] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};

//Các tháng trong năm
//String months[12] = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};

// Lấy h online từ ntpserver
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

// set time duy trì do đạt
unsigned long startTime = 0, currentTime = 0;
const unsigned long period = 10000; // lỗi sau 1phút


void setup() {
  // Xuất outbound 112500
  Serial.begin(112500);

  // Khai báo setup LED
  pinMode(led, OUTPUT);

  // Kiểm tra các kết nối WIFI
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

  // Xuất ra địa chỉ IP của WIFI đã kết nối
  Serial.print("IP Address is: ");
  Serial.println(WiFi.localIP());

  //Khởi động Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  //Set LED off cho lần đầu kết nối đến
  Firebase.setString("LED_STATUS", "OFF");

  // Khởi động timeclient của thư viện NTP để xác định time
  timeClient.begin();
  // Múi giờ VN GMT + 7 với 7*3600 = 7 * 60*60 cứ 1 múi h tăng lên 3600
  timeClient.setTimeOffset(7 * 3600);

  // Khởi đông DHT22
  dht.begin();

  // Khởi động Pir
  pinMode(PIRPIN, INPUT);

  startTime = millis();
  Serial.println(startTime);
}

void loop() {
  thietBiDoPK();
  thietBiDieuKhienPK();
}

// Hàm chứa các thiết bị điều khiển
void thietBiDieuKhienPK() {
  fireStatus = Firebase.getString("LED_STATUS");
  if (fireStatus == "ON") {
    Serial.println("Led Turned ON");
    digitalWrite(led, HIGH);
  }
  else if (fireStatus == "OFF") {
    Serial.println("Led Turned OFF");
    digitalWrite(led, LOW);
  }
  else {
    Serial.println("Kiểm tra kết nối! Vui lòng gửi ON/OFF đến LED");
  }
}

// Hàm chứ các thiết bị đo đạt
void thietBiDoPK() {
  // kiểm tra update time của NTPCLient
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  // Giờ Phút Giây
  String formattedTime = timeClient.getFormattedTime();
  //Serial.print("Formatted Time: ");
  //Serial.println(formattedTime);
  //Thứ Ngày Tháng Năm
  String weekDay = weekDays[timeClient.getDay()]; // thứ
  struct tm *ptm = gmtime ((time_t *)&epochTime);
  int monthDay = ptm->tm_mday; // ngày
  int currentMonth = ptm->tm_mon + 1; // tháng
  int currentYear = ptm->tm_year + 1900; // năm
  String currentDate = String(currentYear) + "-" + String(currentMonth) + "-" + String(monthDay); // năm tháng ngày thứ
  //Serial.println(currentDate);

  currentTime = millis();
  Serial.println(currentTime);
  if (currentTime - startTime > period) {
    // Cây thư mục chứ data đo đạt đc gửi đến fiebase
    String ThietBiDo = "DuLieuDoPhongKhach/" + currentDate + "/" + formattedTime + "/";

    // Gửi time đo đạt đến Firebase
    Firebase.setString(ThietBiDo + "Time", formattedTime);

    // Khai báo biến chứa nhiệt độ và độ ẩm
    float h =  dht.readHumidity();
    float t = dht.readTemperature();
    if (isnan(h) || isnan(t)) {
      Serial.println("Lỗi kết nối DHT22");
      return;
    }

    // Gửi nhiệt độ và độ ẩm đến cây thư mục của firebase
    Firebase.setFloat(ThietBiDo + "Humidity", h);
    Firebase.setFloat(ThietBiDo + "Temperature", t);

    // Gửi dữ liệu ánh sáng đến firebase
    int light = analogRead(LIGHTPIN); // dùng chân anallog để đọc % độ sáng
    Firebase.setInt(ThietBiDo + "Light", light/100);

    // Gửi tín hiệu phát hiện chuyển động và thân nhiệt
    Firebase.setInt(ThietBiDo + "Motion", motion_st);
    motion_st = 0;

    // Kiểm tra trình trạng Firebase nếu lỗi
    if (Firebase.failed()) {
      Serial.println(Firebase.error());
    }
    startTime = currentTime;
  }
  if (digitalRead(PIRPIN) == HIGH) {
    motion_st = 1;
  }
  delay(2000);
}
