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

// Hôm nay
var today = new Date();
var dd = String(today.getDate());
var mm = String(today.getMonth() + 1);
var yyyy = today.getFullYear();

// Ngày hôm qua
var yesterday01 = new Date(new Date().setDate(new Date().getDate() - 1));
var yesdd01 = String(yesterday01.getDate());
// Ngày hôm kia
var yesterday02 = new Date(new Date().setDate(new Date().getDate() - 2));
var yesdd02 = String(yesterday02.getDate());

today = yyyy + '-' + mm + '-' + dd;
yesterday01 = yyyy + '-' + mm + '-' + yesdd01;
yesterday02 = yyyy + '-' + mm + '-' + yesdd02;

console.log(today)
// console.log(yesterday01)
// console.log(yesterday02)

var todayFireBase = "DuLieuDoPhongKhach" + "/" + today;
var yesterday01FireBase = "DuLieuDoPhongKhach" + "/" + yesterday01;
var yesterday02FireBase = "DuLieuDoPhongKhach" + "/" + yesterday02;

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
    firebase.database().ref(todayFireBase).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    //var sensor = data.val().Name;
                    var humi = data.val().Humidity;
                    var temp = data.val().Temperature;
                    var time = data.val().Time;
                    //console.log(humi, time, temp)
                    if (typeof (humi) !== "undefined" && typeof (temp) !== "undefined" && typeof (time) !== "undefined") {
                        AddItemsToTable(time, humi, temp);
                    }
                }
            );
        });
}
// Chèn data phòng khách vào html
function AddItemsToTable(time, humi, temp) {
    document.querySelector('#TimePK').innerHTML = `${time}`;
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
    firebase.database().ref(todayFireBase).limitToLast(30).on('value',
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
    firebase.database().ref().on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var led = data.val().LedStatus;
                    if (typeof (led) !== "undefined") {
                        //console.log(led)
                        if (led == "on" || led == "ON" || led == "On" || led == "oN") {
                            document.getElementById('toggleLED').checked = true;
                        }
                        else {
                            document.getElementById('toggleLED').checked = false;
                        }
                    }
                }
            );
        });
}
//Load
window.addEventListener('load', function () {
    loadonoffLED()
})


// turn up and down daikin AC
function turndownupDaikinAC() {
    var value;
    var valueCheck;
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    firebase.database().ref().once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    value = data.val().NhietDoDieuChinh;
                    if (typeof (value) !== "undefined") {
                        valueCheck = value;
                        document.querySelector('#nhietdoDaikin').innerHTML = `${valueCheck}`;
                    }
                }
            )
            document.querySelector('#decrement').addEventListener('click', () => {
                valueCheck = valueCheck - 1;
                if (valueCheck < 16) {
                    document.getElementById('decrement').style.display = "none";
                }
                else {
                    //console.log(value)
                    document.getElementById('decrement').style.display = "inline";
                    document.getElementById('increment').style.display = "inline";
                    firebaseRef.update({
                        "NhietDoDieuChinh": valueCheck
                    })
                    document.querySelector('#nhietdoDaikin').innerHTML = `${valueCheck}`;
                }
            })
            document.querySelector('#increment').addEventListener('click', () => {
                valueCheck = valueCheck + 1;
                if (valueCheck > 30) {
                    document.getElementById('increment').style.display = "none";
                }
                else {
                    document.getElementById('increment').style.display = "inline";
                    document.getElementById('decrement').style.display = "inline";
                    firebaseRef.update({
                        "NhietDoDieuChinh": valueCheck
                    })
                    document.querySelector('#nhietdoDaikin').innerHTML = `${valueCheck}`;
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
    firebase.database().ref().on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var value = data.val().NhietDoDieuChinh;
                    if (typeof (value) !== "undefined") {
                        document.querySelector('#nhietdoDaikin').innerHTML = `${value}`;
                    }
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
    var fan;
    firebase.database().ref().on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    fan = data.val().Fan;
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
    firebase.database().ref().on('value',
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

// Toggle Daikin On- Off
function turnonoffDaikin() {
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
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    turnonoffDaikin()
})

// Load Toggle Trạng thái Bật - Tắt Máy lạnh
function loadBatTatDaikin() {
    var value;
    firebase.database().ref().on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    value = data.val().DaikinStatus;
                    if (typeof (value) !== "undefined") {
                        if (value == "ON" || value == "On" || value == "on" || value == "oN") {
                            document.querySelector('#toggleDaikinAC').checked = true;
                        }
                        else {
                            document.querySelector('#toggleDaikinAC').checked = false;
                        }
                    }
                })
        })
}
//Load
window.addEventListener('DOMContentLoaded', function () {
    loadBatTatDaikin()
})

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

