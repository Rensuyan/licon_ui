/**
 @Name：业务实体
 @Author：licon
 */
layui.define(function(exports) {
	var $ = layui.$;

	var func = new Function();
	//站点类型
	func.prototype.StationType = function() {
		return [{
			name: "路灯",
			value: 0
		}, {
			name: "夜景",
			value: 1
		}]
	}
	//过载保护器
	func.prototype.ProtectorId = function() {
		return [{
			name: "保险",
			value: 0
		}, {
			name: "空开",
			value: 1
		}]
	}
	//回路相名称
	func.prototype.AliasName = function() {
		return [{
			name: "A相",
			value: 1
		}, {
			name: "B相",
			value: 2
		}, {
			name: "C相",
			value: 3
		}]
	}
	//控制器型号
	func.prototype.BoardType = function() {
		return [{
			name: "LSC8",
			value: "LSC8"
		}, {
			name: "LSC7",
			value: "LSC7"
		}, {
			name: "LSC6",
			value: "LSC6"
		}, {
			name: "208/209终端",
			value: "208/209终端"
		}, {
			name: "虚拟站点",
			value: "虚拟站点"
		}]
	}
	//模式
	func.prototype.ModeOnAll = function() {
		return [{
			name: "关灯模式",
			value: 0
		}, {
			name: "开灯模式1",
			value: 1
		}, {
			name: "开灯模式2",
			value: 2
		}, {
			name: "开灯模式3",
			value: 3
		}, {
			name: "开灯模式4",
			value: 4
		}, {
			name: "开灯模式5",
			value: 5
		}, {
			name: "开灯模式6",
			value: 6
		}]
	}
	//开灯模式
	func.prototype.ModeOn = function() {
		return [{
			name: "开灯模式1",
			value: 1
		}, {
			name: "开灯模式2",
			value: 2
		}, {
			name: "开灯模式3",
			value: 3
		}, {
			name: "开灯模式4",
			value: 4
		}, {
			name: "开灯模式5",
			value: 5
		}, {
			name: "开灯模式6",
			value: 6
		}]
	}
	//关灯模式
	func.prototype.ModeOff = function() {
		return [{
			name: "关灯模式",
			value: 0
		}, {
			name: "关灯模式1",
			value: 1
		}, {
			name: "关灯模式2",
			value: 2
		}, {
			name: "关灯模式3",
			value: 4
		}, {
			name: "关灯模式4",
			value: 4
		}, {
			name: "关灯模式5",
			value: 5
		}, {
			name: "关灯模式6",
			value: 6
		}]
	}
	//控制类型
	func.prototype.OutBitType = function() {
		return [{
			name: "照明",
			value: 1
		}, {
			name: "门磁",
			value: 2
		}]
	}
	//接触器
	func.prototype.ContactorId = function(bitsOutNum) {
		var arr = [];
		for(var i = 0; i < bitsOutNum; i++) {
			arr.push({
				"name": "K" + (i + 1),
				"value": i + 1
			});
		}
		return arr;
	}
	//水浸模块
	func.prototype.WaterLogIndex = function() {
		return [{
			name: "主机",
			value: 0
		}, {
			name: "1",
			value: 1
		}, {
			name: "2",
			value: 2
		}, {
			name: "3",
			value: 3
		}, {
			name: "4",
			value: 4
		}, {
			name: "5",
			value: 5
		}]
	}
	//通信方式
	func.prototype.CommType = function() {
		return [{
			name: "ZigBee",
			value: 90
		}, {
			name: "载波",
			value: 67
		}]
	}
	//单灯通信方式
	func.prototype.LampNodeCommType = function() {
		return [{
			name: "ZigBee",
			value: 2
		}, {
			name: "载波",
			value: 3
		}, {
			name: "公网",
			value: 4
		}]
	}
	//灯具类型
	func.prototype.LampType = function() {
		return [{
			value: 0,
			name: "高压钠灯"
		}, {
			value: 1,
			name: "LED灯"
		}, {
			value: 2,
			name: "金卤灯"
		}, {
			value: 3,
			name: "节能灯"
		}]
	}
	//灯头位置
	func.prototype.LampPosition = function() {
		return [{
			value: 0,
			name: "不启用"
		}, {
			value: 1,
			name: "快车道"
		}, {
			value: 2,
			name: "慢车道"
		}, {
			value: 3,
			name: "人行道"
		}, {
			value: 4,
			name: "装饰灯"
		}]
	}
	//自控
	func.prototype.UseFixedTime = function() {
		return [{
			value: false,
			name: "经纬度"
		}, {
			value: true,
			name: "定时"
		}]
	}
	//公网传输协议
	func.prototype.TcpUdp = function() {
		return [{
			value: 'U',
			name: "UDP"
		},{
			value: 'T',
			name: "TUP"
		}];
	}
	//网络标志
	func.prototype.MN = function() {
		return [{
			value: 'A',
			name: "自动搜索公网"
		}, {
			value: 'G',
			name: "GPRS"
		}, {
			value: 'C',
			name: "CDMA"
		}, {
			value: 'E',
			name: "EVDO"
		}, {
			value: '4',
			name: "4G"
		}, {
			value: '5',
			name: "5G"
		}, {
			value: 'N',
			name: "NB-IoT"
		}, {
			value: 'W',
			name: "WiFi"
		}, {
			value: 'R',
			name: "RJ-45"
		}]
	}
	//标签类型
	func.prototype.EntityType = function() {
		return [{
			value: '0',
			name: "站点"
		}, {
			value: '1',
			name: "灯杆"
		}, {
			value: '2',
			name: "光控分区"
		}];
	}
	
	exports('utils', new func());
});