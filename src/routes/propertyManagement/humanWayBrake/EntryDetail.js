import React from 'react';
import { connect } from 'dva';
import { Form,Row,Col,Card,Button,Select,DatePicker,Input,Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import Community from '../../../components/Community/Community.js';
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
let formItemLayout2 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
function EntryDetail(props) {
  const { dispatch,form,loading,list,params,totals,open_type,userType } = props;
  const { getFieldDecorator } = form;
  /** 
   * 查询表格数据
   * @param {Object} params
  */
  function reload(params){
    dispatch({
      type:'EntryDetailModel/getList',
      payload:params,
    })
  }
  /** 
   * 查询
  */
  function handSearch(){
    form.validateFields((err,values)=>{
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.start_time = (values.time && values.time.length !== 0) ? values.time[0].format('YYYY-MM-DD') : '';
      param.end_time = (values.time && values.time.length !== 0) ? values.time[1].format('YYYY-MM-DD') : '';
      delete param.time;
      reload(param);
    })
  }
  /**
   * 重置
   */
  function handleReset(){
    form.resetFields();
    form.validateFields((err,values)=>{
      const param = {
        page:1,
        rows:10,
        group:"",
        building:"",
        unit:"",
        room:"",
        device_name:"",
        open_type:"",
        start_time:"",
        end_time:"",
        user_phone:"",
        user_type:"",
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
      title: '抓拍照片',
      dataIndex: 'capture_photo',
      key: 'capture_photo',
      render: noData,
      render: (text,record) => {
        return <div className="capture_photo">
          {text!=''?<img style={{width:"100px",height:"100px"}} className="img" src={text}/>:null}
        </div>
      }
    },
    {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: noData,
    },
    {
      title: '开门方式',
      dataIndex: 'open_type',
      key: 'open_type',
      render: noData,
      render: (text,record) => {
        return <div className="capture_photo">
          {text ? text.value:''}
        </div>
      }
    }, {
      title: '开门时间',
      dataIndex: 'open_times',
      key: 'open_times',
      render: noData,
    }, {
      title: '住户手机号',
      dataIndex: 'user_phone',
      key: 'user_phone',
      render: noData,
    },
    {
      title: '门卡卡号',
      dataIndex: 'card_no',
      key: 'card_no',
      render: noData,
    },
    {
      title: '用户类型',
      dataIndex: 'user_type',
      key: 'user_type',
      render: noData,
      render: (text,record) => {
        return <div className="capture_photo">
          {text ? text.value:''}
        </div>
      }
    },{
      title: '设备名称',
      dataIndex: 'device_name',
      key: 'device_name',
      render: noData,
    }, {
      title: '楼宇单元',
      dataIndex: 'group',
      key: 'group',
      render: (text,record) => {
        return <div>{`${record.group+record.building+record.unit}`}</div>
      }
    },{
      title: '室',
      dataIndex: 'room',
      key: 'room',
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
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={6}>
              <FormItem label="开门方式：" {...formItemLayout}>
                {getFieldDecorator('open_type')(
                  <Select placeholder="请选择开门方式">
                    {open_type&&Array.isArray(open_type)?open_type.map((v,k)=>{
                      return <Option key={k} value={v.key}>{v.value}</Option>
                    }):null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="用户身份：" {...formItemLayout}>
                {getFieldDecorator('user_type')(
                  <Select placeholder="请选择用户身份">
                    {userType&&Array.isArray(userType)?userType.map((v,k)=>{
                      return <Option key={k} value={v.key}>{v.value}</Option>
                    }):null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="开门时间：" {...formItemLayout2}>
                {getFieldDecorator('time')(
                  <RangePicker style={{width:'96%'}} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="设备名称：" {...formItemLayout}>
                {getFieldDecorator('device_name')(
                  <Input placeholder="请输入设备名称"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="手机号：" {...formItemLayout}>
                {getFieldDecorator('user_phone')(
                  <Input placeholder="请输入手机号"/>
                )}
              </FormItem>
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
    ...state.EntryDetailModel,
    loading: state.loading.models.EntryDetailModel,
  };
}
export default connect(mapStateToProps)(Form.create()(EntryDetail));
