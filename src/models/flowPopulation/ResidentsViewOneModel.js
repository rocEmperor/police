import FlowPopulationService from './../../services/FlowPopulationService';
import queryString from 'query-string';
export default {
  namespace: 'ResidentsViewOneModel',
  state: {
    infoList: {},
    relatedHouseList: [],
    relatedResidentList: [],
    housePage: 1,
    residentPage: 1,
    residentTotals: 0,
    houseTotals: 0,
    visible: false,
    curHouse: '',
    curIdentity: '',
    isLong: false,
    curId: '',
    editId: '',
    endTime: '',
    // searchType: '',
    loadingHouse: false,
    loadingResident: false,
    labelType: []
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const { query } = payload;
      yield put({
        type: 'concat', payload: {
          curId: query.id,
          // searchType: query.type,
          infoList: {},
          relatedHouseList: [],
          relatedResidentList: [],
          housePage: 1,
          residentPage: 1,
          residentTotals: 0,
          houseTotals: 0,
          visible: false,
          curHouse: '',
          curIdentity: '',
          isLong: false,
          editId: '',
          endTime: '',
          loadingHouse: false,
          loadingResident: false,
          labelType: [],
        }
      });
      yield put({
        type: 'labelType',
        payload: {
          label_type: 2,
          community_id: localStorage.getItem("COMMUNITY_ID"),
        }
      });
      yield put({ type: 'getInfoList', payload: { id: query.id } });
    },
    *getInfoList({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(FlowPopulationService.residentView, payload);
      // const ResidentsViewOneModel = yield select(state => state.ResidentsViewOneModel);
      // 注: 只有在已迁入查看详情的时候，才有相关房屋list和相关住户list
      // if (ResidentsViewOneModel.searchType === 'AlreadySettleIn') {
      yield put({ type: 'getRelatedHouseList', payload: { id: data.member_id, page: 1, rows: 10 } });
      yield put({ type: 'getRelatedResidentList', payload: { id: data.member_id, page: 1, rows: 10 } });
      // }
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            infoList: data
          }
        })
      }
    },
    *getRelatedHouseList({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loadingHouse: true } });
      const { data, code } = yield call(FlowPopulationService.relatedHouse, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            relatedHouseList: data.list,
            houseTotals: data.total,
            loadingHouse: false
          }
        })
      }
    },
    *getRelatedResidentList({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      yield put({ type: 'concat', payload: { loadingResident: true } });
      const { data, code } = yield call(FlowPopulationService.relatedResident, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            relatedResidentList: data.list,
            residentTotals: data.total,
            loadingResident: false
          }
        })
      }
    },
    *labelType({ payload }, { call, put, select }) {
      let defaultParam = {};
      payload = Object.assign({}, defaultParam, payload);
      const { data, code } = yield call(FlowPopulationService.labelType, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            labelType: data ? data.list : []
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        let query = queryString.parse(search);
        if (pathname === '/residentsViewOne') {
          dispatch({ type: 'init', payload: { query: query } });
        }
      });
    }
  }
}
