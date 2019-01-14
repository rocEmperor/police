import request from '../utils/request';
const commonInterface = {
  residentList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/resident/list',data);
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
  // 标签下拉
  labelType: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/label/difference-list', data);
  },
  // 所有图形数据
  graphData: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/resident/get-count-data', data);
  },
  // 住户详情
  residentView: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/resident/show',data);
  },
  // 相关住户
  relatedHouse: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/resident/related-house', data);
  },
  // 相关住户
  relatedResident: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/resident/related-resident', data);
  },
  // 获取籍贯分布
  nativeList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/resident/native-list',data);
  }
}

export default commonInterface;