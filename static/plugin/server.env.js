
(function(){
  let hostname = window.location.hostname;
  if (hostname == '41.188.65.121' || (hostname =='location' && location.port == "9090")) {
    document.write('<script type="text/javascript" async charset="utf-8" src="plugin/jsurl.js"></script>');
    document.write('<script type="text/javascript" async charset="utf-8" src="plugin/main.js"></script>');
  }else{
    document.write('<link rel="stylesheet" href="https://cache.amap.com/lbs/static/main1119.css"/>');
    document.write('<script type="text/javascript" async src="https://webapi.amap.com/maps?v=1.3&key=3def060c5d2def99c80d0687cfb4c51d"></script>');
    document.write('<script type="text/javascript" async src="https://webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>');
  }
})();