// Thống kê & lịch sử hoạt động sensor Phòng khách
function viewmorePK() {
    //var time, temp, humi, light, motion, statusdaikin;
    firebase.database().ref(todayFireBase).limitToLast(50).once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var time = data.val().Time;
                    var temp = data.val().Temperature;
                    var humi = data.val().Humidity;
                    var light = data.val().Light;
                    var motion = data.val().Motion;
                    if (typeof (time) !== "undefined" && typeof (temp) !== "undefined" && typeof (humi) !== "undefined" && typeof (light) !== "undefined") {
                        Addalldatatable(time, temp, humi, light);
                    }
                }
            )
        })
}

function Addalldatatable(time, temp, humi, light) {
    var tbody = document.getElementById('tbodythongke');
    var trow = document.createElement('tr');
    trow.setAttribute("class", "flex w-full md:mb-4");
    var td1 = document.createElement('td');
    td1.setAttribute("class", "p-2 w-full md:w-1/4")
    var td2 = document.createElement('td');
    td2.setAttribute("class", "p-2 w-full md:w-1/4")
    var td3 = document.createElement('td');
    td3.setAttribute("class", "p-2 w-full md:w-1/4")
    var td4 = document.createElement('td');
    td4.setAttribute("class", "p-2 w-full md:w-1/4")
    td1.innerHTML = time;
    td2.innerHTML = temp;
    td3.innerHTML = humi;
    td4.innerHTML = light;
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    tbody.appendChild(trow);
}
// Load
window.addEventListener('load', function () {
    viewmorePK()
})


////////////////////////////////////////////////////////////////////////

// Thống kê & lịch sử hoạt động sensor Phòng khách hôm qua
function viewmorePKYesterday01() {
    //var time, temp, humi, light, motion, statusdaikin;
    firebase.database().ref(yesterday01FireBase).once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var time = data.val().Time;
                    var temp = data.val().Temperature;
                    var humi = data.val().Humidity;
                    var light = data.val().Light;
                    if (typeof (time) !== "undefined" && typeof (temp) !== "undefined" && typeof (humi) !== "undefined" && typeof (light) !== "undefined") {
                        AddalldatatableYesterday01(time, temp, humi, light);
                    }
                }
            )
        })
}

function AddalldatatableYesterday01(time, temp, humi, light) {
    var tbody = document.getElementById('tbodythongkeYesterday01');
    var trow = document.createElement('tr');
    trow.setAttribute("class", "flex w-full md:mb-4");
    var td1 = document.createElement('td');
    td1.setAttribute("class", "p-2 w-full md:w-1/4")
    var td2 = document.createElement('td');
    td2.setAttribute("class", "p-2 w-full md:w-1/4")
    var td3 = document.createElement('td');
    td3.setAttribute("class", "p-2 w-full md:w-1/4")
    var td4 = document.createElement('td');
    td4.setAttribute("class", "p-2 w-full md:w-1/4")
    td1.innerHTML = time;
    td2.innerHTML = temp;
    td3.innerHTML = humi;
    td4.innerHTML = light;
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    tbody.appendChild(trow);
}
// Load
window.addEventListener('load', function () {
    viewmorePKYesterday01()
})


///////////////////////////////////////////////////////////////////////

// Thống kê & lịch sử hoạt động sensor Phòng khách hôm kia
function viewmorePKYesterday02() {
    //var time, temp, humi, light, motion, statusdaikin;
    firebase.database().ref(yesterday02FireBase).once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var time = data.val().Time;
                    var temp = data.val().Temperature;
                    var humi = data.val().Humidity;
                    var light = data.val().Light;
                    if (typeof (time) !== "undefined" && typeof (temp) !== "undefined" && typeof (humi) !== "undefined" && typeof (light) !== "undefined") {
                        AddalldatatableYesterday02(time, temp, humi, light);
                    }
                }
            )
        })
}

