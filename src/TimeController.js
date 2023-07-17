(function TimeController(){
    var usedTime = 0;
    var timeState = ["STOP","UPDATE","REVERSE"];
    var currentState = "STOP";
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
    function getAngle(){
        let timesNum = getTimeNum();
        let timesAngle ={
            hour: timesNum.hour*30,
            minute: timesNum.minute*6,
            second: timesNum.second*6
        };
        return timesAngle;
    }
    function setTimeTo(seconds){
        usedTime = Math.floor(seconds);
    }
    function updateTimeDisplay(){
        let times = getTimeString();
        document.getElementById("TimeCount").innerHTML = `${times.hour}:${times.minute}:${times.second}`;
    }
    async function updateTime(){
        while(currentState=="UPDATE"){
            await waitMilliseconds(1000);
            usedTime += 1;
            if(usedTime > 86400){
                usedTime -= 86400;
            }
            updateTimeDisplay(); 
        }
        return;
    }
    async function updateTimeReverse(){
        while(currentState=="REVERSE"){
            await waitMilliseconds(1000);
            usedTime -= 1;
            if(usedTime > 86400){
                usedTime -= 86400;
            }else if(usedTime <0){
                return true;
            }
            updateTimeDisplay(); 
        }
        return;
    }
    function changeStateTo(state){
        currentState = state;
        switch(currentState){
            case "STOP":
                break;
            case "UPDATE":
                updateTime();
                break;
            case "REVERSE":
                updateTimeReverse();
                break;
            default:
                break;
        }
    }
    window.TimeManager = {
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
        //输入一个参数，设定时间到该参数，向下取整，单位为秒
        setTimeTo: setTimeTo,
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
