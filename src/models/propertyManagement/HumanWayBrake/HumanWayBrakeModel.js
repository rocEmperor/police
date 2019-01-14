import PropertyManagementService from '../../../services/PropertyManagementService.js';
const {peopleProfile,peopleDevice} = PropertyManagementService;
export default {
  namespace: 'HumanWayBrakeModel',
  state:{
    flag:1,
    travelChart:[],
    usersChart:[],
    levelList:[],
    fields:[]
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects:{
    *init({ payload }, { call, put }) {
      yield put({
        type:'concat',
        payload:{
          flag:1,
          travelChart:[],
          usersChart:[],
          levelList:[],
          fields:[]
        }
      })
      yield put({ type: 'peopleProfile', payload: {
        
      }});
      yield put({ type: 'peopleDevice', payload: {
        
        type:1,
      }});
    },
    *peopleProfile({ payload }, { call, put }) {
      const { data,code } = yield call(peopleProfile, payload);
      let usersChart=JSON.stringify(data?data.users:[])
      let usersChart1=usersChart.replace(/name/g, 'item')
      let usersChart2=usersChart1.replace(/value/g, 'count')
      let usersChart3=JSON.parse(usersChart2)

      let travelChart=JSON.stringify(data?data.travel:[])
      let travelChart1=travelChart.replace(/name/g, 'item')
      let travelChart2=travelChart1.replace(/value/g, 'count')
      let travelChart3=JSON.parse(travelChart2)
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            travelChart: travelChart3,
            usersChart: usersChart3,
          }
        });
      }
    },
    *peopleDevice({ payload }, { call, put }) {
      const { data,code } = yield call(peopleDevice, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            levelList: data.data,
            fields:data.fields
          }
        });
      }
    },
   
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/humanWayBrake') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
}
