import React, { Component } from 'react';
import { Modal } from 'antd';
import locationImg from "../../../static/images/location.png";
import './Map.less';
// import { log } from 'util';

class Map extends Component {
  constructor(props) {
    super(props);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { data } = nextProps;
    let location = window.location,
      hostname = location.hostname;
    if(hostname == '41.188.65.121' || (hostname =='location' && location.port == "9090")){
      // 高德地图公安内网开发文档地址
      // http://41.188.33.236:25002/jsmap/2.0/demo
      if (data && data.length > 0) {
        //   map.setCenter(new window.IMAP.LngLat(data[0].lon, data[0].lat));
        setTimeout(() => {
          let map = new window.IMAP.Map("container", {
            minZoom: 4,
            maxZoom: 18,
            zoom: 16,
            center: new window.IMAP.LngLat(data[0].lon, data[0].lat)
          });

          let navi = new window.IMAP.NavigationControl({
            visible: true
          });
          let scale = new window.IMAP.ScaleControl({
            visible: true
          });
          map.addControl(navi);
          map.addControl(scale);
          if (map) {
            let markers = [];
            if (markers.length > 0) {
              map.clearOverlays();
              markers = [];
            }
            let len = data.length;
            for (let i = 0; i < len; i++) {
              let opts = new window.IMAP.MarkerOptions();
              opts.anchor = window.IMAP["Constants"]["BOTTOM_CENTER"];
              opts.icon = new window.IMAP.Icon(window.IMAP.MapConfig.API_REALM_NAME + "images/point_1.png", {
                "size": { "width": 34, "height": 30 }, "offset": { "x": 1, "y": 0 }
              });
              let marker = new window.IMAP.Marker(new window.IMAP.LngLat(data[i].lon, data[i].lat), opts)
              markers.push(marker)
            }
            map.getOverlayLayer().addOverlays(markers, true);
          }
        }, 0)
      }
    }else{
      // 高德地图开发文档地址
      // https://lbs.amap.com/api/javascript-api/guide/overlays/toolbar
      if (data && data.length > 0) {
        setTimeout(() => {
          let map = new window.AMap.Map('container', {
            resizeEnable: true,
            center: new window.AMap.LngLat(data[0].lon, data[0].lat),
            zoom: 14
          });
          window.AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
            map.addControl(new window.AMap.ToolBar()); // 工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            map.addControl(new window.AMap.Scale()); // 比例尺控件
            // map.addControl(new window.AMap.OverView({isOpen:true}));
          });
          map.clearMap();  // 清除地图覆盖物
          let markers = [];
          let icon = new window.AMap.Icon({
            size: new window.AMap.Size(38, 41),    // 图标尺寸
            image: locationImg,  // Icon的图像
            imageSize: new window.AMap.Size(38, 41)   // 根据所设置的大小拉伸或压缩图片
          });
          data.forEach((val, index) => {
            if (val) {
              let arr = [];
              arr.push(Number(val.lon));
              arr.push(Number(val.lat));
              markers.push({
                icon: icon,
                position: arr
              });
            }
          });
  
          // AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
          //
          // });
          // 添加一些标记点到地图上
          markers.forEach(function (marker) {
            new window.AMap.Marker({
              map: map,
              icon: marker.icon,
              position: [marker.position[0], marker.position[1]],
              offset: new window.AMap.Pixel(-12, -36),
            });
          });
        }, 0);
      }
    }
  }
  render() {
    const { visible, handleCancel, type, data } = this.props;
    return (
      <div className="map-component" style={{height: '100%'}}>
        {
          type === "default"
            ? <div id="container" style={{ height: '78.5%', width: '97%', marginTop: '3.5%', marginLeft: '1.5%' }}></div>
            : <Modal
              title="轨迹"
              visible={visible}
              onCancel={handleCancel}
              destroyOnClose={true}
              wrapClassName="map-container-class"
              footer={null}>
              {data.length === 0
                ? <div className="no-data-map">暂无数据</div>
                : <div id="container" style={{ height: 500, marginTop: 50 }}></div>}
            </Modal>
        }
      </div>
    )
  }
}

export default Map;
