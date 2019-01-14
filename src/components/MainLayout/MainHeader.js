import React from 'react';
import { Layout, Form, Menu, Dropdown, Icon, Modal, Select } from 'antd';
import './MainLayout.css';
import './MainHeader.css'
import { connect } from 'dva';
import { Link } from 'react-router-dom';
const { Header } = Layout;
const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;

function MainHeader(props) {
  const { form, menuList, selectedKeys, dispatch, community, community_id, flagChangeCommunity } = props;
  console.log(community,'inin');
  
  if (community_id == undefined){
    form.resetFields(['community_id']);
  }

  const { getFieldDecorator } = form;
  function confirm() {
    Modal.confirm({
      title: '确认退出该账号？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        window.sessionStorage.removeItem('password_time_stamp');
        dispatch({
          type: 'MainLayoutModel/loginOut',
          payload: {

          }
        });
      }
    });
  }
  
  
  function selectChange(val){
    community.map((item,index)=>{
      if(item.community_id == val){
        window.localStorage.setItem('CITY_ID', item.city_id);
        window.localStorage.setItem('COMMUNITY_ID', item.community_id);
        let hash = window.location.hash;
        if (hash.indexOf('communityCloud') != -1){
          window.location.hash = `#communityCloud`;
          window.location.reload();
          // dispatch({
          //   type: 'CommunityCloudModel/init',
          //   payload: {}
          // });
          // dispatch({
          //   type: 'MainLayoutModel/concat',
          //   payload: {
          //     community_id: item.community_id
          //   }
          // });
        }else{
          window.location.hash = `#communityCloud`;
        }
      }
    })
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={confirm}>退出登录</a>
      </Menu.Item>
    </Menu>
  )
  return (
    <Header className="header">
      <Dropdown overlay={menu}>
        <div className="userInfo">
          欢迎你，{localStorage.getItem('USER_NAME') ? localStorage.getItem('USER_NAME') : 'zhujiayi'}
          <Icon type="down" className="ml1 fz12" />
        </div>
      </Dropdown>
      {flagChangeCommunity == true?
        <FormItem label="" style={{ float: 'right', marginBottom: '0', marginTop: '14px' }}>
          {getFieldDecorator('community_id', {
            initialValue: community_id != undefined ? community_id : undefined,
            rules: [{ required: false, message: "请选择社区" }],
            onChange: selectChange.bind(this)
          })(
            <Select placeholder="请选择社区" showSearch={true} style={{ width: '150px', zIndex: '9999' }} notFoundContent="没有数据"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              suffixIcon={<Icon type="search" />}
            >
              {community && community.length > 0 ? community.map((value, index) => {
                return <Option key={index} value={value.community_id.toString()}>{value.community_name}</Option>
              }) : null}
            </Select>)}
        </FormItem>
        :null
      }
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        selectedKeys={selectedKeys}
        style={{ lineHeight: '64px' }}
      >
        {menuList.map((val) => {
          if (val.children.length === 0) {
            return (
              <Menu.Item key={val.key}>
                <Link to={val.route}>{val.title}</Link>
              </Menu.Item>
            )
          } else {
            return (
              <SubMenu key={val.key} title={<span>{val.title}</span>}>
                {val.children.map((valChild) => {
                  let linkTo = `${valChild.route}?type=2`;
                  return (
                    <Menu.Item key={valChild.key}>
                      <Link to={valChild.key === '9-4' ? linkTo : valChild.route}>{valChild.title}</Link>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            )
          }
        })}
      </Menu>
    </Header>
  );
}
function mapStateToProps(state) {
  return { ...state.MainLayoutModel };
}
export default connect(mapStateToProps)(Form.create()(MainHeader));
