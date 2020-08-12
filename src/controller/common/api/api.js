/**
 @Name：接口调用统一
 @Author：licon
 */
layui.define(['table', 'form', "admin", "base"], function(exports) {
	var $ = layui.$,
		base = layui.base,
		setter = layui.setter,
		admin = layui.admin;
	var api = new Function();

	//测试
	api.prototype.getMapDevList = function(data, callcack) {
		return base.getReq({
			url: "./json/map-temp-list.js",
			data: data,
		}, callcack);
	}
	//测试
	api.prototype.getMapDev = function(data, callcack) {
		return base.getReq({
			url: "./json/map-temp-map.js",
			data: data,
		}, callcack);
	}
	exports('api', new api());
});