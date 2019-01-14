import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import airFire from "../../../static/images/airFire.png";

function FireSystem(props) {
  
  return (
    <div style={{ height: `${window.innerHeight - 64}px`, textAlign:'center',color:'#fff' }}>
      <img src={airFire} style={{marginTop: '20%'}}/>
      <div>开发中...</div>
    </div>
  )
}''
function mapStateToProps(state) {
  return {
    ...state.FireSystemModel,
  };
}
export default connect(mapStateToProps)(Form.create()(FireSystem));
