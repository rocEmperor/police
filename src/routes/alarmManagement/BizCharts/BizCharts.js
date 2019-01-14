import React from 'react';
import { Row,Col,Card } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  Guide,
} from "bizcharts";
import DataSet from "@antv/data-set";
import '../style.less';
let itemsList = [
  {
    value: "告警数量",
    marker: {
      symbol: "square",
      fill: "#3182bd",
      radius: 5
    }
  },
  {
    value: "告警处理率",
    marker: {
      symbol: "hyphen",
      stroke: "#ffae6b",
      radius: 5,
      lineWidth: 3
    }
  }
]
function BizCharts(props){
  const { dataSource } = props;
  const {data,data1,data2,data3,data4,percentage,list_status_totals} = dataSource;

  const label = {
    textStyle: {
      fill: '#fff',
    }
  }
  const { DataView } = DataSet;
  const { Html } = Guide;
  const da = new DataView();
  da.source(data1).transform({
    type: "percent",
    field: "count",
    dimension: "item",
    as: "percent"
  });
  const ds = new DataSet();
  const dv = ds.createView().source(data2);
  dv.transform({
    type: "fold",
    fields: ["消防告警", "行为告警", "设备告警", "黑名单告警",],
    // 展开字段集
    key: "告警类型",
    // key字段
    value: "数量" // value字段
  });
  const dataCol={
    cols:{
      sales: {
        tickInterval: 20
      },
    },
    cols1:{
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    }
  }
  const scale = {
    call: {
      min: 0
    },
    people: {
      min: 0
    },
    waiting: {
      min: 0
    }
  };
  let chartIns = null;

  function onLegend(){
    const item = ev.item;
    const value = item.value;
    const checked = ev.checked;
    const geoms = chartIns.getAllGeoms();
    for (let i = 0; i < geoms.length; i++) {
      const geom = geoms[i];
      if (geom.getYScale().field === value) {
        if (checked) {
          geom.show();
        } else {
          geom.hide();
        }
      }
    }
  }

  return (
    <div>
      <Row className="mt2">
        <Col span={7}>
          <Card className="bg">
            <p className="white mt">当日告警处理状态</p>
            {data.length!=0?
              <Chart height={304} data={data} scale={dataCol.cols} forceFit>
                <h2 className="white">{list_status_totals}</h2>
                <p className="white">总计</p>
                <Axis label={label} name="year" />
                <Axis label={label} name="sales" />
                <Tooltip showTitle={false} crosshairs={{type: "y"}}/>
                <Geom size={40} color="year" type="interval" position="year*sales" />
              </Chart>
              :<div className="charts white">暂无数据</div>
            }
          </Card>
        </Col>
        <Col span={7}>
          <Card className="ml1 bg">
            <p className="white mt">当日告警等级分布</p>
            {data1?
              <Chart height={370} data={da} scale={dataCol.cols1} padding={[40, 60, 120, 60]} forceFit>
                <Coord type={"theta"} radius={1} innerRadius={0.7} />
                <Axis name="percent" />
                <Legend textStyle={{fill: '#fff'}} position="bottom" offsetY={0} offsetX={0}/>
                <Tooltip showTitle={false} itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"/>
                <Guide>
                  <Html position={["50%", "50%"]} html={`<div class="style">蓝色警告<br><span class="white">${(percentage*100).toFixed(1)}%</span></div>`} alignX="middle" alignY="middle"/>
                </Guide>
                <Geom type="intervalStack" position="percent" color={['item', ['#224C88','#1CBBF2', '#FFBE00','#F45E18','#D71515',]]}
                  tooltip={[
                    "item*count",
                    (item, count) => {
                      count = (count * 100).toFixed(1) + "%";
                      return {
                        name: item,
                        value: count
                      };
                    }
                  ]}
                  >
                  <Label color="#fff"/>
                </Geom>
              </Chart>  
              :<div className="charts white">暂无数据</div>}
          </Card>
        </Col>
        <Col span={10}>
          <Card className="ml1 alarm1">
            <p className="white mt">当日告警类型分布</p>
            {data2.length!=0?
              <Chart padding={[20, 30, 140, 30]}  height={370} data={dv} forceFit>
                <p className="num white">数量</p>
                <Legend textStyle={{fill: '#fff'}}/>
                <Axis label={label} name="告警类型"/>
                <Axis label={label} name="数量" label={{formatter: val => `${val}`}} />
                <Tooltip />
                <Geom type="interval" position="告警类型*数量" color={"name"} size={40} style={{stroke: "#fff",lineWidth: 1}}/>
              </Chart>  
              :<div className="charts white">暂无数据</div>}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={7}>
          <Card className="mt1 bg">
            <p className="white mt">警告处理及时率</p>
            {data3.length!=0?
              <Chart height={400} padding={[40, 60, 120, 60]} data={data3} scale={dataCol.cols} forceFit>
                <p className="num white">数量</p>
                <Axis name="year" label={label} />
                <Axis name="sales" label={label} />
                <Tooltip showTitle={false} crosshairs={{type: "y"}}/>
                <Geom color="year" type="interval" position="year*sales" size={40} />
              </Chart>  
              :<div className="charts white">暂无数据</div>
            }
          </Card>
        </Col>
        <Col span={17}>
          <Card className="mt1 ml1 alarm2">
            <p className="mt white">近30日告警数量-处理率</p>
            {data4.length!=0?
              <Chart padding={[40, 60, 120, 60]} height={376} scale={scale} forceFit data={data4} onGetG2Instance={chart => {chartIns = chart;}}>
                <p className="num white">告警数量</p>
                <p className="num_right white">告警处理率</p>
                <Legend textStyle={{fill: '#fff'}} custom={true} allowAllCanceled={true} items={itemsList} onClick={onLegend}/>
                <Axis label={label} name="告警数量"/>
                <Axis label={label} name="time" />
                <Axis name="告警处理率" grid={null} label={label}/>
                <Tooltip />
                <Geom type="interval" position="time*告警数量" color="#3182bd" size={20} adjust= {[{type: 'stack',marginRatio: 0, }]} />
                <Geom type="line" position="time*告警处理率" color="#fdae6b" size={3} shape="smooth"/>
                <Geom type="point" position="time*告警处理率" color="#fdae6b" size={3} shape="circle"/>
              </Chart>
              :<div className="charts white">暂无数据</div>
            }
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default BizCharts;
