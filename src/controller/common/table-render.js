/*
 @Name：带分页的表格渲染
 @Author：licon
 */

layui.define(['table', 'laypage'], function(exports) {
	var $ = layui.$,
		table = layui.table,
		laypage = layui.laypage;


	var t = function(inter, config, callback) {
		var pageConfig; //分页配置
		var interData; //接口配置
		var pageId; //分页元素id
		var count = 0; //总页数
		var pageData;
		var pageSize; //每页个数（优先级：传入参数->表格配置）
		if(!inter || !config) return;

		pageConfig = config;
		interData = inter;
		pageId = config.elem.replace("#", "") + "-page";

		var api = inter.api.split(".")[0];
		var method = inter.api.split(".")[1];

		layui.use(api, function() {
			render();

			function render() {

				layui[api][method](inter.data, function(res) {
					if(res.code != 0) return;

					//if(config.page) $(config.elem).after("<div id='" + pageId + "'></div>");
					var d = judgeData(res); //判断数据结构
					pageData = d.data;
					count = d.count;
					pageSize = getPageSize(inter, config); //每页条数
					if(pageSize == null) {
						table(pageData);
						return;
					}

					$(config.elem + "-page").remove(); //分页ID
					$("[lay-id=" + config.elem.replace("#", "") + "]").remove();
					if(config.id) $("[lay-id=" + pageConfig.id + "]").remove();
					if(config.page) $(config.elem).after("<div id='" + pageId + "'></div>");

					layui.laypage.render({
						elem: pageId,
						count: count,
						layout: config.layout ? config.layout : ['count', 'prev', 'page', 'next'],
						limit: pageSize,
						limits: config.limits ? config.limits : [10, 20, 30, 40, 50],
						prev: '<em class="iconfont icon-left"></em>',
						next: '<em class="iconfont icon-right"></em>',
						groups: config.groups ? config.groups : 2,
						jump: function(obj) {
							/*inter.data.pageNo = obj.curr;
							layui[api][method](inter.data, function(res) {
								table(judgeData(res).data); //判断数据结构
							});*/
							if(obj.curr == 1) {
								table(pageData);
							} else {
								inter.data.pageNo = obj.curr;
								layui[api][method](inter.data, function(res) {
									table(judgeData(res).data); //判断数据结构
								});

							}
							$(".layui-laypage-limits select").unbind("change").on("change", function(e) {
								//pageSize = e.currentTarget.value;
								inter.data.pageNo = 1;
								inter.data.pageSize = e.currentTarget.value;
								render();
							});

						}
					});

					function table(data) {
						var option = {};
						Object.keys(config).forEach(function(key) {
							if(config[key]) {
								option[key] = config[key];
							}
						});

						option.page = false;
						option.data = data;
						option.limit = pageSize ? pageSize : Number.MAX_VALUE;

						layui.table.render(option);
						if(callback && typeof callback == "function") callback(data);
					}

				})
			}

		});

	}

	//判断数据结构
	function judgeData(res) {
		var obj = new Object;
		if(typeof(res.data.records) == "undefined" && typeof(res.data) != "undefined") {
			obj.data = res.data;
		}
		if(typeof(res.data.records) == "undefined" && typeof(res.data) != "undefined" && typeof(res.data.list) != 'undefined') {
			obj.data = res.data.list;
		}
		if(typeof(res.count) != "undefined") {
			obj.count = res.count ? res.count : 0;
		}

		if(typeof(res.data.records) != "undefined") {
			obj.data = res.data.records;
		}
		if(typeof(res.data.total) != "undefined") {
			obj.count = res.data.total ? res.data.total : 0;
		}
		return obj;
	}

	function getPageSize(inter, config) {
		if(!config.page || !inter.data || !inter.data.pageSize) {
			return null; //不分页
		} else if(inter.data && inter.data.pageSize) {
			return inter.data.pageSize;
		} else if(config.limit) {
			return config.limit;
		}
	}

	exports('tableRender', t);
});