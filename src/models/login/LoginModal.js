import  CommonInterface from '../../services/CommonInterface';

import { routerRedux } from 'dva/router';
export default {
  namespace: 'login',
  state: {
    token: "",
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *login({ payload, callback }, { call, put }) {
      const { code, data } = yield call(CommonInterface.login, payload);
      if (code == 20000) {
        sessionStorage.setItem('GAT_TOKEN', data.token);
        sessionStorage.removeItem('current');
        sessionStorage.removeItem('openKeys');
        yield put(routerRedux.push('/homePage'));
        callback && callback();
      }
    },
    *register({ payload }, { call, put }) {
      yield put(routerRedux.push('/register'));
    },
  },
  subscriptions: {},
};
