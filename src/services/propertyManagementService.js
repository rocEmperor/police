import request from '../utils/request';
const commonInterface = {
  // 小区列表
  community: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/property/community/change',data);
  },
  //4级联动关联小区接口
  group:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-groups?data='+data,data);
  },
  building:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-buildings?data='+data,data);
  },
  unit:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-units?data='+data,data);
  },
  room:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-rooms?data='+data,data);
  },

  //人行概况の今日出入概况
  peopleProfile: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/door/people-profile',data);
  },
   //人行概况の出入流量趋势
  peopleDevice: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/door/people-device',data);
  },
  //开门记录--列表
  peopleList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/door/people-list',data);
  },
  //开门记录--公共参数
  peopleCommon: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/door/people-common',data);
  },

  //车行概况の今日出入概况
  carProfile: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/parking/car-profile',data);
  },
   //车行概况の出入流量趋势
   carDevice: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/parking/car-device',data);
  },
  //停车记录--列表
  carList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/parking/car-list',data);
  },
  //停车记录--公共参数
  carCommon: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/parking/car-common',data);
  },
}
export default commonInterface;
