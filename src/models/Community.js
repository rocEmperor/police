import HouseManageService from './../services/HouseManageService';
// import propertyManagementService from './../services/propertyManagementService';

export default {
  namespace: 'CommunityModel',
  state: {
    communityList:[],
    groupData:[],
    buildingData:[],
    unitData:[],
    roomData:[],
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getCommunityList({ payload }, { call, put }) {
      const { data,code } = yield call(HouseManageService.community, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            communityList: data?data:[],
          }
        });
      }
    },
    *getGroupList({ payload }, { call, put }) {
      const { data,code } = yield call(HouseManageService.group, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            groupData: data?data:[],
            buildingData:[],
            unitData:[],
            roomData:[],
          }
        });
      }
    },
    *getBuildingList({ payload }, { call, put }) {
      const { data,code } = yield call(HouseManageService.building, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            buildingData: data?data:[],
            unitData:[],
            roomData:[],
          }
        });
      }
    },
    *getUnitList({ payload }, { call, put }) {
      const { data,code } = yield call(HouseManageService.unit, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            unitData: data?data:[],
            roomData:[],
          }
        });
      }
    },
    *getRoomList({ payload }, { call, put }) {
      const { data,code } = yield call(HouseManageService.room, payload);
      if(code == 20000){
        yield put({
          type: 'concat',
          payload: {
            roomData: data?data:[],
          }
        });
      }
    },
  },
  subscriptions: {},
};
