timeCount = document.getElementById("TimeCount");
function TimeInput(){
    element = timeCount;
    window.TimeManager.changeStateTo("STOP");
    var timeString = window.TimeManager.getTimeString();
    var oldhtml = element.innerHTML;
    var hourObj = document.createElement("input");
    function limitInput(inputObj, maxNum){
        inputObj.value = inputObj.value.replace(/[^\d]/g,'');
        if(inputObj.value.length>2){
            inputObj.value = inputObj.value.slice(0,2);
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
                    window.TimeManager.setHourTo(inputObj.value);
                    break;
                case "MINUTE":
                    window.TimeManager.setMinuteTo(inputObj.value);
                    break;
                case "SECOND":
                    window.TimeManager.setSecondTo(inputObj.value);
                    break;
                default:
                    break;
            }
        }else{
            window.TimeManager.changeStateTo("UPDATE");
        }
        //TODO:next obj
    }
    hourObj.type = "text";
    element.appendChild(hourObj);
    hourObj.setSelectionRange(0,2);
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
}

timeCount.addEventListener("dblclick",TimeInput,false);