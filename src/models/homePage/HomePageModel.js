import HomePageService from './../../services/HomePageService';
const { searchReq, infoListReq } = HomePageService;

export default {
  namespace: 'HomePageModel',
  state: {
    pepole_proportion: [],
    device_proportion: [],
    traffic: [],
    visibleMap: false,
    searchList: [],
    searchValue: '',
    info: {},
    loading: false
  },
  reducers: {
    concat(state,{ payload }){
      return {...state,...payload}
    }
  },
  effects:{
    *init({ payload }, { call, put, select }){
      // 初始化
      yield put({
        type: 'concat',
        payload: {
          pepole_proportion: [],
          device_proportion: [],
          traffic: [],
          visibleMap: false,
          searchList: [],
          searchValue: '',
          info: {},
          loading: false
        }
      })
      yield put({
        type: 'infoList',
        payload: {}
      });
    },
    *search ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code, data } = yield call(searchReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { searchList: data }
        });
        callback && callback(data);
      }
    },
    *infoList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(infoListReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            traffic: data.traffic,
            pepole_proportion: data.pepole_proportion,
            device_proportion: data.device_proportion,
            info: data
          }
        })
      }
    },
    *socketUpdate ({ payload }, { call, put, select }) {
      let { data, eventType } = payload;
      let HomePageModel = yield select(state => state.HomePageModel);
      let { info, pepole_proportion } = HomePageModel;
      switch(eventType) {
        case 'RESIDENT':
          info.device_total = `${parseInt(info.device_total) + 1}`;
          pepole_proportion.forEach((val, index) => {
            if (val.type === data.identity_type) {
              pepole_proportion[index].count = pepole_proportion[index].count + 1;
            }
          });
          yield put({type: 'concat', payload: {info: { ...info }, pepole_proportion: pepole_proportion}});
          break;
        case 'DOOR':
          info.device_total = `${parseInt(info.device_total) + 1}`;
          info.flux_pepole = `${parseInt(info.flux_pepole) + 1}`;
          yield put({type: 'concat', payload: {info: { ...info }}});
          break;
        case 'CAR':
          info.device_total = `${parseInt(info.device_total) + 1}`;
          info.flux_car = `${parseInt(info.flux_car) + 1}`;
          yield put({type: 'concat', payload: {info: { ...info }}});
          break;
        case 'MAC':
          info.device_total = `${parseInt(info.device_total) + 1}`;
          info.device_mac = `${parseInt(info.device_mac) + 1}`;
          info.mac = `${parseInt(info.mac) + 1}`;
          yield put({type: 'concat', payload: {info: { ...info }}});
          break;
        case 'ELECTROMOBILE':
          info.device_total = `${parseInt(info.device_total) + 1}`;
          yield put({type: 'concat', payload: {info: { ...info }}});
          break;
      }
    }
  },
  subscriptions: {
    setup({dispatch,history}){
      return history.listen(({ pathname, search })=>{
        if(pathname === '/homePage'){
          dispatch({type: 'init'})
        }
      })
    }
  }
}
