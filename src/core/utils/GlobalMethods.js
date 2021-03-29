// import getChineseZodiac from '@/core/utils/ChineseZodiac';
//计算时间，当前时间-之前时间=00:00  默认分秒，当达到小时时会显示
/**
 * @param {*} oldTime 传入的时间戳 毫秒数
 * @param {*} isHour 是否显示小时 default：false
 * @return string {00:00:00}
 */
let mathTime = function (oldTime,isHour=false) {
    let datetm = new Date().getTime() - oldTime;
    if (datetm < 0) {
        return "00:00"
    }
    //计算出小时
    let leave1 = datetm % (24 * 3600 * 1000)
    let hours = Math.floor(leave1 / (3600 * 1000))
    if (hours > 0 && hours < 10) {
        hours = "0" + hours + ":"
    } else if (hours > 10) {
        hours = hours + ":"
    } else {
        hours = isHour?"00:":"";
    }
    //计算出分钟
    let leave2 = leave1 % (3600 * 1000)
    let minutes = Math.floor(leave2 / (60 * 1000))
    if (minutes >= 0 && minutes < 10) {
        minutes = "0" + minutes + ":"
    } else if (minutes > 10) {
        minutes = minutes + ":"
    }else{
        
    }
    //计算出秒
    let leave3 = leave2 % (60 * 1000)
    let senconds = Math.floor(leave3 / (1000))
    if (senconds >= 0 && senconds < 10) {
        senconds = "0" + senconds
    }

    return hours + minutes + senconds
}
/**
 * 
 * @param {*} date 日期  默认new Date
 * @param {*} isDate 是否显示日期文字 默认显示
 * @param {*} isTime  是否显示时间文字 默认显示
 * @param {*} separator 日期文字的连接符 默认为 -  2018-01-01
 * @return {2019-06-09 00:00:00} string{2019-06-09 00:00:00}
 */
let getDateTime = function (date, isDate = true, isTime = true, separator = "-") {
    if (date == null) {
        date = new Date();
    }

    let dd = "";
    if (isDate == true) {
        let yy = date.getFullYear();
        let MM = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        let day = (date.getDate() < 10 ? '0' : '') + (date.getDate());
        dd += `${yy}${separator}${MM}${separator}${day}`;
    }
    if (isTime == true) {
        let hh = (date.getHours() < 10 ? '0' : '') + date.getHours();
        let mm = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        let ss = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
        dd += ` ${hh}:${mm}:${ss}`;
    }
    // dd = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${hh}:${mm}:${ss}`
    return dd;
}

/**
 * 根据后台返回的时间戳返回对应的时间字符串
 * @param {number} timestamp 
 * @param {boolean} isDate 
 * @param {boolean} isTime 
 * @param {string} separator 
 * @return {2019-06-09 00:00:00} string{2019-06-09 00:00:00}
 */
let getDateTimeByStamp = function(timestamp,isDate=true,isTime=true,separator='-'){
    let date = new Date(timestamp);
    return getDateTime(date,isDate,isTime,separator);
}
/*****************************************************
功能：取字符串的字节长度. 即英文算一个，中文算两个字节
输入：str    要计算字节长度的字符串
输出：字符串的字节长度
*****************************************************/
let strLenthByByte = function (str) {
    if (!str) {
        return 0
    }
    let len;
    let i;
    len = 0;
    for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) len += 2;
        else len++;
    }
    return len;
}

/**
 * 根据身份证号获取性别（仅限于身份证）
 * @param {string} crtNo 证件号
 *  @return {string} 男 ，女
 */
let getSexByCrtNo = function(crtNo){
    let sex = '未知';
    if(!crtNo || crtNo.length!=18){
        return sex;
    }
    let no = crtNo.substr(crtNo.length-2,1);
    if(!no){
        return sex;
    }
    if(no%2 == 0){
        sex='女';
    }else{
        sex ='男';
    }
    return sex;
}
/**
 * 通过身份证证件号获取用户的生日字符串（仅限于身份证）
 * @param {string} crtNo 
 * @param {boolean} year 是否显示年份 默认true
 * @param {boolean} month 是否显示月份 默认true 
 * @param {boolean} day  是否显是日 默认true
 * @param {string} split 分隔符
 * @return {string} 1988-10-10
 */
//身份证号至少18位
let getBirthByCrtNo = function(crtNo,year=true,month=true,day=true,split='-'){
    let birth = '未知';
    if(!crtNo || crtNo.length!=18 ){return birth;}
    birth = crtNo.substr(6,8);
    let res = '';
    let arr = [];
    if(year){
        res = birth.substr(0,4);
        arr.push(res);
    }
    if(month){
        res  = birth.substr(4,2);
        arr.push(res);
    }
    if(day){
        res = birth.substr(6,2);
        arr.push(res);
    }
    res = arr.join(split);
    return res;
}

let chineseZodiac = function(dateVal){
    if(!dateVal){
        return '';
    }
    return ''
    // return getChineseZodiac(dateVal.toString());
}

let loadJs = function(url,callback){
    let script = document.createElement('script');
    script.type = 'text/javascript';
    if(typeof(callback)!='undefined'){
        //ie
        if(script.readyState){
            script.onreadystatechange = function(){
                if(script.readyState == 'loaded' || script.readyState == 'complete'){
                    script.onreadystatechange = null;
                    callback();
                }
            }
        }else{
            //其他浏览器
            script.onload = function(){
                callback();
            }
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}


export  { mathTime, getDateTime,strLenthByByte,chineseZodiac,getSexByCrtNo,getBirthByCrtNo,getDateTimeByStamp,loadJs}
