// Set up FIREBASE
var firebaseConfig = {
    apiKey: "AIzaSyBQfGze72rHnbK0jhnX-aIGUbAuLs6pdvI",
    authDomain: "minhpart2-7ddad.firebaseapp.com",
    databaseURL: "https://minhpart2-7ddad-default-rtdb.firebaseio.com",
    projectId: "minhpart2-7ddad",
    storageBucket: "minhpart2-7ddad.appspot.com",
    messagingSenderId: "616895406183",
    appId: "1:616895406183:web:bb4f6ba2ac5a7638fe34c2",
    measurementId: "G-1Y8JM6GMKT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
var dd = String(today.getDate());
//var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var mm = String(today.getMonth() + 1);
var yyyy = today.getFullYear();

today = dd + '-' + mm + '-' + yyyy;
console.log(today)
var todayFireBase = "PKThietBiDo" + "/" + today;

// Nhiệt độ API
function getWeather() {
    // let api = "https://api.openweathermap.org/data/2.5/weather";
    // let apiKey = "f146799a557e8ab658304c1b30cc3cfd";
    // location.innerHTML = "Locating...";
    // navigator.geolocation.getCurrentPosition(success, error);
    // function success(position) {
    //     latitude = 10.8201;
    //     longitude = 106.6892;
    //     // latitude = position.coords.latitude;
    //     // longitude = position.coords.longitude;

    //     let url =
    //         api +
    //         "?lat=" +
    //         latitude +
    //         "&lon=" +
    //         longitude +
    //         "&appid=" +
    //         apiKey +
    //         "&units=imperial";

    //     fetch(url)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //             let temp = data.main.temp;
    //             var temperature = Number((temp - 32) / 1.8000).toFixed(2) + "°C";
    //             // var location =
    //             //     data.name + " (" + Number(latitude).toFixed(0) + "°, " + Number(longitude).toFixed(0) + "°)";
    //             var location = data.name;
    //             var description = data.weather[0].main;
    //             var iconcode = data.weather[0].icon;
    //             document.querySelector('#apiOpenWeather').innerHTML = `<table><tr>
    //                                 <td>${temperature}<td>
    //                                 <td><img src="http://openweathermap.org/img/w/${iconcode}.png"/></td>
    //                                 <td>${description}</td>
    //                                 </tr></table>
    //                                 <p>${location}<p>`;
    //         });

    // }
    latitude = 10.8201;
    longitude = 106.6892;
    $.getJSON(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&APPID=f146799a557e8ab658304c1b30cc3cfd&units=metric",
        function (data) {
            let temp = data.main.temp + "°C";
            //var temperature = Number((temp - 32) / 1.8000).toFixed(2) + "°C";
            var location = data.name;
            var description = data.weather[0].main;
            var iconcode = data.weather[0].icon;
            console.log(temp, location, description, iconcode)
            document.querySelector('#apiOpenWeather').innerHTML = `<table><tr>
                                <td>${temp}<td>
                                <td><img src="http://openweathermap.org/img/w/${iconcode}.png"/></td>
                                <td>${description}</td>
                                </tr></table>
                                <p>${location}<p>`;
        }
    );

    function error() {
        location.innerHTML = "Unable to retrieve your location";
    }
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    getWeather()
})


function sendTempfirebase() {
    // latitude = position.coords.latitude;
    // longitude = position.coords.longitude;
    latitude = 10.8201;
    longitude = 106.6892;
    $.getJSON(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&APPID=f146799a557e8ab658304c1b30cc3cfd&units=metric",
        function (data) {
            var tempsendfirebase = data.main.temp;
            console.log(tempsendfirebase)
            firebase.database().ref('PKThietBiDieuKhien').update({
                "NhietDoBenNgoai": tempsendfirebase
            })
        }
    );
}
window.addEventListener('load', function () {
    sendTempfirebase()
})

