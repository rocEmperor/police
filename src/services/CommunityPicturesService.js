import request from '../utils/request';
const CommunityPicturesService = {
  //抓拍列表
  photoList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/search/photo-list', data);
  },
}
export default CommunityPicturesService;