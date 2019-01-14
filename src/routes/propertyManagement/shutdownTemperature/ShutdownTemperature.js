import React from 'react';
import { connect } from 'dva';
import { Form,Row,Col,Card,Button} from 'antd';
import { Link } from 'react-router-dom';
import Curved from '../component/Curved.js';
import './style.less';
import carData1 from "../../../../static/images/carData1.png";
import carData2 from "../../../../static/images/carData2.png";
import carData3 from "../../../../static/images/carData3.png";
import carData4 from "../../../../static/images/carData4.png";
function ShutdownTemperature(props) {
  const { dispatch,flag,inCar,out,remain,visitors,chartData } = props;
  function changeList(type){
    dispatch({
      type:'ShutdownTemperatureModel/concat',
      payload:{
        flag:type,
      }
    })
    dispatch({
      type:'ShutdownTemperatureModel/carDevice',
      payload:{
        type:type,
      }
    })
  }
 
  return (
    <div className="shutdown_temperature">
      <Card className="shutdown_card" bordered={false} span={24}>
        <h2 className="inline_block white">今日出入概况</h2>
        <Link to={`shutdownDetail`}><span className="marginL20">出入详情</span></Link>
        <Row>
          <Col span={6}>
            <div className="Margin-right12">
              <div className="flex1"><img src={carData1} title="logo" alt="logo" /></div>
              <div className="flex">
                <p className="white font14">入口总流量</p>
                <h2 className="white font48">{inCar?inCar:''}</h2>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="Margin-right12">
              <div className="flex1"><img src={carData2} title="logo" alt="logo" /></div>
              <div className="flex">
                <p className="white font14">出口总流量</p>
                <h2 className="white font48">{out?out:''}</h2>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="Margin-right12">
              <div className="flex1"><img src={carData3} title="logo" alt="logo" /></div>
              <div className="flex">
                <p className="white font14">访客车流量</p>
                <h2 className="white font48">{visitors?visitors:''}</h2>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="Margin-right12">
              <div className="flex1"><img src={carData4} title="logo" alt="logo" /></div>
              <div className="flex">
                <p className="white font14">剩余车位</p>
                <h2 className="white font48">{remain?remain:''}</h2>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      <Row>
        <Card className="margin20">
          <h2 className="inline_block white">出入流量趋势</h2>
          <Row className="inline_block fr">
            <Button className="mr1" onClick={() => changeList(1)} type={flag === 1 ? "primary" : ""}>今日</Button>
            <Button className="mr1" onClick={() => changeList(2)} type={flag === 2 ? "primary" : ""}>昨日</Button>
            <Button className="mr1" onClick={() => changeList(3)} type={flag === 3 ? "primary" : ""}>7日</Button>
            <Button onClick={() => changeList(4)} type={flag === 4 ? "primary" : ""}>30日</Button>
          </Row>
          <Curved flag={flag} data={ chartData }/>
        </Card>
      </Row>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.ShutdownTemperatureModel
  };
}
export default connect(mapStateToProps)(Form.create()(ShutdownTemperature));
