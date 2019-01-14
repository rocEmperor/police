import request from '../utils/request';
const HomelandService = {
  //家园列表
  peopleList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/activity/people-list',data);
  },
  policeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/activity/police-list',data);
  },
  activityList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/activity/activity-list',data);
  },
}
export default HomelandService;
