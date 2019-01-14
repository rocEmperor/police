import request from '../utils/request';
const HomePageService = {
  searchReq:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/home/community-list', data);
  },
  infoListReq:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/home/index', data);
  },
  getCommunityCloud:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/home/community', data);
  },
  communityNewList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/home/community-new-list', data);
  },
  loginOut:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/user/login-out', data);
  },
};
export default HomePageService;
