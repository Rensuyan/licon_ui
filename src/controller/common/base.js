/**
 @Name：底层逻辑，慎重修改
 @Author：licon
 */
layui.define(['admin'], function(exports) {
	var $ = layui.$,
		admin = layui.admin;
	var base = new Function();
	/**
	 * ajax请求
	 * @param  param参数对象
	 * @param  callback回调函数
	 * @return  返回数据
	 */
	base.prototype.getReq = function(param, callback) {
		var option = {
			cache: false,
			done: function(res) {
				if(callback && typeof callback == "function") callback(res);
			}
		};
		Object.keys(param).forEach(function(key) {
			option[key] = param[key];
			/* if(param[key]){
			 	option[key] = param[key];
			 }*/
		});
		//console.log(option)
		return admin.req(option);
	}
	exports('base', new base());
});