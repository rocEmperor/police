import React from 'react';
import { connect } from 'dva';
import './homePage.less';
import { Form, Input, Spin, message } from 'antd';
import DataSet from '@antv/data-set';
import { createFrame, removeSearchFn } from '../../components/SearchFrame/SearchFrame';

import { Chart, Geom, Axis, Tooltip, Coord, Label } from "bizcharts";

class HomePage extends React.Component {
  constructor (props) {
    super(props);
  }
  /*
  * 设备接入比例图例
  * */
  createDeviceRatio (item) {
    let result = '';
    const { device_proportion } = this.props;
    device_proportion.forEach((val, index) => {
      if (val.item === item){
        result = `${val.item}  ${val.percent}%  ${val.count}台`
      }
    });
    return result;
  }
  /*
  * 监听键盘enter键事件
  * */
  searchKeyUp (e) {
    if (e.keyCode == '13') {
      this.showSearchFn();
    }
  }
  showSearchFn () {
    const { searchValue, dispatch } = this.props;
    if (searchValue === '') {
      message.info('搜索内容为空，请输入！');
      return false;
    }
    dispatch({
      type: 'HomePageModel/concat',
      payload: { loading: true }
    });
    // 星汇半岛
    dispatch({
      type: 'HomePageModel/search',
      payload: { name: searchValue },
      callback: (searchList) => {
        // 搜索下拉框
        createFrame(searchList, 'ipt-box', (mineSearch) => {
          searchList.forEach((val ,index) => {
            let searchItem = document.createElement('div');
            searchItem.classList.add('search-item');
            let left = document.createElement('span');
            let right = document.createElement('span');
            left.innerHTML = val.community_name;
            left.classList.add('left');
            right.classList.add('right');
            right.innerHTML = val.city_name;
            searchItem.appendChild(left);
            searchItem.appendChild(right);
            searchItem.style.fontSize = '12px';
            // 匹配当前搜索值，样式高亮
            if (val.community_name.indexOf(searchValue) !== -1) {
              let list = val.community_name.split(searchValue);
              let html = list.join(`<b>${searchValue}</b>`);
              left.innerHTML = html;
            }
            // 绑定事件
            searchItem.addEventListener('click', () => {
              window.localStorage.setItem('CITY_ID', val.city_id);
              window.localStorage.setItem('COMMUNITY_ID', val.community_id);
              window.location.hash = `#communityCloud`;
              removeSearchFn();
            });
            mineSearch.appendChild(searchItem);
          });
        });
        dispatch({
          type: 'HomePageModel/concat',
          payload: { loading: false }
        });
      }
    });
  }
  searchChange (e) {
    const { dispatch } = this.props;
    const val = e.target.value;
    dispatch({
      type: 'HomePageModel/concat',
      payload: { searchValue: val }
    })
  }
  totalPeople () {
    const { pepole_proportion } = this.props;
    let res = 0;
    pepole_proportion.forEach((val ,index) => {
      res = res + val.count;
    });
    return res;
  }
  render () {
    const { info, traffic, pepole_proportion, device_proportion, loading } = this.props;
    const { DataView } = DataSet;
    const innerHeight = window.innerHeight;
    let totlaToggleData = [];
    if (info.device_total) {
      totlaToggleData = info.device_total.toString().split('')
    }
    const proportion = new DataView();
    proportion.source(pepole_proportion).transform({
      type: "percent",
      field: "percent",
      dimension: "item",
      as: "percent"
    });
    const cols3 = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(0);
          return val + "%";
        }
      }
    };
    const device = new DataView();
    device.source(device_proportion).transform({
      type: "percent",
      field: "percent",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    const cols2 = {
      year: {
        type: "linear",
        tickInterval: 50
      }
    };
    return (
      <Spin spinning={loading} wrapperClassName="home-page-spin">
        <div className="home-page" style={{height: `${innerHeight - 64}px`}}>
          <div className="left-container">
            <div className="staff">
              <div className="til">人员构成</div>
              <div className="count">
                {`${this.totalPeople()}人`}
              </div>
              {pepole_proportion.length === 0
                ? <div style={{height: innerHeight * 0.28, lineHeight: `${innerHeight * 0.28}px`}} className="null-data">暂无数据</div>
                : <Chart
                  data={proportion}
                  scale={cols3}
                  height={innerHeight * 0.28}
                  padding={[30, 30, 30, 30]}
                  forceFit
                >
                  <Coord type="theta" radius={0.75} />
                  <Axis name="percent" />
                  <Tooltip
                    showTitle={false}
                    itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                  />
                  <Geom
                    type="intervalStack"
                    position="percent"
                    color={['item', ['#FFD646', '#32C3B0', '#F28051']]}
                    tooltip={[
                      "item*percent",
                      (item, percent) => {
                        percent = (percent * 100).toFixed(0) + "%";
                        return {
                          name: item,
                          value: percent
                        };
                      }
                    ]}
                    style={{
                      lineWidth: 0
                    }}
                  >
                    <Label
                      content="percent"
                      formatter={(val, item) => {
                        return item.point.item + ": " + val + "%";
                      }}
                      offset={30}
                      labelLine={{
                        lineWidth: 1, // 线的粗细
                        stroke: '#fff', // 线的颜色
                        lineDash: [ 0, 0 ], // 虚线样式
                      }}
                      textStyle={{
                        // textAlign: 'start', // 文本对齐方向，可取值为： start middle end
                        fill: 'red', // 文本的颜色
                        fontSize: '14', // 文本大小
                        fontWeight: 'bold', // 文本粗细
                        rotate: 30,
                        // textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
                      }}
                      htmlTemplate={(text, item, index)=>{
                        // text 为每条记录 x 属性的值
                        // item 为映射后的每条数据记录，是一个对象，可以从里面获取你想要的数据信息
                        // index 为每条记录的索引
                        let point = item.point; // 每个弧度对应的点
                        let percent = point['percent'];
                        let count = point['count'];
                        percent = (percent * 100).toFixed(0) + '%';
                        // 自定义 html 模板
                        text = `${text.split(':')[0]}`;
                        return `<span class="title" style="display: inline-block;width: 70px;color: #fff">${text}</span>
                                 <br><span style="color: #fff;font-size: 12px">${percent}</span> <span style="color: #fff;font-size: 12px">${count}人</span>`;
                      }}
                    />
                  </Geom>
                </Chart>}
            </div>
            <div className="cars-count">
              <div className="til">客流统计</div>
              <div className="legend">
                <span className="one">
                  <span className="icon"></span>
                  人流量
                </span>
                <span className="two">
                  <span className="icon"></span>
                  电瓶车
                </span>
                <span className="three">
                  <span className="icon"></span>
                  车流量
                </span>
              </div>
              {traffic.length === 0
                ? <div style={{height: innerHeight * 0.32, lineHeight: `${innerHeight * 0.32}px`}} className="null-data">暂无数据</div>
                : <Chart height={innerHeight * 0.32} data={traffic} scale={cols2} forceFit padding={[30, 50, 50, 75]}>
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
                    }}/>
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
                      stroke: '#fff',
                      lineWidth: 2
                    }}
                  />
                </Chart>}
            </div>
          </div>

          <div className="center-container">
            <div className="data-totals">
              <div className="til">接入数据总量</div>
              <div className="number">
                {totlaToggleData.map((val, index) => {
                  if (totlaToggleData.length === index + 1) {
                    return (<span className="item last" key={index}>{val}</span>)
                  } else {
                    return <span className="item" key={index}>{val}</span>
                  }
                })}
              </div>
            </div>
            <div className="circle">
              <div className="community">
                <div className="til">社区(个)</div>
                <div className="count">{info.community_total ? info.community_total : 0}</div>
                <div className="icon"></div>
              </div>
              <div className="conservation">
                <div className="til">常住人口(人)</div>
                <div className="count">{info.resident_total ? info.resident_total : 0}</div>
                <div className="icon"></div>
              </div>
              <div className="MAC">
                <div className="til">MAC(个)</div>
                <div className="count">{info.mac ? info.mac : 0}</div>
                <div className="icon"></div>
              </div>
              <div className="flow">
                <div className="til">流动人口(人)</div>
                <div className="count">{info.resident_flow_total ? info.resident_flow_total : 0}</div>
                <div className="icon"></div>
              </div>
              <div className="cars">
                <div className="til">车辆(辆)</div>
                <div className="count">{info.cat_total ? info.cat_total : 0}</div>
                <div className="icon"></div>
              </div>
            </div>
          </div>
          <div className="right-container">
            {/* <div className="search">
              <div className="ipt-box" id="ipt-box">
                <Input
                  placeholder="请输入社区名"
                  className="mine_search_ipt"
                  onChange={(e) => this.searchChange(e)}
                  onKeyDown={(e) => this.searchKeyUp(e)}/>
                <span className="search-icon" onClick={() => this.showSearchFn()}></span>
              </div>
            </div> */}
            <div className="out-device">
              <div className="depot">
                <div className="til">停车场设备</div>
                <div className="cont">
                  <div className="lf">
                    <div className="title">总设备数</div>
                    <div className="count">{info.device_car}</div>
                  </div>
                  <div className="rg">
                    <div className="title">总车流量</div>
                    <div className="count">{info.flux_car}</div>
                  </div>
                </div>
              </div>
              <div className="human-decency">
                <div className="til">人行出入设备</div>
                <div className="cont">
                  <div className="lf">
                    <div className="title">总设备数</div>
                    <div className="count">{info.device_pepole}</div>
                  </div>
                  <div className="rg">
                    <div className="title">总人流量</div>
                    <div className="count">{info.flux_pepole}</div>
                  </div>
                </div>
              </div>
              <div className="monitor">
                <div className="cont">
                  <div className="lf">
                    <div className="til">监控设备</div>
                    <div className="title">总设备数</div>
                    <div className="count">{info.device_monitor}</div>
                  </div>
                  <div className="rg">
                    <div className="til">MAC设备</div>
                    <div className="title">总设备数</div>
                    <div className="count">{info.device_mac}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="device-ratio">
              <div className="til">设备接入比例</div>
              {device_proportion.length === 0
                ? <div style={{height: innerHeight * 0.25, lineHeight: `${innerHeight * 0.25}px`}} className="null-data">暂无数据</div>
                : <Chart
                  height={innerHeight * 0.24}
                  data={device}
                  scale={cols}
                  padding={[0, 20, 10, 20]}
                  forceFit
                >
                  <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                  <Axis name="percent" />
                  <Tooltip
                    showTitle={false}
                    itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                  />
                  <Geom
                    type="intervalStack"
                    position="percent"
                    color={['item', ['#2094FF', '#F28051', '#707DE5', '#FFD646']]}
                    tooltip={[
                      "item*percent",
                      (item, percent) => {
                        percent = (percent * 100).toFixed(0) + "%";
                        return {
                          name: item,
                          value: percent
                        };
                      }
                    ]}
                    style={{
                      lineWidth: 0,
                      stroke: "#fff"
                    }}
                  >
                  </Geom>
                </Chart>}
              {device_proportion.length === 0
                ? null
                : <div className="legend">
                  <div className="one">
                    <span className="icon"></span>
                    <span className="count">{this.createDeviceRatio('停车')}</span>
                  </div>
                  <div className="two">
                    <span className="icon"></span>
                    <span className="count">{this.createDeviceRatio('mac')}</span>
                  </div>
                  <div className="three">
                    <span className="icon"></span>
                    <span className="count">{this.createDeviceRatio('人行')}</span>
                  </div>
                  <div className="four">
                    <span className="icon"></span>
                    <span className="count">{this.createDeviceRatio('监控')}</span>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps(state){
  return {
    ...state.HomePageModel,
    ...state.MainLayout
  };
}
export default connect(mapStateToProps)(Form.create()(HomePage));
