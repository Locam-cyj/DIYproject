/* 单个数字偏移量 */
let size = 86;
/* 把所有的column转换为数组备用 */
let columns = Array.from(document.getElementsByClassName('column'));
/* 设置样式名状态数组 */
let class_list = ['visible', 'near', 'far', 'far', 'distant', 'distant'];
/* true为24小时制，false为12小时制 */
/* let is_24_hour_clock = true; */
/* 配置信息 */
let config = {
    MODEL_SWITCH : true,
    MEMO_SWITCH : "both",
    MEMOTEXT : ""
};

/* 重写lively Wallpaper提供的监听函数 */
function livelyPropertyListener(name, val){
    switch(name){
        case "modelSwitch":
            config.MODEL_SWITCH = !val;
            break;
        case "memoSwitch":
            switch(val){
                case 0:
                    config.MEMO_SWITCH = "remainTime";
                    break;
                case 1:
                    config.MEMO_SWITCH = "memoTextDiv";
                    break;
                case 2:
                    config.MEMO_SWITCH = "both";
                    break;
                case 3:
                    config.MEMO_SWITCH = "none";
                    break;
            }
            break;
        case "memoText":
            config.MEMOTEXT = val;
            break;
    }
}
/* 获取时分秒 */
function getClock() {
    let d = new Date();
    /* 利用jQuery读取json */
    /* $.getJSON('LivelyProperties.json',function(result){
        //console.log("yes");
        is_24_hour_clock = result.modelSwitch.items == "24-hour clock" ? true : false;
    }); */
    //console.log(is_24_hour_clock);
    let hour = config.MODEL_SWITCH ? d.getHours() : d.getHours() % 12 || 12;
    //alert(config.MODEL_SWITCH);
    hour = hour < 10 ? "0" + hour : hour;
    let minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    let second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    return hour + "" + minute + "" + second;
}
//console.log(getClock());

/* 获取对应的样式名 */
function getClass(n, i) {
    return class_list.find(function (class_name, class_index) {
        return i - class_index === n || i + class_index === n;
    }) || "";
}
//console.log(getClass(5,2));

/* 定时器，每秒刷新一次 */
setInterval(() => {
    /* 获取当前时间 */
    let c = getClock();
    /* 遍历所有.colum */
    columns.forEach(function (ele, i) {
        /* 获取时间的每一位并转化为int */
        let n = parseInt(c[i]);
        /* 计算偏移量 */
        let offset = - n * size;
        /* 进行偏移(设置每一位数字的位置) */
        ele.style.transform = 'translateY(calc(50vh + ' + offset + 'px - ' + (size / 2) + 'px))';
        /* 遍历.column的子元素(.num)数组 */
        Array.from(ele.children).forEach(function (ele2, i2) {
            /* 设置每一位数字的样式(透明度) */
            ele2.className = "num " + getClass(n, i2);
        });
    });
}, 1000);

/* 四种状态，分别为只显示剩余时间、只显示备忘录、二者都显示以及二者都隐藏 */
setInterval(function(){
    if(config.MEMO_SWITCH == "remainTime"){
        $(".memo").show();
        $(".remainTime").show();
        $(".memoTextDiv").hide();
    }
    if(config.MEMO_SWITCH == "memoTextDiv"){
        $(".memo").show();
        $(".remainTime").hide();
        $(".memoTextDiv").show();
    }
    if(config.MEMO_SWITCH == "both"){
        $(".memo").show();
        $(".remainTime").show();
        $(".memoTextDiv").show();
    }
    if(config.MEMO_SWITCH == "none"){
        $(".memo").hide();
        $(".remainTime").hide();
        $(".memoTextDiv").hide();
    }
}, 1000);

/* 更新备忘录内容 */
setInterval(function(){
    $(".memoText").text(config.MEMOTEXT);
}, 1000);

/* 计算剩余时间百分比 */
setInterval(() => {
    let d = new Date();
    let remain = (1 - (d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds()) / 24 / 60 / 60) * 100;
    //console.log(remain);
    remain = remain.toFixed(2) + "%";
    //console.log(remain);
    $(".persent").text(remain);
    //console.log($(".persent").text());
}, 1000);