// Lấy Data Phòng Khách
function SelectDataPhongKhach() {
    firebase.database().ref(todayFireBase).limitToLast(1).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    //var sensor = data.val().Name;
                    var humi = data.val().Humidity;
                    var temp = data.val().Temperature;
                    var date = data.val().Date;
                    //console.log(humi, date, temp)
                    if (typeof (humi) !== "undefined" && typeof (temp) !== "undefined" && typeof (date) !== "undefined") {
                        AddItemsToTable(date, humi, temp);
                    }
                }
            );
        });
}
// Chèn data phòng khách vào html
function AddItemsToTable(date, humi, temp) {
    document.querySelector('#DatePK').innerHTML = `${date}`;
    document.querySelector('#HumiPK').innerHTML = `${humi}`;
    document.querySelector('#TempPK').innerHTML = `${temp}`;
}
//Load
window.addEventListener('load', function () {
    SelectDataPhongKhach()
})

// Tìm Nhiệt Độ Độ Ẩm  [Thấp Nhất -> Cao Nhất]
var arrayTempMinMax = [], arrayHumiMinMax = [];
// Tìm giá trị nhỏ nhất và lớn nhất
function SelectMinMaxTempHumiPhongKhach() {
    var a, b, c, d;
    firebase.database().ref(todayFireBase).limitToLast(12).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    //console.log(JSON.stringify(snapshot.val()))
                    tempMinMax = data.val().Temperature;
                    if (typeof (tempMinMax) === "number") {
                        arrayTempMinMax.push(tempMinMax);
                        //console.log(array);
                        a = Math.min(...arrayTempMinMax);
                        b = Math.max(...arrayTempMinMax);
                    }
                    humiMinMax = data.val().Humidity;
                    if (typeof (humiMinMax) === "number") {
                        arrayHumiMinMax.push(humiMinMax);
                        //console.log(array);
                        c = Math.min(...arrayHumiMinMax);
                        d = Math.max(...arrayHumiMinMax);
                    }
                    AddTempHumiMinMaxPK(a, b, c, d)
                }
            );
        });
}
function AddTempHumiMinMaxPK(tempMin, tempMax, humiMin, humiMax) {
    document.querySelector('#tempMin').innerHTML = `${tempMin}`;
    document.querySelector('#tempMax').innerHTML = `${tempMax}`;
    document.querySelector('#humiMin').innerHTML = `${humiMin}`;
    document.querySelector('#humiMax').innerHTML = `${humiMax}`;
}
window.addEventListener('load', function () {
    SelectMinMaxTempHumiPhongKhach()
})

// Bật tắt LED
function onoffLED() {
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    document.querySelector('#toggleLED').addEventListener('click', () => {
        if (document.getElementById('toggleLED').checked == true) {
            firebaseRef.update({
                "LedStatus": "ON"
            })
        }
        else {
            firebaseRef.update({
                "LedStatus": "OFF"
            })
        }
    })
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    onoffLED()
})

// Kiểm tra LED đang ON hay OFF
function loadonoffLED() {
    firebase.database().ref().limitToFirst(parseInt(1)).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var led = data.val().LedStatus;
                    //console.log(led)
                    if (led == "on" || led == "ON" || led == "On" || led == "oN") {
                        document.getElementById('toggleLED').checked = true;
                    }
                    else {
                        document.getElementById('toggleLED').checked = false;
                    }
                }
            );
        });
}
//Load
window.addEventListener('load', function () {
    loadonoffLED()
})

// Bật tắt Auto-DaikinAC
function onoffAutoDaikinAC() {
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    document.querySelector('#toggleAutoDaikinAC').addEventListener('click', () => {
        if (document.getElementById('toggleAutoDaikinAC').checked == true) {
            firebaseRef.update({
                "autoDaikinAC": 1
            })
        }
        else {
            firebaseRef.update({
                "autoDaikinAC": 0
            })
        }
    })
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    onoffAutoDaikinAC()
})

