(function StateButton(){
//先用100此for循环await waitMilliseconds(10)提高精度
//切换模式前把此模式的usedTime保存到localStorage
var clockButton = document.getElementById("StateButton--Clock");
var stopwatchButton = document.getElementById("StateButton--Stopwatch");
var countdownButton = document.getElementById("StateButton--Countdown");
var currentButtonState = "CLOCK";
var morePrecision = 0;
function getCurrentButtonState(){
    return currentButtonState;
}
function changeButtonState(state){
    if(currentButtonState == state){
        return;
    }
    window.localStorage.setItem(currentButtonState,window.TimeManager.getCurrentTime());
    currentButtonState = state;
    window.TimeManager.setTimeTo(Number(window.localStorage.getItem(state)));
    switch (state){
        case "CLOCK":
            window.TimeManager.changeStateTo("UPDATE");
            break;
        case "STOPWATCH":
            window.TimeManager.changeStateTo("STOP");
            window.TimeManager.updateTimeDisplay();
            break;
        case "CUNTDOWN":
            window.TimeManager.changeStateTo("STOP");
            window.TimeManager.updateTimeDisplay();
            break;
        default:
            break;
    }
}
function changeToClock(){
    changeButtonState("CLOCK");
}
function changeToStopwatch(){
    changeButtonState("STOPWATCH");
}
function changeToCountdown(){
    changeButtonState("CUNTDOWN");
}
function bindButtonClick(){
    clockButton.onclick = changeToClock;
    stopwatchButton.onclick = changeToStopwatch;
    countdownButton.onclick = changeToCountdown;
}
async function UpdatePrecision(){
    while(currentButtonState=="STOPWATCH"){
        
    }
}
window.ButtonManager ={
    bindButtonClick: bindButtonClick,
    getCurrentButtonState: getCurrentButtonState
}
})();
ButtonManager.bindButtonClick();