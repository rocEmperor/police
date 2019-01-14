import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Coord,
  Guide,
  Shape
} from "bizcharts";


class Pie extends React.Component {
  render() {
    const { Arc, Html } = Guide;
    // 自定义Shape 部分
    Shape.registerShape('point', 'pointer', {
      drawShape(cfg, group) {
        let point = cfg.points[0]; // 获取第一个标记点
        point = this.parsePoint(point);
        const center = this.parsePoint({ // 获取极坐标系下画布中心点
          x: 0,
          y: 0
        });
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: point.x,
            y2: point.y - 20,
            stroke: cfg.color,
            lineWidth: 5,
            lineCap: 'round'
          }
        });
        return group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 12,
            stroke: cfg.color,
            lineWidth: 4.5,
            fill: '#fff'
          }
        });
      }
    });

    const data = [
      { value: Number(this.props.data.enter_probability)/10 }
    ];
    const cols = {
      'value': {
        min: 0,
        max: 10,
        ticks: [],
        nice: false
      }
    }
    return (
      <div>
        <Chart height={335} data={data} scale={cols} padding={[0, 0, 80, 0]} forceFit>
          <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 10 * Math.PI} radius={0.75} />
          <Axis name="value"
            zIndex={2}
            line={null}
          />
          <Axis name="1" visible={false} />
          <Guide>
            <Arc zIndex={0} start={[0, 1]} end={[10, 1]}
              style={{ // 底灰色
                stroke: '#000',
                lineWidth: 18,
                opacity: 0.3
              }} />
            <Arc zIndex={1} start={[0, 1]} end={[data[0].value, 1]}
              style={{ // 底灰色
                stroke: '#7B68EE',
                lineWidth: 18,
              }} />
            <Html position={['50%', '95%']} html={() => { return (`<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 16px;color: rgba(255,255,255);margin: 0;">${Number(this.props.data.enter_probability)}%</p></div>`) }} />
          </Guide>
          <Geom type="point" position="value*1" shape="pointer" color="#7B68EE"
            active={false}
          />
        </Chart>
      </div>
    );
  }
}

export default Pie;
