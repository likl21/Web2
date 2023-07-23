(function TimeController(){
    var usedTime = 0;
    var timeState = ["STOP","UPDATE","REVERSE"];
    var currentState = "STOP";
    var isActivedAlarm = false;
    var isAlarming = false;
    var alarm = 0;
    var audio = document.createElement("audio");
    var isUpdating = false;
    var isNeedPrecision = false;
    audio.src = "../resources/AlarmSound.mp3";
    audio.loop = true; 
    // 用于设置时间
    const clock = document.getElementById("clock");
    const minuteHand = document.getElementById("minutehand");
    const hourHand = document.getElementById("hourhand");
    const secondHand = document.getElementById("secondhand");
    var isSecondHandSelected = false;
    var isMinuteHandSelected = false;
    var isHourHandSelected = false;
    var initialState = "CLOCK";
    var min_count = 0;

    // 用于表针动画
    const mHand = document.getElementById("mhand");
    const sHand = document.getElementById("shand");
    const hHand = document.getElementById("hhand");

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
    // 开始动画
    function runAnimation()
    {
        mHand.classList.add("mrot");
        sHand.classList.add("srot");
        hHand.classList.add("hrot");
    }
    
    // 停止动画（并在再次开始动画时从头播放）
    function stopAnimation()
    {
        mHand.classList.remove("mrot");
        sHand.classList.remove("srot");
        hHand.classList.remove("hrot");
    }
    
    // 开始逆向动画
    function runRevAnimation()
    {
        mHand.classList.add("mrevrot");
        sHand.classList.add("srevrot");
        hHand.classList.add("hrevrot");
    }
    
    // 停止逆向动画（并在再次开始动画时从头播放）
    function stopRevAnimation()
    {
        mHand.classList.remove("mrevrot");
        sHand.classList.remove("srevrot");
        hHand.classList.remove("hrevrot");
    }

    // 暂停所有动画，停表时使用
    function pauseAllAnimation()
    {
        mHand.style.animationPlayState =
        sHand.style.animationPlayState =
        hHand.style.animationPlayState = "paused";
    }

    // 开始所有动画，停表时使用
    function startAllAnimation()
    {
        mHand.style.animationPlayState =
        sHand.style.animationPlayState =
        hHand.style.animationPlayState = "running";
    }
    
    function changeClockDisplay(timesAngle)
    {
        minuteHand.setAttribute("transform", "rotate(" + timesAngle.minute + ", 200, 200)");
        hourHand.setAttribute("transform", "rotate(" + timesAngle.hour + ", 200, 200)");
        secondHand.setAttribute("transform", "rotate(" + timesAngle.second + ", 200, 200)");
    }

    // 更新表盘时间，一定要在停止所有动画后操作
    function updateClockDisplay()
    {
        var timesAngle = getAngle();
        changeClockDisplay(timesAngle);
    }
    function updatePreciseClockDisplay()
    {
        var timesAngle = getAngle();
        var deltaTime = window.ButtonManager.getMorePrecision();
        timesAngle.hour   += deltaTime / 60000.0;
        timesAngle.minute += deltaTime * 0.001;
        timesAngle.second += deltaTime * 0.06;
        changeClockDisplay(timesAngle);
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
                alarmCheck();
            }
        }
        return;
    }
    async function updateTimeReverse(){
        if(isUpdating){
            return;
        }
        while(currentState=="REVERSE"){
            isUpdating = true;
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
        isUpdating =false;
        return;
    }

    // 鼠标按下事件处理程序
    function handleMouseDown(event, element) {
        event.preventDefault();
        // element.classList.add('selected'); // 添加选中样式
        //usedTime = initialHourAngle * 120 + initialMinuteAngle * 10 + initialSecondAngle / 6;
        // document.getElementById("usedTime_value").textContent = usedTime;
        initialState = getCurrentState();
        if (element === secondHand) {
            isSecondHandSelected = true;
            isMinuteHandSelected = false;
            isHourHandSelected = false;
            changeStateTo("STOP");
            //initialSecondAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        } else if (element === minuteHand) {
            isMinuteHandSelected = true;
            isSecondHandSelected = false;
            isHourHandSelected = false;
            changeStateTo("STOP");
            //initialMinuteAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        } else if (element === hourHand) {
            isHourHandSelected = true;
            isSecondHandSelected = false;
            isMinuteHandSelected = false;
            changeStateTo("STOP");
            //initialHourAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        }
    }
    // 鼠标松开事件处理程序
    function handleMouseUp() {
        // secondHand.classList.remove('selected');
        // minuteHand.classList.remove('selected');
        // hourHand.classList.remove('selected');
        isSecondHandSelected = false;
        isMinuteHandSelected = false;
        isHourHandSelected = false;
        window.TimeManager.changeStateTo(initialState);
    }
    var hour_flag = false;
    var hour_flag_reverse = false;
    function setDragHourTo(hourNum) {
        var time_t = (getCurrentTime() + 86400) % 86400;
        let hours = Math.floor(time_t / 3600);
        let minutes = Math.floor((time_t - (hours * 3600)) / 60);
        let seconds = time_t - (hours * 3600) - (minutes * 60);
        if(hours <= 11){
            hours = Math.max(0, Math.min(Math.floor(hourNum), 24));
        }
        else{
            hours = (hourNum + 12) % 24;
        }
        setTimeTo((hours * 3600) + (minutes * 60) + seconds);
        updateTimeDisplay();
        updateClockDisplay();
        if (hourNum === 0 && hour_flag === true) {
            var temp_times = getTimeNum();
            let pm_count = 0;
            if(temp_times.hour < 12){
                temp_times.hour = 12;
            }
            else{
                temp_times.hour = 0;
            }
            hour_flag = false;
            pm_count = temp_times.hour * 3600 + temp_times.second + temp_times.minute * 60;
            setTimeTo(pm_count);
            // alert(usedTime);
            updateTimeDisplay();
            updateClockDisplay();
        }
        if (hourNum === 11 && hour_flag_reverse === true) {
            var temp_times = getTimeNum();
            let pm_count = 0;
            if(temp_times.hour < 12){
                temp_times.hour = 23;
            }
            else{
                temp_times.hour = 11;
            }
            hour_flag = false;
            pm_count = temp_times.hour * 3600 + temp_times.second + temp_times.minute * 60;
            setTimeTo(pm_count);
            updateTimeDisplay();
            updateClockDisplay();
        }
        hour_flag = false;
        hour_flag_reverse = false;
        if (hourNum === 11) {
            hour_flag = true;
        }
        if (hourNum === 0) {
            hour_flag_reverse = true;
        }
    }
    var min_flag = false;
    var min_flag_reverse = false;
    var total_count = 0;
    function setDragMinuteTo(minuteNum) {
        var time_t = (getCurrentTime() + 86400) % 86400;
        let hours = Math.floor(time_t / 3600);
        let minutes = Math.floor((time_t - (hours * 3600)) / 60);
        let seconds = time_t - (hours * 3600) - (minutes * 60);
        minutes = Math.max(0, Math.min(Math.floor(minuteNum), 60));
        setTimeTo((hours * 3600) + (minutes * 60) + seconds);
        updateTimeDisplay();
        updateClockDisplay();
        if (minuteNum === 0 && min_flag === true) {
            var temp_times = getTimeNum();
            total_count = (temp_times.hour + 1+ 24)%24 * 3600;
            min_flag = false;
            total_count = total_count + temp_times.second;
            setTimeTo(total_count);
            updateTimeDisplay();
            updateClockDisplay();
        }
        if (minuteNum === 59 && min_flag_reverse === true) {
            var temp_times = getTimeNum();
            total_count = (temp_times.hour + 24) % 24 * 3600;
            min_flag_reverse = false;
            total_count = total_count + temp_times.second - 60;
            setTimeTo(total_count);
            updateTimeDisplay();
            updateClockDisplay();
        }
        min_flag = false;
        min_flag_reverse = false;
        if (minuteNum === 59) {
            min_flag = true;
        }
        if (minuteNum === 0) {
            min_flag_reverse = true;
        }
    }
    var sec_flag = false;
    var sec_flag_reverse = false;
    var sec_count = 0;
    function setDragSecondTo(secondNum) {
        var time_t = (getCurrentTime() + 86400) % 86400;
        let hours = Math.floor(time_t / 3600);
        let minutes = Math.floor((time_t - (hours * 3600)) / 60);
        let seconds = time_t - (hours * 3600) - (minutes * 60);
        seconds = Math.max(0, Math.min(Math.floor(secondNum), 60));
        setTimeTo((hours * 3600) + (minutes * 60) + seconds);
        updateTimeDisplay();
        updateClockDisplay();
        if (secondNum === 0 && sec_flag === true) {

            var temp_times = getTimeNum();
            sec_count = temp_times.minute * 60;
            sec_flag = false;
            sec_count = sec_count + 60 + temp_times.hour * 3600;
            setTimeTo(sec_count);
            updateTimeDisplay();
            updateClockDisplay();
        }
        if (secondNum === 59 && sec_flag_reverse === true) {
            var temp_times = getTimeNum();
            sec_count = temp_times.minute * 60;
            sec_flag_reverse = false;
            sec_count = sec_count - 1 + temp_times.hour * 3600;
            setTimeTo(sec_count);
            updateTimeDisplay();
            updateClockDisplay();
        }

        sec_flag = false;
        sec_flag_reverse = false;
        if (secondNum === 59) {
            sec_flag = true;
        }
        if (secondNum === 0) {
            sec_flag_reverse = true;
        }
    }

    // 鼠标移动事件处理程序
    function handleMouseMove(event) {
        var rect = clock.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        //var angles = getAngle();
        //var initialSecondAngle = -Math.PI / 2;
        //var initialMinuteAngle = -Math.PI / 2;
        //var initialHourAngle = -Math.PI / 2;
        //关于这部分，考虑到使用usedTIme来表示时间，那么就不能使用连续值，因为连续值的使用，
        //比如转动分针，要求秒针不转动，则必然小数上会产生余数，导致秒针转动，所以采用的是这种方式
        if (isSecondHandSelected) {
            var angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            var rotation = (Math.round((angle + Math.PI / 2) * 60 / (2 * Math.PI)) + 60) % 60;
            //usedTime += rotation;

            // document.getElementById('rotationValue').textContent = rotation.toFixed(2);
            //updateTimeDisplay();
            //updateClockDisplay();
            setDragSecondTo(rotation);
        }

        if (isMinuteHandSelected) {
            var angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            var rotation = (Math.round((angle + Math.PI / 2) * 60 / (2 * Math.PI)) + 60) % 60;
            //usedTime += rotation * 60;
            //updateTimeDisplay();
            //updateClockDisplay();

            setDragMinuteTo(rotation);

            // document.getElementById('rotationValue').textContent = rotation.toFixed(2);

        }

        if (isHourHandSelected) {
            var angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            var rotation = (Math.round((angle + Math.PI / 2) * 12 / (2 * Math.PI))+12)%12;
            /*usedTime += rotation * 3600;
            updateTimeDisplay();
            updateClockDisplay();*/
            // document.getElementById('rotationValue').textContent = rotation.toFixed(2);
            setDragHourTo(rotation);
        }
        

    }

    // 事件监听
    secondHand.addEventListener('mousedown', function (event) {
        handleMouseDown(event, secondHand);
    });
    minuteHand.addEventListener('mousedown', function (event) {
        handleMouseDown(event, minuteHand);
    });
    hourHand.addEventListener('mousedown', function (event) {
        handleMouseDown(event, hourHand);
    });
    document.addEventListener('mouseup', function () {
        handleMouseUp();
    });
    clock.addEventListener('mousemove', handleMouseMove);

    // 初始更新时间和表盘显示

    function changeStateTo(state){
        
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
        if(!isNeedPrecision)
        {
            updateClockDisplay();
            isNeedPrecision = true;
        }
        else if(window.ButtonManager.getCurrentButtonState() == "STOPWATCH")
            updatePreciseClockDisplay();
        else
            updateClockDisplay();
        switch(currentState)
        {
            case "UPDATE":
                runAnimation();
                break;
            case "REVERSE":
                runRevAnimation();
                break;
            default:
                stopAnimation();
                stopRevAnimation();
                break;
        }
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
        changeClockDisplay: changeClockDisplay,
        //更新时钟指针至当前时间
        updateClockDisplay: updateClockDisplay,
        //更新时钟指针至当前精确时间
        updatePreciseClockDisplay: updatePreciseClockDisplay,
        //isNeedPrecision: isNeedPrecision,
        //设置并播放正向动画
        runAnimation: runAnimation,
        //停止并删除正向动画
        stopAnimation: stopAnimation,
        //设置并播放逆向动画
        runRevAnimation: runRevAnimation,
        //停止并删除逆向动画
        stopRevAnimation: stopRevAnimation,
        //所有动画继续播放
        startAllAnimation: startAllAnimation,
        //所有动画暂停播放
        pauseAllAnimation: pauseAllAnimation,
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
        changeStateTo: changeStateTo,
    }
})()
function timeTest(){
    TimeManager.setTimeTo(3600+63);
    TimeManager.changeStateTo("UPDATE");
    //TimeManager.setTimeTo(10);
    //TimeManager.updateTimeReverse();
}
timeTest();
