# Đồ án tốt nghiệp "Nhà thông minh". 2021

- Bao gồm các mục sau:
  + Theo dỗi thông số cơ bản trong nhà như: Nhiệt độ, độ ẩm, độ sáng,...
  + Giám sát người ra vào cửa nhà bằng hệ thống camera giám sát khuôn mặt .
  + Điều khiển đèn và máy lạnh từ xa bằng thiết bị: button hoặc giọng nói.
- Các thiết bị cần thiết:
  + ESP-8266
  + Arduino
  + Camera và microphone
  + LED
  + PIR
  + ULTRASONIC
  + PHOTODIODE
  + DHT22
  + MQ-2
  + LED Hồng ngoại
  + LED thu Hồng ngoại
* Firebase là nơi chứ Database nhận từ ESP và Web
* ESP-8266: thực viện việt đo đạt các chỉ số trong nhà và là thiết bị thu phát các lệnh remote.
* Server chạy bằng Python Flask kết nối xử lý hình ảnh thông qua webcam (thiết bị ngoại vi). Đồng thời giúp deploy webapp duy trì hệ thống hoạt động 24/7.
* Javascript xử lý tín hiệu âm thanh nhận vào.
