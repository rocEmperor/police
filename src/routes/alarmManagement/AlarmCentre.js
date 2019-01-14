import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Button, Select, DatePicker, Input, Table, Cascader, Tabs, Modal, message, Popover } from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
import BizCharts from './BizCharts/BizCharts.js';
import { noData } from '../../utils/util';
import './style.less';
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
}
const formItemLayout1 = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}
let columnsList = {
  content: '告警内容',
  picture: '图片',
  location: '地点',
  device_name: '设备名称',
  level_two_desc: '告警类型(二级)',
  level_one_desc: '告警类型(一级)',
  create_at: '告警时间',
  community_name: '小区名称',
  level_color_desc: '告警等级',
}
let columns1List = {
  resolve_content: '处理结果',
  resolve_name: '处理人',
  resolve_at: '处理时间',
  picture: '图片',
  content: "内容",
  location: "地点",
  device_name: '设备名称',
  level_two_desc: '告警类型(二级)',
  level_one_desc: '告警类型(一级)',
  create_at: '告警时间',
  community_name: '小区名称',
  level_color_desc: '告警等级',
}
function popover(text) {
  return (
    <Popover content={<div>{text}</div>}>
      <span>{text}</span>
    </Popover>
  )
}
let padding = {
  padding: '16px'
}
let padding1 = {
  padding: '37px'
}
function pushColumns(obj, target) {
  for (let k in obj) {
    if (k == 'content' || k == 'resolve_content') {
      target.unshift({
        title: obj[k],
        dataIndex: k,
        key: k,
        render: (text, record) => popover(text)
      })
    }
    else if (k == 'level_color_desc') {
      target.unshift({
        title: obj[k],
        dataIndex: k,
        key: k,
        className: k,
        render: (text, record) => {
          return <span className={`color color` + record.level_color} style={record.picture?padding1:padding}>{text}</span>
        }
      })
    } else if (k == 'picture') {
      target.unshift({
        title: obj[k],
        dataIndex: k,
        key: k,
        className: k,
        render: (text) => {
          if (text) {
            return <img src={text} className="mr1 imgSize"/>
          } else {
            return noData()
          }
        }
      })
    } else {
      target.unshift({
        title: obj[k],
        dataIndex: k,
        key: k,
        className: k
      })
    }
  }
}
function AlarmCentre(props) {
  const { dispatch, form, loading, list, flag, visible, ID, level_one, level_two, levelList, totals, params, list_status, list_rate, list_grade, list_type, dataList, percentage, list_status_totals } = props;
  const { getFieldDecorator } = form;
  /**
   * 查询表格数据
   * @param {Object} params
  */
  function reload(params) {
    dispatch({
      type: 'AlarmCentreModel/getList',
      payload: params,
    })
  }
  let columns = [
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a style={{ color: '#1890ff' }} onClick={modalShow.bind(this, record.id)}>处理</a>
          </span>
        )
      },
    }
  ];
  let columns1 = [];
  pushColumns(columnsList, columns);
  pushColumns(columns1List, columns1);
  /**
   * 查询
   *
   */
  function handSearch() {
    form.validateFields((err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.status = flag;
      param.level_one = level_one;
      param.level_two = level_two;
      param.alarm_start = (values.alarm_time && values.alarm_time.length !== 0) ? values.alarm_time[0].format('YYYY-MM-DD HH:mm') : '';
      param.alarm_end = (values.alarm_time && values.alarm_time.length !== 0) ? values.alarm_time[1].format('YYYY-MM-DD HH:mm') : '';
      param.deal_start = (values.deal_time && values.deal_time.length !== 0) ? values.deal_time[0].format('YYYY-MM-DD HH:mm') : '';
      param.deal_end = (values.deal_time && values.deal_time.length !== 0) ? values.deal_time[1].format('YYYY-MM-DD HH:mm') : '';
      delete param.alarm_time;
      delete param.deal_time;
      delete param.level_type;
      delete param.resolve_content;
      reload(param);
    })
  }
  /**
   * 重置
   *
   */
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        alarm_end: '',
        alarm_start: '',
        deal_end: '',
        deal_start: '',
        device_name: '',
        level_color: '',
        level_one: '',
        level_two: '',
        page: 1,
        rows: 10,
        status: flag,
      }
      reload(param);
    })
  }
  /**
   * tab切换
   * @param {number} key
   */
  function onChange(key) {
    dispatch({
      type: 'AlarmCentreModel/concat',
      payload: {
        flag: Number(key)
      }
    })
    dispatch({
      type: 'AlarmCentreModel/getList',
      payload: {
        status: key,
      }
    })
  }
  /**
   * 警告类型选择
   * level_one,level_two
   * @param { number}
   */
  function onChangeType(val) {
    dispatch({
      type: 'AlarmCentreModel/concat',
      payload: {
        level_one: val[0],
        level_two: val[1],
      }
    })
  }
  /**
   * 处理弹框
   * ID,visible
   * @param { number,Boolean}
   */
  function modalShow(id) {
    form.resetFields(['resolve_content']);
    dispatch({
      type: 'AlarmCentreModel/concat',
      payload: {
        visible: true,
        ID: id,
      }
    })
  }
  /**
   * 处理弹框确定
   * ID,resolve_content
   * @param { number,string}
   */
  function handleOk(e) {
    form.validateFields(['resolve_content'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'AlarmCentreModel/warningDeal',
        payload: {
          id: ID,
          resolve_content: values.resolve_content
        },
        callback() {
          message.success("操作成功！");
          dispatch({
            type: 'AlarmCentreModel/init',
            payload: {
              status: flag,
              page: 1,
              rows: 10
            },
          })
        }
      })
    })
  }
  /**
   * 关闭弹框
   *
   * @param { Boolean }visible
   */
  function handleCancel() {
    dispatch({
      type: 'AlarmCentreModel/concat',
      payload: {
        visible: false,
      }
    })
  }
  /**
   * 分页
   * @param{page:number,size:number}
  */
  function handlePaginationChange(page, size) {
    const param = { ...params, page }
    reload(param)
  }
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: total => `共${totals}条`,
    defaultCurrent: 1,
  }
  return (
    <div className="alarm_centre">
      <Card>
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="设备名称：" {...formItemLayout}>
                {getFieldDecorator('device_name')(
                  <Input className="white" placeholder="请输入设备名称" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="告警等级：" {...formItemLayout}>
                {getFieldDecorator('level_color')(
                  <Select placeholder="请选择告警等级">
                    <Option value="">全部</Option>
                    <Option key={5} value="1">灰色警告</Option>
                    <Option key={1} value="2">蓝色告警</Option>
                    <Option key={2} value="3">黄色告警</Option>
                    <Option key={3} value="4">橙色告警</Option>
                    <Option key={4} value="5">红色告警</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="告警类型：" {...formItemLayout}>
                {getFieldDecorator('level_type')(
                  <Cascader onChange={onChangeType} options={levelList} placeholder="请选择警告类型" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <FormItem label="告警时间：" {...formItemLayout1}>
                {getFieldDecorator('alarm_time')(
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem label="处理时间：" {...formItemLayout1}>
                {getFieldDecorator('deal_time')(
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4} offset={2}>
              <Button type="primary" onClick={handSearch} >查询</Button>
              <Button type="ghost" onClick={handleReset} style={{ marginLeft: 15 }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </ Card>
      <Modal
        title="处理"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('resolve_content', {
              rules: [{
                pattern: /^[^ ]{1,200}$/,
                required: true,
                message: '处理内容不能超过200个字'
              }],
            })(
              <TextArea placeholder="请输入处理内容200字" rows={4} />
            )}
          </FormItem>
        </Form>
      </Modal>
      <Card className="mt2">
        <Tabs activeKey={String(flag)} onChange={onChange}>
          <TabPane tab="未处理" key="1"></TabPane>
          <TabPane tab="已处理" key="2"></TabPane>
        </Tabs>
        <Table className="slide" style={{ marginTop: "20px" }} loading={loading} dataSource={list} columns={flag === 1 ? columns : columns1} rowKey={record => record.id} pagination={pagination} />
      </Card>
      <div>
        <BizCharts dataSource={{ list_status_totals: list_status_totals, percentage: percentage, data: list_status, data1: list_grade ? list_grade : [], data2: list_type, data3: list_rate, data4: dataList }} />
      </div>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.AlarmCentreModel,
    loading: state.loading.models.AlarmCentreModel,
  };
}
export default connect(mapStateToProps)(Form.create()(AlarmCentre));
