import React from 'react';
import { connect } from 'dva';
import { Form,Row,Col,Card,Button,Select,DatePicker,Input,Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import { noData } from '../../../utils/util';
import './style.less';
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  },
};
const formItemLayout1 = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  },
};
let formItemLayout2 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
function ShutdownDetail(props) {
  const { dispatch,form,loading,list,params,totals,car_type } = props;
  const { getFieldDecorator } = form;

  /** 
   * 查询表格数据
   * @param {Object} param
  */
  function reload(param){
    dispatch({
      type:'ShutdownDetailModel/getList',
      payload:param,
    })
  }
  function handSearch(){
    form.validateFields((err,values)=>{
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.start_time = (values.in_time && values.in_time.length !== 0) ? values.in_time[0].format('YYYY-MM-DD') : '';
      param.end_time = (values.in_time && values.in_time.length !== 0) ? values.in_time[1].format('YYYY-MM-DD') : '';
      delete param.in_time;
      reload(param);
    })
  }
  function handleReset(){
    form.resetFields();
    form.validateFields((err,values)=>{
      const param = {
        page:1,
        rows:10,
        car_num:'',
        car_type:'',
        start_time:'',
        end_time:'',
        amount_min:'',
        amount_max:'',
      }
      reload(param);
    })
  }
  function handlePaginationChange(page,size){
    const param = {...params,page};
    reload(param);
  }
  const columns=[
    {
      title: '编号',
      dataIndex: 'tid',
      key: 'tid',
      render: noData,
    },
    {
      title: '车牌号',
      dataIndex: 'car_num',
      key: 'car_num',
      render: noData,
    }, {
      title: '出口',
      dataIndex: 'out_address',
      key: 'out_address',
      render: noData,
    }, {
      title: '出库时间',
      dataIndex: 'out_time',
      key: 'out_time',
      render: noData,
    },
    {
      title: '入口',
      dataIndex: 'in_address',
      key: 'in_address',
      render: noData,
    },
    {
      title: '入库时间',
      dataIndex: 'in_time',
      key: 'in_time',
      render: noData,
    },{
      title: '车辆属性',
      dataIndex: 'car_type',
      key: 'car_type',
      render: (text,record)=>{
        return <span>{text.value}</span>
      },
    }, {
      title: '停车时长',
      dataIndex: 'park_time',
      key: 'park_time',
      render: noData,
    },{
      title: '停车费用',
      dataIndex: 'amount',
      key: 'amount',
      render: noData,
    }
  ]
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent:1
  }
  return (
    <div className="entry_detail">
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="车牌号：" {...formItemLayout}>
                {getFieldDecorator('car_num')(
                  <Input placeholder="请输入车牌号"/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车辆类别：" {...formItemLayout}>
                {getFieldDecorator('car_type',)(
                  <Select placeholder="请选择车辆类别">
                    {car_type&&Array.isArray(car_type)?car_type.map((v,k)=>{
                      return <Option key={k} value={v.key}>{v.value}</Option>
                    }):null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="入库时间：" {...formItemLayout2}>
                {getFieldDecorator('in_time')(
                  <RangePicker style={{width:'96%'}} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={17}>
              <Col span={9}>
                <FormItem label="停车费用：" {...formItemLayout1}>
                  {getFieldDecorator('amount_min')(
                    <Input placeholder="请输入起始停车费用" addonAfter="元" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="至" {...formItemLayout1}>
                  {getFieldDecorator('amount_max')(
                    <Input placeholder="请输入最大停车费用" addonAfter="元" />
                  )}
                </FormItem>
              </Col>
            </Col>
            <Col className="fr" style={{marginRight:"40px"}}>
              <Button type="primary" onClick={handSearch} >查询</Button>
              <Button type="ghost" onClick={handleReset} style={{ marginLeft: 15 }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card style={{marginTop:"20px"}} >
        <Table 
          style={{marginTop:"20px"}} 
          loading={loading} 
          dataSource={list} 
          columns={columns} 
          rowKey={record => record.id} 
          pagination={pagination} 
        />
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.ShutdownDetailModel,
    loading: state.loading.models.ShutdownDetailModel,
  };
}
export default connect(mapStateToProps)(Form.create()(ShutdownDetail));
