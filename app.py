import cv2, sys, numpy, os, time
from flask import Flask, render_template, Response, request
import requests, json
from telegram import *
from telegram.ext import *
from datetime import datetime
from datetime import date
import crypto
import sys
sys.modules['Crypto'] = crypto
import pyrebase

size = 2 # change this to 4 to speed up processing trade off is the accuracy
classifier = 'haarcascade_frontalface_default.xml'
image_dir = 'images'
classeye = 'haarcascade_eye.xml'

print("Face Recognition Starting ...")
# Create a list of images,labels,dictionary of corresponding names
(images, labels, names, id) = ([], [], {}, 0)

app = Flask(__name__)
now = datetime.now()
current_time = now.strftime("%H_%M_%S")
today = date.today()
dayy = today.strftime("%d_%m_%Y")
datetimeString = now.strftime("%d/%m/%Y %H:%M:%S")

apikey_weather = "f146799a557e8ab658304c1b30cc3cfd"
baseurl_weather = "https://api.openweathermap.org/data/2.5/weather?"

firebaseConfig = {
    "apiKey": "AIzaSyBQfGze72rHnbK0jhnX-aIGUbAuLs6pdvI",
    "authDomain": "minhpart2-7ddad.firebaseapp.com",
    "databaseURL": "https://minhpart2-7ddad-default-rtdb.firebaseio.com",
    "projectId": "minhpart2-7ddad",
    "storageBucket": "minhpart2-7ddad.appspot.com",
    "messagingSenderId": "616895406183",
    "appId": "1:616895406183:web:bb4f6ba2ac5a7638fe34c2",
    "measurementId": "G-1Y8JM6GMKT"
 }
firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()

@app.route('/')
def index():          
    #render home page
    return render_template('index.html')

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

