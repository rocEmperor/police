import React from 'react';
import { Table, Button, Modal, Anchor, Tooltip } from 'antd';
import { connect } from 'dva';
import Map from '../../components/Map/Map';
import './SearchResult.less';
let gapValue = 18;

const { Link } = Anchor;
let topCount = -1;
let bottomCount = -1;
class SearchResult extends React.Component {
  constructor (props) {
    super(props);
  }
  componentWillMount () {
    topCount = -1;
    bottomCount = -1;
  }
  componentDidMount () {
    // 在切换路由的时候dragscroll之前绑定的拖动效果已经消失，
    // dragscroll.reset()方法用于更新元素，重新绑定滑动效果。
    window.dragscroll.reset();
  }
  /*
  * 计算标签高度工具函数
  * */
  countHeight (id) {
    return document.getElementById(id).offsetHeight;
  }
  /*
  * 监听浏览器滚动，左上角锚点同步变化 (功能暂未实现， 代码备用)
  * */
  scrollListen (_th) {
    let baseInfoHeight = this.countHeight('baseInfo');
    let carsHeight = this.countHeight('cars');
    let inAndOutHeight = this.countHeight('inAndOut');
    let MACHeight = this.countHeight('MAC');
    let faceHeight = this.countHeight('face');
    let shutOne = carsHeight + baseInfoHeight;
    let shutTwo = carsHeight + baseInfoHeight + inAndOutHeight;
    let shutThree = carsHeight + baseInfoHeight + inAndOutHeight + MACHeight;
    let shutFour = carsHeight + baseInfoHeight + inAndOutHeight + MACHeight + faceHeight;
    window.addEventListener('scroll', () => {
      let { dispatch } = _th.props;
      let documentTop = document.documentElement.scrollTop;
      if (0 < documentTop && documentTop < baseInfoHeight) {
        dispatch({
          type: 'SearchResultModel/concat',
          payload: {
            activeMenu: 'baseInfo'
          }
        });
      } else if (baseInfoHeight < documentTop && documentTop < shutOne) {
        dispatch({
          type: 'SearchResultModel/concat',
          payload: {
            activeMenu: 'cars'
          }
        });
      } else if (shutOne < documentTop && documentTop < shutTwo) {
        dispatch({
          type: 'SearchResultModel/concat',
          payload: {
            activeMenu: 'inAndOut'
          }
        });
      } else if (shutTwo < documentTop && documentTop < shutThree) {
        dispatch({
          type: 'SearchResultModel/concat',
          payload: {
            activeMenu: 'MAC'
          }
        });
      } else if (shutThree < documentTop && documentTop < shutFour) {
        dispatch({
          type: 'SearchResultModel/concat',
          payload: {
            activeMenu: 'face'
          }
        });
      }
    })
  }
  // componentWillReceiveProps (nextProps) {
  //   let { SearchResultModel, dispatch } = nextProps;
  //   let { ajaxCount } = SearchResultModel;
  //   if (ajaxCount == 2) {
  //     let _th = this;
  //     setTimeout(() => {
  //       this.scrollListen(_th);
  //       dispatch({
  //         type: 'SearchResultModel/concat',
  //         payload: {
  //           ajaxCount: 0
  //         }
  //       })
  //     }, 0);
  //   }
  // }
  componentWillUpdate () {
    topCount = -1;
    bottomCount = -1;
  }
  moreFn (route) {
    window.location.hash = `#${route}`;
  }
  /*
  * 生成不同类型的table表格
  * @params {String} title 表格头部标题
  * @params {Array} data table表格数据源
  * @params {String} id 生成的table最外侧容器id
  * @params {String} route 点击更多跳转到相应路由
  * */
  createTable (title, data, id, route) {
    let nameType = '姓名';
    let nameValue = 'username';
    let search = '';
    let create_at = 'create_at';
    let address = 'location';
    if (title === '车辆信息') {
      nameType = '车牌';
      nameValue = 'car_num';
      search = data && data.length > 0 && data[0].car_num
    } else if (title === 'MAC信息') {
      nameType = 'MAC地址';
      nameValue = 'mac';
    } else if (title === '出入信息') {
      search = data && data.length > 0 && data[0].user_name
      nameValue = 'user_name'
    } else if (title === '人脸信息') {
      create_at = 'created_at';
      address = 'address';
    }
    const columns = [{
      title: '抓拍照片',
      dataIndex: 'pictrue',
      key: 'pictrue',
      render: (text, record) => {
        let src = record.photo;
        if (title === '人脸信息') {
          src = record.img_log;
        }
        return (
          <img
            src={src}
            alt="抓拍图片"
            height={30}
            style={{cursor: 'pointer'}}
            onClick={() => this.showImage(src)}/>
        )
      }
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    }, {
      title: nameType,
      dataIndex: nameValue,
      key: nameValue,
    }, {
      title: '事件',
      dataIndex: 'event',
      key: 'event',
    }, {
      title: '地点',
      dataIndex: address,
      key: address,
    }, {
      title: '时间',
      dataIndex: create_at,
      key: create_at,
    }];
    if (title === 'MAC信息') {
      columns.shift();
    }
    // 给每个table表格添加唯一的key
    data && data.forEach((val, index) => {
      data[index].mineTableKey = index;
    });
    return (
      <div className="table-box" id={id}>
        <div className="table_header_res">
          <span className="til">{title}</span>
          {data && data.length === 0
            ? null
            : <div className="operation-box">
              <Button type="primary" onClick={() => this.showMap(title)} style={{marginRight: 10}}>轨迹</Button>
              {route
                ? <Button type="primary" className="more_btn" onClick={() => this.moreFn(`${route}?search=${search}`)}>
                  更多
                </Button>
                : null}
            </div>}
        </div>
        <Table dataSource={data} columns={columns} pagination={false} rowKey={ record => record.mineTableKey }/>
      </div>
    )
  }
  /*
   * 隐藏地图弹框
   * @params {String} type 不同弹框对应的visible字段
   * */
  handleCancel (type) {
    let { dispatch } = this.props;
    let payload = {};
    payload[type] = false;
    payload.currentMapList = [];
    dispatch({
      type: 'SearchResultModel/concat',
      payload: payload
    })
  }
  /*
  * 显示地图弹框
  * @params {String} title 通过不同title判断当前地图展示数组
  * */
  showMap (title) {
    let { dispatch, SearchResultModel } = this.props;
    const { mapCar, mapFace, mapMac, mapOpendoor } = SearchResultModel;
    if (title === '车辆信息') {
      dispatch({
        type: 'SearchResultModel/concat',
        payload: { currentMapList: [...mapCar] }
      })
    } else if (title === '出入信息') {
      dispatch({
        type: 'SearchResultModel/concat',
        payload: { currentMapList: [...mapOpendoor] }
      })
    } else if (title === 'MAC信息') {
      dispatch({
        type: 'SearchResultModel/concat',
        payload: { currentMapList: [...mapMac] }
      })
    } else if (title === '人脸信息') {
      dispatch({
        type: 'SearchResultModel/concat',
        payload: { currentMapList: [...mapFace] }
      })
    }
    dispatch({
      type: 'SearchResultModel/concat',
      payload: { visibleMap: true }
    })
  }
  /*
  * 显示图片弹框
  * @params {String} src 图片url地址
  * */
  showImage (src) {
    let { dispatch } = this.props;
    dispatch({
      type: 'SearchResultModel/concat',
      payload: {
        previewVisible: true,
        previewImage: src
      }
    })
  }
  /*
  * 锚点
  * @params {String} id 锚点对应的标签id
  * */
  anchor (id) {
    let { dispatch } = this.props;
    dispatch({
      type: 'SearchResultModel/concat',
      payload: {
        activeMenu: id
      }
    });
    document.getElementById(id).scrollIntoView();
    let top = window.$(document).scrollTop();
    window.$(document).scrollTop(top - 84);
  }
  /*
  * 基本信息树状结构，上部分结构
  * */
  createTopInfo (type, value, maxWidth) {
    if (!value) {
      value = ''
    }
    // topCount 记录函数createTopInfo调用次数, 自动计算每条信息的left值
    topCount = topCount + 1;
    return (
      <div className="info info-top" style={{ left: `${topCount * gapValue + 3}rem` }}>
        <div className="line"></div>
        <div className="type">{type}</div>
        <div className={maxWidth ? "value maxWidth" : "value"}>{value}</div>
      </div>
    )
  }
  /*
  * 基本信息树状结构，下部分结构
  * */
  createBottomInfo (type, value, maxWidth) {
    // topCount 记录函数createBottomInfo调用次数, 自动计算每条信息的left值
    if (!value) {
      value = ''
    }
    bottomCount = bottomCount + 1;
    let valueType = <div className={maxWidth ? "value maxWidth" : "value"}>{value}</div>;
    if (type === '人脸照片') {
      let url = `url(${value}) no-repeat`;
      valueType = <div className="value value-pic" style={{background: url, backgroundSize: '100% 100%'}}></div>;
    } else if (type === '标签') {
      valueType = <div className="label-box">
        {value && value.map((val, index) => {
          return (
            <Tooltip title={val.name} overlayClassName="search-label-police" key={index}>
              <div className="value-label">
                {val.name}
              </div>
            </Tooltip>
          )
        })}
      </div>;
    }
    return (
      <div className="info info-bottom" style={{ left: `${bottomCount * gapValue + 11}rem` }}>
        <div className="line"></div>
        <div className="type">{type}</div>
        {valueType}
      </div>
    )
  }
  /*
  * 判断数据是否有效
  * @params {String} val 判断的字段名称
  * */
  dataIsNull (val) {
    return val ? val : ''
  }
  render () {
    const { SearchResultModel } = this.props;
    const { lists, visibleMap, previewVisible, previewImage, infoList, currentMapList } = SearchResultModel;
    const face_url = infoList.face_url ? infoList.face_url : 'images/init-face.png';
    return (
      <div className="search-result">
        <div className="menu">
          <span onClick={() => this.anchor('baseInfo')}>基本信息</span>
          <span onClick={() => this.anchor('cars')}>车辆信息</span>
          <span onClick={() => this.anchor('inAndOut')}>出入信息</span>
          <span onClick={() => this.anchor('MAC')}>MAC信息</span>
          <span onClick={() => this.anchor('face')}>人脸信息</span>
        </div>
        <div className="content">
          <div className="baseInfo" id="baseInfo">
            <div className="baseInfoItem dragscroll">
              <div className="container" style={{width: `${6 + Math.ceil(17 / 2) * gapValue}rem`}}>
                {this.createTopInfo('姓名', infoList.name)}
                {this.createTopInfo('性别', infoList.sex)}
                {this.createTopInfo('电话', infoList.mobile)}
                {this.createTopInfo('身份证号', infoList.card_no)}
                {this.createTopInfo('暂住证号', infoList.residence_number)}
                {this.createTopInfo('民族', infoList.nation)}
                {this.createTopInfo('所在地址', infoList.household_address, true)}
                {this.createTopInfo('工作单位', infoList.work_address, true)}
                {this.createTopInfo('邮箱', infoList.email)}
                {this.createBottomInfo('人脸照片', face_url)}
                {this.createBottomInfo('标签', infoList.labels)}
                {this.createBottomInfo('政治面貌', infoList.face)}
                {this.createBottomInfo('婚姻情况', infoList.marry_status)}
                {this.createBottomInfo('户口类型', infoList.household_type)}
                {this.createBottomInfo('户籍地址', `${this.dataIsNull(infoList.household_province)}${this.dataIsNull(infoList.household_city)}${this.dataIsNull(infoList.household_area)}`, true)}
                {this.createBottomInfo('QQ', infoList.qq)}
                {this.createBottomInfo('微信', infoList.wechat)}
                {this.createBottomInfo('MAC信息', infoList.mac, true)}
              </div>
            </div>
          </div>
          {this.createTable('车辆信息', lists.car, 'cars', 'shutdownDetail')}
          {this.createTable('出入信息', lists.opendoor, 'inAndOut', 'entryDetail')}
          {this.createTable('MAC信息', lists.mac, 'MAC')}
          {this.createTable('人脸信息', lists.face, 'face')}
          <Map
            visible={visibleMap}
            data={currentMapList}
            handleCancel={() => this.handleCancel('visibleMap')}
            type="modal"/>
          <Modal
            visible={previewVisible}
            wrapClassName="search-result-img"
            footer={null}
            onCancel={() => this.handleCancel('previewVisible')}>
            <img alt="img" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    SearchResultModel: state.SearchResultModel
  };
}
export default connect(mapStateToProps)(SearchResult);
