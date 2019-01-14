import PropertyManagementService from '../../../services/PropertyManagementService.js';
const {carList,carCommon} = PropertyManagementService;
import queryString from 'query-string';
export default {
  namespace: 'ShutdownDetailModel',
  state:{
    list:[],
    car_type:[],
    totals:'',
    params:{
      page:1,
      rows:10,
      car_num:'',
      car_type:'',
      start_time:'',
      end_time:'',
      amount_min:'',
      amount_max:'',
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put }) {
      yield put({ type: 'carCommon', payload: {}});
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.ShutdownDetailModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(carList, payload);
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
    *carCommon({ payload }, { call, put }) {
      const { data,code } = yield call(carCommon, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            car_type: data?data.car_type:[],
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/shutdownDetail') {
          let query = queryString.parse(search);
          const params={
            page:1,
            rows:10,
            car_num:query?query.car_num:'',
            car_type:'',
            start_time:'',
            end_time:'',
            amount_min:'',
            amount_max:'',
          }
          dispatch({ type: 'getList', payload: params});
          dispatch({ type: 'init' });
        }
      });
    }
  },
}
