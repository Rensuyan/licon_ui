/**
 @Name：监控地图操作--支持百度地图
 @Author：licon
 */
layui.define(function(exports) {
	var map;
	var defaultCursor = "";
	var func = new Function();
	//初始化地图
	func.prototype.initMap = function(config, callback) {
		try {
			map = new BMapGL.Map(config.container ? config.container : 'allmap', {
				restrictCenter: false,
				style: {
					styleJson: config.styleJson,
				}
			});

			map.enableScrollWheelZoom(); //开启鼠标滚轮缩放
			var navi3DCtrl = new BMapGL.NavigationControl3D({
				anchor: BMAP_ANCHOR_TOP_RIGHT,
				offset: new BMap.Size(10, 10)
			}); // 添加3D控件
			map.addControl(navi3DCtrl);
			map.setDisplayOptions({
				indoor: false,
				skyColors: !config.skyColors ? ["#fff", "#bad3fc"] : ['rgba(5, 5, 30, 0.7)', 'rgba(5, 5, 30, 1.0)']
			});
			if(config.center) {
				map.centerAndZoom(new BMapGL.Point(config.center[0], config.center[1]), config.zoom ? config.zoom : 12);
			} else {
				map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12);
			}

			map.setTilt(37.5);
			map.setHeading(0);

			if(document.getElementById("mask").nextSibling.nextSibling == null) { //3D
				if(callback && typeof callback == "function") callback(map);
			} else {
				//关闭了硬件加速，瓦片图加载不出来，加载2D地图
				map = null;
				if(callback && typeof callback == "function") callback();
			}

		} catch(e) {
			console.log(e)
		}

	}
	//获得地图
	func.prototype.getMap = function() {
		return map;
	}
	//获得地图边界
	func.prototype.getMapBound = function() {
		var bs = map.getBounds();
		var nE = bs.getNorthEast();
		var sW = bs.getSouthWest();
		return {
			leftDownLon: sW.lng,
			leftDownLat: sW.lat,
			rightUpLat: nE.lat,
			rightUpLon: nE.lng
		}
	}
	//获得地图缩放比例
	func.prototype.getMapZoom = function() {
		return map.getZoom();
	}
	//设置地图缩放比例
	func.prototype.setMapZoom = function(zoom) {
		map.setZoom(typeof(zoom) != "undefined" ? zoom : 12);
	}
	//设置地图最大缩放比例
	func.prototype.setMapMaxZoom = function(zoom) {
		map.setMaxZoom(zoom);
	}
	//设置地图最小缩放比例
	func.prototype.setMapMinZoom = function(zoom) {
		map.setMinZoom(zoom);
	}
	//设置地图视图范围
	func.prototype.setViewport = function(points) {
		var pts = [];
		for(var i = 0; i < points.length; i++) {
			pts.push(new BMapGL.Point(points.lonX, points.latY))
		}
		map.setViewport(pts);
	}
	//设置地图样式
	func.prototype.setMapStyle = function(styleJson) {
		map.setMapStyleV2({
			styleJson: styleJson,
		});
	}
	//设置地图中心点
	func.prototype.setMapCenter = function(lonX, latY) {
		map.setCenter(new BMapGL.Point(lonX, latY));
	}
	//获取中心点
	func.prototype.getMapCenter = function() {

	}
	//map绑定事件
	func.prototype.bindEvent = function(eventName, handler) {
		map.addEventListener(eventName, handler);
	}
	//map取消绑定事件
	func.prototype.removeEvent = function(eventName, handler) {
		map.removeEventListener(eventName, handler);
	}
	//绑定拖拽事件
	func.prototype.dragendEvent = function(handler) {
		map.addEventListener("dragend", handler);
	}
	//绑定缩放事件
	func.prototype.zoomendEvent = function(handler) {
		map.addEventListener("zoomend", handler);
	}
	//map绑定click事件
	func.prototype.clickEvent = function(handler) {
		map.addEventListener("click", handler);
	}
	//map取消绑定click事件
	func.prototype.clickRemoveEvent = function(handler) {

	}
	//map click获得的经纬度
	func.prototype.clickEventPosition = function(e) {

	}
	//设置中心和缩放比例
	func.prototype.setCenterAndZoom = function(lonX, latY, zoom) {
		map.centerAndZoom(new BMapGL.Point(lonX, latY), zoom ? zoom : map.getZoom())
	}
	//判断点是否在视野范围内
	func.prototype.boundContainsPoint = function(lonX, latY) {
		var bound = map.getBounds(); //地图可视区域
		if(bound.containsPoint(new BMapGL.Point(lonX, latY)) == true) {
			return true;
		}
		return false;
	}
	//设置marker位置
	func.prototype.setMarkerPosition = function(marker, lonX, latY) {

	}
	//获取所有覆盖物
	func.prototype.getOverlays = function(type) {
		return map.getOverlays();
	}
	//添加覆盖物
	func.prototype.addOverlay = function(overlay) {

	}
	//删除覆盖物
	func.prototype.removeOverlay = function(overlay) {
		map.removeOverlay(overlay);
	}
	//清空覆盖物
	func.prototype.clearOverlays = function() {
		map.clearOverlays();
	}
	//删除多个覆盖物
	func.prototype.removeOverlays = function(overlays) {

	}
	//设置鼠标样式
	func.prototype.setDefaultCursor = function(v) {

	}
	//创建标注，ifAdd是否添加到地图上，默认添加
	func.prototype.createMarker = function(config, ifAdd) {
		var marker;
		var pt = new BMapGL.Point(config.position[0], config.position[1]);
		if(config.icon && config.icon.url) {
			var width = config.size[0] ? config.size[0] : 20;
			var height = config.size[1] ? config.size[1] : 20;
			var myIcon = new BMapGL.Icon(config.icon.url, new BMapGL.Size(width, height), {
				imageSize: config.icon.size ? new BMapGL.Size(config.icon.size[0], config.icon.size[1]) : new BMapGL.Size(width, height),
			});

			marker = new BMapGL.Marker(pt, {
				icon: myIcon,
				offset: config.offset ? new BMapGL.Size(config.offset[0], config.offset[1]) : new BMapGL.Size(0, 0),
			});
			if(config.extData) {
				marker.extData = config.extData
			}
		} else {
			marker = new BMapGL.Marker(pt);
			if(config.extData) {
				marker.extData = config.extData
			}
		}

		/*var labelMarker = new BMapGL.Label('<div class="alarm-round"><div class="circle"><a></a></div><div class="circle_bottom animation"></div><div class="circle_bottom2 animation2"></div></div>', {
			position: new BMapGL.Point(config.position[0], config.position[1]),
		});
		labelMarker.setStyle({
			border: 'none',
			backgroundColor: 'rgba(0,0,0,0)',
		});
		marker.setLabel(labelMarker);*/
		if(ifAdd != false)
			map.addOverlay(marker);
		return marker;

	}
	//设置标注icon
	func.prototype.setIcon = function(marker, config) {
		marker.setIcon(new BMapGL.Icon(config.url, new BMapGL.Size(config.size[0], config.size[1])));
	}
	//获取markers的extData
	func.prototype.getMarkersExtData = function(markers) {

	}
	//创建Label，ifAdd是否添加到地图上，默认添加
	func.prototype.createLabel = function(config, ifAdd) {
		//添加闪烁报警效果
		var labelMarker = new BMapGL.Label(config.content ? config.content : "", {
			position: new BMapGL.Point(config.lonX, config.latY),
			offset: config.offset ? new BMapGL.Size(config.offset[0], config.offset[1]) : new BMapGL.Size(0, 0),
		});
		labelMarker.setStyle({
			border: 'none',
			backgroundColor: 'rgba(0,0,0,0)',
		});
		if(ifAdd != false)
			map.addOverlay(labelMarker);
		return labelMarker;
	}
	//给marker添加点击事件
	func.prototype.markerClickEvent = function(marker, clickHandler) {
		marker.addEventListener("click", clickHandler);
	}
	//手动点击marker
	func.prototype.clickMarker = function(marker) {
		if(marker.domElement) marker.domElement.click();
	}
	//弹出infoWindow,callback弹出框open回调
	func.prototype.openInfoWindow = function(marker, config, callback) {
		var infoWindow = new BMapGL.InfoWindow(config.content ? config.content : "", config);
		marker.openInfoWindow(infoWindow, new BMapGL.Point(config.lonX, config.latY));
	}
	//marker数组中找到对应经纬度并显示弹出框
	func.prototype.showInfoWindowWithCoordinates = function(markers, lonX, latY) {
		for(var i = 0, len = markers.length; i < len; i++) {
			if(markers[i].latLng.lng.toFixed(6) == lonX.toFixed(6) && markers[i].latLng.lat.toFixed(6) == latY.toFixed(6)) {
				if(markers[i].domElement) markers[i].domElement.click();
			}
		}
	}
	//标注拖拽移动位置
	func.prototype.drugMarkerToMove = function(marker, callback) {

	}
	//将经纬度解析成行政区域
	func.prototype.pointToAddress = function(lonX, latY, callback) {
		var myGeo = new BMapGL.Geocoder();
		myGeo.getLocation(new BMapGL.Point(lonX, latY), function(rs) {
			var addressComponents = rs.addressComponents;
			if(callback && typeof callback == "function") callback(addressComponents);
		});
	}
	//将行政区域解析成经纬度
	func.prototype.addressToPoint = function(address, callback) {
		var myGeo = new BMapGL.Geocoder();
		myGeo.getPoint(address.county, function(point) {
			if(callback && typeof callback == "function") callback({
				lonX: point.lng,
				latY: point.lat,
			});
		}, address.city);
	}
	//画折线
	func.prototype.drawPolyline = function(points, callback) {

	}
	//获取折线点集合
	func.prototype.getPolylinePath = function(polyline) {

	}
	//画圆
	func.prototype.drawCircle = function(callback) {

	}
	//获取圆圈覆盖物中包含的marker覆盖物
	func.prototype.getCircleContains = function(circle) {

	}
	//批量移动markers，操作点在circle范围中
	func.prototype.batchMoveMarkersByCircle = function(markers, circle, callback) {

	}
	//画多边形
	func.prototype.drawPolygon = function(callback) {

	}
	//获取多边形覆盖物中包含的marker覆盖物
	func.prototype.getPolygonContains = function(polygon) {

	}
	//批量移动markers，操作点在circle范围中
	func.prototype.batchMoveMarkersByPolygon = function(markers, polygon, callback) {

	}
	//绘制点轨迹图（引入mapvgl）
	func.prototype.drawVPoint = function(data) {

	}
	//新建mapvgl View
	func.prototype.createMapvglView = function() {
		var view = new mapvgl.View({
			map: map
		});
		return view;
	}
	//设置view中layer的值
	func.prototype.setMapvglLayer = function(view, layers, data) {
		for(var p = 0, len = layers.length; p < len; p++) {
			view.removeLayer(layers[p]);
		}
		var layerArr = [];

		for(var i = 0, len = data.length; i < len; i++) {
			if(data[i]) {
				var newData = [];
				for(var j = 0, len = data[i].locationDTOS.length; j < len; j++) {
					newData.push({
						geometry: {
							type: 'POINT',
							coordinates: [data[i].locationDTOS[j].lonX, data[i].locationDTOS[j].latY],
						},
					});
				}
				var pointLayer = new mapvgl.PointLayer({
					blend: 'lighter',
					shape: 'circle',
					color: data[i].color,
					size: 4
				});
				pointLayer.setData(newData);
				view.addLayer(pointLayer);
				layerArr.push(pointLayer)
			}

		}
		return layerArr;
	}
	//删除图管理容器（需要引入mapvgl）
	func.prototype.destroyView = function(view) {
		view.destroy();
	}
	//添加自定义DOM元素的工具，element DOM元素
	func.prototype.addDOMControl = function(element) {
		try {
			// 定义一个控件类,即function
			function magnifyControl() {
				// 默认停靠位置和偏移量
				this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
				this.defaultOffset = new BMapGL.Size(10, 10);
			}
			magnifyControl.prototype = new BMapGL.Control();
			magnifyControl.prototype.initialize = function(map) {
				// 添加DOM元素到地图中
				map.getContainer().appendChild(element);
				return element;
			}
			map.getContainer().appendChild(element);
			var mymagnifyControl = new magnifyControl();
			// 添加到地图当中
			map.addControl(mymagnifyControl);
		} catch(e) {

		}
	}
	//添加海量点
	func.prototype.addPointCollection = function(data) {

	}

	exports('bMapGL', new func());
});