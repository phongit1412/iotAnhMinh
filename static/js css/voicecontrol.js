var voicecontrol = document.getElementById('voiceresult');
    var speechRecognizer = new webkitSpeechRecognition();
    var firebaseRef = firebase.database().ref('PKThietBiDieuKhien')
    function startVoiceControl() {
        //hold
        document.getElementById('btnStopVoiceControl').style.display = "inline";
        document.getElementById('btnStartVoiceControl').style.display = "none";
        document.getElementById('dotPingVoiceControl_1').setAttribute("class", "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75");
        document.getElementById('dotPingVoiceControl_2').setAttribute("class", "relative inline-flex rounded-full h-3 w-3 bg-red-500");
        if ('webkitSpeechRecognition' in window) {
            speechRecognizer.continuous = true; //tiếp tục đợi để nghe
            speechRecognizer.interimResults = true; //kết quả tạm thời đoán trước(gợi ý từ)
            speechRecognizer.start();
            var finalTranscripts = '';
            speechRecognizer.onresult = function (event) {
                var interimTranscripts = '';
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    var transcript = event.results[i][0].transcript;
                    transcript.replace("\n", "<br>");
                    if (event.results[i].isFinal) {
                        finalTranscripts += transcript;
                        //console.log("final: " + finalTranscripts)
                    } else {
                        interimTranscripts += transcript;
                        //console.log("inter: " + interimTranscripts)
                    }
                }
                //Kết quả thu được voicecontrol.value
                voicecontrol.value = finalTranscripts + interimTranscripts;
                var a = voicecontrol.value
                console.log("voice control: " + voicecontrol.value)
                if ((a.toLowerCase() == "bật đèn") || (a.toLowerCase() == "turn on") || (a.toLowerCase() == "mở đèn") || (a.toLowerCase() == "sáng đèn") || (a.toLowerCase() == "đèn mở")) {
                    firebaseRef.update({
                        "LedStatus": "ON"
                    })
                }
                else if ((a.toLowerCase() == "tắt đèn") || (a.toLowerCase() == "turn off") || (a.toLowerCase() == "đèn tắt")) {
                    firebaseRef.update({
                        "LedStatus": "OFF"
                    })
                }
                else if ((a.toLowerCase() == "quạt nhẹ") || (a.toLowerCase() == "quạt mức 1") || (a.toLowerCase() == "quạt chậm")) {
                    firebaseRef.update({
                        "Fan": "min"
                    })
                }
                else if ((a.toLowerCase() == "quạt vừa") || (a.toLowerCase() == "quạt mức 2") || (a.toLowerCase() == "quạt bình thường")) {
                    firebaseRef.update({
                        "Fan": "med"
                    })
                }
                else if ((a.toLowerCase() == "quạt mạnh") || (a.toLowerCase() == "quạt mức 3") || (a.toLowerCase() == "quạt nhanh")) {
                    firebaseRef.update({
                        "Fan": "max"
                    })
                }
                else if ((a.toLowerCase() == "chế độ tự động") || (a.toLowerCase() == "tự động điều chỉnh") || (a.toLowerCase() == "auto control") || (a.toLowerCase() == "tự động điều khiển")) {
                    firebaseRef.update({
                        "Mode": "auto"
                    })
                } else if ((a.toLowerCase() == "chế độ làm lạnh") || (a.toLowerCase() == "cool") || (a.toLowerCase() == "làm lạnh") || (a.toLowerCase() == "snow")) {
                    firebaseRef.update({
                        "Mode": "snow"
                    })
                }
                else if ((a.toLowerCase() == "chế độ hong khô") || (a.toLowerCase() == "dry") || (a.toLowerCase() == "hút ẩm") || (a.toLowerCase() == "hong khô")) {
                    firebaseRef.update({
                        "Mode": "dry"
                    })
                }
                else if ((a.toLowerCase() == "bật cánh quạt")) {
                    firebaseRef.update({
                        "Mode": "fan"
                    })
                }
                else if ((a.toLowerCase() == "chế độ làm nóng") || (a.toLowerCase() == "heat") || (a.toLowerCase() == "làm nóng")) {
                    firebaseRef.update({
                        "Mode": "heat"
                    })
                }
                else if ((a.toLowerCase() == "tắt máy lạnh") || (a.toLowerCase() == "đóng máy lạnh")) {
                    firebaseRef.update({
                        "DaikinStatus": "off"
                    })
                }
                else if ((a.toLowerCase() == "mở máy lạnh") || (a.toLowerCase() == "bật máy lạnh")) {
                    firebaseRef.update({
                        "DaikinStatus": "on"
                    })
                }
                else if ((a.toLowerCase() == "máy lạnh tự động")) {
                    firebaseRef.update({
                        "autoDaikinAC": "1"
                    })
                }
                else if ((a.toLowerCase() == "điều chỉnh máy lạnh")) {
                    firebaseRef.update({
                        "autoDaikinAC": "0"
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 16") || (a.toLowerCase() == "16 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 16
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 17") || (a.toLowerCase() == "17 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 17
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 18") || (a.toLowerCase() == "18 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 18
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 19") || (a.toLowerCase() == "19 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 19
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 20") || (a.toLowerCase() == "20 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 20
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 21") || (a.toLowerCase() == "21 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 21
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 22") || (a.toLowerCase() == "22 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 22
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 23") || (a.toLowerCase() == "23 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 23
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 24") || (a.toLowerCase() == "24 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 24
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 25") || (a.toLowerCase() == "25 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 25
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 26") || (a.toLowerCase() == "26 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 26
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 27") || (a.toLowerCase() == "27 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 27
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 28") || (a.toLowerCase() == "28 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 28
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 29") || (a.toLowerCase() == "29 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 29
                    })
                }
                else if ((a.toLowerCase() == "nhiệt độ 30") || (a.toLowerCase() == "30 độ")) {
                    firebaseRef.update({
                        "NhietDoDieuChinh": 30
                    })
                }
            };
            speechRecognizer.onerror = function (event) {
            };
        } else {
            voicecontrol.innerHTML = 'No browser support. Please upgrade your browser';
        }
    }
    function stopVoiceControl() {
        document.getElementById('btnStopVoiceControl').style.display = "none";
        document.getElementById('btnStartVoiceControl').style.display = "inline";
        document.getElementById('dotPingVoiceControl_1').setAttribute("class", "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75");
        document.getElementById('dotPingVoiceControl_2').setAttribute("class", "relative inline-flex rounded-full h-3 w-3 bg-green-500");
        speechRecognizer.stop();
    }