
import PropertyManagementService from '../../../services/PropertyManagementService.js';
const { carProfile, carDevice } = PropertyManagementService;
export default {
  namespace: 'ShutdownTemperatureModel',
  state: {
    flag: 1,
    inCar: "",
    out: "",
    remain: "",
    visitors: "",
    chartData:[]
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put }) {
      yield put({
        type:'concat',
        payload:{
          flag:1,
        }
      })
      yield put({
        type: 'carProfile', payload: {
        }
      });
      yield put({
        type: 'carDevice', payload: {
          type: 1,
        }
      });
    },
    *carProfile({ payload }, { call, put }) {
      const { data, code } = yield call(carProfile, payload);

      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            inCar: data.in,
            out: data.out,
            remain: data.remain,
            visitors: data.visitors
          }
        });
      }
    },
    *carDevice({ payload }, { call, put }) {
      const { data, code } = yield call(carDevice, payload);

      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            chartData: data?data.data:[],
          }
        });
      }
    },


  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/shutdownTemperature') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
}
