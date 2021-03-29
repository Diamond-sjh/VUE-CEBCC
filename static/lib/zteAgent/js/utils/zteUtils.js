/** 提供常用js操作
 *  注：该js依赖jQuery 1.3以上版本 
 *
 */
if (zteUtils == null) {
	var zteUtils = {};
}

// 数字分隔符
zteUtils.DECIMAL_SEP = '.';
zteUtils.DATE_FORMAT = 'yyyy-MM-dd';

// 用于控制是否显示alert信息
zteUtils.alert = function(str) {
	alert(str);
};

// 去除前後的空格
zteUtils.strTrim = function(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
};

//是否为字符串
zteUtils.isString = function(str) {
	return typeof str === "string";
};

//判断是否整数
zteUtils.isInt = function(str) {
	var reg = new RegExp("^[-+]{0,1}[0-9]*$");
	return reg.test(str);
};

// 判断是否整数（包括0）
zteUtils.isPosInt = function(str) {
	return /^\d+$/.test(str);
};

// 判断是否负整数
zteUtils.isNegInt = function(str) {
	return /^-\d+$/.test(str);
};

// 判断是否正整数
zteUtils.isPostInteger = function(str) {
	return /^[1-9]\d*$/.test(str);
};

zteUtils.specialPattern0 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
zteUtils.specialPattern1 = new RegExp("[~|^']");
//是否含有特殊字符
zteUtils.isHasSpecialChar = function(str){
	return zteUtils.specialPattern1.test(str);
};

//是否为双精度数
zteUtils.isDouble = function(str) {
	var sep = zteUtils.DECIMAL_SEP;
	var reg = new RegExp("^[-+]{0,1}[0-9]*[" + sep + "]{0,1}[0-9]*$");
	return reg.test(str);
};

// 判断是否为空
zteUtils.isEmpty = function(str) {
	if (!zteUtils.isString(str)) {
		//zteUtils.alert("Not String");
		return true;
	}
	return str.length > 0 ? false : true;
};

// 判断是否邮件
zteUtils.isEmail = function(str) {
	if (!zteUtils.isString(str)) {
		zteUtils.alert("Not String");
		return false;
	}
	var reg = new RegExp(
			"^(([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}){0,1}$");
	var reg2 = new RegExp(
			"^.*\<(([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}){0,1}\>$");
	return reg.test(str) || reg2.test(str);
};

// 是否电话号码(无区号)
zteUtils.isPhone = function(str) {
	return /(^[0-9]{7,21}$)/.test(str);
	//return /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}1[0-9]{10}$)/
	//		.test(str);
};

// 短时间，形如 (13:04:06)
zteUtils.isTime = function(str) {
	var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
	if (a == null) {
		return false;
	}
	if (a[1] > 24 || a[3] > 60 || a[4] > 60) {		
		return false;
	}
	return true;
};

// 长时间，形如 (2003-12-05 13:04:06)
zteUtils.isDateTime = function(str) {
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var r = str.match(reg);
	if (r == null) {
		return false;
	}
	var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
	return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3]
			&& d.getDate() == r[4] && d.getHours() == r[5]
			&& d.getMinutes() == r[6] && d.getSeconds() == r[7]);
};

// 日期
zteUtils.isDate = function(str) {
	if (zteUtils.isEmpty(str)) {
		return false;
	}

	var dateFormat = zteUtils.DATE_FORMAT;
	ddReg = new RegExp("dd");
	MMReg = new RegExp("MM");
	yyyyReg = new RegExp("yyyy");
	if (!ddReg.test(dateFormat) || !MMReg.test(dateFormat)
			|| !yyyyReg.test(dateFormat)) {
		zteUtils.alert('DEBUG: locale format ' + dateFormat + ' not supported');
		return false;
	} else {
		ddStart = dateFormat.indexOf('dd');
		MMStart = dateFormat.indexOf('MM');
		yyyyStart = dateFormat.indexOf('yyyy');
	}
	strReg = dateFormat.replace('dd', '[0-9]{2}').replace('MM', '[0-9]{2}')
			.replace('yyyy', '[0-9]{4}');
	reg = new RegExp("^" + strReg + "$");
	if (!reg.test(str)) {
		return false;
	} else {
		dd = str.substring(ddStart, ddStart + 2);
		MM = str.substring(MMStart, MMStart + 2);
		yyyy = str.substring(yyyyStart, yyyyStart + 4);
		if (!zteUtils.checkddMMyyyy(dd, MM, yyyy)) {
			return false;
		}
		return true;
	}
};