// Kiểm tra Bật tắt Auto-DaikinAC ON hay OFF
function loadonoffAutoDaikinAC() {
    var auto;
    firebase.database().ref().limitToFirst(parseInt(1)).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    auto = data.val().autoDaikinAC;
                    //console.log(led)
                }
            );
            if (auto == 1) {
                document.getElementById('toggleAutoDaikinAC').checked = true;
            }
            else {
                document.getElementById('toggleAutoDaikinAC').checked = false;
            }
        });
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    loadonoffAutoDaikinAC()
})

// turn up and down daikin AC
function turndownupDaikinAC() {
    var value;
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    firebase.database().ref().limitToFirst(parseInt(1)).once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    value = data.val().NhietDoDieuChinh;
                    document.querySelector('#nhietdoDaikin').innerHTML = `${value}`;
                }
            )
            document.querySelector('#decrement').addEventListener('click', () => {
                value = value - 1;
                if (value < 16) {
                    document.getElementById('decrement').style.display = "none";
                }
                else {
                    document.getElementById('decrement').style.display = "inline";
                    document.getElementById('increment').style.display = "inline";
                    firebaseRef.update({
                        "NhietDoDieuChinh": value
                    })
                    document.querySelector('#nhietdoDaikin').innerHTML = `${value}`;
                }
            })
            document.querySelector('#increment').addEventListener('click', () => {
                value = value + 1;
                if (value > 30) {
                    document.getElementById('increment').style.display = "none";
                }
                else {
                    document.getElementById('increment').style.display = "inline";
                    document.getElementById('decrement').style.display = "inline";
                    firebaseRef.update({
                        "NhietDoDieuChinh": value
                    })
                    document.querySelector('#nhietdoDaikin').innerHTML = `${value}`;
                }
            })
        }
    )
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    turndownupDaikinAC()
})

function LoadNhietDoDaikinACMulti() {
    firebase.database().ref().limitToFirst(parseInt(1)).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var value = data.val().NhietDoDieuChinh;
                    document.querySelector('#nhietdoDaikin').innerHTML = `${value}`;
                }
            )
        })
}
window.addEventListener('DOMContentLoaded', function () {
    LoadNhietDoDaikinACMulti()
})


// Điều chỉnh Fan DaikinAC
function getvalueFanDaikin() {
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    var green = "border-2 border-green-700 xl:p-2"
    var red = "border-2 border-red-200 xl:p-2"
    document.querySelector('#valuebtnFan1').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnFan1').value;
        document.getElementById('imgFan1').setAttribute("class", green)
        document.getElementById('imgFan2').setAttribute("class", red)
        document.getElementById('imgFan3').setAttribute("class", red)
        firebaseRef.update({
            "Fan": ele
        })
        console.log(ele)
    })
    document.querySelector('#valuebtnFan2').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnFan2').value;
        document.getElementById('imgFan1').setAttribute("class", red)
        document.getElementById('imgFan2').setAttribute("class", green)
        document.getElementById('imgFan3').setAttribute("class", red)
        firebaseRef.update({
            "Fan": ele
        })
        console.log(ele)
    })
    document.querySelector('#valuebtnFan3').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnFan3').value;
        document.getElementById('imgFan1').setAttribute("class", red)
        document.getElementById('imgFan2').setAttribute("class", red)
        document.getElementById('imgFan3').setAttribute("class", green)
        firebaseRef.update({
            "Fan": ele
        })
        console.log(ele)
    })
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    getvalueFanDaikin()
})