######################################################################################################
bot = Bot("1616356914:AAHPClJkMWIpiDPpwMrYRumtdiannDAKMIw")
updater = Updater("1616356914:AAHPClJkMWIpiDPpwMrYRumtdiannDAKMIw", use_context=True)
dispatcher = updater.dispatcher
def chat_voi_bot(update:Update, context:CallbackContext):
    fullurl_weather = 'http://api.openweathermap.org/data/2.5/weather?appid=f146799a557e8ab658304c1b30cc3cfd&q=SaiGon'
    reponseW = requests.get(fullurl_weather)
    x = reponseW.json()
    if x["cod"] != "404":
        city_name = x["name"]
        y = x["main"]
        current_temperature = y["temp"]
        current_pressure = y["pressure"]
        current_humidiy = y["humidity"]
        z = x["weather"]
        weather_description = z[0]["description"] #trạng thái thời tiếp với [0] là english

        if str(weather_description) == "few clouds":
            weather_description = "Mây ít"
        elif str(weather_description) == "scattered clouds":
            weather_description = "Mây rải rác"
        elif str(weather_description) == "broken clouds":
            weather_description = "Mây tảng to"
        elif str(weather_description) == "overcast clouds":
            weather_description = "Mây u ám"
        elif str(weather_description) == "clear sky":
            weather_description = "Bầu trời quang đãng"
            #######
        elif str(weather_description) == "rain":
            weather_description = "Mưa"
        elif str(weather_description) == "light rain":
            weather_description = "Mưa nắng"
        elif str(weather_description) == "moderate rain":
            weather_description = "Mưa vừa"
        elif str(weather_description) == "heavy intensity rain":
            weather_description = "Mưa lớn"
        elif str(weather_description) == "very heavy rain":
            weather_description = "Mưa rất lớn"
        elif str(weather_description) == "extreme rain":
            weather_description = "Mưa cực lớn"
        elif str(weather_description) == "freezing rain":
            weather_description = "Mưa đóng băng"
        elif str(weather_description) == "light intensity shower rain":
            weather_description = "Mưa rào nhẹ"
        elif str(weather_description) == "shower rain":
            weather_description = "Mưa rào"
        elif str(weather_description) == "heavy intensity shower rain":
            weather_description = "Mưa rào cường độ lớn"
        elif str(weather_description) == "ragged shower rain":
            weather_description = "Mưa rào lớn"
            #######
        elif str(weather_description) == "light intensity drizzle":
            weather_description = "Cường độ nhẹ Mưa phùn"
        elif str(weather_description) == "drizzle":
            weather_description = "Mưa phùn"
        elif str(weather_description) == "heavy intensity drizzle":
            weather_description = "Cường độ nặng Mưa phùn"
        elif str(weather_description) == "light intensity drizzle rain":
            weather_description = "Cường độ nhẹ Mưa phùn"
        elif str(weather_description) == "drizzle rain":
            weather_description = "Mưa phùn"
        elif str(weather_description) == "heavy intensity drizzle rain":
            weather_description = "Cường độ lớn Mưa phùn"
        elif str(weather_description) == "shower rain and drizzle":
            weather_description = "Mưa rào và Mưa phùn"
        elif str(weather_description) == "heavy shower rain and drizzle":
            weather_description = "Mưa rào và Mưa phùn (nặng hạt)"
        elif str(weather_description) == "shower drizzle":
            weather_description = "Mưa phùn"
            #######
        elif str(weather_description) == "thunderstorm with light rain":
            weather_description = "Giông Bão có Mưa nhẹ"
        elif str(weather_description) == "thunderstorm with rain":
            weather_description = "Giông Bão có Mưa"
        elif str(weather_description) == "thunderstorm with heavy rain":
            weather_description = "Giông Bão với Mưa lớn"
        elif str(weather_description) == "light thunderstorm":
            weather_description = "Giông bão nhẹ"
        elif str(weather_description) == "thunderstorm":
            weather_description = "Giông tố"
        elif str(weather_description) == "heavy thunderstorm":
            weather_description = "Giông Bão lớn"
        elif str(weather_description) == "ragged thunderstorm":
            weather_description = "Cơn giông Bão"
        elif str(weather_description) == "thunderstorm with light drizzle":
            weather_description = "Giông Bão có Mưa phùn nhẹ"
        elif str(weather_description) == "thunderstorm with drizzle":
            weather_description = "Giông Bão có Mưa phùn"
        elif str(weather_description) == "thunderstorm with heavy drizzle":
            weather_description = "Giông Bão với Mưa phùn lớn"

        t = x["wind"]
        speed_wind = t["speed"]
        weather_visibility = x["visibility"]
        h = x["clouds"]
        percent_cloud = h["all"]
        textsend = (city_name +
                    "\n Nhiệt độ: " +
                            str(current_temperature-273.15) + "°C" + 
                    "\n Áp suất khí quyển: " +
                            str(current_pressure) + "hPa" +
                    "\n Độ ẩm: " +
                            str(current_humidiy) + "%" + 
                    "\n Trạng thái thời tiết: " +
                            str(weather_description) +
                    "\n Tốc độ gió: " +
                            str(speed_wind) + "m/s" + 
                    "\n Tầm nhìn xa: " +
                            str(weather_visibility/1000) + "km" +
                    "\n Mật độ mây: " +
                            str(percent_cloud) + "%")
        bot.send_message(
            chat_id = update.effective_chat.id,
            text = textsend,
        )
    else:
        print("City Not Found")
start_value = CommandHandler('weather', chat_voi_bot)
dispatcher.add_handler(start_value)
updater.start_polling()
############################################################################################################

# Get the folders containing the training data
for (subdirs, dirs, files) in os.walk(image_dir):

    # Loop through each folder named after the subject in the photos
    for subdir in dirs:
        names[id] = subdir
        
        subjectpath = os.path.join(image_dir, subdir)

        # Loop through each photo in the folder
        for filename in os.listdir(subjectpath):

            # Skip non-image formats
            f_name, f_extension = os.path.splitext(filename)
            if(f_extension.lower() not in
                    ['.png','.jpg','.jpeg','.gif','.pgm']):
                print("Skipping "+filename+", wrong file type")
                continue
            path = subjectpath + '/' + filename
            label = id

            # Add to training data
            images.append(cv2.imread(path, 0))
            labels.append(int(label))
        id += 1
(im_width, im_height) = (120, 102)

# Create a Numpy array from the two lists above
(images, labels) = [numpy.array(lis) for lis in [images, labels]]

model = cv2.face.LBPHFaceRecognizer_create()
model.train(images, labels)
haar_cascade = cv2.CascadeClassifier(classifier)
eye_cascade = cv2.CascadeClassifier(classeye)
webcam = cv2.VideoCapture(0) #  0 to use webcam
#szie video
webcam.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
webcam.set(cv2.CAP_PROP_FRAME_HEIGHT, 180)
webcam.set(cv2.CAP_PROP_FPS, 25)

