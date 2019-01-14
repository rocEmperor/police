import HomePageService from './../../services/HomePageService';
const { loginOut, communityNewList } = HomePageService;
import { message } from 'antd';
export default {
  namespace: 'MainLayoutModel',
  state: {
    menuList: [
      {key: '1', route: 'homePage', title: '智安小区', children: []},
      {key: '2', route: 'homeland', title: '家园+', children: []},
      {key: '3', route: 'searchTerrace', title: '大数据分析', children: []},
      {key: '4', route: 'communityCloud', title: '云图', children: []},
      {key: '5', route: 'realTimeMonitoring', title: '视频监控', children: []},
      {key: '6', route: 'alarmCentre', title: '告警信息', children: []},
      {key: '7', route: 'fireSystem', title: '消防系统', children: []},
      {key: '8', route: 'flowPopulation', title: '流动人口', children: []},
      {key: '9', route: '', title: '物业管理', children: [
        {key: '9-1', route: 'humanWayBrake', title: '人行道闸'},
        {key: '9-3', route: 'houseManage', title: '房屋信息'},
        {key: '9-2', route: 'shutdownTemperature', title: '停车系统'},
        {key: '9-4', route: 'flowPopulation', title: '常住人口'},
      ]}
    ],
    selectedKeys: [],
    community:[],
    community_id: localStorage.getItem("COMMUNITY_ID")!==undefined ? localStorage.getItem("COMMUNITY_ID") : undefined,
    flagChangeCommunity:true,
    mateWebSocketList: {
      CAPTURE: [{route: 'SearchTerrace', dispatchType: 'socketUpdate'}],
      RESIDENT: [{route: 'HomePage', dispatchType: 'socketUpdate'}, {route: 'CommunityCloud', dispatchType: 'socketUpdate'}],
      DOOR: [{route: 'HomePage', dispatchType: 'socketUpdate'}, {route: 'CommunityCloud', dispatchType: 'socketUpdate'}],
      CAR: [{route: 'HomePage', dispatchType: 'socketUpdate'}, {route: 'CommunityCloud', dispatchType: 'socketUpdate'}],
      MAC: [{route: 'HomePage', dispatchType: 'socketUpdate'}, {route: 'CommunityCloud', dispatchType: 'socketUpdate'}],
      ELECTROMOBILE: [{route: 'HomePage', dispatchType: 'socketUpdate'}, {route: 'CommunityCloud', dispatchType: 'socketUpdate'}],
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      
      let { pathname } = payload;
      // 不同路由页面，各自的头部导航有区别
      let menuList = [];
      let selectedKeys = [];
      let flagChangeCommunity = false;
      if (pathname === '/homePage' || pathname === '/homeland' || pathname === '/communityPictures'){
        menuList = [
          {key: '1', route: 'homePage', title: '智安小区', children: []},
          {key: '2', route: 'homeland', title: '家园+', children: []},
          {key: '3', route: 'searchTerrace', title: '大数据分析', children: []},
          { key: '4', route: 'communityPictures', title: '小区聚合', children: [] }
        ]
        flagChangeCommunity = true;
      } else if (pathname === '/searchTerrace' || pathname === '/searchResult') {
        menuList = [{key: '1', route: 'homePage', title: '智安小区', children: []}];
        flagChangeCommunity = true;
      } else {
        menuList = [
          {key: '1', route: 'homePage', title: '智安小区', children: []},
          {key: '4', route: 'communityCloud', title: '云图', children: []},
          {key: '5', route: 'realTimeMonitoring', title: '视频监控', children: []},
          {key: '6', route: 'alarmCentre', title: '告警信息', children: []},
          {key: '7', route: 'fireSystem', title: '消防系统', children: []},
          {key: '8', route: 'flowPopulation', title: '流动人口', children: []},
          {key: '9', route: '', title: '物业管理', children: [
            {key: '9-1', route: 'humanWayBrake', title: '人行道闸'},
            {key: '9-3', route: 'houseManage', title: '房屋信息'},
            {key: '9-2', route: 'shutdownTemperature', title: '停车系统'},
            {key: '9-4', route: 'residentPopulation', title: '常住人口'},
          ]}
        ];
        flagChangeCommunity = true;
      }
      // 将当前路由与头部导航进行匹配
      menuList.forEach((val, index) => {
        if (`/${val.route}` === pathname) {
          selectedKeys.push(val.key)
        }
        if (val.children.length > 0) {
          val.children.forEach((valC) => {
            if (`/${valC.route}` === pathname) {
              selectedKeys.push(valC.key)
            }
          })
        }
      });
      yield put({
        type: 'concat',
        payload: { 
          menuList: [...menuList], 
          selectedKeys: selectedKeys, 
          flagChangeCommunity: flagChangeCommunity,
          community_id: localStorage.getItem("COMMUNITY_ID") !== undefined ? localStorage.getItem("COMMUNITY_ID") : undefined,
        }
      })
      yield put({
        type: 'communityNewList',
        payload: { name:'' }
      })
    },
    *loginOut({ payload }, { call, put }) {
      const {code} = yield call(loginOut, payload);
      if(code == 20000){
        message.success('退出成功！');
        setTimeout(() => {
          location.href = "#/";
        },2000)
      }
    },
    *communityNewList({ payload }, { call, put }) {
      const { data, code } = yield call(communityNewList, payload);
      let arr = [];
      data&&data.length>0?data.map((item, index)=>{
        let obj = {
          city_id: item.city_id,
          city_name: item.city_name,
          community_id: item.community_id,
          community_name: (index+1)+item.community_name
        }
        arr.push(obj);
      }):''

      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { community: arr }
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        dispatch({
          type: 'init',
          payload: { pathname: pathname }
        });
        if (pathname === '/homePage') {
          if (localStorage.getItem("COMMUNITY_ID") != undefined) {
            localStorage.removeItem("COMMUNITY_ID");
            localStorage.removeItem("CITY_ID");
            dispatch({
              type: 'concat',
              payload: {
                community_id: undefined,
                community:[]
              }
            });
          }
        }
      });
    }
  },
};
