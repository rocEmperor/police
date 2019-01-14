import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import videoMonitoring from "../../../static/images/videoMonitoring.png";
import './style.less';
function RealTimeMonitoring(props) {
  return (
    <div style={{ height: `${window.innerHeight - 64}px` }} className="real_time_monitoring">
      <div><img src={videoMonitoring} title="logo" alt="logo" /></div>
    </div>
  )
}

export default connect()(Form.create()(RealTimeMonitoring));
