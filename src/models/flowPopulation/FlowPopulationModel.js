import FlowPopulationService from './../../services/FlowPopulationService';
const { residentList, labelType, graphData, nativeList } = FlowPopulationService;
import queryString from 'query-string';

export default {
  namespace: 'FlowPopulationModel',
  state: {
    list: [],
    age: [],
    enter_type: [],
    labelType: [],
    age_gender: [],
    flow_change: [],
    params: {
      page: 1,
      rows: 10,
      community_id: localStorage.getItem("COMMUNITY_ID"),
      group: "",
      building: "",
      unit: "",
      room: "",
      name: "",
      status: "",
      user_label_id: "",
      type: "1"
    },
    area_list: [],
    routeType: "1",
    param:{
      page: 1,
      rows: 10,
      community_id: localStorage.getItem("COMMUNITY_ID"),
      type:"1"
    },
    normal_percent:"",
    population_percent:"",
    totals:"",
    total:""
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const { query } = payload;
      if (query.type == 2) {
        yield put({
          type: 'getList', payload: {
            page: 1,
            rows: 10,
            type: 2,
            community_id: localStorage.getItem("COMMUNITY_ID"),
            group: "",
            building: "",
            unit: "",
            room: "",
            status: "",
            user_label_id: "",
            name: "",
          }
        });
        yield put({
          type: 'nativeList', payload: {
            type: 2,
            community_id: localStorage.getItem("COMMUNITY_ID"),
            page: 1,
            rows: 10
          }
        });
        yield put({
          type: 'graphData', payload: {
            type: 2,
            community_id: localStorage.getItem("COMMUNITY_ID"),
          }
        });
      } else {
        yield put({
          type: 'getList', payload: {
            page: 1,
            rows: 10,
            type: 1,
            community_id: localStorage.getItem("COMMUNITY_ID"),
            group: "",
            building: "",
            unit: "",
            room: "",
            status: "",
            user_label_id: "",
            name: "",
          }
        });
        yield put({
          type: 'nativeList', payload: {
            type: 1,
            community_id: localStorage.getItem("COMMUNITY_ID"),
            page: 1,
            rows: 10
          }
        });
        yield put({
          type: 'graphData', payload: {
            type: 1,
            community_id: localStorage.getItem("COMMUNITY_ID"),
          }
        });
      }

      yield put({
        type: 'concat',
        payload: {
          is_reset: true,
          routeType: query.type,
          params: {
            page: 1,
            rows: 10,
            community_id: localStorage.getItem("COMMUNITY_ID"),
            group: "",
            building: "",
            unit: "",
            room: "",
            status: "",
            user_label_id: "",
            type: query.type,
            name: "",
          },
          param: {
            page: 1,
            rows: 10,
            community_id: localStorage.getItem("COMMUNITY_ID"),
            type: query.type?query.type:"1"
          }
        }
      });
      yield put({
        type: 'labelType', payload: {
          label_type: 2,
          community_id: localStorage.getItem("COMMUNITY_ID"),
        }
      });
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state => state.FlowPopulationModel.params);
      const newParams = Object.assign(params, payload);
      yield put({ type: 'concat', payload: { loading: true } });
      const { data, code } = yield call(residentList, payload);
      const listType = yield select(state => state.FlowPopulationModel);
      if (code == 20000) {
        if (listType.routeType === '2') {
          yield put({
            type: 'concat',
            payload: {
              list: data ? data.list : [],
              totals: data.totals,
              all_area: data.all_area,
              params: newParams,
              loading: false
            }
          });
        } else {
          yield put({
            type: 'concat',
            payload: {
              list: data ? data.list : [],
              totals: data.totals,
              all_area: data.all_area,
              params: newParams,
              loading: false
            }
          });
        }
      }
    },
    *labelType({ payload }, { call, put, select }) {
      const params = yield select(state => state.FlowPopulationModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(labelType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            labelType: data ? data.list : [],
            params: newParams,
          }
        });
      }
    },
    *nativeList({ payload }, { call, put, select }) {
      const params = yield select(state => state.FlowPopulationModel.param);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(nativeList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            area_list: data ? data.list : [],
            param: newParams,
            total: data.totals
          }
        });
      }
    },
    *graphData({ payload }, { call, put, select }) {
      const params = yield select(state => state.FlowPopulationModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(graphData, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            enter_type: data.enter_type,
            age: data.sex_scale,
            age_gender: data.age,
            flow_change: data.flow_change,
            normal_percent:data.enter_type[1].percent,
            population_percent: data.sex_scale[0].percent,
            params: newParams,
          }
        });
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/flowPopulation' || pathname === '/residentPopulation') {
          dispatch({ type: 'init', payload: { query: query } })
        }
      })
    }
  }
}
