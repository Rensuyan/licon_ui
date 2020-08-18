layui.define(['form', 'flow', 'mapOpt', 'api', 'view','slimScroll','com'], function(exports) {
	var $ = layui.$,
		flow = layui.flow,
		mapOpt = layui.mapOpt,
		view = layui.view,
		com = layui.com,
		api = layui.api,
		form = layui.form;
	//地图请求
	var mapAjax;
	//地图上markers的Map对象
	var mapObj = new Map();

	//form.render();
	initMap();
	bindEvents();
	$("#LAY-app-map-temp-list").slimScroll(com.getSlimScrollStyle("100%", "100%"));
	/**
	 * 初始化地图容器
	 */
	function initMap() {
		mapOpt.initMap({
			container: 'allmap',
			zoom: 12,
			center: [118.803702, 31.871605],
		}, 1, function() {
			loadList();
			loadMap();
		});
	}
	/**
	 * 获得设备列表数据
	 * @param {number=} p1 回调函数（可选）
	 */
	function loadList(callback) {
		var param = {
			pageNo: 1,
			pageSize: 15,
		}

		layui.flow.load({
			elem: '#LAY-app-map-temp-list',
			scrollElem: '#LAY-app-map-temp-list',
			isAuto: true,
			done: function(page, next) {
				api.getMapDevList(param, function(res) {
					if (res.code == 0) {
						var lis = [];
						for (var i = 0, len = res.data.length; i < len; i++) {
							lis.push(getListItemHtml(res.data[i]))
						}
						param.pageNo++;
						next(lis.join(''), page < res.pages); //总页数

						//列表点击
						$('.licon-list-message-item').unbind('click').on('click', function(e) {
							listClick(e);
						});

						//回调
						if (callback && typeof(callback) == 'function') callback(res);
					}

				})
			}
		});

	}
	/**
	 * 处理列表点击
	 * @param {number=} p1 点击事件
	 */
	function listClick(e) {
		var data = JSON.parse($(e.currentTarget).find('.licon-list-message-item-data').val());
		//将地图中心点设置到该设备
		mapOpt.setMapCenter(data.lonX, data.latY);

		loadMap(function(res) {
			//手动点击marker
			mapOpt.clickMarker(mapObj.get(data.id));
		});

	}
	/**
	 * 加载地图数据
	 * @param {number=} p1 回调函数（可选）
	 */
	function loadMap(callback) {
		if (mapAjax) {
			//释放之前请求
			mapAjax.abort();
			mapAjax = null;
		}
		var bs = mapOpt.getMapBound();
		mapAjax = api.getMapDev({
			leftDownLon: bs.leftDownLon,
			leftDownLat: bs.leftDownLat,
			rightUpLat: bs.rightUpLat,
			rightUpLon: bs.rightUpLon
		}, function(res) {
			if (res.code == 0) {
				showMarkers(res.data);
				if (callback && typeof callback == 'function') callback(); //回调
			}
		});
	}
	/**
	 * 加载地图上markers
	 * @param {number=} p1 回调函数（可选）
	 */
	function showMarkers(list) {
		$.each(list, function(i, item) {
			var obj = mapObj.get(item.id);
			if (obj) {
				if (obj.extData.img != item.img) {
					mapOpt.setIcon(obj, {
						url: 'style/res/dev.png',
						size: [16, 16],
					})
				}
			} else {
				var marker = mapOpt.createMarker({
					position: [item.lonX, item.latY],
					icon: {
						url: layui.setter.base + 'style/res/dev.png',
						size: [16, 16],
					},
					size: [16, 16],
					extData: {
						img: item.img,
					}
				});
				mapObj.set(item.id, marker);
				mapOpt.markerClickEvent(marker, markerClick);

				function markerClick() {
					mapOpt.openInfoWindow(marker, {
						content: getOpenInfoHtml(item),
						lonX: item.lonX,
						latY: item.latY,
					});
					setTimeout(function() {
						bindMarkerEvents(item, marker);
					}, 100)
				};

				function bindMarkerEvents() {
					$('[lay-filter="marker-station-detail-btn"]').unbind('click').click(function() {
						openDevDetail(item);
					});
				}
			}
		});
	}
	/**
	 * 打开设备详情页
	 *
	 * @param {string} p1 某个设备数据
	 */
	function openDevDetail(data) {
		console.log(data)
		//view('LAY-app-map-dev-detail').render('page/template/devDetail', data);
		if($("#LAY-app-map-dev-open").length){
			$("#LAY-app-map-dev-open").parent().remove();
		}
		layer.open({
			title: "设备详情",
			type: 1,
			id: "LAY-app-map-dev-open",
			offset: 'rb',
			shade: 0,
			area: ['400px', '600px'],
			success: function(layero, index) {
				view(this.id).render('page/template/devDetail', data);
			}
		});
	}
	/**
	 * 绑定界面操作事件
	 *
	 */
	function bindEvents() {
		$('[lay-filter="map-list-toggle-display"]').on('click', function(e) {
			$('.licon-list-message-item').toggleClass('inline-display');
			if (e.currentTarget.className == 'iconfont icon-group') {
				e.currentTarget.className = 'iconfont icon-list';
			} else {
				e.currentTarget.className = 'iconfont icon-group';
			}
		})
	}
	/**
	 * 拼接列表数据
	 *
	 * @param {string} p1 某个设备数据
	 * @return {Object} 返回列表html
	 */
	function getListItemHtml(data) {
		return '<li class="licon-list-message-item inline-display">' +
			'<textarea class="licon-list-message-item-data" style="display: none;">' + JSON.stringify(data) + '</textarea>' +
			'<h3>' + data.name + '</h3>' +
			'<p>' +
			'<div>设备类型：' + data.type + '</div>' +
			'<div>设备串号：' + data.trashcanSn + '</div>' +
			'<div>所属站点：' + data.stationName + '</div>' +
			'</p>' +
			'<span>' + data.createTime + '</span>' +
			//'<a href="javascript:;" layadmin-event="replyNote" data-id="5" class="layui-btn layui-btn-xs layuiadmin-reply">详情</a>' +
			'</li>';
	}
	/**
	 * 拼接标注弹出框html
	 *
	 * @param {string} p1 某个设备数据
	 * @return {Object} 返回标注弹出框html
	 */
	function getOpenInfoHtml(data) {
		return '<div>设备名称：' + data.name + '</div>' +
			'<div>设备串号：' + data.trashcanSn + '</div>' +
			'<div>更新时间：' + data.updateTime + '</div>' +
			'<div class="marker-btn-group">' +
			'<a lay-filter="marker-station-detail-btn" href="javascript:;">详情 </a>' +
			'<div>';
	}

	exports('mapTemp', {})
});
