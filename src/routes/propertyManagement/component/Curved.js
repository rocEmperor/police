import React from "react";
import { cutStr } from '../../../utils/util';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import './style.less';
class Curved extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {

  }
  time(val) {
    if(cutStr(val,3) === '30'){
      return ;
    }else{
      return val
    }
  }
  isInteger(obj){
    return typeof obj === 'number' && obj%1 === 0;
  }

  num(val){
    if(this.isInteger(Number(val))){
      return val;
    }
  }
  render() {
    const { height, data,flag } = this.props;
    const cols = {
      time: {
        range: [0, 1]
      }
    };
    const label = {
      textStyle: {
        fill: '#fff',
      }
    }
    return (
      <div className="section">
        {data.length!=0?
          <Chart padding={[80, 80, 80, 80]} height={height ? height : 400} data={data} scale={cols} forceFit>
            <Legend textStyle={{fill: '#fff'}}/>
            <Axis name="time" label={{formatter: flag&&(flag==1||flag==2)?val =>this.time(val,flag):val => `${val}`}} />
            <Axis name="value" label={{formatter: val =>this.num(val), textStyle:{fill: '#fff',}}} />
            <Tooltip crosshairs={{ type: "y" }} />
            <Geom type="line" position="time*value" size={2} color={"type"} shape={"smooth"} />
            <Geom type="point" position="time*value" size={4} shape={"circle"} color={"type"} style={{ stroke: "#fff", lineWidth: 1 }} />
          </Chart>
          :<div className="charts white">暂无数据</div>}
      </div>
    );
  }
}

export default Curved;
