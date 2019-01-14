import HomePageService from './../../services/HomePageService';
const { communityNewList } = HomePageService;
import CommunityPicturesService from './../../services/CommunityPicturesService';
const { photoList } = CommunityPicturesService;

export default {
  namespace: 'CommunityPicturesModel',
  state: {
    community:[],
    community_id:'',
    type:1,
    list:[],
    totals:'',
    page:1,
    previewVisible:false,
    previewImage:'',
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'communityNewList',
        payload: { name: '' }
      })
    },
    *communityNewList({ payload }, { call, put }) {
      const { data, code } = yield call(communityNewList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { community: data, community_id: data && data.length > 0 ? data[0].community_id:'' }
        })
        yield put({
          type: 'getPhoto',
          payload: { 
            communityId: data && data.length > 0 ? data[0].community_id : '',
            type:1,
            rows:24,
            page:1
          }
        })
      }
    },
    *getPhoto({ payload }, { call, put }) {
      const { data, code } = yield call(photoList, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: { 
            list: data && data.list.length>0?data.list:[], 
            totals: data.count,
          }
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/communityPictures') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
