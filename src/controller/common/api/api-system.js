/**
 @Name：接口调用统一 系统
 @Author：licon
 */
layui.define(['table', 'form', "admin", "base"], function(exports) {
	var $ = layui.$,
		base = layui.base,
		setter = layui.setter,
		admin = layui.admin;
	var api = new Function();
	/*系统状态*/
	//获取当前系统运行状态
	api.prototype.getSystemStatus = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/status"
		}, callcack);
	}
	//获取当前设备统计信息
	api.prototype.getSystemStatistics = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/statistics"
		}, callcack);
	}
	//判断系统是否初始化
	api.prototype.sysIsInit = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/isInit"
		}, callcack);
	}
	//获取软件授权相关信息（关于页面）
	api.prototype.sysVerify = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/verify"
		}, callcack);
	}
	//获取地图类型
	api.prototype.mapType = function(data, callcack) {
		return base.getReq({
			async: false,
			url: "/olm-biz/system/mapType"
		}, callcack);
	}
	//获取系统实际开关灯时间
	api.prototype.getCurrSysSwitch = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/get-currSysSwitch"
		}, callcack);
	}
	

	/*巡检参数*/
	//获得巡检参数设置
	api.prototype.getAutoPollParams = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/auto-poll-params"
		}, callcack);
	}
	//更新巡检参数设置
	api.prototype.updateAutoPollParams = function(data, callcack) {
		return base.getReq({
			type: "put",
			url: "/olm-biz/system/auto-poll-params",
			data: JSON.stringify(data),
			contentType: "application/json;charset=UTF-8"
		}, callcack);
	}
	//公网设备监视
	api.prototype.getDeviceScada = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/device/scada",
			data: data,
		}, callcack);
	}

	/*系统参数*/
	//获得系统参数设置
	api.prototype.getSysParams = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/get-system-params",
		}, callcack);
	}
	//更新系统参数设置
	api.prototype.updateSysParams = function(data, callcack) {
		return base.getReq({
			type: "put",
			url: "/olm-biz/system/update-system-params",
			data: JSON.stringify(data),
			contentType: "application/json;charset=UTF-8"
		}, callcack);
	}
	//设置系统中心点
	api.prototype.setSysCenter = function(data, callcack) {
		return base.getReq({
			type: "put",
			url: "/olm-biz/system/center",
			data: data,
			//data: JSON.stringify(data),
			//contentType: "application/json;charset=UTF-8"
		}, callcack);
	}
	api.prototype.getSysCenter = function(data, callcack) {
		return base.getReq({
			type: "GET",
			url: "/olm-biz/system/center"
		}, callcack);
	}

	/*系统命令*/
	//切换工作方式data{runMode}
	api.prototype.cmdRunModeSwitch = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/switch/" + data,
		}, callcack);
	}
	//停用or启用自动巡检
	api.prototype.cmdAutoPoll = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/auto/poll",
			data: data,
		}, callcack);
	}
	//循环读表
	api.prototype.cmdPowerPoll = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/power/poll",
		}, callcack);
	}
	//系统校时
	api.prototype.cmdTimeSync = function(data, callcack) {
		return base.getReq({
			url: "/olm-biz/system/time/sync",
		}, callcack);
	}

	//获取系统日志
	api.prototype.getSystemLogData = function(data, callcack) {
		return base.getReq({
			type: "POST",
			url: "/admin/log?beginTime=" + data.startTime + "&endTime=" + data.endTime + "&pageNo=" + data.pageNo + "&pageSize=" + data.pageSize + "&type=" + data.type,
			data: JSON.stringify(data.serviceIds),
			contentType: "application/json;charset=UTF-8"
		}, callcack);
	}
	//删除系统日志
	api.prototype.delSystemLogById = function(data, callcack) {
		return base.getReq({
			type: "DELETE",
			url: "/admin/log/" + data
		}, callcack);
	}

	/*********************在线更新 ***********************/
	// 根据激活码获取用户信息
	api.prototype.getUserInfoByCode = function(data, callcack) {
		return base.getReq({
			type: "GET",
			url: "/olm-biz/verify/client/" + data + "/info"
		}, callcack);
	}

	//发送验证码
	api.prototype.sendVeriCode = function(data, callcack) {
		return base.getReq({
			type: "Post",
			url: "/olm-biz/verify/send/code?userName=" + data
		}, callcack);
	}
	//在线更新/验证
	api.prototype.updateOnline = function(data, callcack) {
		return base.getReq({
			type: "POST",
			url: "/olm-biz/verify/verification",
			data: JSON.stringify(data),
			contentType: "application/json;charset=UTF-8"
		}, callcack);
	}
	//激活设备
	api.prototype.validation = function(data, callcack) {
		return base.getReq({
			type: "POST",
			url: "/olm-biz/verify/validation",
			data: JSON.stringify(data),
			contentType: "application/json;charset=UTF-8"
		}, callcack);
	}

	//获取报警等级列表
	api.prototype.getAlarmLevelList = function(data, callcack) {
		return base.getReq({
			type: "GET",
			url: "/olm-biz/alarm/level/list",
		}, callcack);
	}
	//更新报警等级列表
	api.prototype.updateAlarmLevel = function(data, callcack) {
		return base.getReq({
			type: "PUT",
			url: "/olm-biz/alarm/level",
			data: JSON.stringify(data),
			contentType: "application/json;charset=UTF-8"
		}, callcack);
	}
	//获取所有的故障
	api.prototype.getFaultList = function(data, callcack) {
		return base.getReq({
			type: "GET",
			url: "/olm-biz/alarm/level/fault/list/" + data,
		}, callcack);
	}

	//数据库备份自动配置
	api.prototype.getBackupConfig = function(data, callcack) {
		return base.getReq({
			type: "GET",
			url: "/olm-biz/dbbackup/config",
		}, callcack);
	}

	//数据库备份  自动动
	api.prototype.dbBackupByAuto = function(data, callcack) {
		return base.getReq({
			type: "POST",
			url: "/olm-biz/dbbackup/automatic",
			data: JSON.stringify(data),
			contentType: "application/json;charset=UTF-8"
		}, callcack);
	}

	//数据库备份  列表
	api.prototype.getDBbackupList = function(data, callcack) {
		return base.getReq({
			type: "GET",
			url: "/olm-biz/dbbackup/getBackupList",
		}, callcack);
	}

	//数据库备份  删除
	api.prototype.deleteDBbackup = function(data, callcack) {
		return base.getReq({
			type: "DELETE",
			url: "/olm-biz/dbbackup/del?fileName=" + data,
		}, callcack);
	}

	exports('apiSys', new api());
});