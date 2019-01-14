import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
import './style.less';
// const innerWidth= window.innerWidth;
class PieChart extends React.Component {
  constructor(props){
    super(props);
    this.state={}
  }
  componentDidMount(){
    
  }
  render() {
    const { DataView } = DataSet;
    const { height,data,text } = this.props;
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
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
    return (
      <div className="section">
        {data.length!=0?
          <Chart  padding={[80, 100, 80, 80]} height={height?height:350} data={dv} scale={cols} forceFit>
            <h2 className="main-title white">{text}</h2>
            <Coord type="theta" radius={1} />
            <Axis name="percent" />
            <Legend textStyle={{fill: '#fff',}} position="bottom" offsetY={40} offsetX={0}/>
            <Tooltip showTitle={false} itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"/>
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*percent",
                (item, percent) => {
                  percent = (percent * 100).toFixed(1) + "%";
                  return {
                    name: item,
                    value: percent
                  };
                }
              ]}
              style={{lineWidth: 1,stroke: "#fff"}}
            >
              <Label textStyle={{fill: '#fff',}} position="right" content="percent" formatter={(val, item) => {
                return item.point.item + ': ' + item.point.count;
              }} />
            </Geom>
          </Chart>
          :<div className="charts white">暂无数据</div>}
      </div>
    );
  }
}

export default PieChart;
