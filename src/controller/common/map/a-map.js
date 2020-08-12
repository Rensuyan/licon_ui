/**
 @Name：监控地图操作--支持高德地图
 @Author：licon
 */
layui.define(function(exports) {
	var map;
	var defaultCursor = "";
	var func = new Function();
	//初始化地图
	func.prototype.initMap = function(config, callback) {
		try {
			map = new AMap.Map(config.container ? config.container : 'allmap', {
				resizeEnable: true, //是否监控地图容器尺寸变化
				zoom: typeof(config.zoom) != "undefined" ? config.zoom : 12, //初始化地图层级
				center: [config.center && config.center[0] ? config.center[0] : 116.497, config.center && config.center[1] ? config.center[1] : 39.843] //初始化地图中心点
			});
			map.setFeatures(['bg', 'road', 'building']);
			defaultCursor = map.getDefaultCursor();
			if(callback && typeof callback == "function") callback();
		} catch(e) {
			console.log(e)
			//TODO handle the exception
		}
	}
	//获得地图
	func.prototype.getMap = function() {
		return map;
	}
	//获得地图边界
	func.prototype.getMapBound = function() {
		var bs = map.getBounds();
		var nE = bs.northeast;
		var sW = bs.southwest;
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
		
	}
	//设置地图最小缩放比例
	func.prototype.setMapMinZoom = function(zoom) {
		
	}
	//设置地图视图范围
	func.prototype.setViewport = function(points) {
		
	}
	//设置地图样式
	func.prototype.setMapStyle = function(styleJson) {
		
	}
	//设置地图中心点
	func.prototype.setMapCenter = function(lonX, latY) {
		map.setCenter([lonX, latY]);
	//	map.setCenter(new AMap.Pixel(lonX, latY));
		
	}
	//获取中心点
	func.prototype.getMapCenter = function() {
		return {
			lonX: map.getCenter().lng,
			latY: map.getCenter().lat,
		};
	}
	//map绑定事件
	func.prototype.bindEvent = function(eventName, handler) {

	}
	//map取消绑定事件
	func.prototype.removeEvent = function(eventName, handler) {

	}
	//绑定拖拽事件
	func.prototype.dragendEvent = function(handler) {
		map.on('dragend', handler);
	}
	//绑定缩放事件
	func.prototype.zoomendEvent = function(handler) {
		map.on('zoomend', handler);
	}
	//map绑定click事件
	func.prototype.clickEvent = function(handler) {
		map.on('click', handler);
	}
	//map取消绑定click事件
	func.prototype.clickRemoveEvent = function(handler) {
		map.off('click', handler);
	}
	//map click获得的经纬度
	func.prototype.clickEventPosition = function(e) {
		return {
			lonX: e.lnglat.lng,
			latY: e.lnglat.lat,
		}
	}
	//设置中心和缩放比例
	func.prototype.setCenterAndZoom = function(lonX, latY, zoom) {
		map.setZoomAndCenter(zoom, [lonX, latY]);
	}
	//判断点是否在视野范围内
	func.prototype.boundContainsPoint = function(lonX, latY) {
		var bound = map.getBounds();
		if(bound.contains(new AMap.LngLat(lonX, latY))) {
			return true;
		}
		return false;
	}
	//设置marker位置
	func.prototype.setMarkerPosition = function(marker, lonX, latY) {
		marker.setPosition([lonX, latY]);
	}
	//获取所有覆盖物
	func.prototype.getOverlays = function(type) {
		if(type) {
			return map.getAllOverlays(type);
		} else {
			return map.getAllOverlays();
		}
	}
	//添加覆盖物
	func.prototype.addOverlay = function(overlay) {
		map.add(overlay);
	}
	//删除覆盖物
	func.prototype.removeOverlay = function(overlay) {
		if(overlay) map.remove(overlay);
	}
	//删除多个覆盖物
	func.prototype.removeOverlays = function(overlays) {
		for(var i = 0, len = overlays.length; i < len; i++) {
			map.remove(overlays[i]);
		}
	}
	//清空覆盖物
	func.prototype.clearOverlays = function() {
		map.clearMap();
	}
	//设置鼠标样式
	func.prototype.setDefaultCursor = function(v) {
		if(v) {
			map.setDefaultCursor(v);
		} else {
			map.setDefaultCursor(defaultCursor);
		}
	}
	//创建标注，ifAdd是否添加到地图上，默认添加
	func.prototype.createMarker = function(config, ifAdd) {
		/*config = {
			"position": [118.787724, 31.867808],//点位置
			"icon": {
				"url": "../src/style/res/monitor/station_error.png",//图片路径
				"size": [20, 20],//图片大小，默认标注大小
				"offset": [0, 0],//图片偏移，默认[0,0]
			},
			"size": [20, 20],//标注大小，默认[20,20]
			"offset": [0, 0],//标注偏移，默认[0,0]
			"anchor": "center",//锚点“enter”，“bottom”,默认‘center’
			"extData": {},//自定义数据
		}*/
		var marker;
		if(config.icon && config.icon.url) {
			var width = config.size[0] ? config.size[0] : 20;
			var height = config.size[1] ? config.size[1] : 20;
			var imgOffset = [width / 2, height / 2];
			marker = new AMap.Marker({
				position: config.position,
				//position: new AMap.LngLat(config.lonX, config.latY),
				clickable: true,
				offset: config.offset ? new AMap.Pixel(config.offset[0] - imgOffset[0], config.offset[1] - imgOffset[0]) : new AMap.Pixel(0 - imgOffset[0], 0 - imgOffset[0]),
				icon: new AMap.Icon({
					image: config.icon.url,
					size: new AMap.Size(width, height),
					imageSize: config.icon.size ? new AMap.Size(config.icon.size[0], config.icon.size[1]) : new AMap.Size(width, height),
					imageOffset: config.icon.offset ? new AMap.Pixel(config.icon.offset[0], config.icon.offset[1]) : new AMap.Pixel(0, 0),
				}),
				extData: config.extData,
			});
		} else {
			//默认标注
			marker = new AMap.Marker({
				position: config.position,
				clickable: true,
				extData: config.extData,
			});
		}
		if(ifAdd != false)
			map.add(marker);
		return marker;
	}
	//设置标注icon
	func.prototype.setIcon = function(marker, config) {
		if(typeof(config) == "string") {
			marker.setIcon(config);
		} else {
			marker.setIcon(new AMap.Icon({
				image: config.url,
				size: new AMap.Size(config.size[0], config.size[1]),
			}));
		}
	}
	//获取markers的extData
	func.prototype.getMarkersExtData = function(markers) {
		var extData = [];
		for(var i = 0, len = markers.length; i < len; i++) {
			extData.push(markers[i].getExtData());
		}
		return extData;
	}
	//获取markers的经纬度
	func.prototype.getMarkerLnglat = function(marker) {
		var p = marker.getPosition();
		return {
			lng: p.lng,
			lat: p.lat
		};
	}
	//创建Label，ifAdd是否添加到地图上，默认添加
	func.prototype.createLabel = function(config, ifAdd) {
		var text = new AMap.Text({
			text: config.content ? config.content : "",
			cursor: 'pointer',
			zIndex: 0,
			offset: new AMap.Pixel(3, 2),
			style: {
				'background-color': 'rgba(0,0,0,0)',
				'border': 'none',
			},
			position: config.position,
		});

		if(ifAdd != false)
			text.setMap(map);
		return text;
	}
	//给marker添加点击事件
	func.prototype.markerClickEvent = function(marker, clickHandler) {
		marker.on('click', clickHandler);
		//AMap.event.addListener(marker, "click", clickHandler);
	}
	//手动点击marker
	func.prototype.clickMarker = function(marker) {
		marker.emit('click', {
			target: marker
		});
	}
	//弹出infoWindow,callback弹出框open回调
	func.prototype.openInfoWindow = function(marker, config, callback) {
		marker.setLabel(null);
		var infoWindow = new AMap.InfoWindow({
			content: config.content ? config.content : "", //使用默认信息窗体框样式，显示信息内容
			closeWhenClickMap: true,
			anchor: config.anchor ? config.anchor : "bottom-center",
			offset: config.offset ? new AMap.Pixel(config.offset[0], config.offset[1]) : new AMap.Pixel(0, 0),
		});
		if(config.size) infoWindow.setSize(new AMap.Size(config.size[0], config.size[1]));

		infoWindow.open(map, marker.getPosition());
	}
	//marker数组中找到对应经纬度并显示弹出框
	func.prototype.showInfoWindowWithCoordinates = function(markers, lonX, latY) {
		for(var i = 0, len = markers.length; i < len; i++) {
			var p = markers[i].getPosition();
			if(p.lng == lonX && p.lat == latY) {
				markers[i].emit('click', {
					target: markers[i]
				});
				/*markers[i].setLabel({
					offset: new AMap.Pixel(0, -20), //设置文本标注偏移量
					content: "<div title='" + markers[i].De.extData + "'>" + markers[i].De.extData + "<span class='arrow'></span></div>", //设置文本标注内容
					direction: 'center' //设置文本标注方位
				});*/
				return false;
			}
		}
	}
	//标注拖拽移动位置
	func.prototype.drugMarkerToMove = function(marker, callback) {
		map.clearInfoWindow();
		marker.setDraggable(true);
		//marker.setCursor();
		marker.setLabel({
			offset: new AMap.Pixel(10, -15),
			content: "拖拽移动"
		});

		marker.on("dragend", handler); //添加事件句柄

		/*window.addEventListener("click", winClick);
		function winClick(e) {
			console.log(e.target)
			window.removeEventListener("click", winClick);
		}*/

		function handler() {
			var curPoint = marker.getPosition(); //拖拽后位置
			marker.setDraggable(false);
			marker.off("dragend", handler);
			map.remove(marker.getLabel());
			if(callback && typeof callback == "function") callback(curPoint);
		}
	}
	//将经纬度解析成行政区域
	func.prototype.pointToAddress = function(lonX, latY, callback) {
		AMap.plugin('AMap.Geocoder', function() {
			var geocoder = new AMap.Geocoder();
			geocoder.getAddress([lonX, latY], function(status, result) {
				if(status === 'complete' && result.regeocode) {
					var addressComponent = result.regeocode.addressComponent;
					if(callback && typeof callback == "function") callback(addressComponent);
				}
			});
		});
	}
	//将行政区域解析成经纬度
	func.prototype.addressToPoint = function(address, callback) {
		AMap.plugin('AMap.Geocoder', function() {
			var geocoder = new AMap.Geocoder();
			geocoder.getLocation(address.province + address.city + address.county, function(status, result) {
				if(status === 'complete' && result.geocodes.length) {
					var lnglat = result.geocodes[0].location;
					if(callback && typeof callback == "function") callback({
						lonX: lnglat.lng,
						latY: lnglat.lat,
					});
				}
			});
		});
	}
	//画折线
	func.prototype.drawPolyline = function(points, callback) {
		var pts = [];
		for(var i = 0, len = points.length; i < len; i++) {
			pts.push([points[i].lonX, points[i].latY]);
			/*if(i == 0) {
				var marker = new AMap.Marker({
					position: [points[i].lonX, points[i].latY],
					shape: new AMap.MarkerShape('Circle'),
					size: new AMap.Size(10, 10),
				});
				map.add(marker);
			}*/
		}
		var polyline = new AMap.Polyline({
			path: pts,
		});
		map.add(polyline);
		return polyline;
	}
	//获取折线点集合
	func.prototype.getPolylinePath = function(polyline) {
		var path = polyline.getPath();
		var pts = [];
		for(var i = 0, len = path.length; i < len; i++) {
			pts.push({
				lonX: path[i].lng,
				latY: path[i].lat,
			});
		}
		return pts;
	}
	//画圆
	func.prototype.drawCircle = function(callback) {

		/*var circle;
		var mouseTool = new AMap.MouseTool(map);
		mouseTool.on('draw', function(e) {
			circle = e.obj;
			mouseTool.close();
			if(callback && typeof callback == "function")
				callback(circle)
		})
		mouseTool.circle({
			fillColor: '#00b0ff',
			strokeColor: '#80d8ff',
			draggable: true,
			cursor: "pointer",
			//同Polygon的Option设置
		});*/

		map.setStatus({
			dragEnable: false,
		});

		//map.on("mouseup", removeEvent);
		map.on("mousedown", mapMousedown);
		document.addEventListener("mouseup", removeEvent)
		var circle;
		var centerPoint;

		function mapMousedown(e) {
			map.on("mousemove", mapMousemove);
			centerPoint = new AMap.LngLat(e.lnglat.lng, e.lnglat.lat);
			circle = new AMap.Circle({
				center: centerPoint, // 圆心位置
				radius: 1, //半径
				//strokeColor: "#FF33FF", //线颜色
				strokeOpacity: 0.3, //线透明度
				strokeWeight: 1, //线宽
				fillColor: "#1791fc", //填充色
				fillOpacity: 0.3, //填充透明度
				map: map,
			});
			map.add(circle);
		}

		function mapMousemove(e) {
			var dis = centerPoint.distance(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat));
			circle.setRadius(dis);
		}

		function removeEvent() {
			map.off("mousedown", mapMousedown);
			map.off("mousemove", mapMousemove);
			//map.off("mouseup", removeEvent);
			document.removeEventListener("mouseup", removeEvent)
			map.setStatus({
				dragEnable: true,
			});
			if(callback && typeof callback == "function")
				callback(circle)

		}

	}
	//获取圆圈覆盖物中包含的marker覆盖物
	func.prototype.getCircleContains = function(circle) {
		var overlays = map.getAllOverlays();
		var markers = [];
		for(var i = 0, len = overlays.length; i < len; i++) {
			if(overlays[i].CLASS_NAME == "AMap.Marker") {
				var p = overlays[i].getPosition();
				if(circle.contains(new AMap.LngLat(p.lng, p.lat))) {
					markers.push(overlays[i]);
				}
			}
		}
		return markers;
	}
	//批量移动markers，操作点在circle范围中
	func.prototype.batchMoveMarkersByCircle = function(markers, circle, callback) {
		var markerPos = []; //提前获取markers的经纬度，否则鼠标移动耗时，导致卡顿
		var center = circle.getCenter(); //圆开始圆心坐标
		var startPos; //鼠标开始坐标
		for(var i = 0, len = markers.length; i < len; i++) {
			var p = markers[i].getPosition();
			markerPos.push({
				lng: p.lng,
				lat: p.lat,
			})
		}
		map.setStatus({
			dragEnable: false,
		});
		circle.on("mousedown", mapMousedown);

		function mapMousedown(e) {
			document.addEventListener("mouseup", removeEvent);
			circle.on("mousemove", mapMousemove);
			startPos = e.lnglat;
		}

		function mapMousemove(e) {
			cal = calculate(startPos, e.lnglat);

			var newP = getNewPosition(center, cal);
			circle.setCenter(new AMap.LngLat(newP.lng, newP.lat));
			for(var i = 0, len = markers.length; i < len; i++) {
				var newPos = getNewPosition(markerPos[i], cal);
				markers[i].setPosition(new AMap.LngLat(newPos.lng, newPos.lat));
			}

		}

		function removeEvent() {
			circle.off("mousedown", mapMousedown);
			circle.off("mousemove", mapMousemove);
			document.removeEventListener("mouseup", removeEvent)
			map.setStatus({
				dragEnable: true,
			});
			if(callback && typeof callback == "function")
				callback(markers)

		}

		function calculate(startLnglat, endLnglat) {
			var r = Math.sqrt(Math.pow(endLnglat.lng - startLnglat.lng, 2) + Math.pow(endLnglat.lat - startLnglat.lat, 2));
			return {
				cos: (endLnglat.lng - startLnglat.lng) / r,
				sin: (endLnglat.lat - startLnglat.lat) / r,
				r: r,
			}
		}

		function getNewPosition(position, cal) {
			return {
				lng: cal.cos * cal.r + position.lng,
				lat: cal.sin * cal.r + position.lat
			}

		}
	}
	//画多边形
	func.prototype.drawPolygon = function(callback) {
		var polygon = new AMap.Polygon({
			map: map,
			path: [], //设置多边形边界路径
			strokeColor: "blue", //线颜色
			strokeOpacity: 0.5, //线透明度
			fillOpacity: 0.2,
			fillColor: "#fff", //填充色
			strokeWeight: 2, //线宽
		});
		map.add(polygon);
		var points = [];
		map.setStatus({
			doubleClickZoom: false,
			dragEnable: false,
		});
		//map.setDefaultCursor("crosshair");
		map.on("click", mapClick);
		map.on("dblclick", removeEvent); //rightclick
		map.on("rightclick", removeEvent);
		map.on("mousemove", mouseMove);

		function mapClick(e) {
			points.push(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat));
			polygon.setPath(points);
		}

		function mouseMove(e) {
			if(points.length) {
				polygon.setPath(points.concat(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat)));
			}
		}

		function removeEvent(e) {
			map.setDefaultCursor(defaultCursor)
			map.off("click", mapClick);
			map.off("dblclick", removeEvent);
			map.off("rightclick", removeEvent);
			map.off("mousemove", mouseMove);
			map.setStatus({
				doubleClickZoom: true,
				dragEnable: true,
			});
			if(e.type == "dblclick") {
				if(callback && typeof callback == "function") callback(polygon)
			} else if(e.type == "rightclick") {
				map.remove(polygon);
				map.setStatus({
					dragEnable: true,
				});
				if(callback && typeof callback == "function") callback(false)
			}
		}

		/*
		map.plugin(["AMap.MouseTool"], function() {
			var polygon;
			var mouseTool = new AMap.MouseTool(map);
			map.setDefaultCursor("crosshair")
			mouseTool.on('draw', function(e) {
				polygon = e.obj;
				mouseTool.close();
				map.setDefaultCursor()
				
				if(callback && typeof callback == "function")
					callback(polygon);
			})
			mouseTool.polygon({
				fillColor: '#fff',
				strokeColor: 'blue',
				strokeOpacity: 0.5,
				fillOpacity: 0.5,
				draggable: true,
				cursor: "pointer",
			});
		});
	*/
	}
	//获取多边形覆盖物中包含的marker覆盖物
	func.prototype.getPolygonContains = function(polygon) {
		var overlays = map.getAllOverlays("marker");
		var markers = [];
		for(var i = 0, len = overlays.length; i < len; i++) {
			//if(overlays[i].CLASS_NAME == "AMap.Marker") {
			var p = overlays[i].getPosition();
			if(polygon.contains(new AMap.LngLat(p.lng, p.lat))) {
				markers.push(overlays[i]);
			}
			//}
		}
		return markers;
	}
	//批量移动markers，操作点在circle范围中
	func.prototype.batchMoveMarkersByPolygon = function(markers, polygon, callback) {
		var markerPos = []; //提前获取markers的经纬度，否则鼠标移动耗时，导致卡顿
		var polygonPath = polygon.getPath();
		var startPos; //鼠标开始坐标
		for(var i = 0, len = markers.length; i < len; i++) {
			var p = markers[i].getPosition();
			markerPos.push({
				lng: p.lng,
				lat: p.lat,
			})
		}
		map.setStatus({
			dragEnable: false,
		});

		polygon.on("mousedown", mapMousedown);
		map.on("rightclick", removeEvent);

		function mapMousedown(e) {
			polygon.on("mousemove", mapMousemove);
			document.addEventListener("mouseup", removeEvent);
			startPos = e.lnglat; //鼠标开始位置作为参考点
		}

		function mapMousemove(e) {
			cal = calculate(startPos, e.lnglat);

			var newPath = [];
			for(var i = 0, len = polygonPath.length; i < len; i++) {
				var newPos = getNewPosition(polygonPath[i], cal);
				newPath.push([newPos.lng, newPos.lat]);
			}
			polygon.setPath(newPath);

			for(var i = 0, len = markers.length; i < len; i++) {
				var newPos = getNewPosition(markerPos[i], cal);
				markers[i].setPosition(new AMap.LngLat(newPos.lng, newPos.lat));
			}

		}

		function removeEvent(e) {
			polygon.off("mousedown", mapMousedown);
			polygon.off("mousemove", mapMousemove);
			document.removeEventListener("mouseup", removeEvent);
			map.setStatus({
				dragEnable: true,
			});
			if(e.type == "rightclick") {
				map.remove(polygon);
				map.off("rightclick", removeEvent);
				map.setStatus({
					dragEnable: true,
				});
				if(callback && typeof callback == "function") callback(false)
			} else {
				if(callback && typeof callback == "function") callback(markers)
			}

		}

		function calculate(startLnglat, endLnglat) {
			var r = Math.sqrt(Math.pow(endLnglat.lng - startLnglat.lng, 2) + Math.pow(endLnglat.lat - startLnglat.lat, 2));
			return {
				cos: (endLnglat.lng - startLnglat.lng) / r,
				sin: (endLnglat.lat - startLnglat.lat) / r,
				r: r,
			}
		}

		function getNewPosition(position, cal) {
			return {
				lng: cal.cos * cal.r + position.lng,
				lat: cal.sin * cal.r + position.lat
			}

		}
	}
	//绘制点轨迹图（引入mapvgl）
	func.prototype.drawVPoint = function(data) {
		
	}
	//新建mapvgl View
	func.prototype.createMapvglView = function() {
		
	}
	//设置view中layer的值
	func.prototype.setMapvglLayer = function(view, layers, data) {
		
	}
	//删除图管理容器（需要引入mapvgl）
	func.prototype.destroyView = function(view) {
		
	}
	//添加自定义DOM元素的工具，element DOM元素
	func.prototype.addDOMControl = function(element) {
		
	}
	//添加海量点
	func.prototype.addPointCollection = function(data) {
		
	}

	exports('aMap', new func());
});