import request from '../utils/request';
const AlarmManagementService = {
  //告警列表
  getWarningList: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/activity/warning-list',data);
  },
  //告警类型
  warningLevel: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/activity/warning-level',data);
  },
  //告警处理
  warningDeal: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/activity/warning-deal',data);
  },
  //告警处理图表
  warningChart: (parameter) => {
    const data = JSON.stringify(parameter);
    return request('/activity/warning-chart',data);
  },
}
export default AlarmManagementService;