zteUtils.checkddMMyyyy = function(dd, MM, yyyy) {
	retVal = true;
	if ((dd < 1)
			|| (dd > 31)
			|| (MM < 1)
			|| (MM > 12)
			|| (dd == 31 && (MM == 2 || MM == 4 || MM == 6 || MM == 9 || MM == 11))
			|| (dd > 29 && MM == 2)
			|| (dd == 29 && (MM == 2) && ((yyyy % 4 > 0) || (yyyy % 4 == 0
					&& yyyy % 100 == 0 && yyyy % 400 > 0)))) {
		retVal = false;
	}
	return retVal;
};

// 字符串的计算字节数
zteUtils.countBytes = function(str) {
	return str.replace(/[^\x00-\xff]/g, "**").length;
};

zteUtils.interceptStr = function(str,maxLength){
	if(str == null || str.length == 0){
		return str;
	}
	if(zteUtils.countBytes(str) <= maxLength){
		return str;
	}else{
		var temp = str.substr(0,maxLength > str.length ? str.length - 1 : maxLength);
		while(zteUtils.countBytes(temp) > maxLength){
			temp = temp.substr(0,temp.length - 1);
		}
		return temp + "...";
	}
};

/**
 * window.open窗口,
 * @param cloParentWin 是否关闭父窗口
 */
zteUtils.popUp = function(cloParentWin,url, width, height, winname, left, top){
	  if(width == '' || width == null){
	  		width = screen.width;
	  }
	  if(height == '' || height == null){
	  		height = screen.height;
	  }
	  var _top = (top == '' || top == null) ? (screen.height - height) / 2 : top;
	  var _left = (left == '' || left == null) ? (screen.width - width)/2:left;
	  var _winname = (winname == undefined || winname == null || winname == '') ? '_blank' : winname;
	  window.open(url, _winname, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width=' 
	    		  + width + ',height=' + height + ',left=' + _left + ', top=' + _top + ',screenX=' + left + ',screenY=' + top + '');
	  if(cloParentWin){
		  window.opener = null;    // 关闭父窗口
		  window.open('','_self'); // 当前窗口置为新窗口
		  setTimeout(function () {
			  window.close();	   // 延迟1秒后，(当前窗口置为新窗口)关闭
		  }, 1);
	  } 	
};

/**
 * 获取radio的checked值
 */
zteUtils.getRadioVal = function(elName){
	var _rtnVal = "";
	var _sel = "input[type='radio'][name='" + elName + "']";	
	$.each($(_sel), function(i, n) {
		if (n.checked) {
			_rtnVal = n.value;
			return false;
		}
	});
	return _rtnVal;	
};

/**
 * 设置radio checked
 */
zteUtils.radioChkByVal = function(elName, chkVal){
	var _sel = "input[type='radio'][name='" + elName + "']";
	if (chkVal || chkVal == "0") {
		$.each($(_sel), function(i, n) {
			if (chkVal == n.value) {
				n.checked = true;
				return false;
			}
		});
	}
};

/**
 * 替换字符串str1中所有与字符串str2匹配的字符为str3
 */
zteUtils.replaceAll = function(str1,str2,str3){
    while(str1.indexOf(str2)>-1){
         str1 = str1.replace(str2,str3);
    }
    return str1;
};

/**
 * 时间格式（不足两位时，左边补零）
 */
zteUtils.leftPadZero = function (time){
	if(time < 10){
		return "0" + time;
	}else{
		return "" + time;
	}
};

/**
 * 短时间（hh:mi:ss)增加秒数后，得到新时间
 * @incrementBy 递增因子
 */
