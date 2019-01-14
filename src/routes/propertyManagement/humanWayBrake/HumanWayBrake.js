import React from 'react';
import { connect } from 'dva';
import { Form,Row,Col,Card,Button} from 'antd';
import { Link } from 'react-router-dom';
import PieChart from '../component/PieChart.js';
import Curved from '../component/Curved.js';
import './style.less';
function HumanWayBrake(props) {
  const { dispatch,flag,travelChart,usersChart,levelList,fields } = props;
  function changeList(type){
    dispatch({
      type:'HumanWayBrakeModel/concat',
      payload:{
        flag:type,
      }
    })
    dispatch({
      type:'HumanWayBrakeModel/peopleDevice',
      payload:{
        type:type,
      }
    })
  }
  return (
    <div className="human_way_brake">
      <Card className="human_way_cart mt2">
        <div>
          <h2 className="inline_block white">今日出入概况</h2>
          <Link to={`entryDetail`}><span className="marginL20">出入详情</span></Link>
        </div>
        <Col span={12}>
          <div>
            <PieChart data={usersChart} text="用户统计" />
          </div>
        </Col>
        <Col span={12}>
          <div>
            <PieChart data={travelChart} text="出行方式统计" />
          </div>
        </Col>
      </Card>
      <Row>
        <Card>
          <h2 className="inline_block white">出入流量趋势</h2>
          <Row className="inline_block fr">
            <Button className="mr1" onClick={() => changeList(1)} type={flag === 1 ? "primary" : ""}>今日</Button>
            <Button className="mr1" onClick={() => changeList(2)} type={flag === 2 ? "primary" : ""}>昨日</Button>
            <Button className="mr1" onClick={() => changeList(3)} type={flag === 3 ? "primary" : ""}>7日</Button>
            <Button onClick={() => changeList(4)} type={flag === 4 ? "primary" : ""}>30日</Button>
          </Row>
          <Curved data={ levelList } flag={flag} fields={fields} />
        </Card>
      </Row>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.HumanWayBrakeModel
  };
}
export default connect(mapStateToProps)(Form.create()(HumanWayBrake));
