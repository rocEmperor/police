var demoHash = [ "core/map", "core/control", "core/mapstate", "core/changemap", "core/mapto", "core/getmapzoom", "layer/customlayer","layer/traffic",

    "point/iconmarker", "point/vectormarker", "point/markers", "point/removespecifiedmarker", "point/trackplayback",

    "point/cluster", "point/heatmap", "point/mass", "vector/vector", "vector/visible", "vector/editable", "vector/vectorlabel",

    "vector/getinformation", "infowindow/infowindow", "infowindow/custominfowindow", "contextmenu/contextmenu",

    "contextmenu/customcontextmenu", "contextmenu/overlaycontextmenu", "calculation/calculation", "mouseMap/getlnglat",

    "mouseMap/drawoverlay", "mouseMap/zoomtool", "mouseMap/measure", "panorama/panoramaControl", "event/mapclick", "event/overlayevent",

    "event/removemapclick", "server/searchkey", "server/nearsearch", "server/rectsearch", "server/suggest",

    "geocode/geocode", "geocode/regeocode", "driver/driverforlnglat", "walking/walkingforlnglat", "bus/busnavi",

    "boundary/boundary","bus/busInfoByName","spatial/contains","spatial/intersection","spatial/buffer","spatial/intersects","spatial/union","spatial/different",

    "spatial/distance","spatial/polygonarea","spatial/centroid" ];

var defaultKeyLabel = "ec85d3648154874552835438ac6a02b2";

var defaultHtmlHash = "#core/map";//默认示例url hash

//主页面不加载引擎

if(window.location.pathname.lastIndexOf(".htm") == -1){

    document.write('<script src="'+webApiUrl+'"></script>');



    window.Konsole = {

        exec: function(code) {

            code = code || '';

            try {

                var result = window.eval(code);

                window.parent.setIFrameResult('result', result);

            } catch (e) {

                window.parent.setIFrameResult('error', e);

            }

        }

    }

}



//控制台日志 用于调试等

window.log = function(msg, type) {

    window.console && (console[type || (type = "log")]) && console[type](msg);

}



//替换示例demo里的场景外链  关联hsDemo.js-->runScripts()

window.replaceIFramerContentLink = function(iframeHead){

    //iframeHead = iframeHead.replace("../sourceLinks/style.css", "./apidemos/sourceLinks/style.css");



    return iframeHead;

}