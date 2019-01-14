export default {
  namespace: 'FireSystemModel',
  state: {
    
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      
    },
    
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/fireSystem') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
