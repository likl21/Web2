(function StateButton(){
//先用100此for循环await waitMilliseconds(10)提高精度
//切换模式前把此模式的usedTime保存到localStorage
var clockButton = document.getElementById("StateButton--Clock");
var stopwatchButton = document.getElementById("StateButton--Stopwatch");
var countdownButton = document.getElementById("StateButton--Countdown");
var stopOrPlayButton = document.getElementById("StopOrPlayButton");
var currentButtonState = "CLOCK";
var morePrecision = 0;
var timeCountText = document.getElementById("TimeCount");
var precisionDisplay;
function getCurrentButtonState(){
    return currentButtonState;
}
function changeButtonState(state){
    if(currentButtonState == state){
        return;
    }
    if(currentButtonState == "STOPWATCH"){
        precisionDisplay.remove();
    }
    window.localStorage.setItem(currentButtonState,window.TimeManager.getCurrentTime());
    currentButtonState = state;
    window.TimeManager.setTimeTo(Number(window.localStorage.getItem(state)));
    switch (state){
        case "CLOCK":
            window.TimeManager.changeStateTo("UPDATE");
            stopOrPlayButton.style.display = "none";
            break;
        case "STOPWATCH":
            window.TimeManager.changeStateTo("STOP");
            window.TimeManager.updateTimeDisplay();
            createPrecisionDisplay();
            stopOrPlayButton.style.display = "";
            break;
        case "COUNTDOWN":
            window.TimeManager.changeStateTo("STOP");
            window.TimeManager.updateTimeDisplay();
            stopOrPlayButton.style.display = "";
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
    precisionDisplay = document.createElement("p");
    precisionDisplay.innerHTML = "."+morePrecision;
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
    if(currentButtonState=="COUNTDOWN"){
        var targetState = window.TimeManager.getCurrentState()=="STOP"?"REVERSE":"STOP";
        if(targetState == "REVERSE"){
            stopOrPlayButton.innerHTML = "Pause";
            
        }else{
            stopOrPlayButton.innerHTML = "Play";
        }
    }
    window.TimeManager.changeStateTo(targetState);
    
    
}
function bindButtonClick(){
    clockButton.onclick = changeToClock;
    stopwatchButton.onclick = changeToStopwatch;
    countdownButton.onclick = changeToCountdown;
    stopOrPlayButton.onclick = stopOrPlay;
}
async function UpdatePrecision(){
    let originalUpdate = window.TimeManager.updateTime;
    window.TimeManager.updateTime = async function(){
        while(window.TimeManager.getCurrentState()=="UPDATE"&&currentButtonState=="STOPWATCH"){
                await window.TimeManager.waitMilliseconds(10);
                if(currentButtonState!="STOPWATCH"){
                    return;
                }
                morePrecision +=1;
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
        window.TimeManager.updateTime = originalUpdate;
    }
    
}
function updatePrecisionDisplay(){
    if(morePrecision>=100){
        morePrecision = 0;
    }
    precisionDisplay.innerHTML = "."+ (morePrecision <= 10? "0"+String(morePrecision):morePrecision);
}
window.ButtonManager ={
    bindButtonClick: bindButtonClick,
    getCurrentButtonState: getCurrentButtonState,
    addClickAnimationFor: addClickAnimationFor,
    updatePrecisionDisplay: updatePrecisionDisplay,
    stopOrPlay: stopOrPlay
}
})();
ButtonManager.bindButtonClick();