function AddalldatatableYesterday02(time, temp, humi, light) {
    var tbody = document.getElementById('tbodythongkeYesterday02');
    var trow = document.createElement('tr');
    trow.setAttribute("class", "flex w-full md:mb-4");
    var td1 = document.createElement('td');
    td1.setAttribute("class", "p-2 w-full md:w-1/4")
    var td2 = document.createElement('td');
    td2.setAttribute("class", "p-2 w-full md:w-1/4")
    var td3 = document.createElement('td');
    td3.setAttribute("class", "p-2 w-full md:w-1/4")
    var td4 = document.createElement('td');
    td4.setAttribute("class", "p-2 w-full md:w-1/4")
    td1.innerHTML = time;
    td2.innerHTML = temp;
    td3.innerHTML = humi;
    td4.innerHTML = light;
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    tbody.appendChild(trow);
}
// Load
window.addEventListener('load', function () {
    viewmorePKYesterday02()
})

///////////////////////////////////////////////////////////////////////

// Xử lý các button thống kê phòng khách
function btnHomKia() {
    document.getElementById('tblDataPK3').style.display = "block";
    document.getElementById('tblDataPK1').style.display = "none";
    document.getElementById('tblDataPK2').style.display = "none";
    document.getElementById('buttonhomkia').setAttribute("class", "bg-blue-300 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed")    
    document.getElementById('buttonhomnay').setAttribute("class", "bg-blue-300 font-bold py-2 px-4 rounded")
    document.getElementById('buttonhomqua').setAttribute("class", "bg-blue-300 font-bold py-2 px-4 rounded")
    //
    document.getElementById('exportexcel3').style.display = "block";
    document.getElementById('exportexcel1').style.display = "none";
    document.getElementById('exportexcel2').style.display = "none";
}

function btnHomQua() {
    document.getElementById('tblDataPK2').style.display = "block";
    document.getElementById('tblDataPK1').style.display = "none";
    document.getElementById('tblDataPK3').style.display = "none";
    document.getElementById('buttonhomqua').setAttribute("class", "bg-blue-300 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed")    
    document.getElementById('buttonhomnay').setAttribute("class", "bg-blue-300 font-bold py-2 px-4 rounded")
    document.getElementById('buttonhomkia').setAttribute("class", "bg-blue-300 font-bold py-2 px-4 rounded")
    //
    document.getElementById('exportexcel2').style.display = "block";
    document.getElementById('exportexcel1').style.display = "none";
    document.getElementById('exportexcel3').style.display = "none";
}
function btnHomNay() {
    document.getElementById('tblDataPK1').style.display = "block";
    document.getElementById('tblDataPK2').style.display = "none";
    document.getElementById('tblDataPK3').style.display = "none";
    document.getElementById('buttonhomnay').setAttribute("class", "bg-blue-300 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed")    
    document.getElementById('buttonhomkia').setAttribute("class", "bg-blue-300 font-bold py-2 px-4 rounded")
    document.getElementById('buttonhomqua').setAttribute("class", "bg-blue-300 font-bold py-2 px-4 rounded")
    //
    document.getElementById('exportexcel1').style.display = "block";    
    document.getElementById('exportexcel2').style.display = "none";
    document.getElementById('exportexcel3').style.display = "none";
}

//////////////////////////////////////////////////////////////////////


// Show Phòng khach
function showPhongKhach() {
    if (document.getElementById('hiddenPhongKhach').style.display === "none") {
        document.getElementById('hiddenPhongKhach').style.display = "block";
        document.getElementById('hiddenNhaBep').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "none";
        document.getElementById('phongkhach').setAttribute("class", "border-blue-700 border-4 rounded-lg");
        document.getElementById('nhabep').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    }
    else {
        document.getElementById('hiddenPhongKhach').style.display = "none";
        document.getElementById('hiddenAllDataPhongKhach').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "block";
        document.getElementById('phongkhach').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    }
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    showPhongKhach()
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

// Turn On - Off Auto Daikin AC
function loadOnOffDaikinAuto() {
    var auto;
    firebase.database().ref().on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    auto = data.val().autoDaikinAC;
                    if (typeof (auto) !== "undefined") {
                        //console.log(auto)
                        if (auto == 1) {
                            document.getElementById('toggleAutoDaikinAC').checked = true;
                            document.getElementById('offautoDaikin').style.display = "none";
                        }
                        else {
                            document.getElementById('toggleAutoDaikinAC').checked = false;
                            document.getElementById('offautoDaikin').style.display = "block";
                        }
                    }
                }
            );
        });
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    loadOnOffDaikinAuto()
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


