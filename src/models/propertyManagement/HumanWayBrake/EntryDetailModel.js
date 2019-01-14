import PropertyManagementService from '../../../services/PropertyManagementService.js';
const {peopleList,peopleCommon} = PropertyManagementService;
import queryString from 'query-string';
export default {
  namespace: 'EntryDetailModel',
  state:{
    list:[],
    totals:'',
    open_type:[],
    userType:[],
    params:{
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
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put }) {
      yield put({ type: 'peopleCommon', payload: { }});
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.EntryDetailModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(peopleList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.count,
            params: newParams
          }
        });
      }
    },
    *peopleCommon({ payload }, { call, put }) {
      const { data,code } = yield call(peopleCommon, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            open_type: data?data.open_type:[],
            userType: data.user_type,
          }
        });
      }
    },
   
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/entryDetail') {
          let query = queryString.parse(search);
          const params={
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
          dispatch({ type: 'getList', payload: params});
          dispatch({ type: 'init' });
        }
      });
    }
  },
}
