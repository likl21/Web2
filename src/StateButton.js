(function StateButton(){
//先用100此for循环await waitMilliseconds(10)提高精度
//切换模式前把此模式的usedTime保存到localStorage
var clockButton = document.getElementById("StateButton--Clock");
var stopwatchButton = document.getElementById("StateButton--Stopwatch");
var countdownButton = document.getElementById("StateButton--Countdown");
var stopOrPlayButton = document.getElementById("StopOrPlayButton");
var setAlarmButton = document.getElementById("SetAlarmButton");
var toZeroButton = document.getElementById("ToZeroButton");
var currentButtonState = "CLOCK";
var morePrecision = 0;
var timeCountText = document.getElementById("TimeCount");
var alarmText = document.getElementById("AlarmText");
var precisionDisplay;
var isPrecisionUpdating = false;
function getCurrentButtonState(){
    return currentButtonState;
}
function getMorePrecision(){
    return morePrecision;
}
function changeButtonState(state){
    if(currentButtonState == state){
        return;
    }
    if(currentButtonState == "STOPWATCH"){
        precisionDisplay.remove();
        if(window.TimeManager.getCurrentState()=="UPDATE"){
            stopOrPlay();
        }
    }
    window.localStorage.setItem(currentButtonState,window.TimeManager.getCurrentTime());
    currentButtonState = state;
    window.TimeManager.setTimeTo(Number(window.localStorage.getItem(state)));
    switch (state){
        case "CLOCK":
            window.TimeManager.changeStateTo("UPDATE");
            stopOrPlayButton.style.display = "none";
            toZeroButton.style.display = "none";
            alarmText.style.display = "";
            setAlarmButton.style.display = "";
            window.TimeManager.updateTimeDisplay();
            break;
        case "STOPWATCH":
            window.TimeManager.changeStateTo("STOP");
            window.TimeManager.updateTimeDisplay();
            createPrecisionDisplay();
            stopOrPlayButton.style.display = "";
            toZeroButton.style.display = "";
            alarmText.style.display = "none";
            setAlarmButton.style.display = "none";
            break;
        case "COUNTDOWN":
            window.TimeManager.changeStateTo("STOP");
            window.TimeManager.updateTimeDisplay();
            stopOrPlayButton.style.display = "";
            toZeroButton.style.display = "none";
            alarmText.style.display = "none";
            setAlarmButton.style.display = "none";
            break;
        default:
            break;
    }
}
async function addClickAnimationFor(button){
    var originalStyle = button.style;
    button.style.transition = "0s";
    button.style.backgroundColor = "#DCD6F7";
    await window.TimeManager.waitMilliseconds(20);
    button.style = originalStyle;
}
function createPrecisionDisplay(){
    let precision = Math.floor(morePrecision);
    precisionDisplay = document.createElement("p");
    precisionDisplay.innerHTML = "."+precision;
    timeCountText.parentElement.appendChild(precisionDisplay);
    precisionDisplay.style.position = "relative";
    precisionDisplay.style.bottom = "380px";
    precisionDisplay.style.left = "370px";
    precisionDisplay.style.fontSize = "80px";
    precisionDisplay.style.zIndex = "-1";
    updatePrecisionDisplay();
}
function changeToClock(){
    addClickAnimationFor(clockButton);
    changeButtonState("CLOCK");
}
function changeToStopwatch(){
    addClickAnimationFor(stopwatchButton);
    changeButtonState("STOPWATCH");
}
function changeToCountdown(){
    addClickAnimationFor(countdownButton);
    changeButtonState("COUNTDOWN");
}
function stopOrPlay(){
    addClickAnimationFor(stopOrPlayButton);
    if(currentButtonState=="STOPWATCH"){
        var targetState = window.TimeManager.getCurrentState()=="STOP"?"UPDATE":"STOP";
        if(targetState == "UPDATE"){
            stopOrPlayButton.innerHTML = "Pause";
            if(currentButtonState=="STOPWATCH"){
                UpdatePrecision();
            }else{
                window.TimeManager.updateTime();
            }
            
        }else{
            stopOrPlayButton.innerHTML = "Play";
        }
    }
    else if(currentButtonState=="COUNTDOWN"){
        var targetState = window.TimeManager.getCurrentState()=="STOP"?"REVERSE":"STOP";
        if(targetState == "REVERSE"){
            stopOrPlayButton.innerHTML = "Pause";
            
        }else{
            stopOrPlayButton.innerHTML = "Play";
        }
    }
    window.TimeManager.changeStateTo(targetState);
    
}
function setAlarm(){
    addClickAnimationFor(setAlarmButton);
    if(window.TimeManager.getIsAlarming()){
        window.TimeManager.stopAlarm();
    }
    window.TimeManager.changeAlarmState();
    if(window.TimeManager.alarmIsActive()){
        setAlarmButton.innerHTML = "Cancel&nbsp;Alarm";
    }else{
        setAlarmButton.innerHTML = "Set&nbsp;Alarm";
    }
}
function toZero(){
    addClickAnimationFor(toZeroButton);
    window.TimeManager.setTimeTo(0);
    morePrecision = 0;
    window.TimeManager.updateTimeDisplay();
    updatePrecisionDisplay();
    window.TimeManager.toZeroClock();
    window.TimeManager.changeStateTo("STOP");
}
function bindButtonClick(){
    clockButton.onclick = changeToClock;
    stopwatchButton.onclick = changeToStopwatch;
    countdownButton.onclick = changeToCountdown;
    stopOrPlayButton.onclick = stopOrPlay;
    setAlarmButton.onclick = setAlarm;
    toZeroButton.onclick = toZero;
}
async function UpdatePrecision(){
    let originalUpdate = window.TimeManager.updateTime;
    var oldTime = 0;
    var newTime = 0;
    window.TimeManager.updateTime = async function(){
        if(isPrecisionUpdating){
            window.TimeManager.updateTime = originalUpdate;
            return;
        }
        var date = new Date();
        oldTime = date.getTime();
        while(window.TimeManager.getCurrentState()=="UPDATE"&&currentButtonState=="STOPWATCH"){
                isPrecisionUpdating = true;
                await window.TimeManager.waitMilliseconds(10);
                if(currentButtonState!="STOPWATCH"){
                    break;
                }
                var date = new Date();
                newTime = date.getTime();
                morePrecision += (newTime - oldTime)*0.1;
                oldTime = newTime;
                if(morePrecision>=100){
                    window.TimeManager.setTimeTo(window.TimeManager.getCurrentTime()+1);
                    if(window.TimeManager.getCurrentTime() > 86400){
                        window.TimeManager.setTimeTo(window.TimeManager.getCurrentTime() - 86400);
                    }
                    window.TimeManager.updateTimeDisplay(); 
                    morePrecision = 0;
                }
                window.ButtonManager.updatePrecisionDisplay();
        }
        isPrecisionUpdating =false;
        window.TimeManager.updateTime = originalUpdate;
    }
    
}
function updatePrecisionDisplay(){
    if(morePrecision>=100){
        morePrecision = 0;
    }
    let precision = Math.floor(morePrecision);
    precisionDisplay.innerHTML = "."+ (precision <= 10? "0"+String(precision):precision);
}
function initeButton(){
    stopOrPlayButton.style.display = "none";
    toZeroButton.style.display = "none";
    bindButtonClick();
}
window.ButtonManager ={
    bindButtonClick: bindButtonClick,
    getCurrentButtonState: getCurrentButtonState,
    addClickAnimationFor: addClickAnimationFor,
    UpdatePrecision: UpdatePrecision,
    updatePrecisionDisplay: updatePrecisionDisplay,
    stopOrPlay: stopOrPlay,
    initeButton: initeButton,
    setAlarmButton: setAlarmButton,
    getMorePrecision: getMorePrecision,
}
})();
ButtonManager.initeButton();