countUnknown = ['a']
directory = ("%s" %dayy)
parent_dir = "Unknown/"
path = os.path.join(parent_dir, directory)
try:
    os.makedirs(path, exist_ok = True)
    print("Directory '%s' created successfully" % directory)
except OSError as error:
    print("Directory '%s' can not be created" % directory)

def process():    
    while True:        
        # Loop until the camera is working
        rval = False
        while(not rval):
        # Put the image from the webcam into 'frame'
            (rval, frame) = webcam.read()
            if(not rval):
                print("Failed to open webcam. Trying again...")
        startTime = time.time()
        # Flip the image (optional)
        frame=cv2.flip(frame,1) # 0 = horizontal ,1 = vertical , -1 = both

        # Convert to grayscalel
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Resize to speed up detection (optinal, change size above)
        mini = cv2.resize(gray, (int(gray.shape[1] / size), int(gray.shape[0] / size)))        

        # Detect faces and loop through each one
        faces = haar_cascade.detectMultiScale(mini)
        for i in range(len(faces)):
            face_i = faces[i]

            # Coordinates of face after scaling back by size
            (x, y, w, h) = [v * size for v in face_i]
            face = gray[y:y + h, x:x + w]

            roi_color = frame[y:y + h, x:x + w]
            eyes = eye_cascade.detectMultiScale(face)

            for(ex, ey, ew, eh) in eyes:
                cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
                face_resize = cv2.resize(face, (im_width, im_height))
                start =(x, y)
                end =(x + w, y + h)
                # Try to recognize the face
                prediction = model.predict(face_resize)
                cv2.rectangle(frame,start , end, (0, 255, 0), 3) # creating a bounding box for detected face
                cv2.rectangle(frame, (start[0],start[1]-20), (start[0]+120,start[1]), (0, 255, 255), -3) # creating  rectangle on the upper part of bounding box
                #for i in prediction[1]
                if prediction[1]<90 :  # note: 0 is the perfect match  the higher the value the lower the accuracy
                    cv2.putText(frame,'%s - %.0f' % (names[prediction[0]],prediction[1]),(x+5, y-5), cv2.FONT_HERSHEY_SIMPLEX,0.6,(0, 0, 0),thickness=2)
                    #print('%s - %.0f' % (names[prediction[0]],prediction[1]))
                    countUnknown.clear()
                else:                    
                    countUnknown.append('a')
                    alen = len(countUnknown)
                    cv2.putText(frame,("Unknown {} ".format(str(int(prediction[1])))),(x+5, y-5), cv2.FONT_HERSHEY_SIMPLEX,0.5,(0, 0, 0),thickness=2)
                    print("Unknown -",prediction[1])
                    if(alen > 50):                        
                        showPic = cv2.imwrite("Unknown/%s/%s.jpg" %(dayy, current_time),frame)
                        path_local = ("Unknown/%s/%s.jpg" %(dayy, current_time))
                        storage.child("Unknown/%s/%s.jpg" %(dayy, current_time)).put(path_local)
                        send_text_bot_telegram()                        
                        send_image_bot_telegram()                        
                        countUnknown.clear()                        
                        print("check người lạ")                    
        endTime = time.time()
        fps = 1/(endTime-startTime)
        cv2.rectangle(frame,(30,48),(130,70),(0,0,0),-1)
        cv2.putText(frame,"Fps : {} ".format(str(int(fps))),(34,65),cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,255,255),2)
        # Show the image and check for "q" being pressed
        #cv2.imshow('Recognition System', frame)
        ret, buffer = cv2.imencode('.jpg', frame) #compress and store image to memory buffer
        frame = buffer.tobytes()    
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        
        #concat frame one by one and return frame
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break        
    webcam.release()
    cv2.destroyAllWindows()

@app.route('/camera')
def camera():    
    return render_template('camera.html')
@app.route('/index')
def home():    
    return render_template('index.html')

#Video streaming route
@app.route('/video_feed')
def video_feed():    
    return Response(process(),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    #ssl_context=('cert.pem', 'key.pem')
    app.run(host="127.0.0.1", port="8080")