//LOAD Fan DaikinAC
function loadfandaikinac() {
    var green = "border-2 border-green-700 xl:p-2"
    var red = "border-2 border-red-200 xl:p-2"
    var opacity100 = "opacity-100 hover:opacity-100"
    var opacity50 = "opacity-50 hover:opacity-100"
    firebase.database().ref().limitToFirst(1).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var fan = data.val().Fan;
                    if (fan == "min" || fan == "MIN") {
                        document.getElementById('valuebtnFan1').setAttribute("class", opacity100)
                        document.getElementById('imgFan1').setAttribute("class", green)
                        document.getElementById('valuebtnFan2').setAttribute("class", opacity50)
                        document.getElementById('imgFan2').setAttribute("class", red)
                        document.getElementById('valuebtnFan3').setAttribute("class", opacity50)
                        document.getElementById('imgFan3').setAttribute("class", red)
                    }
                    if (fan == "med" || fan == "MED") {
                        document.getElementById('valuebtnFan1').setAttribute("class", opacity50)
                        document.getElementById('imgFan1').setAttribute("class", red)
                        document.getElementById('valuebtnFan2').setAttribute("class", opacity100)
                        document.getElementById('imgFan2').setAttribute("class", green)
                        document.getElementById('valuebtnFan3').setAttribute("class", opacity50)
                        document.getElementById('imgFan3').setAttribute("class", red)
                    }
                    if (fan == "max" || fan == "MAX") {
                        document.getElementById('valuebtnFan1').setAttribute("class", opacity50)
                        document.getElementById('imgFan1').setAttribute("class", red)
                        document.getElementById('valuebtnFan2').setAttribute("class", opacity50)
                        document.getElementById('imgFan2').setAttribute("class", red)
                        document.getElementById('valuebtnFan3').setAttribute("class", opacity100)
                        document.getElementById('imgFan3').setAttribute("class", green)
                    }
                }
            )
        })
}
window.addEventListener('DOMContentLoaded', function () {
    loadfandaikinac()
})


// Điều chỉnh Mode DaikinAC
function getvalueModeDaikin() {
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    var green = "border-2 border-green-700 xl:p-2"
    var red = "border-2 border-red-200 xl:p-2"
    document.querySelector('#valuebtnMode1').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnMode1').value;
        document.getElementById('imgMode1').setAttribute("class", green)
        document.getElementById('imgMode2').setAttribute("class", red)
        document.getElementById('imgMode3').setAttribute("class", red)
        document.getElementById('imgMode4').setAttribute("class", red)
        document.getElementById('imgMode5').setAttribute("class", red)
        firebaseRef.update({
            "Mode": ele
        })
        console.log(ele)
    })
    document.querySelector('#valuebtnMode2').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnMode2').value;
        document.getElementById('imgMode1').setAttribute("class", red)
        document.getElementById('imgMode2').setAttribute("class", green)
        document.getElementById('imgMode3').setAttribute("class", red)
        document.getElementById('imgMode4').setAttribute("class", red)
        document.getElementById('imgMode5').setAttribute("class", red)
        firebaseRef.update({
            "Mode": ele
        })
        console.log(ele)
    })
    document.querySelector('#valuebtnMode3').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnMode3').value;
        document.getElementById('imgMode1').setAttribute("class", red)
        document.getElementById('imgMode2').setAttribute("class", red)
        document.getElementById('imgMode3').setAttribute("class", green)
        document.getElementById('imgMode4').setAttribute("class", red)
        document.getElementById('imgMode5').setAttribute("class", red)
        firebaseRef.update({
            "Mode": ele
        })
        console.log(ele)
    })
    document.querySelector('#valuebtnMode4').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnMode4').value;
        document.getElementById('imgMode1').setAttribute("class", red)
        document.getElementById('imgMode2').setAttribute("class", red)
        document.getElementById('imgMode3').setAttribute("class", red)
        document.getElementById('imgMode4').setAttribute("class", green)
        document.getElementById('imgMode5').setAttribute("class", red)
        firebaseRef.update({
            "Mode": ele
        })
        console.log(ele)
    })
    document.querySelector('#valuebtnMode5').addEventListener('click', () => {
        var ele = document.getElementById('valuebtnMode5').value;
        document.getElementById('imgMode1').setAttribute("class", red)
        document.getElementById('imgMode2').setAttribute("class", red)
        document.getElementById('imgMode3').setAttribute("class", red)
        document.getElementById('imgMode4').setAttribute("class", red)
        document.getElementById('imgMode5').setAttribute("class", green)
        firebaseRef.update({
            "Mode": ele
        })
        console.log(ele)
    })
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    getvalueModeDaikin()
})


