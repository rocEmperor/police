import HomePageService from './../../services/HomelandService';
const { peopleList,policeList,activityList } = HomePageService;
import { format } from '../../utils/util';
export default {
  namespace: 'HomelandModel',
  state: {
    dataSource:[],
    dataSource1:[],
    policeList:[],
    month:'',
    totals1:'',
    totals:'',
    params:{
      label_id:'',
      page:1,
      rows:20
    },
    params1:{
      page:1,
      rows:20
    }
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      let date=new Date;
      yield put({ type: 'concat', payload: {
        params:{
          label_id:'',
          page:1,
          rows:20
        },
        params1:{
          page:1,
          rows:20
        }
      }});
      yield put({ type: 'getPeopleList', payload: {
        label_id:'',
        page:1,
        rows:20
      }});
      yield put({ type: 'activityList', payload: {page:1,rows:20}});
      yield put({ type: 'policeList', payload: {select_date:format(date,'yyyyMM')}});
    },
    *getPeopleList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.HomelandModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(peopleList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            dataSource: data?data.list:[],
            totals: data.totals,
            params: newParams
          }
        });
      }
    },
    *activityList({ payload }, { call, put,select }) {
      const params1 = yield select(state=>state.HomelandModel.params1);
      const newParams = Object.assign(params1, payload);
      const { data,code } = yield call(activityList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            dataSource1: data?data.list:[],
            totals1: data.totals,
            params1: newParams
          }
        });
      }
    },
    *policeList({ payload }, { call, put }) {
      const { data,code } = yield call(policeList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            policeList: data?data.list:[],
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/homeland') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
