
import AlarmManagementService from './../../services/AlarmManagementService';
const {getWarningList,warningLevel,warningDeal,warningChart} = AlarmManagementService;
export default {
  namespace:'AlarmCentreModel',
  state: {
    list: [],
    list_status:[],
    list_rate:[],
    list_type:[],
    dataList:[],
    list_grade:[],
    percentage:'',
    list_status_totals:'',
    flag:1,
    visible:false,
    level_one:'',
    level_two:'',
    totals:'',
    is_reset:false,
    params:{
      alarm_end:'',		
      alarm_start:'',		
      deal_end:'',		
      deal_start:'',	
      device_name:'',		
      level_color:'',		
      level_one:'',	
      level_two:'',		
      page:1,		
      rows:10,		
      status:1,	
    }
  },
  reducers: {
    concat(state,{ payload }){
      return {...state,...payload}
    }
  },
  effects:{
    *init({payload},{ call,put,select }){
      let params={
        page:1,		
        rows:10,		
        status:1,	
        alarm_end:'',		
        alarm_start:'',		
        deal_end:'',		
        deal_start:'',	
        device_name:'',		
        level_color:'',		
        level_one:'',	
        level_two:'',		
      }
      yield put({ type: 'concat', payload:{
        flag:1,
      }});
      yield put({ type: 'getList', payload: params});
      yield put({ type: 'warningLevel', payload: {}});
      yield put({ type: 'warningChart', payload: {}});
    },
    *getList({ payload }, { call, put, select }) {
      const params = yield select(state=>state.AlarmCentreModel.params);
      const newParams = Object.assign(params, payload);
      const { data,code } = yield call(getWarningList, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            list: data?data.list:[],
            totals: data.totals,
            params: newParams
          }
        });
      }
    },
    *warningLevel({ payload }, { call, put }) {
      const { data,code } = yield call(warningLevel, payload);
      let list = data?data.list:[]
      let str = JSON.stringify(list);
      let str1 = str.replace(/id/g, 'value');
      let str2 = str1.replace(/name/g, 'label');
      let str3 = str2.replace(/child/g, 'children');
      let levelList = JSON.parse(str3) 
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            levelList: levelList,
          }
        });
      }
    },
    *warningDeal({ payload,callback }, { call, put }) {
      const { code } = yield call(warningDeal, payload);
      if(code == 20000){
        yield put({
          type:'concat',
          payload: {
            visible:false,
          }
        });
        callback&&callback()
      }
    },
    *warningChart({ payload }, { call, put }) {
      const { data,code } = yield call(warningChart, payload);
      let listGrade = data?data.list_grade:[];
      let percentage='';
      listGrade.map((value,index)=>{
        if(value.item ==='蓝色告警'){
          percentage=value.count
        }
      })
      if(code == 20000){
        yield put({
          type:'concat',
          payload: {
            list_status:data&&data.list_status?data.list_status:[],
            list_rate:data&&data.list_rate?data.list_rate:[],
            dataList:data&&data.list?data.list:[],
            list_grade:data&&data.list_grade?data.list_grade:[],
            list_type:data&&data.list_type?data.list_type:[],
            percentage:percentage,
            list_status_totals:data&&data.list_status_totals?data.list_status_totals:[]
          }
        });
      }
    },
  },
  subscriptions: {
    setup({dispatch,history}){
      return history.listen(({ pathname, search })=>{
        if(pathname === '/alarmCentre'){
          dispatch({type: 'init'})
        }
      })
    }
  }
}