//LOAD Mode DaikinAC
function loadmodedaikinac() {
    var green = "border-2 border-green-700 xl:p-2"
    var red = "border-2 border-red-200 xl:p-2"
    var opacity100 = "opacity-100 hover:opacity-100"
    var opacity50 = "opacity-50 hover:opacity-100"
    firebase.database().ref().limitToFirst(1).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var mode = data.val().Mode;
                    if (mode == "auto" || mode == "AUTO") {
                        document.getElementById('valuebtnMode1').setAttribute("class", opacity100)
                        document.getElementById('imgMode1').setAttribute("class", green)
                        document.getElementById('valuebtnMode2').setAttribute("class", opacity50)
                        document.getElementById('imgMode2').setAttribute("class", red)
                        document.getElementById('valuebtnMode3').setAttribute("class", opacity50)
                        document.getElementById('imgMode3').setAttribute("class", red)
                        document.getElementById('valuebtnMode4').setAttribute("class", opacity50)
                        document.getElementById('imgMode4').setAttribute("class", red)
                        document.getElementById('valuebtnMode5').setAttribute("class", opacity50)
                        document.getElementById('imgMode5').setAttribute("class", red)
                    }
                    if (mode == "snow" || mode == "SNOW") {
                        document.getElementById('valuebtnMode1').setAttribute("class", opacity50)
                        document.getElementById('imgMode1').setAttribute("class", red)
                        document.getElementById('valuebtnMode2').setAttribute("class", opacity100)
                        document.getElementById('imgMode2').setAttribute("class", green)
                        document.getElementById('valuebtnMode3').setAttribute("class", opacity50)
                        document.getElementById('imgMode3').setAttribute("class", red)
                        document.getElementById('valuebtnMode4').setAttribute("class", opacity50)
                        document.getElementById('imgMode4').setAttribute("class", red)
                        document.getElementById('valuebtnMode5').setAttribute("class", opacity50)
                        document.getElementById('imgMode5').setAttribute("class", red)
                    }
                    if (mode == "dry" || mode == "DRY") {
                        document.getElementById('valuebtnMode1').setAttribute("class", opacity50)
                        document.getElementById('imgMode1').setAttribute("class", red)
                        document.getElementById('valuebtnMode2').setAttribute("class", opacity50)
                        document.getElementById('imgMode2').setAttribute("class", red)
                        document.getElementById('valuebtnMode3').setAttribute("class", opacity100)
                        document.getElementById('imgMode3').setAttribute("class", green)
                        document.getElementById('valuebtnMode4').setAttribute("class", opacity50)
                        document.getElementById('imgMode4').setAttribute("class", red)
                        document.getElementById('valuebtnMode5').setAttribute("class", opacity50)
                        document.getElementById('imgMode5').setAttribute("class", red)
                    }
                    if (mode == "fan" || mode == "FAN") {
                        document.getElementById('valuebtnMode1').setAttribute("class", opacity50)
                        document.getElementById('imgMode1').setAttribute("class", red)
                        document.getElementById('valuebtnMode2').setAttribute("class", opacity50)
                        document.getElementById('imgMode2').setAttribute("class", red)
                        document.getElementById('valuebtnMode3').setAttribute("class", opacity50)
                        document.getElementById('imgMode3').setAttribute("class", red)
                        document.getElementById('valuebtnMode4').setAttribute("class", opacity100)
                        document.getElementById('imgMode4').setAttribute("class", green)
                        document.getElementById('valuebtnMode5').setAttribute("class", opacity50)
                        document.getElementById('imgMode5').setAttribute("class", red)
                    }
                    if (mode == "heat" || mode == "HEAT") {
                        document.getElementById('valuebtnMode1').setAttribute("class", opacity50)
                        document.getElementById('imgMode1').setAttribute("class", red)
                        document.getElementById('valuebtnMode2').setAttribute("class", opacity50)
                        document.getElementById('imgMode2').setAttribute("class", red)
                        document.getElementById('valuebtnMode3').setAttribute("class", opacity50)
                        document.getElementById('imgMode3').setAttribute("class", red)
                        document.getElementById('valuebtnMode4').setAttribute("class", opacity50)
                        document.getElementById('imgMode4').setAttribute("class", red)
                        document.getElementById('valuebtnMode5').setAttribute("class", opacity100)
                        document.getElementById('imgMode5').setAttribute("class", green)
                    }
                }
            )
        })
}
window.addEventListener('DOMContentLoaded', function () {
    loadmodedaikinac()
})

