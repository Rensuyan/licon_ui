/**
 @Name：业务逻辑公用函数
 @Author：licon
 */
layui.define(function(exports) {
	var $ = layui.$;

	var func = new Function();

	//格式化站点编号
	func.prototype.stationId = function(value) {
		return fix(value, 4);
	};
	//格式化分组编号
	func.prototype.groupId = function(value) {
		return fix(value, 2);
	};
	//格式化光控分区编号\光照度采集器编号
	func.prototype.luxId = function(value) {
		return fix(value, 2);
	};
	//站点类型
	func.prototype.formateStationType = function(type) {
		if(type == 0) return "路灯";
		if(type == 1) return "夜景";
		if(type == -1) return "全体";
		return "";
	}
	//站点状态
	func.prototype.formateStationStatus = function(status) {
		if(status == 0) return "禁用";
		if(status == 1) return "启用";
		if(status == 2) return "维修中";
		return "";
	}
	//漏保状态
	func.prototype.formateLeakStatus = function(leakAmp, leakStatus) {
		/*if(status == 0) return "未启用";
		if(status == 1) return "启用";
		if(status == 2) return "启用，参数校验字不一致";
		if(status == 3) return "启用，处于漏保保护状态";
		return "";*/
		var val = "正常";

		if(leakAmp == 0xffff) {
			val = "采样芯片故障";
		} else if(leakAmp == 0xfffe) {
			val = "通信故障";
		} else {
			if(leakStatus == 1) //protect)
			{
				val = "已保护";
			} else if(leakStatus == 2) {
				val = "漏电";
			}else if(leakStatus == 3) {
				val = "漏电值超限";
			}
		}
		return val;
	}
	//模式
	func.prototype.formateMode = function(mode) {
		if(mode == 0) return "关灯模式";
		if(mode >= 1 && mode <= 6) return "开灯模式" + mode;
		return "--";
	}
	//工作方式格式化
	func.prototype.formatControlMode = function(mode) {
		if(mode == 1) return "自主";
		if(mode == 2) return "遥控";
		if(mode == -1) return "--";
		return "";
	}
	//工作方式格式化
	func.prototype.formatWorkMode = function(mode) {
		if(mode == 0) {
			return "正常"; //自动
		} else if(mode == 1) {
			return "特殊"; //手动
		}
		return "";
	}
	//相位
	func.prototype.formatePhase = function(status) {
		if(status == 1) return "A相";
		if(status == 2) return "B相";
		if(status == 3) return "C相";
		if(status == 0) return "全相";
		return "";
	}
	//通信类型
	func.prototype.formateCommType = function(type) {
		if(type == 0) return "UDP";
		if(type == 1) return "TCP";
		return "";
	}
	//根据控制器串号算出控制器型号(单灯控制器)
	func.prototype.getBoardTypeLampNode = function(serialNo) {
		var substr = serialNo.substring(4, 5);
		var boardType = "SLC" + serialNo.substring(4, 6);
		if(substr == 1 || substr == 2 || substr == 3) {
			boardType = "SLC" + serialNo.substring(4, 6);
		} else {
			return "不是单灯控制器";
		}
		return boardType;
	}
	//根据控制器串号算出控制器型号（未知类型）
	func.prototype.getBoardType = function(serialNo) {
		var substr = serialNo.substring(4, 5);
		if(substr == 1 || substr == 2 || substr == 3) {
			//单灯控制器
			boardType = "SLC" + serialNo.substring(4, 6);
		} else if(substr == 6 || substr == 7 || substr == 8) {
			//照明集控器
			boardType = this.getBoardTypeStation(serialNo);
		} else if(substr == 4 && serialNo.substring(5, 6) == 3) {
			//照度采集器
			boardType = "TLC43";
		} else if(substr == 5) {
			boardType = "主机模块及拓展模块";
		}
		return boardType;
	}
	//根据控制器串号算出控制器型号(站点)
	func.prototype.getBoardTypeStation = function(serialNo) {
		var substr = serialNo.substring(4, 6);
		if(substr == "08" || substr == "09") {
			return "208/209终端";
		} else if(substr == "81" || substr == "82" || substr == "83") {
			return "LSC8";
		} else if(substr == "61" || substr == "62" || substr == "63") {
			return "LSC6";
		} else if(substr == "71" || substr == "72" || substr == "73") {
			return "LSC7";
		} else {
			return "";
		}
	}
	//控制器型号
	func.prototype.boardType = function(type) {
		if(type.indexOf("LSC8") >= 0) return "LSC8";
		if(type.indexOf("LSC7") >= 0) return "LSC7";
		if(type.indexOf("LSC6") >= 0) return "LSC6";
		if(type.indexOf("208/209终端") >= 0) return "208/209终端";
		if(type.indexOf("虚拟站点") >= 0) return "虚拟站点";
		return "";
	}
	//站点、灯杆状态格式化
	func.prototype.formatFlag = function(flag) {
		if(flag <= 0)
			return "<span class='status-dot status-gray'></span>";
		if(flag == 1)
			return "<span class='status-dot status-green'></span>";
		if(flag == 2)
			return "<span class='status-dot status-red'></span>";
		if(flag == null)
			return "<span class='status-dot status-gray'></span>";
		return "";
	}
	//输入输出只有1开（红），0关（绿）两种状态
	//输出状态转换bitsOut（数组） ==> status
	func.prototype.bitsOutToStatus = function(bitsOut) {
		var status = 0;
		for(var i = 0, len = bitsOut.length; i < len; i++) {
			status |= (1 << bitsOut[i]);
		}
		return status;
	}
	//输出状态转换bitsOut（数组） ==> 圆点
	func.prototype.bitsOutToDots = function(bitsOut) {
		var dots = "";
		for(var i = 0, len = bitsOut.length; i < len; i++) {
			if(bitsOut[i] > 0) {
				dots += "<span class='status-dot status-red'></span>";
			} else {
				dots += "<span class='status-dot status-green'></span>";
			}
		}
		return dots;
	}
	//站点、灯杆状态bitsOut（值）
	func.prototype.formatePostStationBitsOut = function(bitsOut, branchNum) {
		if(bitsOut == null || typeof(bitsOut) == "undefined") return "";
		var dots = "";
		for(var i = 0; i < branchNum; i++) {
			if((bitsOut & (1 << i)) > 0) {
				dots += "<span class='status-dot status-red'></span>";
			} else {
				dots += "<span class='status-dot status-green'></span>";
			}
		}
		return dots;
	}
	//输入输出状态单个格式化
	func.prototype.formateBitInOut = function(bit, i) {
		if(bit == null || typeof(bit) == "undefined") return "";
		var value = bit;
		if(typeof(i) != "undefined" && i != null) {
			value = (bit & (1 << i));
		}
		if(value > 0) {
			return "<span class='status-dot status-red'></span>";
		} else {
			return "<span class='status-dot status-green'></span>";
		}
	}
	//工況数据格式化
	func.prototype.formatStatusPoll = function(status, recdTime, fixednum) {
		if(recdTime == null) {
			return "";
		} else {
			if(status == -1) {
				return "--";
			} else {
				if(fixednum) {
					return status.toFixed(fixednum);
				} else {
					return status; //.toFixed(1)
				}

			}
		}
	}
	//判断是否是水浸  position:回路号（从0开始）
	func.prototype.isWater = function(position, bitsInNum, waterLogProtect, waterLogIndex, serialNo) {
		/*var isWater = false;
		if(waterLogProtect) {
			var modeOne = serialNo.substring(4, 5);
			if(waterLogIndex >= 0) {
				if(modeOne != null) {
					switch(modeOne) {
						case "8":
							if(position >= waterLogIndex * 4 && position < (waterLogIndex * 4 + 4)) {
								isWater = true;
							}
							break;
						case "7":
							if(waterLogIndex == 0 && position >= 0 && position < 4) {
								isWater = true;
							}
							break;
						case "6": //如果有水浸模块，必须在最后四位
							if(waterLogIndex == 1 && position >= 1 && position < bitsInNum && position > (bitsInNum - 5)) {
								isWater = true;
							}
							break;
						case "0":
							if(waterLogIndex == 1 && position >= 12 && position < 16) {
								isWater = true;
							}
							break;
						default:
							break;
					}
				}
			}

		} else {
			isWater = false;
		}
		return isWater;
*/
		var isWater = false;
		if(waterLogProtect) {
			var modeOne = serialNo.substring(4, 5);
			if(waterLogIndex >= 0) {
				if(modeOne != null) {
					switch(modeOne) {
						case "8":
							if(position >= waterLogIndex * 4 && position < (waterLogIndex * 4 + 4)) {
								isWater = true;
							}
							break;
						case "7":
							if(waterLogIndex == 0 && position >= 0 && position < 4) {
								isWater = true;
							}
							break;
						case "6": //如果有水浸模块，必须在最后四位
							if(waterLogIndex == 1 && position >= 1 && position < bitsInNum && position > (bitsInNum - 5)) {
								isWater = true;
							}
							break;
						case "0":
							if(waterLogIndex == 1 && position >= 12 && position < 16) {
								isWater = true;
							}
							break;
						default:
							break;
					}
				}
			}

		} else {
			isWater = false;
		}
		return isWater;

	}
	//根据串号获得控制器输出回路数
	func.prototype.getSerialNoOutNum = function(serialNo) {
		if(serialNo) return Number(serialNo.substring(5, 6));
		return 0;
	}
	//灯具类型
	func.prototype.formateLampType = function(type) {
		if(type == 0) return "高压钠灯";
		if(type == 1) return "LED灯";
		if(type == 2) return "金卤灯";
		if(type == 3) return "节能灯";
		return "";
	}
	//灯头位置
	func.prototype.formateLampPosition = function(type) {
		if(type == 0) return "不启用";
		if(type == 1) return "快车道";
		if(type == 2) return "慢车道";
		if(type == 3) return "人行道";
		if(type == 4) return "装饰灯";
		return "";
	}
	//滚动样式jquery.slimscroll.min.js插件
	func.prototype.getSlimScrollStyle = function(width, height) {
		return {
			width: width != null ? width : 'auto', //可滚动区域宽度
			height: height != null ? height : '100%', //可滚动区域高度
			size: '10px', //滚动条宽度，即组件宽度
			color: '#333', //滚动条颜色
			position: 'right', //组件位置：left/right
			distance: '0px', //组件与侧边之间的距离
			start: 'top', //默认滚动位置：top/bottom
			opacity: .4, //滚动条透明度
			alwaysVisible: false, //是否 始终显示组件
			disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
			railVisible: false, //是否 显示轨道
			railColor: 'rgba(0,0,0,0)', //轨道颜色
			railOpacity: .2, //轨道透明度
			railDraggable: true, //是否 滚动条可拖动
			railClass: 'slimScrollRail', //轨道div类名
			barClass: 'slimScrollBar', //滚动条div类名
			wrapperClass: 'slimScrollDiv', //外包div类名
			allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
			wheelStep: 15, //滚轮滚动量
			touchScrollStep: 200, //滚动量当用户使用手势
			borderRadius: '7px', //滚动条圆角
			railBorderRadius: '7px' //轨道圆角
		}
	}
	//标签类型
	func.prototype.formateEntityType = function(type) {
		if(type == 0) return "站点";
		if(type == 1) return "灯杆";
		if(type == 2) return "光控分区";
		return "";
	}

	exports('com', new func());
});
// 格式化数组 num:12,length:4 -> 0012
function fix(num, length) {
	return('' + num).length < length ? ((new Array(length + 1)).join('0') + num)
		.slice(-length) :
		'' + num;
}