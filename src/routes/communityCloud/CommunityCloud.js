import React from 'react';
import { connect } from 'dva';
import { Form, Col } from 'antd';
import './CommunityCloud.less';
import { Chart, Geom, Axis, Tooltip, Coord, Label } from 'bizcharts';
import commImg from "../../../static/images/communityBj.png";
import carData1 from "../../../static/images/iconVisitor.png";
import carData2 from "../../../static/images/iconCarIn.png";
import Map from '../../components/Map/Map';

function CommunityCloud(props) {
  let { resident, customTotal, inCar, visitor_car, location, community_name, car_dynamic, pepole_dynamic, electro_dynamic, mac_dynamic, pepole_total } = props;
  const cols2 = {
    year: {
      type: "linear",
      tickInterval: 50
    }
  };
  return (
    <div className="communityCloud" style={{ height: `${window.innerHeight - 80}px` }}>
      <Col span={7} style={{ height: `${window.innerHeight - 80}px` }}>
        <div className="ownerType">
          <div className="ownerTitle">
            <div>业主身份</div>
            <div className="ownerNum">{pepole_total}人</div>
          </div>
          {
            resident.length != 0 ?
              <Chart
                data={resident}
                padding={[80, 100, 80, 80]}
                forceFit
                height={window.innerHeight * 0.35}
              >
                <Coord type="theta" radius={1} />
                <Tooltip
                  showTitle={false}
                  itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                />
                <Geom
                  type="intervalStack"
                  position="percent"
                  color={['item', ['#FFD646', '#32C3B0', '#EC6A41']]}
                  tooltip={[
                    "item*percent",
                    (item, percent) => {
                      percent = percent + "%";
                      return {
                        name: item,
                        value: percent
                      };
                    }
                  ]}
                >
                  <Label
                    content="percent"
                    formatter={(val, item) => {
                      return item.point.item + ": " + val + "%" + " " + item.point.count + '人';
                    }}
                    textStyle={{
                      fill: '#fff', // 文本的颜色
                    }}
                  />
                </Geom>
              </Chart> : <div className="charts">暂无数据</div>
          }


        </div>
        <div className="ownerType" style={{marginTop:'3%'}}>
          <div className="ownerTitle">
            <div>客流统计</div>
          </div>
          <div className="legend">
            <span className="one">
              <span className="icon"></span>
              车流量
            </span>
            <span className="two">
              <span className="icon"></span>
              人流量
            </span>
            <span className="three">
              <span className="icon"></span>
              电瓶车
            </span>
          </div>
          {customTotal.length === 0
            ? <div className="charts">暂无数据</div>
            : <Chart height={window.innerHeight * 0.338} data={customTotal} scale={cols2} forceFit padding={[30, 50, 50, 75]}>
              <Axis
                name="time"
                line={{
                  stroke: '#fff',
                  fill: '#fff',
                  lineWidth: 1
                }}
                label={{
                  textStyle: {
                    fill: '#fff'
                  }
                }}
                tickLine={{
                  lineWidth: 1, // 刻度线宽
                  stroke: '#fff', // 刻度线的颜色
                  length: 5, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
                }}
              />
              <Axis
                name="value"
                tickLine={{
                  lineWidth: 1, // 刻度线宽
                  stroke: '#fff', // 刻度线的颜色
                  length: 5, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
                }}
                grid={{
                  align: 'top', // 网格顶点从两个刻度中间开始
                  type: 'line', // 网格的类型
                  lineStyle: {
                    stroke: '#fff', // 网格线的颜色
                    lineWidth: 1, // 网格线的宽度
                    lineDash: [1, 1] // 网格线的虚线配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
                  }, // 网格线的样式配置，原有属性为 line
                }}
                scale={{
                  min: 0, // 定义数值范围的最小值
                  max: 10000, // 定义数值范围的最大值
                  tickInterval: 5, // 用于指定坐标轴各个标度点的间距，是原始数据之间的间距差值，tickCount 和 tickInterval 不可以同时声明。
                  tickCount: 10, // 定义坐标轴刻度线的条数，默认为 5
                }}
                label={{
                  textStyle: {
                    fill: '#fff'
                  }
                }}
                line={{
                  stroke: '#fff',
                  fill: '#fff',
                  lineWidth: 1
                }} />
              <Tooltip
                crosshairs={{
                  type: "line",
                  style: {
                    lineWidth: 1,
                    stroke: "#fff",
                  }
                }}
              />
              <Geom type="area" position="time*value" color={['type', ['#2094FF', '#707DE5', '#FFD646']]} />
              <Geom type="line" position="time*value" size={1} color={['type', ['#2094FF', '#707DE5', '#FFD646']]} />
              <Geom
                type="point"
                position="time*value"
                size={4}
                shape={"circle"}
                color={['type', ['#2094FF', '#707DE5', '#FFD646']]}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
              />
            </Chart>}
        </div>
      </Col>
      <Col span={9} style={{ height: `${window.innerHeight - 80}px`}}>
        <div className="mapBlock">
          <div className="titleBlock">
            <img src={commImg} />
            <div className="commName">{community_name}</div>
          </div>
          <Map type="default" data={location} />
        </div>
        <div className="carBlock">
          <div className="inCar">
            <img src={carData2} />
            <div>
              <div>在库车辆</div>
              <div className="carNume">{inCar}</div>
            </div>
          </div>
          <div className="visitorCar">
            <img src={carData1} />
            <div>
              <div>访客车流量</div>
              <div className="carNume">{visitor_car}</div>
            </div>
          </div>
        </div>
      </Col>
      <Col span={8} style={{ height: `${window.innerHeight - 80}px` }}>
        <div className="rightBlock">
          <div className="bj">
            <div className="title">
              <div>停车动态</div>
            </div>
            {
              car_dynamic.length != 0 ?
                car_dynamic.map((item, index) => {
                  return (
                    <div className={index % 2 != 0 ? 'item bjShow' : 'item'} key={index}>
                      {
                        item.car_type == 1 ? <span className="itemType">内部车</span> : <span className="itemType color">{item.car_type_lable}</span>
                      }
                      <span>{item.car_num}</span>
                      <span>{item.in_out_lable}</span>
                      <span>{item.address}</span>
                      <span>{item.in_out_time}</span>
                    </div>
                  )
                }) : <div className="air">暂无数据</div>
            }
          </div>
          <div className="bj" style={{marginTop:'3%'}}>
            <div className="title">
              <div>人行通道</div>
            </div>
            {
              pepole_dynamic.length != 0 ?
                pepole_dynamic.map((item, index) => {
                  return (
                    <div className={index % 2 != 0 ? 'item bjShow' : 'item'} key={index}>
                      {
                        item.user_type == 1 ?
                          <span className="itemType orange">{item.user_type_lable}</span> :
                          (item.user_type == 3 ? <span className="itemType color">{item.user_type_lable}</span> : (item.user_type == 2 ? <span className="itemType lightOrange">{item.user_type_lable}</span> : <span className="itemType">{item.user_type_lable}</span>))
                      }

                      <span style={{ width: '45px', display: 'inline-block' }}>{item.user_name}</span>
                      <span>{item.open_lable}</span>
                      <span>{item.device_name}</span>
                      <span>{item.create_at}</span>
                    </div>
                  )
                }) : <div className="air">暂无数据</div>
            }
          </div>
          <div className="bj" style={{marginTop:'3%'}}>
            <div className="title">
              <div>电瓶车</div>
            </div>
            {
              electro_dynamic.length != 0 ? electro_dynamic.map((item, index) => {
                return (
                  <div className={index % 2 != 0 ? 'item bjShow' : 'item'} key={index}>
                    <span className="itemType battery">电瓶车</span>
                    <span style={{ width: '72px', display: 'inline-block' }}>{item.plate}</span>
                    <span>{item.type_lable}</span>
                    <span style={{ width: '38px', display: 'inline-block' }}>{item.channel}</span>
                    <span>{item.create_at}</span>
                  </div>
                )
              }) : <div className="air">暂无数据</div>
            }
          </div>
          <div className="bj" style={{marginTop:'3%'}}>
            <div className="title">
              <div>MAC信息</div>
            </div>
            {
              mac_dynamic.length != 0 ? mac_dynamic.map((item, index) => {
                return (
                  <div className={index % 2 != 0 ? 'item bjShow' : 'item'} key={index}>
                    {
                      item.identity_type == 1 ?
                        <span className="itemType orange">{item.identity_type_lable}</span> :
                        (item.identity_type == 3 ? <span className="itemType color">{item.identity_type_lable}</span> : (item.identity_type == 2 ? <span className="itemType lightOrange">{item.identity_type_lable}</span> : <span className="itemType">{item.identity_type_lable}</span>))
                    }
                    <span style={{ width: '38px', display: 'inline-block' }}>{item.username}</span>
                    <span>{item.mac}</span>
                    <span>{item.devicename}</span>
                    <span>{item.create_at}</span>
                  </div>
                )
              }) : <div className="air">暂无数据</div>
            }
          </div>
        </div>
      </Col>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.CommunityCloudModel,
  };
}
export default connect(mapStateToProps)(Form.create()(CommunityCloud));
