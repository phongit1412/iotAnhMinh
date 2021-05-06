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
Cần thông thạo các commands git:
https://git-scm.com/docs/gittutorial
push lên github download git bash
https://git-scm.com/download/win
App.py chạy bằng Python Flask 
Từ khoá render index with python flask
Tutorial: https://flask.palletsprojects.com/en/1.1.x/quickstart/
Sử dụng
from flask import Flask, render_template, Response, request
app = Flask(__name__)
@app.route('/') //Bắt route
def index():    
    return render_template('index.html')
if __name__ == "__main__":
    app.run(host="0.0.0.0", port="8080")
Tại đấy render_template mở file index.html trong folder templates với đường dẫn mặc định VD: http://127.0.0.1:8080
![alt text](https://imgur.com/ZkzI0MG)
Tương tự như thế đến phần webcam
@app.route('/camera') 
def camera():    
    return render_template('camera.html')
truy cập đến trang camera.html -> VD như này: http://127.0.0.1:8080/camera
tại trang camera ta dùng 
<div class="text-center">
        <!-- video -->
        <img src="{{ url_for('video_feed') }}" class="mx-auto">
</div>

Để render hình ảnh đến. Phần xử lý ảnh như sau:
Từ khoá Face detection with Python: (Kiểm tra viền mặt)
-	Xử lý ảnh: https://realpython.com/face-recognition-with-python/
-	Xử lý với video live cam: https://realpython.com/face-detection-in-python-using-a-webcam/
Eye detection with Python: (Kiểm tra vị trí mắt)
-	https://pythonprogramming.net/haar-cascade-face-eye-detection-python-opencv-tutorial/
Code trong file chỗ nào ko hiểu hỏi t chú thích sẽ bổ sung từ từ 😊
Triền khai bot chat telegram 
Link tham khảo: https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-telegram?view=azure-bot-service-4.0 (Tiếng anh chủ yếu để đọc documents)
Tiếng việt dễ dùng dễ hiểu hơn
https://blog.cloud365.vn/linux/tao-canh-bao-su-dung-telegram-python/

Thư viện cần thiết:
import requests, json
from telegram import *
from telegram.ext import *

Sao khi tạo xong
#telegram bot
def send_text_bot_telegram():
    try:
        telegram_notify = Bot("1616356914:AAHPClJkMWIpiDPpwMrYRumtdiannDAKMIw")
        message = "có người lạ"
        telegram_notify.send_message(chat_id="-1001288626996", text=message, parse_mode='Markdown')
    except Exception as ex:
        print(ex)
def send_image_bot_telegram():
    files = {'photo':open('Unknown\%s\%s.jpg' %(dayy, current_time), 'rb')}
    resp = requests.post('https://api.telegram.org/bot1616356914:AAHPClJkMWIpiDPpwMrYRumtdiannDAKMIw/sendPhoto?chat_id=-1001288626996&caption=%s' %datetimeString, files=files)
Code đẩy đủ hơn trong file xem file để dễ nhìn hơn
Chỉ cần gọi đến hàm là nó chạy
Python chỉ xử lý 3 chức năng chính như trên là: phụ trách BE với Flask, xử lý hình ảnh, thông báo qua telegram. Còn lại xử lý chính là dùng JS
Phần Web index.html và JavaScript
Phần api dự báo thời tiết 7 ngày tại khu vực nhất định https://weatherwidget.io/
Phần api thời tiết nhiệt độ dùng https://openweathermap.org/
Phần giọng nói dùng https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
-	Recognition.lang = ‘en-US’ //Ko set cái này
-	Vì khi set nó chỉ nhận dạng giọng nói tiếng anh đã thử qua set tiếng việt nhưng cũng không ổn định lắm nên dùng như sau:
-	speechRecognizer.continuous = true; //tiếp tục đợi để nghe
-	speechRecognizer.interimResults = true; //kết quả tạm thời đoán trước(gợi ý từ)
-	Để nó dự đoán và tự nhận dạng từ dựa trên cơ chế hoạt động tương tự như tìm kiếm bằng giọng nói thông qua google
Đọc code giao diện xử lý css với bootstrap bằng tailwind css dùng thay thế bootstrap 5
https://tailwindcss.com/docs
font chữ t dùng: https://fonts.google.com/
và các icon kiếm trên gg thôi
Truy cập database từ firebase cái này chắc mài bít dùng rùi 
 
Dùng DOM để xử lý các button và các function này thì chỉ có đọc code thôi tại nó thiên về xử lý code file app.js

Phần biểu đổ chart vẽ bằng nét line:
https://www.chartjs.org/docs/latest/samples/bar/vertical.html
Link Project trên github
https://github.com/annminn104/iotAnhMinh 
Cách chạy python app.py
Với port thì mình set trên file app.py vd 8080
Muốn http thành https
Dùng giải pháp ngrok biến web local ra internet. Có file ngrok.exe trong project un á
Chạy lần đầu cần quyền như này 
./ngrok authtoken 1ljzw84P66sl16eAQFnyACrf53d_4q54SxQaa9hBW1DNSyLo7
Này ko cần giống t chỉ cần lên ngrok down app về rùi tạo tài khoản sau đó coi cái key nó là gì rùi chạy như trên là key của t á
Chạy với cú pháp ngrok http 8080
Link: https://ngrok.com/docs 
Có thể set tài khoản và mật khẩu khi truy cập trong link trên có hướng dẫn
Sau khi chạy xong nó hiện ra 2 link có domain random hơi xấu 1 cái http và 1 cái https cái nào cũng dùng đc
Chạy này lệnh nì oke nhất:
Đầu tiên python app.py
Sau đó mở ngrok.exe: ngrok http -region ap -auth=”admin:minh” 8080
-	Với -region ap là là khu vực singapo