// LOAD Bật Tắt Daikin
function turnonoffDaikin() {
    var value;
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    document.querySelector('#toggleDaikinAC').addEventListener('click', () => {
        if (document.getElementById('toggleDaikinAC').checked == true) {
            firebaseRef.update({
                "DaikinStatus": "ON"
            })
        }
        else {
            firebaseRef.update({
                "DaikinStatus": "OFF"
            })
        }
    })
    firebase.database().ref().limitToFirst(1).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    value = data.val().DaikinStatus;
                    //console.log(value)
                })
            if (value == "ON" || value == "On" || value == "on" || value == "oN") {
                document.querySelector(`#toggleDaikinAC`).checked = true;
            }
            else {
                document.querySelector(`#toggleDaikinAC`).checked = false;
            }
        })
}
//Load
window.addEventListener('load', function () {
    turnonoffDaikin()
})

// Thống kê & lịch sử hoạt động sensor Phòng khách
function viewmorePK() {
    //var date, temp, humi, light, motion, statusdaikin;
    firebase.database().ref(todayFireBase).limitToLast(35).once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var date = data.val().Date;
                    var temp = data.val().Temperature;
                    var humi = data.val().Humidity;
                    var light = data.val().Light;
                    var motion = data.val().Motion;
                    if (typeof (date) !== "undefined" && typeof (temp) !== "undefined" && typeof (humi) !== "undefined" && typeof (light) !== "undefined" && typeof (motion) !== "undefined") {
                        Addalldatatable(date, temp, humi, light, motion);
                    }
                }
            )
        })
}

function Addalldatatable(date, temp, humi, light, motion) {
    var tbody = document.getElementById('tbodythongke');
    var trow = document.createElement('tr');
    trow.setAttribute("class", "flex w-full md:mb-4");
    var td1 = document.createElement('td');
    td1.setAttribute("class", "p-1 w-full md:w-1/5")
    var td2 = document.createElement('td');
    td2.setAttribute("class", "p-1 w-full md:w-1/5")
    var td3 = document.createElement('t');
    td3.setAttribute("class", "p-1 w-full md:w-1/5")
    var td4 = document.createElement('td');
    td4.setAttribute("class", "p-1 w-full md:w-1/5")
    var td5 = document.createElement('td');
    td5.setAttribute("class", "p-1 w-full md:w-1/5")
    td1.innerHTML = date;
    td2.innerHTML = temp;
    td3.innerHTML = humi;
    td4.innerHTML = light;
    td5.innerHTML = motion;
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    tbody.appendChild(trow);
}
// Load
window.addEventListener('load', function () {
    viewmorePK()
})

//thu thập nhiệt độ độ ẩm để vẽ biểu đồ line chart
var tempChart = [], humiChart = [], lightChart = [], motionChart = [];

