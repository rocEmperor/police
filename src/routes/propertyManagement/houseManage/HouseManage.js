import React from 'react';
import { connect } from 'dva';
import { Form, Col, Row, Card, Button, Table, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import Pie from './components/Pie';
import { noData } from '../../../utils/util';

import Community from '../../../components/Community/Community.js';
import { Chart, Geom, Tooltip, Axis, Legend } from "bizcharts";

function HouseManage(props) {
  let { dispatch, form, list, floorList, house_rate, lease_deadline, room_purpose, room_change, liftList, totals, params, loading, is_reset, labelType } = props;
  const { getFieldDecorator } = form;
  
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'houseManageModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params) {
    dispatch({
      type: 'houseManageModel/getList',
      payload: params,
    });
  }
  /**
   * 查询
   */
  function handleSubmit() {
    form.validateFields((err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = localStorage.getItem("COMMUNITY_ID");
      reload(param);
    });
    dispatch({
      type: 'houseManageModel/concat',
      payload: {
        selectedNum: 0,
      }
    });
  }
  /**
   * 重置
   */
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: localStorage.getItem("COMMUNITY_ID"),
        group: [],
        unit: [],
        room: [],
        building: [],
        property_type: "",
        status: "",
        room_label_id: []
      };
      reload(param);
    });
    dispatch({
      type: 'houseManageModel/concat',
      payload: {
        selectedNum: 0,
      }
    });
    const params = {
      unitData: [],
      roomData: [],
      buildingData: [],
    };
    dispatch({
      type: 'CommunityModel/concat',
      payload: params
    });
  }
  /**
   * 楼道号与电梯号选择
   * @param  {String} e
   * @param  {String} val
   * e = 1 楼道号
   * e = 2 电梯编号
   */
  function handleFloorListChange(e, val) {
    if (e == 1) {
      floorList.map(item => {
        if (item.name == val) {
          dispatch({
            type: 'houseManageModel/concat',
            payload: {
              floor_shared_id: item.id
            }
          })
        }
      })
    } else if (e == 2) {
      liftList.map(item => {
        if (item.name == val) {
          dispatch({
            type: 'houseManageModel/concat',
            payload: {
              lift_shared_id: item.id
            }
          })
        }
      })
    }
  }
  /**
   * 切换页码
   * @param  {Number} page
   */
  function handlePaginationChange(page, size) {
    const param = { ...params, page };
    reload(param);
  }
  /**
   * 表格排序
   * @param  {Object} sorter
   */
  function tableChanges(pagination, filters, sorter) {
    form.validateFields((err, values) => {
      let { group, unit, room, building, property_type, status } = values;
      if (Object.keys(sorter).length != 0) {
        dispatch({
          type: 'houseManageModel/getList',
          payload: {
            community_id: localStorage.getItem("COMMUNITY_ID"),
            page: params.page,
            rows: 10,
            group,
            unit,
            room,
            building,
            property_type,
            status,
            order_sort: (sorter.order.indexOf('descend') > -1 ? 'desc' : 'asc')
          },
        });
      }
    })
  }
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  };
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1
  };
  // 表格列配置
  const columns = [{
    title: '苑/期/区',
    dataIndex: 'group',
    key: 'group',
    render: noData,
  }, {
    title: '幢',
    dataIndex: 'building',
    key: 'building',
    render: noData,
  }, {
    title: '单元',
    dataIndex: 'unit',
    key: 'unit',
    render: noData,
  }, {
    title: '室',
    dataIndex: 'room',
    key: 'room',
    render: noData,
  }, {
    title: '楼段系数',
    dataIndex: 'floor_coe',
    key: 'floor_coe',
    render: noData,
  }, {
    title: '楼道号',
    dataIndex: 'floor_shared_id',
    key: 'floor_shared_id',
    render: noData,
  }, {
    title: '电梯编号',
    dataIndex: 'lift_shared_id',
    key: 'lift_shared_id',
    render: noData,
  }, {
    title: '物业类型',
    dataIndex: 'property_type',
    key: 'property_type',
    render: noData,
  }, {
    title: '房屋状态',
    dataIndex: 'status',
    key: 'status',
    render: noData,
  }, {
    title: '收费面积',
    dataIndex: 'charge_area',
    key: 'charge_area',
    render: (text) => {
      return <span>{`${text}m²`}</span>
    },
  }, {
    title: '备注',
    dataIndex: 'intro',
    key: 'intro',
    render: (text, record) => {
      if (text) {
        return (<span>{text.length > 10 ? text.substring(0, 10) + '...' : text}</span>)
      } else {
        return (<span>-</span>)
      }
    }
  }];
  const label = {
    textStyle: {
      fill: '#fff',
    }
  }
  return (
    <div className="houseManage">
      <Row>
        <Col span={12}>
          <div className="ownerType">
            <div className="ownerTitle">
              <div>房屋入住率</div>
              <div className="ownerNum">已入住户数{house_rate.already_enter}</div>
            </div>
            <Pie data={house_rate} />
          </div>
        </Col>
        <Col span={12}>
          <div className="ownerType">
            <div className="ownerTitle">
              <div>租期截止概览</div>
            </div>
            <Chart height={335} data={lease_deadline} forceFit style={{marginTop: '20px'}}>
              <Axis name="st_type_name" label={label} />
              <Axis name="number" label={label} />
              <Tooltip showTitle={false}
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'/>
              <Geom
                type="interval"
                position="st_type_name*number"
                color="#7B68EE"
                tooltip={['st_type_name*num', (item, num) => {
                  return {
                    name: item,
                    value: num
                  };
                }]}
                shape="waterfall"
              />
            </Chart>
          </div>
        </Col>

      </Row>
      <Row>
        <Col span={10}>
          <div className="ownerType">
            <div className="ownerTitle">
              <div>房屋用途概览</div>
            </div>
            <div className="bigDiv">
              <div style={{float:'left',width: '65%',background:'#3F3FA9',height:'148px',textAlign:'center',lineHeight:'150px'}}>
                自住({room_purpose.zz}%)
              </div>
              <div style={{float:'left',width: '35%',background:'#C044CC',height:'148px',textAlign:'center',lineHeight:'150px'}}>闲置({room_purpose.sz}%)</div>
              <div style={{float:'left',width: '65%',background:'#7439CA',height:'148px',textAlign:'center',lineHeight:'150px'}}>出租({room_purpose.cs}%)</div>
              <div style={{float:'left',width: '35%',background:'#EC7837',height:'148px',textAlign:'center',lineHeight:'150px'}}>其他({room_purpose.qt}%)</div>
            </div>
          </div>
        </Col>
        <Col span={14}>
          <div className="ownerType">
            <div className="ownerTitle">
              <div>房屋用途变化</div>
            </div>
            <Chart height={290} data={room_change} forceFit style={{marginTop: '20px'}}>
              <Axis name="st_month" label={label}/>
              <Axis name="number" label={label}/>
              <Legend textStyle={{
                fill: '#fff', // 文本的颜色
              }}/>
              <Tooltip crosshairs={{ type: "y" }} />
              <Geom type="interval" position="st_month*number" color={'label_name'} adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
            </Chart>
          </div>
        </Col>
      </Row>
      <Card className="section">
        <Form>
          <Row>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={6}>
              <FormItem label="物业类型：" {...formItemLayout}>
                {getFieldDecorator('property_type')(
                  <Select placeholder="请选择物业类型">
                    <Option value="">全部</Option>
                    <Option value="1">住宅</Option>
                    <Option value="2">商用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="房屋状态：" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择房屋状态">
                    <Option value="">全部</Option>
                    <Option value="1">已售</Option>
                    <Option value="2">未售</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="楼道号:" {...formItemLayout}>
                {getFieldDecorator('floor_shared_id')(
                  <Select className="select-150 mr-5"
                    optionFilterProp="children"
                    showSearch
                    placeholder="请选择楼道号"
                    onChange={handleFloorListChange.bind(this, "1")}
                  >
                    <Option value="">全部</Option>
                    {floorList ? floorList.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="电梯编号:" {...formItemLayout}>
                {getFieldDecorator('lift_shared_id')(
                  <Select className="select-150 mr-5"
                    optionFilterProp="children"
                    showSearch
                    placeholder="请选择电梯编号"
                    onChange={handleFloorListChange.bind(this, "2")}
                  >
                    <Option value="">全部</Option>
                    {liftList ? liftList.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="房屋标签：" {...formItemLayout}>
                {getFieldDecorator('room_label_id')(
                  <Select
                    optionFilterProp="children"
                    showSearch
                    mode="multiple"
                    placeholder="请选择房屋标签"
                  >
                    {labelType ? labelType.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={4} offset={20}>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Table
          dataSource={list}
          onChange={tableChanges.bind(this)}
          columns={columns}
          loading={loading}
          rowKey={record => record.id}
          pagination={pagination}
          style={{ marginTop: "10px" }}
        />
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.houseManageModel,
  };
}
export default connect(mapStateToProps)(Form.create()(HouseManage));
