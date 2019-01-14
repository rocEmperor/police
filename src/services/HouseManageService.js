import request from '../utils/request';
const commonInterface = {
  houseManagementList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/list',data);
  },
  //4级联动关联小区接口
  group:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-groups',data);
  },
  building:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-buildings',data);
  },
  unit:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-units',data);
  },
  room:(parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-rooms',data);
  },
  // 获取楼道号及电梯编号列表
  floorLiftList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/shared/shared-search-list',data);
  },
  // 标签列表
  labelList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/label/list', data);
  },
  // 所有图形数据
  graphData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/house/get-count-data', data);
  },
  // 标签下拉
  labelType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/label/difference-list', data);
  },
}

export default commonInterface;