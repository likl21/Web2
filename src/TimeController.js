(function TimeController(){
    var usedTime = 0;
    var timeState = ["STOP","UPDATE","REVERSE"];
    var currentState = "STOP";
    var isActivedAlarm = false;
    var isAlarming = false;
    var alarm = 0;
    var audio = document.createElement("audio");
    audio.src = "../resources/AlarmSound.mp3";
    audio.loop = true; 
    function waitMilliseconds(duration){
        return new Promise(resolve=>{setTimeout(() => {
            resolve();
        }, duration);})
    }
    function getTimeNum(){
        let hours = Math.floor(usedTime /3600);
        let minutes = Math.floor((usedTime - (hours*3600))/60);
        let seconds = usedTime - (hours*3600) - (minutes*60);
        let times = { 
            hour: hours,
            minute: minutes,
            second: seconds
        };
        return times;
    }
    function getTimeString(){
        let hours = Math.floor(usedTime /3600);
        let minutes = Math.floor((usedTime - (hours*3600))/60);
        let seconds = usedTime - (hours*3600) - (minutes*60);
        let rawTimes = [String(hours),String(minutes),String(seconds)];
        let timesArray = rawTimes.map((num)=>{
            if(Number(num)<10){
                return "0"+num;
            }
            return num;
        })
        let times={
            hour: timesArray[0],
            minute: timesArray[1],
            second: timesArray[2]
        };
        return times;
    }
    function getCurrentTime(){
        return usedTime;
    }
    function getCurrentState(){
        return currentState;
    }
    function getAngle(){
        let timesNum = getTimeNum();
        let timesAngle ={
            hour: timesNum.hour*30 + timesNum.minute*0.5 + timesNum.second/120.0,
            minute: timesNum.minute*6 + timesNum.second*0.1,
            second: timesNum.second*6
        };
        return timesAngle;
    }
    function updateClockDisplay()
    {
        var minhand = document.getElementById("minutehand");
        var hourhand = document.getElementById("hourhand");
        var sechand = document.getElementById("secondhand");
        
        var timesAngle = getAngle();

        minhand.setAttribute("transform", "rotate(" + timesAngle.minute + ", 200, 200)");
        hourhand.setAttribute("transform", "rotate(" + timesAngle.hour + ", 200, 200)");
        sechand.setAttribute("transform", "rotate(" + timesAngle.second + ", 200, 200)");
    }
    function setTimeTo(seconds){
        if(seconds ==null){
            seconds = 0;
        }
        usedTime = Math.floor(seconds);
    }
    function setHourTo(hourNum){
        let hours = Math.floor(usedTime /3600);
        let minutes = Math.floor((usedTime - (hours*3600))/60);
        let seconds = usedTime - (hours*3600) - (minutes*60);
        hours = Math.max(0,Math.min(Math.floor(hourNum),24));
        usedTime = (hours*3600) + (minutes*60) + seconds;
        if(usedTime > 86400){
            usedTime -= 86400;
        }
        updateTimeDisplay();
        updateClockDisplay();
    }
    function setMinuteTo(minuteNum){
        let hours = Math.floor(usedTime /3600);
        let minutes = Math.floor((usedTime - (hours*3600))/60);
        let seconds = usedTime - (hours*3600) - (minutes*60);
        minutes = Math.max(0,Math.min(Math.floor(minuteNum),60));
        usedTime = (hours*3600) + (minutes*60) + seconds;
        if(usedTime > 86400){
            usedTime -= 86400;
        }
        updateTimeDisplay();
        updateClockDisplay();
    }
    function setSecondTo(secondNum){
        let hours = Math.floor(usedTime /3600);
        let minutes = Math.floor((usedTime - (hours*3600))/60);
        let seconds = usedTime - (hours*3600) - (minutes*60);
        seconds = Math.max(0,Math.min(Math.floor(secondNum),60));
        usedTime = (hours*3600) + (minutes*60) + seconds;
        if(usedTime > 86400){
            usedTime -= 86400;
        }
        updateTimeDisplay();
        updateClockDisplay();
    }
    function updateTimeDisplay(){
        let times = getTimeString();
        document.getElementById("TimeCount").innerHTML = `${times.hour}:${times.minute}:${times.second}`;
    }
    function updateAlarmDisplay(){
        let times = getAlarmString();
        document.getElementById("AlarmText").innerHTML = `${times.hour}:${times.minute}:${times.second}`;
    }
    async function updateTime(){
        while(currentState=="UPDATE"){
            await waitMilliseconds(1000);
            if(currentState == "UPDATE"){
                usedTime += 1;
                if(usedTime > 86400){
                    usedTime -= 86400;
                }
                updateTimeDisplay();
                
                updateClockDisplay(); // 测试时针显示是否正确，可删去

                alarmCheck();
            }
        }
        return;
    }
    async function updateTimeReverse(){
        while(currentState=="REVERSE"){
            await waitMilliseconds(1000);
            if(currentState=="REVERSE"){
                usedTime -= 1;
                if(usedTime > 86400){
                    usedTime -= 86400;
                }else if(usedTime < 0){
                    
                    usedTime = 0;
                    audio.play();
                    alert("Time Out!");
                    audio.pause();
                    window.ButtonManager.stopOrPlay();
                    changeStateTo("STOP");
                    return true;
                }
                updateTimeDisplay(); 
            }
        }
        return;
    }
    function changeStateTo(state){
        if(currentState==state){
            return;
        }
        currentState = state;
        switch(currentState){
            case "STOP":
                break;
            case "UPDATE":
                window.TimeManager.updateTime();
                break;
            case "REVERSE":
                updateTimeReverse();
                break;
            default:
                break;
        }
        updateTimeDisplay();
    }
    function setAlarm(x){
        if(alarm > 86400){
            alarm -= 86400;
        }
        alarm = Math.floor(Number(x));
        alarmCheck();
    }
    function alarmCheck(){
        if(!isActivedAlarm){
            return;
        }
        if (usedTime == alarm){
            isAlarming = true;
            audio.play();
            window.ButtonManager.setAlarmButton.innerHTML = "Stop&nbsp;Alarming";
        }
    }
    function stopAlarm(){
        audio.currentTime = 0;
        audio.pause();
    }
    function getAlarmString(){
        var orgUsedTime = usedTime;
        usedTime = alarm;
        var times = getTimeString();
        usedTime = orgUsedTime;
        return times;
    }
    function setAlarmHour(hourNum){
        let hours = Math.floor(alarm /3600);
        let minutes = Math.floor((alarm - (hours*3600))/60);
        let seconds = alarm - (hours*3600) - (minutes*60);
        hours = Math.max(0,Math.min(Math.floor(hourNum),24));
        alarm = (hours*3600) + (minutes*60) + seconds;
        if(alarm > 86400){
            alarm -= 86400;
        }
        updateAlarmDisplay();
    }
    function setAlarmMinute(minuteNum){
        let hours = Math.floor(alarm /3600);
        let minutes = Math.floor((alarm - (hours*3600))/60);
        let seconds = alarm - (hours*3600) - (minutes*60);
        minutes = Math.max(0,Math.min(Math.floor(minuteNum),60));
        alarm = (hours*3600) + (minutes*60) + seconds;
        if(alarm > 86400){
            alarm -= 86400;
        }
        updateAlarmDisplay();
    }
    function setAlarmSecond(secondNum){
        let hours = Math.floor(alarm /3600);
        let minutes = Math.floor((alarm - (hours*3600))/60);
        let seconds = alarm - (hours*3600) - (minutes*60);
        seconds = Math.max(0,Math.min(Math.floor(secondNum),60));
        alarm = (hours*3600) + (minutes*60) + seconds;
        if(alarm > 86400){
            alarm -= 86400;
        }
        updateAlarmDisplay();
    }
    function changeAlarmState(){
        isActivedAlarm = !isActivedAlarm;
    }
    function alarmIsActive(){
        return isActivedAlarm;
    }
    function getAlarm(){
        return alarm;
    }
    function getIsAlarming(){
        return isAlarming;
    }
    window.TimeManager = {
        //输入整数n，等待n ms。
        waitMilliseconds: waitMilliseconds,
        //返回一个对象，具有hour,minute,second属性
        //属性值为整数
        getTimeNum: getTimeNum,
        //返回一个对象，具有hour,minute,second属性
        //属性值为长度为2的string,不足两位时用“0”占位
        getTimeString: getTimeString,
        //获取当前时间，返回一个整数秒
        getCurrentTime: getCurrentTime,
        //获取当前角度，返回一个对象，具有hour,minute,second属性
        //属性值为整数
        getAngle: getAngle,
        //获取当前状态
        getCurrentState: getCurrentState,
        //更新时钟指针至当前时间
        updateClockDisplay: updateClockDisplay,
        //输入一个参数，设定时间到该参数，向下取整，单位为秒
        setTimeTo: setTimeTo,
        //输入一个整数，设定小时/分钟/秒为该整数，其他时间参数不变
        //如23:49:12调用setHourTo(2)后为02:49:12
        setHourTo: setHourTo,
        setMinuteTo: setMinuteTo,
        setSecondTo: setSecondTo,
        getAlarm: getAlarm,
        getAlarmString: getAlarmString,
        setAlarmHour: setAlarmHour,
        setAlarmMinute: setAlarmMinute,
        setAlarmSecond: setAlarmSecond,
        changeAlarmState: changeAlarmState,
        alarmIsActive: alarmIsActive,
        getIsAlarming: getIsAlarming,
        stopAlarm: stopAlarm,
        //设置闹钟，传入一个整数秒
        setAlarm: setAlarm,
        //更新时间显示(会重置timeCount文本状态)
        updateTimeDisplay: updateTimeDisplay,
        updateTime: updateTime,
        //传入一个字符串，改变时间状态
        //状态有"STOP","UPDATE","REVERSE"三种
        //"STOP"状态下，时间不动
        //"UPDATE"状态下，时间每秒向前流动
        //"REVERSE"状态下，时间每秒向后流动
        //所有状态均可内部处理，无需每帧调用
        changeStateTo: changeStateTo
    }
})()
function timeTest(){
    TimeManager.setTimeTo(3600+63);
    TimeManager.changeStateTo("UPDATE");
    //TimeManager.setTimeTo(10);
    //TimeManager.updateTimeReverse();
}
timeTest();