// Show Nhà Bếp
function showNhaBep() {
    if (document.getElementById('hiddenNhaBep').style.display === "none") {
        document.getElementById('hiddenNhaBep').style.display = "block";
        document.getElementById('hiddenPhongKhach').style.display = "none";
        document.getElementById('hiddenAllDataPhongKhach').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "none";
        document.getElementById('nhabep').setAttribute("class", "border-green-700 border-4 rounded-lg");
        document.getElementById('phongkhach').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    }
    else {
        document.getElementById('hiddenNhaBep').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "block";
        document.getElementById('nhabep').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    }
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    showNhaBep()
})

var demgas = 0;
window.feed = function (callback) {
    var tick = {};
    var value;
    var valueCheck;
    firebase.database().ref().on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    value = data.val().KhiGas;
                    if (typeof (value) !== "undefined" && value != 0) {
                        valueCheck = value;
                        //console.log(valueCheck)
                        if (valueCheck > 700) {
                            console.log("Cảnh báo nguy hiểm: CÓ KHÍ GAS!!!")
                            var token = '1616356914:AAHPClJkMWIpiDPpwMrYRumtdiannDAKMIw';
                            var chat_id = -1001288626996;
                            var my_text = "Cảnh báo nguy hiểm: CÓ KHÍ GAS!!!";
                            var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${my_text}&parse_mode=html`;
                            let api = new XMLHttpRequest();
                            api.open("GET", url, true);
                            //console.log(demgas)
                            if (demgas >= 5) {
                                demgas = 0;
                                api.send()
                            }
                            demgas = demgas + 1;
                        }
                        else {
                            //console.log(demgas)
                            demgas = 0;
                        }
                    }
                }
            )
        })
    tick.plot0 = valueCheck;
    callback(JSON.stringify(tick));

};
// Vẽ biểu đồ Gauge Nồng độ khí Gas
function drawGaugeGas() {
    var myConfig = {
        type: "gauge",
        globals: {
            fontSize: 25,
            backgroundColor: 'none'
        },
        plotarea: {
            backgroundColor: 'transparent',
            marginTop: 60
        },
        plot: {
            size: '100%',
            valueBox: {
                placement: 'center',
                text: '%v', //default
                fontSize: 35,
                rules: [{
                    rule: '%v >= 700',
                    "font-color": "#ff0000",
                    text: '%v<br>Danger alarm'
                },
                {
                    rule: '%v < 700 && %v > 640',
                    "font-color": "#ff9933",
                    text: '%v<br>Warning alarm'
                },
                {
                    rule: '%v < 640 && %v > 580',
                    "font-color": "#ffcc00",
                    text: '%v<br>Bad'
                },
                {
                    rule: '%v <  580',
                    "font-color": "#00cc66",
                    text: '%v<br>Good'
                }
                ]
            }
        },
        tooltip: {
            borderRadius: 5
        },
        scaleR: {
            aperture: 180,
            minValue: 300,
            maxValue: 850,
            step: 50,
            center: {
                visible: false
            },
            tick: {
                visible: false
            },
            item: {
                offsetR: 0,
                rules: [{
                    rule: '%i == 9',
                    offsetX: 15
                }]
            },
            labels: ['300', '', '', '', '', '', '600', '640', '700', '750', '', '850'],
            ring: {
                size: 50,
                rules: [{
                    rule: '%v <= 580',
                    backgroundColor: '#66ff66 #006600'
                },
                {
                    rule: '%v > 580 && %v < 640',
                    backgroundColor: '#ffff4d'
                },
                {
                    rule: '%v >= 640 && %v < 700',
                    backgroundColor: '#ffa366'
                },
                {
                    rule: '%v >= 700',
                    backgroundColor: '#ff6666 #4d0000'
                }
                ]
            }
        },
        refresh: {
            type: "feed",
            transport: "js",
            url: "feed()",
            interval: 1500,
            resetTimeout: 1000
        },
        series: [{
            values: [55], // starting value
            backgroundColor: 'black',
            indicator: [10, 5, 100, 0, 0.3],
            animation: {
                effect: 2,
                method: 1,
                sequence: 4,
                speed: 900
            },
        }]
    };

    zingchart.render({
        id: 'chartGas',
        data: myConfig,
        height: 400,
        width: '100%'
    });
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    drawGaugeGas()
})


// DANH SÁCH BIỂU ĐỒ PHÒNG KHÁCH
function bieudoNHIETDO() {
    var datatemp;
    firebase.database().ref(todayFireBase).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var temp = data.val().Temperature;
                    if (typeof (temp) !== "undefined") {
                        datatemp = temp;
                    }
                }
            );
        });
    function onRefresh(chart) {
        chart.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: datatemp

            });
        });
    }
    var ctx = document.getElementById('myChart1').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            datasets: [{
                label: "temperature [°C]",
                labelString: "°C",
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 179, 179, 0.5)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                data: []
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            hoverMode: 'nearest',
            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        duration: 10000,
                        refresh: 2800,
                        delay: 2800,
                        onRefresh: onRefresh
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: '[°C]'
                    },
                    min: 22,
                    max: 40
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                datalabels: {
                    backgroundColor: function (context) {
                        return context.dataset.backgroundColor;
                    },
                    padding: 4,
                    borderRadius: 4,
                    clip: true,
                    color: 'white',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function (value) {
                        return value.y;
                    }
                }
            }
        }
    });
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    bieudoNHIETDO();
})

function bieudoDOAM() {
    var datahumi;
    firebase.database().ref(todayFireBase).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var humi = data.val().Humidity;
                    if (typeof (humi) !== "undefined") {
                        datahumi = humi;
                    }
                }
            );
        });
    function onRefresh(chart) {
        chart.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: datahumi

            });
        });
    }
    var ctx = document.getElementById('myChart2').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            datasets: [{
                label: "humidity [%RH]",
                labelString: "%RH",
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                data: []
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            hoverMode: 'nearest',
            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        duration: 10000,
                        refresh: 2800,
                        delay: 2800,
                        onRefresh: onRefresh
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: '[%RH]'
                    },
                    min: 40,
                    max: 80
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                datalabels: {
                    backgroundColor: function (context) {
                        return context.dataset.backgroundColor;
                    },
                    padding: 4,
                    borderRadius: 4,
                    clip: true,
                    color: 'white',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function (value) {
                        return value.y;
                    }
                }
            }
        }
    });
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    bieudoDOAM();
})


function bieudoANHSANG() {
    var datalight;
    firebase.database().ref(todayFireBase).on('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var light = data.val().Light;
                    if (typeof (light) !== "undefined") {
                        datalight = light;
                    }
                }
            );
        });
    function onRefresh(chart) {
        chart.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: datalight

            });
        });
    }
    var ctx = document.getElementById('myChart3').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            datasets: [{
                label: "light [%]",
                labelString: "%",
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 255, 153, 0.5)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                data: []
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            hoverMode: 'nearest',
            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        duration: 10000,
                        refresh: 2800,
                        delay: 2800,
                        onRefresh: onRefresh
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: '[%]'
                    },
                    max: 103,
                    min: 0
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                datalabels: {
                    backgroundColor: function (context) {
                        return context.dataset.backgroundColor;
                    },
                    padding: 4,
                    borderRadius: 4,
                    clip: true,
                    color: 'white',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function (value) {
                        return value.y;
                    }
                }
            }
        }
    });
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    bieudoANHSANG();
})

/////////////////////////////////////////////////////////////////

//BUTTON BIỂU ĐỒ CHARTJS
function bieudo1() {
    document.getElementById('myChart1').style.display = "block";
    document.getElementById('myChart2').style.display = "none";
    document.getElementById('myChart3').style.display = "none";
}
window.addEventListener('DOMContentLoaded', function () {
    bieudo1();
})

function bieudo2() {
    document.getElementById('myChart2').style.display = "block";
    document.getElementById('myChart1').style.display = "none";
    document.getElementById('myChart3').style.display = "none";
}
window.addEventListener('DOMContentLoaded', function () {
    bieudo2();
})

function bieudo3() {
    document.getElementById('myChart3').style.display = "block";
    document.getElementById('myChart1').style.display = "none";
    document.getElementById('myChart2').style.display = "none";
}
window.addEventListener('DOMContentLoaded', function () {
    bieudo3();
})

///////////////////////////////////////////////////////////////////

function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    filename = filename?filename+'.xls':'excel_data.xls';
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        // thông báo tải xuống cho người dùng
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting tên file
        downloadLink.download = filename;
        
        // bấm để download
        downloadLink.click();
    }
}

///////////////////////////////////////////////////////////////////