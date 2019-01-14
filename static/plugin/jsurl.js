//默认演示密钥
var defaultKey = "ec85d3648154874552835438ac6a02b2";

var host = "41.188.33.236";
var port = 25001;
var httpurl = "http://"+ host+ ":"+port;
var webApiUrl = httpurl + "/as/webapi/js/auth?v=2.0&t=jsmap&ak="+defaultKey;

//样式文件地址
var demoDomains = "http://" + host + ":25002/jsmap/2.0/demo/"

// 白色地图切片地址
var whiteTileUrl = "http://" + host + ":25333/v3/tile?lid=traffic&get=map&cache=off&x={x}&y={y}&z={z}"

// 路网图层地址
var ROADNET_URL = "http://"+host+":25033/v3/tile?x={x}&y={y}&z={z}";

//城市
var cityCode = "330100"; //行政区号
var cityName = "杭州"; //城市名称

//map 属性配置
var mapZoom = 8,
	mapCenter = [120.182520,30.243753],
	mapMinZoom = 4,
	mapMaxZoom = 18;


// --------------------------------以下部分不用修改---------------------------------------------



//搜索关键字

var poiKeyword = "酒店";

//全景示例---中心点

var panoramaMapCenter = [120.182520,30.243753];

var MAP_NET_USETMS = false;


//公交换乘查询，驾车导航，步行导航起终点
var startLnglat = mapCenter[0]+','+mapCenter[1],
	endLnglat =  (mapCenter[0]+0.1) + ',' + (mapCenter[1]+0.1);

// 地理编码poi
var geocoderAddress = cityName+"站"

//驾车导航途径点
var driverWayPoints = (mapCenter[0]+0.5)+','+mapCenter[1]

//驾车导航避让区域
var driverAvoidPoints = mapCenter[0] + ',' + (mapCenter[1]+0.5)



//折线轨迹坐标
var polylinePath = mapCenter[0]+','+mapCenter[1]+";"
					+(mapCenter[0]+0.2)+','+mapCenter[1]+";"
					+mapCenter[0]+','+(mapCenter[1]+0.2);



//多边形轨迹坐标
var polygonPath = (mapCenter[0]+0.5)+','+(mapCenter[1]+0.5)+";"+(mapCenter[0]+0.2+0.5)+','+(mapCenter[1]+0.5)+";"+(mapCenter[0]+0.5)+','+(mapCenter[1]+0.2+0.5);



//矩形范围
var rectBounds = mapCenter[0]-0.1 + ',' + (mapCenter[1]+0.1)+";" +mapCenter[0]+','+mapCenter[1]+";";



//自定义图层瓦片服务地址
var customlayerUrl = "http://mt1.google.cn/vt/lyrs=m@180000000&hl=zh-CN&gl=cn&src=app&s=Gal&";



//空间分析服务地址
var spatial_url = "http://" + host + ":25001/v3/gts/";



//contains_bcoor是否包含于contains_acoor
var contains_acoor = "116.40976,40.22293;117.29279,40.06756;117.08542,39.71564;116.22574,39.71564;116.40976,40.22293"; //面
var contains_bcoor = "116.58829,40.04969;116.78879,39.97186;116.5361,39.90868"; //线

//计算两组坐标串的交点（交集）、是否相交、并集
var intersection_acoor = "116.54022,40.22398;116.89316,40.06756;116.09665,39.82647"; //线
var intersection_bcoor = "116.77917,40.25542;116.44958,40.02656;116.76956,39.78321;116.77917,40.25542"; //面


//计算点/线/面缓冲区、点到线距离、多边形面积、面中心点
var buffer_point = "116.39362,39.92435"; //点
var buffer_line = "116.37817,40.04549;116.45096,39.82963;116.29715,39.88761"; //线
var buffer_polygon = "116.42624,39.97291;116.5567,39.84123;116.29028,39.8328;116.30127,39.9466;116.42624,39.97291"; //面


// 添加路网图层
function addRoadNetLayer() {
	var getRoadTileUrl = function(x,y,z) {
		return ROADNET_URL.replace("{x}", x).replace("{y}", y).replace("{z}", z);
	}
	var RoadLayer = new IMAP.TileLayer({
		maxZoom: 18,
		minZoom: 1,
		tileSize: 256
	});
	RoadLayer.setTileUrlFunc(getRoadTileUrl);
	RoadLayer.setOpacity(0.9); //设置图层透明度，取值范围0-1
	map.addLayer(RoadLayer);
	return RoadLayer
	// isRomve["trafficLayer"] = trafficLayer;
};
