import React from 'react';
import { connect } from 'dva';
import { Form, Col, Row, Card, Button, Table, Select, Input, Progress } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import Community from '../../components/Community/Community.js';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, Guide, Facet } from 'bizcharts';
import { noData } from '../../utils/util';
import './Index.less';

function FlowPopulation(props) {
  let { dispatch, form, totals, params, total, param, routeType, population_percent, normal_percent, loading, is_reset, labelType, list, age, enter_type, age_gender, flow_change, area_list } = props;

  const { getFieldDecorator } = form;
  const {Text}= Guide;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'FlowPopulationModel/concat',
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
      type: 'FlowPopulationModel/getList',
      payload: params,
    });
  }
  // 查询籍贯列表数据
  function nativeList(param) {
    dispatch({
      type: 'FlowPopulationModel/nativeList',
      payload: param,
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
      param.type = params.type;
      reload(param);
    });
    dispatch({
      type: 'FlowPopulationModel/concat',
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
        name: "",
        status: "",
        user_label_id: "",
        type: routeType
      };
      reload(param);
    });
    dispatch({
      type: 'FlowPopulationModel/concat',
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
  /**
   * 切换页码
   * @param  {Number} page
   */
  function handlePaginationChange(page, size) {
    const param = { ...params, page };
    reload(param);
  }
  function handlePaginationChange1(page, size) {
    const params = { ...param, page };
    nativeList(params);
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
  // 籍贯分页配置
  // 表格分页配置
  const pagination1 = {
    current: param.page,
    total: parseInt(total),
    showTotal: total => `共${total}条`,
    onChange: handlePaginationChange1,
    defaultCurrent: 1,
  };
  // 表格列配置
  const columns1 = [{
    title: '籍贯',
    dataIndex: 'city_name',
    key: 'city_name',
    width: '30%',
    render: (text, record) => {
      if (record.province_name != '其他') {
        return (<span>{record.province_name + record.city_name}</span>)
      } else {
        return (<span>{record.city_name}</span>)
      }
    },
  }, {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
    width: '20%'
  }, {
    title: '占比',
    dataIndex: 'percent',
    key: 'percent',
    width: '35%',
    render: (text, record) => {
      return (
        <div>
          <Progress percent={record.percent} size="small" />
        </div>
      )
    }
  }];
  // 表格列配置
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: noData,
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
    render: noData,
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render: (text, record) => {
      if (text == '1') {
        return (<span>男</span>)
      } else if (text == '2') {
        return (<span>女</span>)
      } else {
        return (<span>未知</span>)
      }
    },
  }, {
    title: '身份证号',
    dataIndex: 'card_no',
    key: 'card_no',
    render: noData,
  }, {
    title: '对应房屋',
    dataIndex: 'group',
    key: 'group',
    render: (text, record) => {
      return (<span>{record.group + record.building + record.unit + record.room}</span>)
    },
  }, {
    title: '身份',
    dataIndex: 'identity_type_desc',
    key: 'identity_type_desc',
    render: noData,
  }, {
    title: '有效期',
    dataIndex: 'time_end',
    key: 'time_end',
    render: (text, record) => {
      if (record.time_end == '0') {
        return <span>长期</span>
      } else {
        return <span>{record.time_end}</span>
      }
    }
  }, {
    title: '认证状态',
    dataIndex: 'status_desc',
    key: 'status_desc'
  }, {
    title: '认证时间',
    dataIndex: 'auth_time',
    key: 'auth_time',
    render: noData,
  }, {
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      let linkView = `/residentsViewOne?id=${record.id}`;
      return (
        <span>
          <Link to={linkView} className="table-operating mr1">查看</Link>
        </span>
      )
    },
  }];
  const label = {
    textStyle: {
      fill: '#fff',
    }
  }
  return (
    <div className="flowPopulation">
      <Row>
        <Col span={7}>
          <div className="ownerType">
            <div className="ownerTitle">
              <div>住户类型</div>
            </div>
            {
              enter_type.length != 0 ?
                <Chart height={400} data={enter_type} padding={[80, 100, 80, 80]} forceFit>
                  <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
                  <Legend textStyle={{
                    fill: '#fff', // 文本的颜色
                  }} />
                  <Tooltip
                    showTitle={false}
                    itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                  />
                  <Guide>
                    <Text position={['50%', '50%']} content={`常住:${normal_percent}%`} style={{
                      lineHeight: '240px',
                      fontSize: '14',
                      fill: '#fff',
                      textAlign: 'center'
                    }} />
                  </Guide>
                  <Geom
                    type="intervalStack"
                    position="percent"
                    color="is_fluid"
                    tooltip={['is_fluid*percent', (item, percent) => {
                      percent = percent + '%';
                      return {
                        name: item,
                        value: percent
                      };
                    }]}
                  >
                    <Label content="percent" formatter={(val, item) => {
                      return item.point.is_fluid + ': ' + val + '%';
                    }} textStyle={{
                      fill: '#fff', // 文本的颜色
                    }} />
                  </Geom>
                </Chart> : <div className="charts">暂无数据</div>
            }

          </div>
        </Col>
        <Col span={7}>
          <div className="ownerType">
            <div className="ownerTitle">
              <div>小区{routeType == 2 ? '常住' : '流动'}人口男女比例</div>
            </div>
            <Chart height={400} data={age} padding={[80, 100, 80, 80]} forceFit>
              <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
              <Axis name="percent" />
              <Legend textStyle={{
                fill: '#fff', // 文本的颜色
              }} />
              <Tooltip
                showTitle={false}
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
              />
              <Guide>
                <Text position={['50%', '50%']} content={`男:${population_percent}%`} style={{
                  lineHeight: '240px',
                  fontSize: '14',
                  fill: '#fff',
                  textAlign: 'center'
                }} />
              </Guide>
              <Geom
                type="intervalStack"
                position="percent"
                color="sex"
                tooltip={['sex*percent', (item, percent) => {
                  percent = percent + '%';
                  return {
                    name: item,
                    value: percent
                  };
                }]}
              >
                <Label content="percent" formatter={(val, item) => {
                  return item.point.sex + ': ' + val + '%';
                }} textStyle={{
                  fill: '#fff', // 文本的颜色
                }} />
              </Geom>
            </Chart>
          </div>
        </Col>
        <Col span={10}>
          <div className="ownerType">
            <div className="ownerTitle">
              <div>{routeType == 2 ? '常住' : '流动'}人口年龄段性别分布</div>
            </div>
            <Chart height={400} data={age_gender} scale={{
              sex: {
                sync: true
              },
              y: {
                sync: true,
                tickCount: 5
              },
            }} renderer="svg" style={{ marginLeft: '10%' }}>
              <Tooltip />
              <Facet type="mirror" fields={['sex']} padding={[30, 90, 0, 0]} transpose={true} eachView={(view, facet) => {
                view.interval().position('age*y')
                  .color('sex', ['rgb(113,192,235)', 'rgb(246,170,203)']);
              }} colTitle={{
                offsetY: -20,
                style: {
                  fontSize: 14,
                  textAlign: 'center',
                  fill: '#fff'
                }
              }}>
              </Facet>
            </Chart>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <div className="ownerType changeLine">
            <div className="ownerTitle">
              <div>常住-流动人口变化曲线</div>
            </div>
            <Chart height={400} data={flow_change} forceFit>
              <Legend textStyle={{
                fill: '#fff', // 文本的颜色
              }} />
              <Axis name="time" label={label} />
              <Axis name="y" label={label} />
              <Tooltip crosshairs={{ type: "y" }} />
              <Geom type="line" position="time*y" size={2} color={'type'} shape={'smooth'} />
              <Geom type="point" position="time*y" size={4} shape={'circle'} color={'type'} style={{ stroke: '#fff', lineWidth: 1 }} />
            </Chart>
          </div>
        </Col>
        <Col span={14} className="smallTable">
          <Card style={{ marginTop: '22px', height: 372 }}>
            <h3>{routeType == 2 ? '常住' : '流动'}人口籍贯分布</h3>
            <Table
              dataSource={area_list}
              columns={columns1}
              loading={loading}
              size="small"
              bordered={false}
              rowKey={record => record.id}
              scroll={{ y: 290 }}
              pagination={pagination1}
            />
          </Card>
        </Col>
      </Row>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="住 户" {...formItemLayout}>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入姓名/手机号码"/>
                )}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={6}>
              <FormItem label="认证状态" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select className="select-100 mr-5" placeholder="请选择认证状态">
                    <Option value="">全部</Option>
                    <Option value="1">未认证</Option>
                    <Option value="2">已认证</Option>
                    {/*<Option value="3">已失效</Option>*/}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="住户标签：" {...formItemLayout}>
                {getFieldDecorator('user_label_id')(
                  <Select
                    optionFilterProp="children"
                    showSearch
                    mode="multiple"
                    placeholder="请选择住户标签"
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
    ...state.FlowPopulationModel,
  };
}
export default connect(mapStateToProps)(Form.create()(FlowPopulation));
