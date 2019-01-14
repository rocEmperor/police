import HouseManageService from './../../../services/HouseManageService';
const { houseManagementList, floorLiftList, labelType, graphData } = HouseManageService;

export default {
  namespace:'houseManageModel',
  state: {
    list:[],
    floorList: [],
    liftList: [],
    totals: '',
    is_reset:false,
    house_rate:{
      already_enter:'965户',
      enter_probability:'56%',
      room_total:'1123'
    },
    lease_deadline:[],
    room_purpose:{
      lease:'12%',
      leave_unused:'45%',
      other:"23%",
      self_enter:"25%"
    },
    room_change:[],
    labelType: [],
    params:{
      page:1,
      rows:10,
      community_id: localStorage.getItem("COMMUNITY_ID"),
      group:"",
      building:"",
      unit:"",
      room:"",
      property_type:"",
      status:""
    }
  },
  reducers: {
    concat(state,{ payload }){
      return {...state,...payload}
    }
  },
  effects:{
    *init({payload},{ call,put,select }){
      yield put({ type: 'getList' ,payload:{
        page:1,
        rows:10,
        community_id: localStorage.getItem("COMMUNITY_ID"),
        group:"",
        building:"",
        unit:"",
        room:"",
        property_type:"",
        status:""
      }});
      yield put({
        type: 'concat',
        payload: {
          is_reset:true,
          params: {
            page: 1,
            rows: 10,
            community_id: localStorage.getItem("COMMUNITY_ID"),
            group: "",
            building: "",
            unit: "",
            room: "",
            property_type: "",
            status: ""
          }
        }
      });
      yield put({
        type: 'floorLiftList',
        payload: {
          shared_type: 1,
          community_id: localStorage.getItem("COMMUNITY_ID"),
        }
      });
      yield put({
        type: 'floorLiftList',
        payload: {
          shared_type: 2,
          community_id: localStorage.getItem("COMMUNITY_ID"),
        }
      });
      yield put({
        type: 'labelType', payload: {
          label_type: 1,
          community_id: localStorage.getItem("COMMUNITY_ID"),
        }
      }); 
      yield put({
        type: 'graphData', payload: {
          community_id: localStorage.getItem("COMMUNITY_ID"),
        }
      }); 
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.houseManageModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(houseManagementList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            params: newParams,
          }
        });
      }
    },
    *floorLiftList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.houseManageModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(floorLiftList, payload);
      if(code == 20000){
        if(payload.shared_type==2){
          yield put({
            type: 'concat',
            payload: {
              floorList: data?data.list:[],
              params: newParams
            }
          });
        }else if(payload.shared_type==1){
          yield put({
            type: 'concat',
            payload: {
              liftList: data?data.list:[],
              params: newParams
            }
          });
        }

      }
    },
    
    *labelType({ payload }, { call, put, select }) {
      const params = yield select(state => state.houseManageModel.params);
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
    *graphData({ payload }, { call, put, select }) {
      const params = yield select(state => state.houseManageModel.params);
      const newParams = Object.assign(params, payload);
      const { data, code } = yield call(graphData, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            house_rate: data.room_enter,
            lease_deadline:data.lease_deadline.list,
            room_purpose:data.room_purpose.list,
            room_change:data.room_change.list,
            params: newParams,
          }
        });
      }
    },
  },
  
  subscriptions: {
    setup({dispatch,history}){
      return history.listen(({ pathname, search })=>{
        if(pathname === '/houseManage'){
          dispatch({type: 'init'})
        }
      })
    }
  }
}
