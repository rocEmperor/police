import SearchTerraceService from './../../services/SearchTerraceService';
const { searchReq, photosListReq } = SearchTerraceService;
export default {
  namespace: 'SearchTerraceModel',
  state: {
    photoList: [],
    searchList: [],
    searchValue: '',
    loading: false
  },
  reducers: {
    concat(state,{ payload }){
      return {...state,...payload}
    }
  },
  effects:{
    *init ({ payload }, { call, put, select }) {
      // 初始化
      yield put({
        type: 'concat',
        payload: {
          photoList: [],
          searchList: [],
          searchValue: '',
          loading: false
        }
      });
      yield put({
        type: 'photoList',
        payload: { data: '' }
      })
    },
    *search ({ payload, callback }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { code, data } = yield call(searchReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { searchList: data.length ? data : [{member_id: 0, name: '未查找到匹配项'}] }
        });
        callback && callback(data);
      }
    },
    *photoList ({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(photosListReq, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            photoList: data
          }
        })
      }
    },
    *socketUpdate ({ payload }, { call, put, select }) {
      let data = payload.data;
      let SearchTerraceModel = yield select(state => state.SearchTerraceModel);
      let { photoList } = SearchTerraceModel;
      photoList.unshift(data);
      yield put({
        type: 'concat',
        payload: {
          photoList: photoList
        }
      })
    }
  },
  subscriptions: {
    setup({dispatch,history}){
      return history.listen(({ pathname, search })=>{
        if(pathname === '/searchTerrace'){
          dispatch({type: 'init'})
        }
      })
    }
  }
}
