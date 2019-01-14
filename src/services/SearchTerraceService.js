import request from '../utils/request';
const HomePageService = {
  searchReq:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/search', data);
  },
  photosListReq:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/search/photos', data);
  }
};
export default HomePageService;
