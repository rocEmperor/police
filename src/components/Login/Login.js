import React from "react";
import { connect } from 'dva';
import { Form, Input, Button } from "antd";
import "./login.less";
import logoIndex1 from "../../../static/images/rightTop.png";
import logoIndex2 from "../../../static/images/leftBottom.png";
const FormItem = Form.Item;
function Login(props) {
  let { dispatch, form } = props;

  const { getFieldDecorator } = form;
  function handleSubmit(e){
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      window.sessionStorage.removeItem('password_time_stamp');
      dispatch({
        type: 'login/login',
        payload: {
          username:values.username,
          password:values.password,
        },callback(){
          localStorage.setItem('USER_NAME',values.username);
        }
      })
    });
  }

  return (
    <div className="login">
      <div className="login">
        <div className="layout">
          <h1 className="title">智安小区</h1>
          <div className="iconBlock">
            <img src={logoIndex1} className="rightTop"/>
          </div>
          <div className="contents">
            <h1 className="userLogin">用户登录</h1>
            <Form>
              <FormItem>
                {getFieldDecorator("username", {
                  rules: [{ required: true, message: "请输入用户名" }]
                })(<Input placeholder="用户名" className="loginInput"/>)}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{ required: true, message: "请输入密码" }]
                })(
                  <Input
                    type="password"
                    placeholder="密码" className="loginInput"
                  />
                )}
              </FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="button"
                onClick={handleSubmit}
              >
                登录
              </Button>
            </Form>
          </div>
          <img src={logoIndex2} className="leftBottom"/>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.login };
}
export default connect(mapStateToProps)(Form.create()(Login));
