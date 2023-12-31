alarmCount = document.getElementById("AlarmText");
var hourNum = 0;
var minuteNum = 0;
var secondNum = 0;
function AlarmInput(){
    element = alarmCount;
    var timeString = window.TimeManager.getAlarmString();
    var oldhtml = element.innerHTML;
    var hourObj = document.createElement("input");
    function limitInput(inputObj, maxNum){
        inputObj.value = inputObj.value.replace(/[^\d]/g,'');
        if(inputObj.value.length>=2){
            inputObj.value = inputObj.value.slice(0,2);
            inputObj.blur();
        }
        if(inputObj.value>maxNum){
            inputObj.value = maxNum;
        }
        if(inputObj.value<0){
            inputObj.value =0;
        }
    }
    function mouseBlur(inputObj,type){
        if(inputObj.value && inputObj.value.trim() != null){
            switch(type){
                case "HOUR":
                    window.TimeManager.setAlarmHour(inputObj.value);
                    var minuteObj = document.createElement("input");
                    styleSync(minuteObj);
                    minuteObj.style.right = "260px";
                    element.appendChild(minuteObj);
                    minuteObj.focus();
                    minuteObj.value = timeString.minute;
                    function minuteLimit() {
                        limitInput(minuteObj,60);
                    } 
                    minuteObj.oninput = minuteLimit;
                    function minuteBlur() {
                        mouseBlur(minuteObj,"MINUTE");
                    } 
                    minuteObj.onblur = minuteBlur;
                    function minute_enter_submit(event){
                        if (event.keyCode == 13){
                            minuteObj.blur();
                        }
                    }
                    minuteObj.addEventListener("keydown",minute_enter_submit,false);
                    minuteObj.setSelectionRange(0,2);
                    break;
                case "MINUTE":
                    window.TimeManager.setAlarmMinute(inputObj.value);

                    var secondObj = document.createElement("input");
                    styleSync(secondObj);
                    secondObj.style.right = "120px";
                    element.appendChild(secondObj);
                    secondObj.focus();
                    secondObj.value = timeString.second;
                    function secondLimit() {
                        limitInput(secondObj,60);
                    } 
                    secondObj.oninput = secondLimit;
                    function secondBlur() {
                        mouseBlur(secondObj,"SECOND");
                    } 
                    secondObj.onblur = secondBlur;
                    function second_enter_submit(event){
                        if (event.keyCode == 13){
                            secondObj.blur();
                        }
                    }
                    secondObj.addEventListener("keydown",second_enter_submit,false);
                    secondObj.setSelectionRange(0,2);
                    break;
                case "SECOND":
                    window.TimeManager.setAlarmSecond(inputObj.value);
                    break;
                default:
                    break;
            }

        }else{
            hourObj.remove();
        }
    }
    function styleSync(obj){
        obj.type = "text";
        obj.style.position = "relative";
        obj.style.fontSize = "100px";
        obj.style.width = "115px";
        obj.style.border = "0px";
        obj.style.outline = "none";
    }
    styleSync(hourObj);
    hourObj.style.right = "400px";
    element.appendChild(hourObj);
    hourObj.focus();
    hourObj.value = timeString.hour;
    function hourLimit() {
        limitInput(hourObj,24);
    } 
    hourObj.oninput = hourLimit;
    function hourBlur() {
        mouseBlur(hourObj,"HOUR");
    } 
    hourObj.onblur = hourBlur;
    function enter_submit(event){
        if (event.keyCode == 13){
            hourObj.blur();
        }
    }
    hourObj.addEventListener("keydown",enter_submit,false);
    hourObj.setSelectionRange(0,2);
}

alarmCount.addEventListener("dblclick",AlarmInput,false);