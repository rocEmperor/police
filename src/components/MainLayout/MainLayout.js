import React from 'react';
import { connect } from 'dva';
import './MainLayout.css';
import MainHeader from "./MainHeader.js";
import { Layout, LocaleProvider, Form } from 'antd';
const { Content } = Layout;
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { mineSocket } from '../../components/Socket/Socket';
class MainLayout extends React.Component {
  componentDidMount() {
    let { dispatch, mateWebSocketList } = this.props;
    if ('WebSocket' in window) {
      mineSocket(dispatch, mateWebSocketList);
    } else {
      alert('您的浏览器不支持 WebSocket!');
    }
  }

  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <Layout>
          <MainHeader />
          <div style={{ height: 64 }}></div>
          <Layout>
            <Content className="content">
              {this.props.children}
              <footer></footer>
            </Content>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.MainLayoutModel
  };
}
export default connect(mapStateToProps)(Form.create()(MainLayout));
