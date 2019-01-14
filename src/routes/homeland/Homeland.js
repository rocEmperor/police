import React from 'react';
import { connect } from 'dva';
import './index.less';
import { Card, Form, DatePicker, Select,Table,Button,Col,Row } from 'antd';
import moment from 'moment';
import { cutStr,format } from '../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const {MonthPicker} = DatePicker;
const formItemLayout1 = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 10
  },
};
const formItemLayout2 = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  },
};
let date=new Date; 
function Homeland(props) {
  const {dispatch,form,dataSource,dataSource1,month,params,totals,totals1,params1,policeList,loading} = props;
  const { getFieldDecorator } = form;
  function onChange(date, dateString){
    dispatch({
      type:'HomelandModel/concat',
      payload:{
        month:date?date.format("M"):null
      }
    })
    dispatch({
      type:'HomelandModel/policeList',
      payload:{
        select_date:date?date.format("YYYYMM"):format(new Date,"yyyyMM")
      }
    })
  }
  function handlePaginationChange(page, size,){
    const param = { ...params, page };
    dispatch({
      type:'HomelandModel/getPeopleList',
      payload:param
    })
  }
  function handlePaginationChange1(page, size){
    const param = { ...params1, page };
    dispatch({
      type:'HomelandModel/activityList',
      payload:param
    })
  }
  function handSearch(e){
    form.validateFields(['panel_type'],(err,val)=>{
      dispatch({
        type:'HomelandModel/getPeopleList',
        payload:{
          label_id:val.panel_type,
          page:1,
          rows:20
        }
      })
    })
  }
  function handleReset(e){
    form.resetFields(['panel_type']);
    form.validateFields(['panel_type'],(err,val)=>{
      dispatch({
        type:'HomelandModel/getPeopleList',
        payload:{
          label_id:'',
          page:1,
          rows:20
        }
      })
    })
  }
  const columns = [{
    title: '家园+',
    dataIndex: 'label_name',
    key: 'label_name',
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '联系电话',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '单位部门',
    dataIndex: 'department',
    key: 'department',
  }, {
    title: '参加活动数',
    dataIndex: 'join_number',
    key: 'join_number',
  }, {
    title: '报道派出所',
    dataIndex: 'ps_name',
    key: 'ps_name',
  }, {
    title: '网格民警',
    dataIndex: 'police_name',
    key: 'police_name',
  }]
  const columns1 = [{
    title: '活动名称',
    dataIndex: 'title',
    key: 'title',
    render: (text,record) => {
      return <div>
        <a className="white" href={record.link_url} target="_blank">{text}</a>
      </div>
    }
  }]
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1,
    defaultPageSize:20,
  };
  const pagination1={
    current: params1.page,
    onChange: handlePaginationChange1,
    total: parseInt(totals1),
    showTotal: totals => `共${totals1}条`,
    defaultCurrent: 1,
    defaultPageSize:20,
  }
  return (
    <div className="homeland">
      <Card className="white" title={`月度统计(${month?month:cutStr(format(date,'MM'),1)}月)`}>
        <div className="title">
          <Form className="form">
            <FormItem {...formItemLayout1} label="选择日期" >
              {getFieldDecorator('month-picker',{initialValue:moment(format(date,'yyyy-MM'))})(
                <MonthPicker onChange={onChange} style={{width:'100%'}}/>
              )}
            </FormItem>
          </Form>
        </div>
        <div className="total">
          {policeList&&policeList.length!=0?policeList.map((v,k)=>{
            return (
              <div key={k}>
                <i className={`icon-fff ${"icon"+v.ps_id}`}>{cutStr(v.name,0,1)}</i>
                <div>
                  <span>{v.name}</span>
                  <p><span>活动：</span>{v.number}次</p>
                  <p><span>卫士：</span>{v.volunteer_num}人</p>
                </div>
              </div>
            )
          }):<div className="white">暂无数据</div>}
          
        </div>
      </Card>
      <Card className="mt1">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="家园+：" {...formItemLayout2}>
                {getFieldDecorator('panel_type')(
                  <Select placeholder="请选择家园">
                    <Option value="">全部</Option>
                    <Option key={1} value="1">家园卫士</Option>
                    <Option key={2} value="2">家园先锋</Option>
                    <Option key={3} value="3">家园医生</Option>
                    <Option key={4} value="4">家园文工</Option>
                    <Option key={5} value="5">家园园丁</Option>
                    <Option key={6} value="6">家园顾问</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className="fr" style={{marginRight:"40px"}}>
              <Button type="primary" onClick={handSearch} >查询</Button>
              <Button type="ghost" onClick={handleReset} style={{ marginLeft: 15 }}>重置</Button>
            </Col>
          </Row>
        </Form>
        <Table loading={loading} dataSource={dataSource} columns={columns} pagination={pagination} rowKey={record => record.id} />
      </Card>
      <Card className="mt1" title="活动列表">
        <Table loading={loading} dataSource={dataSource1} columns={columns1} pagination={pagination1} rowKey={record => record.id} />
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.HomelandModel,
    loading:state.loading.models.HomelandModel,
  };
}
export default connect(mapStateToProps)(Form.create()(Homeland));