zteUtils.shortTimeInc = function(srcTime, incrementBy){
	var arr = srcTime.split(':');	
	var ss = parseInt(arr[2],10);	
	var mi = parseInt(arr[1],10);	
	var hh = parseInt(arr[0],10);
	ss += incrementBy;
	if (ss > 59) {
		ss = 0;
		mi += 1;
	}
	
	if (mi > 59) {
		mi = 0;
		hh += 1;
	}	
	return this.leftPadZero(hh) + ":" + this.leftPadZero(mi) + ":" + this.leftPadZero(ss);     
};

/**
 * 计算两个时间点的时间差（毫秒）
 */
zteUtils.getMilliSecondsDiff = function(srtTime, destTime){
    if (srtTime == null || destTime == null) {
        return 0;
    }
    return destTime.getTime() - srtTime.getTime();
};

/**
 * 计算两个时间点的时间差，格式： hh24:mi:ss
 */
zteUtils.getDiffTime = function(srtTime, destTime) {
	var diff = zteUtils.getMilliSecondsDiff(srtTime, destTime);
	
	if (diff > 0) {
		
		diff = Math.floor(diff /1000);
		var str = "";

		var hh = Math.floor(diff / 3600) + "";
		hh = (hh.length == 1) ? "0" + hh : hh;

		var mm = Math.floor((diff % 3600) / 60) + "";
		mm = (mm.length == 1) ? "0" + mm : mm;

		var ss = diff % 60 + "";
		ss = (ss.length == 1) ? "0" + ss : ss;

		str = hh + ":" + mm + ":" + ss;
		
		return str;

	} else {
		return "00:00:00";
	}

};

/**
 * 时间转换为yyyy-mm-dd hh:mi:ss字符串
 */
zteUtils.dateToString = function(srcDate){
    if (srcDate == null) {
        return "";
    }
    var buffer = new Array();
    buffer.push(srcDate.getFullYear()); // 年份
    buffer.push("-");
    var month = srcDate.getMonth() + 1;
    if (month < 10)
    {
        buffer.push("0");
    }
    buffer.push(month); // 月份
    buffer.push("-");
    var day = srcDate.getDate();
    if (day < 10)
    {
        buffer.push("0");
    }
    buffer.push(day); // 日
    buffer.push(" ");
    var hh = srcDate.getHours();
    if (hh < 10)
    {
        buffer.push("0");
    }
    buffer.push(hh);// 时
    buffer.push(":");
    var mi = srcDate.getMinutes();
    if (mi < 10)
    {
        buffer.push("0");
    }
    buffer.push(mi);// 分
    buffer.push(":");
    var sec = srcDate.getSeconds();
    if (sec < 10)
    {
        buffer.push("0");
    }
    buffer.push(sec); // 秒
    return buffer.join("");
};

