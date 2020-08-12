/**
 @Name：自定义公共函数
 @Author：licon
 */
layui.define(['cryptojs'], function(exports) {
	var $ = layui.$;

	var func = new Function();
	/*//获取筛选的session数据的某个值
	//设置的session数据
	func.prototype.setSessionData = function(name, value) {
		if(typeof(value) == "object") {
			$.session.set(name, JSON.stringify(value));
		} else {
			$.session.set(name, value);
		}
	}
	//获取的session数据
	func.prototype.getSessionData = function(name) {
		return eval('(' + $.session.get(name) + ')');
	}*/

	//时间格式化为YY-MM-DD hh:mm:ss
	func.prototype.formateDateTime = function(value) {
		if(!value) return "--";
		var date = new Date(value);
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1);
		var day = date.getDate().toString();
		var hour = date.getHours().toString();
		var minutes = date.getMinutes().toString();
		var seconds = date.getSeconds().toString();

		return year + "-" + fix(month, 2) + "-" + fix(day, 2) + " " + fix(hour, 2) + ":" + fix(minutes, 2) + ":" + fix(seconds, 2);
	};
	//日期格式YY-MM-DD
	func.prototype.formateDate = function(value) {
		if(!value) return "--";
		var date = new Date(value);
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1);
		var day = date.getDate().toString();

		return year + "-" + fix(month, 2) + "-" + fix(day, 2);
	};
	//获取某月的天数
	func.prototype.getDaysInOneMonth = function(Year, Month) {
		var d = new Date(Year, Month, 0);
		return d.getDate();
	};
	//获取星期几
	func.prototype.getWeek = function(w) {
		if(w == "1") {
			return "星期一";
		} else if(w == "2") {
			return "星期二";
		} else if(w == "3") {
			return "星期三";
		} else if(w == "4") {
			return "星期四";
		} else if(w == "5") {
			return "星期五";
		} else if(w == "6") {
			return "星期六";
		} else if(w == "7" || w == "0") {
			return "星期日";
		}
	};

	// 将分钟数量转为整点分钟数量
	func.prototype.minutesInt = function(minutes, b) {
		var mm = (minutes % 60);
		if(mm % 10 != 0) {
			// 如果true 则向上取
			if(b) {
				minutes = minutes - (mm % 10) + 10;
			} else {
				minutes = minutes - (mm % 10);

			}
		}
		return minutes;
	}
	// 将分钟数量转换HH:mm
	func.prototype.toHourMinute = function(minutes) {
		if(minutes < 0) return "";
		if(minutes > 1440) minutes -= 1440;
		var mm = (minutes % 60);
		if(mm < 10) {
			mm = "0" + mm;
		}
		var hh = (Math.floor(minutes / 60));
		if(hh < 10) {
			hh = "0" + hh;
		}
		return(hh + ":" + mm);

	}
	// 将HH:mm转为分钟数量
	func.prototype.toMinutes = function(time) {
		var timeArray = time.split(":");
		var mintutes = parseInt(timeArray[0] * 60) + parseInt(timeArray[1]);
		return mintutes;
	}

	// 将秒数数量转换为HH:mm:ss
	func.prototype.secondsInt = function(s) {
		return this.toHourMinuteSeconds(s);
	}
	// 将秒数数量转换为HH:mm:ss
	func.prototype.toHourMinuteSeconds = function(s) {
		if(isNaN(s)) return s;
		var t;
		if(s > -1) {
			var hour = Math.floor(s / 3600);
			var min = Math.floor(s / 60) % 60;
			var sec = s % 60;
			if(hour < 10) {
				t = '0' + hour + ":";
			} else {
				t = hour + ":";
			}

			if(min < 10) {
				t += "0";
			}
			t += min + ":";
			if(sec < 10) {
				t += "0";
			}
			t += sec;
		}
		return t;

	}

	// 将HH:mm:ss转为秒数
	func.prototype.toSeconds = function(time) {
		if(isNaN(time)) {
			var timeArray = time.split(":");
			var seconds = parseInt(timeArray[0] * 3600) + parseInt(timeArray[1] * 60) + parseInt(timeArray[2]);
			return seconds;
		} else {
			return time;
		}
	}

	//获取url上的参数(英文)
	func.prototype.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null)
			return decodeURI(r[2]);
		return null;
	}
	//获取地址栏参数，值可以是中文
	func.prototype.getUrlParam = function(key) {
		var url = window.location.search;
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
		var result = url.substr(1).match(reg);
		return result ? decodeURIComponent(result[2]) : null;
	}
	//比较对象中某个属性的大小(从大到小)
	func.prototype.compare = function(property) {
		return function(a, b) {
			var value1 = a[property];
			var value2 = b[property];
			return value2 - value1;
		}
	}

	//当有小数时保留n位小数
	func.prototype.formatToFixed = function(value, n) {
		if(value.toString().indexOf('.') <= 0) {
			return value;
		} else if(value.toString().split(".")[1].length <= n) {
			return value;
		} else if(value.toString().split(".")[1].length) {
			return value.toFixed(n);
		}
		return value;
	}

	//获取事件相对于控件位置
	func.prototype.getRelativePosition = function(event) {
		var objTop = getOffsetTop(event.currentTarget); //对象x位置
		var objLeft = getOffsetLeft(event.currentTarget); //对象y位置
		var mouseX = event.clientX + event.currentTarget.scrollLeft; //鼠标x位置
		var mouseY = event.clientY + event.currentTarget.scrollTop; //鼠标y位置
		var obj = {
			x: mouseX - objLeft,
			y: mouseY - objTop
		}
		return obj;
	}
	//字符串只提取汉字
	func.prototype.getChinese = function(strValue) {
		if(strValue != null && strValue != "") {
			var reg = /[\u4e00-\u9fa5]/g;
			return strValue.match(reg).join("");
		} else
			return "";
	}
	//字符串去掉汉字
	func.prototype.removeChinese = function(strValue) {
		if(strValue != null && strValue != "") {
			var reg = /[\u4e00-\u9fa5]/g;
			return strValue.replace(reg, "");
		} else
			return "";
	}
	//字符串只提取英文字母
	func.prototype.getLetter = function(strValue) {
		if(strValue != null && strValue != "") {
			var reg = /[a-zA-Z]/g;
			return strValue.match(reg).join("");
		} else
			return "";
	}
	//字符串去掉英文字母
	func.prototype.removeLetter = function(strValue) {
		if(strValue != null && strValue != "") {
			var reg = /[a-zA-Z]/g;
			return strValue.replace(reg, "");
		} else
			return "";

	}

	//网络图像文件转Base64
	func.prototype.getBase64Image = function(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
		var dataURL = canvas.toDataURL("image/" + ext);
		return dataURL;
	}

	//Base64字符串转二进制
	func.prototype.dataURLtoBlob = function(dataurl) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while(n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {
			type: mime
		});
	}
	//Bytes转化成KB(保留2位有效数字)
	func.prototype.BytesToKB = function(size) {
		return(size / 1024).toFixed(2);
	}
	//Bytes转化成MB(保留2位有效数字)
	func.prototype.BytesToMB = function(size) {
		return(size / 1024 / 1024).toFixed(2);
	}

	func.prototype.fix = function(num, length) {
		return('' + num).length < length ? ((new Array(length + 1)).join('0') + num)
			.slice(-length) :
			'' + num;

	}
	//当有小数时保留n位小数
	func.prototype.formatToFixed = function(value, n) {
		if(value.toString().indexOf('.') <= 0) {
			return value;
		} else if(value.toString().split(".")[1].length <= n) {
			return value;
		} else if(value.toString().split(".")[1].length) {
			return value.toFixed(n);
		}
		return value;
	}
	/*对象数组，组成新数组
	 * 例如[{name:"一",value:"1"},{name:"二",value:"2"}]
	 * 返回{name:["一","二"],value:["1","2"]}
	 * */
	func.prototype.arrToObj = function(arr) {
		var obj = {};
		if(arr[0]) {
			Object.keys(arr[0]).forEach(function(key) {
				obj[key] = [];
			});
		} else {
			return;
		}
		for(var i = 0, len = arr.length; i < len; i++) {
			if(arr[i]) {
				Object.keys(arr[i]).forEach(function(key) {
					if(arr[i][key] != null && typeof(arr[i][key]) != "undefined") {
						obj[key].push(arr[i][key])
					} else {
						obj[key].push("");
					}
				});
			}
		}
		return obj;
	}

	//aes加密
	func.prototype.aes = function(params) {
		var data = params.data;
		var type = params.type;
		var param = params.param;
		var key = params.key;
		const result = JSON.parse(JSON.stringify(data))
		if(type === 'Base64') {
			param.forEach(function(ele) {
				result[ele] = btoa(result[ele])
			})
		} else {
			param.forEach(function(ele) {
				var data = result[ele]
				key = CryptoJS.enc.Latin1.parse(key)
				var iv = key
				// 加密
				var encrypted = CryptoJS.AES.encrypt(
					data,
					key, {
						iv: iv,
						mode: CryptoJS.mode.CBC,
						padding: CryptoJS.pad.ZeroPadding
					});
				result[ele] = encrypted.toString()
			})
		}
		return result
	}
	//aes加密
	func.prototype.pwdAse = function(pwd, key) {
		var key = key ? key : "pigxpigxpigxpigx";
		var result = "";

		key = CryptoJS.enc.Latin1.parse(key);
		var iv = key;
		// 加密
		var encrypted = CryptoJS.AES.encrypt(
			pwd,
			key, {
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.ZeroPadding
			});
		result = encrypted.toString();

		return result;
	}
	//将对象拼接成 url参数
	func.prototype.queryStringByObj = function(params) {
		var paramsData = "?";
		for(var key in params) {
			if(params[key] != null && typeof(params[key]) != "undefined") {
				paramsData += key + "=" + params[key] + "&";
			} else {
				paramsData += key + "=&";
			}
		}
		paramsData = paramsData.slice(0, paramsData.length - 1);
		return paramsData;
	}
	//判断是否是IP地址
	func.prototype.isIP = function(value) {
		var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
		if(re.test(value)) {
			if(RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 &&
				RegExp.$4 < 256)
				return true;
		} else {
			return false;
		}
	}
	//10进制数字转化成16进制颜色
	func.prototype.decToHexColor = function(color) {
		return "#" + fix(color.toString(16), 6);
	}
	//16进制颜色数字转化成10进制数字
	func.prototype.hexToDecColor = function(color) {
		return parseInt(color.slice(1, 7), 16);
	}
	//获取浏览器类型
	func.prototype.myBrowser = function() {
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
		var isIE = userAgent.indexOf("compatible") > -1 &&
			userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
		var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
		var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
		var isSafari = userAgent.indexOf("Safari") > -1 &&
			userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
		var isChrome = userAgent.indexOf("Chrome") > -1 &&
			userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

		if(isIE) {
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			var fIEVersion = parseFloat(RegExp["$1"]);
			if(fIEVersion == 7) {
				return "IE7";
			} else if(fIEVersion == 8) {
				return "IE8";
			} else if(fIEVersion == 9) {
				return "IE9";
			} else if(fIEVersion == 10) {
				return "IE10";
			} else if(fIEVersion == 11) {
				return "IE11";
			} else {
				return "0";
			} //IE版本过低
			return "IE";
		}
		if(isOpera) {
			return "Opera";
		}
		if(isEdge) {
			return "Edge";
		}
		if(isFF) {
			return "Firefox";
		}
		if(isSafari) {
			return "Safari";
		}
		if(isChrome) {
			return "Chrome";
		}

	}
	//删除数组中值为某一值得项
	func.prototype.arrToDelValue = function(arr, v) {
		arr = arr.filter(function(curr) {
			return curr != v;
		});
		return arr;
	}
	//数组相减
	func.prototype.arrSubtraction = function(a, b) {
		for(var i = 0, len = b.length; i < len; i++) {
			for(var j = 0, jen = a.length; j < jen; j++) {
				if(JSON.stringify(a[j]) == JSON.stringify(b[i])) {
					a.splice(j, 1);
					j--
				}
			}
		}
		return a
	}

	exports('tools', new func());
});

function getOffsetTop(obj) {
	var tmp = obj.offsetTop;
	var val = obj.offsetParent;
	while(val != null) {
		tmp += val.offsetTop;
		val = val.offsetParent;
	}
	return tmp;
}

function getOffsetLeft(obj) {
	var tmp = obj.offsetLeft;
	var val = obj.offsetParent;
	while(val != null) {
		tmp += val.offsetLeft;
		val = val.offsetParent;
	}
	return tmp;
}
// 格式化数组 num-12 length - 4 -> 0012
function fix(num, length) {
	return('' + num).length < length ? ((new Array(length + 1)).join('0') + num)
		.slice(-length) :
		'' + num;
}