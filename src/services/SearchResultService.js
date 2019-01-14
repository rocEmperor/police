import request from '../utils/request';
const SearchResultService = {
  residentReq:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/resident/info', data);
  },
  searchListReq:(parameter)=>{
    const data = JSON.stringify(parameter);
    return request('/search/list', data);
  }
};
export default SearchResultService;