zteUtils.dateFormatStr = function (date, fmt) { //author: meizz 
    var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
/**
 * 将字符串转换为Date对象
 * 
 * @param {String} dateStr yyyy-MM-dd HH:mm:ss格式的日期字符串
 */
zteUtils.stringToDate = function(dateStr)
{
    var ret = null;
    
    if (dateStr)
    {
        ret = new Date();
        ret.setFullYear(parseInt(dateStr.substring(0, 4), 10), parseInt(dateStr.substring(5, 7), 10) - 1, parseInt(dateStr.substring(8, 10), 10));
        ret.setHours(parseInt(dateStr.substring(11, 13), 10), parseInt(dateStr.substring(14, 16), 10), parseInt(dateStr.substring(17, 19), 10));
    }
    
    return ret;
};

/**
 * A接口传过来的时间TickCount转为yyyy-mm-dd hh:mi:ss字符串
 */
zteUtils.tickCountToDateString = function(tickCount){
   // 从1994年2月1号开始？	
   var date = new Date(new Date(1994,1,1).getTime()+tickCount*1000);
   return zteUtils.dateToString(date);
};



zteUtils.parseURL = function(url){
	var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {}, seg = a.search.replace(/^\?/, '').split('&'), len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [null, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [null, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
};

zteUtils.replaceUrlObjParams = function(myUrl, newParams){
    for (var x in newParams) {
        var hasInMyUrlParams = false;
        for (var y in myUrl.params) {
            if (x.toLowerCase() == y.toLowerCase()) {
                myUrl.params[y] = newParams[x];
                hasInMyUrlParams = true;
                break;
            }
        }
        //原来没有的参数则追加
        if (!hasInMyUrlParams) {
            myUrl.params[x] = newParams[x];
        }
    }
    var _result = myUrl.protocol + "://" + myUrl.host + ":" + myUrl.port + myUrl.path + "?";
    for (var p in myUrl.params) {
        _result += (p + "=" + myUrl.params[p] + "&");
    }
    if (_result.substr(_result.length - 1) == "&") {
        _result = _result.substr(0, _result.length - 1);
    }
    if (myUrl.hash != "") {
        _result += "#" + myUrl.hash;
    }
    return _result;
};

zteUtils.replaceUrlParams = function(url, newParams){
    var myUrl = zteUtils.parseURL(url);
    for (var x in newParams) {
        var hasInMyUrlParams = false;
        for (var y in myUrl.params) {
			//if (x.toLowerCase() == y.toLowerCase()) {
            if (x == y) {
                myUrl.params[y] = newParams[x];
                hasInMyUrlParams = true;
                break;
            }
        }
        //原来没有的参数则追加
        if (!hasInMyUrlParams) {
            myUrl.params[x] = newParams[x];
        }
    }
	
	var _result = "";
	if(myUrl.protocol != null && myUrl.protocol != "" &&
		myUrl.host != null && myUrl.host != "" &&
		myUrl.port != null && myUrl.port != ""){
		_result = myUrl.protocol + "://" + myUrl.host + ":" + myUrl.port + myUrl.path + "?";
	}else{
		if(url.indexOf("/") == 0){
			_result = myUrl.path + "?";
		}else{
			_result = "./" + myUrl.path + "?";
		}
	}
    
    for (var p in myUrl.params) {
        _result += (p + "=" + (myUrl.params[p] == null ?  "" : myUrl.params[p]) + "&");
    }
    
    if (_result.substr(_result.length - 1) == "&") {
        _result = _result.substr(0, _result.length - 1);
    }
    
    if (myUrl.hash != "") {
        _result += "#" + myUrl.hash;
    }
    return _result;
};

// 判断是否是空字符串
zteUtils.isNullString = function(data){
	if(data == undefined){
		return true;		
	}	
	return (data == null || data == "");	
};

// 获取select被选中的text内容
zteUtils.getSelText = function(elName){
    var val = "";
    $.each($(elName)[0].options, function(i, n){
        if (n.selected) {
            val = n.text;
            return false;
        }
    });
    return val;
};

/**
 * 解析userdata数据键值对格式的数据
 * @param userdata
 * @returns {}
 */
zteUtils._decodeParam = function (param)
{
	var key, value, paramObj = {};
	
	if(!param)
	{
		return paramObj;
	}
	
	for (var startIndex = 0, eqIdx = param.indexOf('=', startIndex), semiIdx; eqIdx > -1;)
	{
		key = param.substring(startIndex, eqIdx).toLowerCase();
		
		// 随路数据中us是最后一个关键且其内容也可能会带=和;所以做特殊处理
		if (key === "us")
		{
			value = param.substring(eqIdx + 1);
			paramObj[key] = value;
			break;
		}
		
		semiIdx = param.indexOf(';', eqIdx);
		
		if (semiIdx > -1)
		{
			startIndex = semiIdx + 1;
			value = param.substring(eqIdx + 1, semiIdx);
		}
		else
		{
			startIndex = param.length;
			value = param.substring(eqIdx + 1);
		}
		
		paramObj[key] = value;
		
		eqIdx = param.indexOf('=', startIndex);
	}
	
	return paramObj;
};

/**
*判断IE是否是9以上版本
*/
zteUtils.isOver9 = function()
{
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
	var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
	var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE){
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
		if(fIEVersion <=9){
			return false;
		}
     } else if(isEdge) {
           return true;
     } else if(isIE11) {
		   return true;
	 }else{
		return false;//不是ie浏览器
	}
}