function drawGraphData() {
    firebase.database().ref(todayFireBase).limitToLast(20).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    //console.log(data.val());
                    var humi = data.val().Humidity;
                    var temp = data.val().Temperature;
                    var anhsang = data.val().Light;
                    var motion = data.val().Motion;
                    if (typeof (humi) === "number" && typeof (temp) === "number" && typeof (anhsang) === "number" && typeof (motion) === "number") {
                        humiChart.push(humi);
                        tempChart.push(temp);
                        lightChart.push(anhsang);
                        motionChart.push(motion);
                    }
                }
            );
            drawGraph(humiChart, tempChart, lightChart, motionChart);
            tempChart = [];
            humiChart = [];
            lightChart = [];
            motionChart = [];
        });
}

//Hàm vẽ line Chart

function drawGraph(humiChart, tempChart, lightChart, motionChart) {
    var labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "temperature [°C]",
                labelString: "°C",
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
                fill: false,
                data: tempChart,
                yAxisID: "y-axis-temp",
            },
            {
                label: "humidity [%RH]",
                labelString: "hum",
                borderColor: 'rgb(0, 99, 132)',
                backgroundColor: 'rgb(0, 99, 132)',
                fill: false,
                data: humiChart,
                yAxisID: "y-axis-temp",
            },
            {
                label: "light [%]",
                labelString: "light",
                borderColor: 'rgb(145, 70, 65)',
                backgroundColor: 'rgb(145, 70, 65)',
                fill: false,
                data: lightChart,
                yAxisID: "y-axis-temp",
            },
            {
                label: "motion [0-1]",
                labelString: "motion",
                borderColor: 'rgb(0, 21, 32)',
                backgroundColor: 'rgb(0, 21, 32)',
                fill: false,
                data: motionChart,
                yAxisID: "y-axis-temp",
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            hoverMode: 'nearest',
            stacked: false,
            title: {
                display: true,
                text: 'Biểu đổ 20 giá trị gần nhất RealTime'
            },
            scales: {
                yAxes: [{
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-temp",
                    ticks: {
                        //bắt đầu tại 0
                        //beginAtZero: true,
                        suggestedMin: 20,
                        suggestedMax: 100
                    }
                }]
            }
        }
    });
}
// Load delay
var delayInMilliseconds = 5000;
setTimeout(window.addEventListener('load', function () {

    drawGraphData();
}), delayInMilliseconds)

// Show all data Phòng khách
function showAllThongTinPK() {
    if (document.getElementById('hiddenAllDataPhongKhach').style.display === "none") {
        document.getElementById('hiddenAllDataPhongKhach').style.display = "block";
    }
    else {
        document.getElementById('hiddenAllDataPhongKhach').style.display = "none";
    }
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    showAllThongTinPK()
})

// Show Phòng khach
function showPhongKhach() {
    if (document.getElementById('hiddenPhongKhach').style.display === "none") {
        document.getElementById('hiddenPhongKhach').style.display = "block";
        document.getElementById('phongkhach').setAttribute("class", "border-blue-700 border-4");
    }
    else {
        document.getElementById('hiddenPhongKhach').style.display = "none";
        document.getElementById('hiddenAllDataPhongKhach').style.display = "none";
        document.getElementById('phongkhach').setAttribute("class", "border-4 border-gray-400 p-1.5");
    }
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    showPhongKhach()
})


// Turn Off auto Daikin AC
function OffAutoDaikinAC() {
    firebase.database().ref().limitToFirst(parseInt(1)).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var auto = data.val().autoDaikinAC;
                    //console.log(led)
                    if (auto == 1) {
                        document.getElementById('offautoDaikin').style.display = "none";
                    }
                    else {
                        document.getElementById('offautoDaikin').style.display = "block";
                    }
                }
            );
        });
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    OffAutoDaikinAC()
})


//Scroll top
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    var mybutton = document.getElementById("scrolltopbtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
