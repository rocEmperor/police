import SearchResultService from './../../services/SearchResultService';
import queryString from 'query-string';
const { residentReq, searchListReq } = SearchResultService;

export default {
  namespace: 'SearchResultModel',
  state: {
    lists: {},
    visibleMap: false,
    previewVisible: false,
    previewImage: '',
    infoList: {},
    mapCar: [],
    mapFace: [],
    mapMac: [],
    mapOpendoor: [],
    currentMapList: [],
    activeMenu: '',
    heightList: {
      baseInfoHeight: 0,
      carsHeight: 0,
      inAndOutHeight: 0,
      MACHeight: 0,
      faceHeight: 0,
    },
    ajaxCount: 0
  },
  reducers: {
    concat(state,{ payload }){
      return {...state,...payload}
    }
  },
  effects:{
    *init({ payload }, { call, put, select }){
      let memberId = payload.id;
      yield put(({
        type: 'concat',
        payload: {
          lists: {},
          visibleMap: false,
          previewVisible: false,
          previewImage: '',
          infoList: {},
          mapCar: [],
          mapFace: [],
          mapMac: [],
          mapOpendoor: [],
          currentMapList: [],
          activeMenu: '',
          heightList: {
            baseInfoHeight: 0,
            carsHeight: 0,
            inAndOutHeight: 0,
            MACHeight: 0,
            faceHeight: 0,
          },
          ajaxCount: 0
        }
      }));
      // '38345'
      yield put({
        type: 'searchList',
        payload: { member_id: memberId }
      });
      yield put({
        type: 'resident',
        payload: { member_id: memberId }
      })
    },
    *searchList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code, data } = yield call(searchListReq, payload);
      if (code == 20000) {
        let mapCar = [];
        let mapFace = [];
        let mapMac = [];
        let mapOpendoor = [];
        // 取四个列表里面的地图经纬度
        data.car && data.car.forEach((val ,index) => {
          if (val.map) {
            mapCar.push(val.map);
          }
        });
        data.face && data.face.forEach((val ,index) => {
          if (val.map) {
            mapFace.push(val.map);
          }
        });
        data.mac && data.mac.forEach((val ,index) => {
          if (val.map) {
            mapMac.push(val.map);
          }
        });
        data.opendoor && data.opendoor.forEach((val ,index) => {
          if (val.map) {
            mapOpendoor.push(val.map);
          }
        });
        let SearchResultModel = yield select(state => state.SearchResultModel);
        yield put({
          type: 'concat',
          payload: {
            lists: data,
            mapCar: mapCar,
            mapFace: mapFace,
            mapMac: mapMac,
            mapOpendoor: mapOpendoor,
            ajaxCount: SearchResultModel.ajaxCount + 1
          }
        });
      }
    },
    *resident ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code, data } = yield call(residentReq, payload);
      if (code == 20000) {
        let SearchResultModel = yield select(state => state.SearchResultModel);
        yield put({
          type: 'concat',
          payload: {
            infoList: data,
            ajaxCount: SearchResultModel.ajaxCount + 1
          }
        });
      }
    }
  },
  subscriptions: {
    setup({dispatch,history}){
      return history.listen(({ pathname, search })=>{
        let query = queryString.parse(search);
        if(pathname === '/searchResult'){
          dispatch({type: 'init', payload: query})
        }
      })
    }
  }
}
