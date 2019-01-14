import './SearchFrame.less';
/*
* 向缓存中添加记录
* */
function addRecord (key, val, diff) {
  let res = [];
  let historyList = window.sessionStorage.getItem(key);
  if (!historyList) {
    res.push(val);
  } else {
    historyList = JSON.parse(historyList);
    let update = diff(historyList);
    if (update) {
      res = historyList.slice();
      res.push(val);
      // 历史记录最多20条
      if (res.length > 20) {
        res = res.slice(0, 20);
      }
    }
  }
  window.sessionStorage.setItem(key, JSON.stringify(res));
}
/*
* 浏览历史
* */
function searchHistory (type, strogeKey, boxId) {
  let storge = window.sessionStorage;
  let historyList = storge.getItem(strogeKey);
  if (historyList) {
    historyList = JSON.parse(historyList);
    createFrame(historyList, boxId, (mineSearch) => {
      historyList.forEach((val ,index) => {
        let searchItem = document.createElement('div');
        searchItem.classList.add('search-item');
        if (type === 'homePage') { // 首页搜索框
          let left = document.createElement('span');
          let right = document.createElement('span');
          left.innerHTML = val.community_name;
          left.classList.add('left');
          right.classList.add('right');
          right.innerHTML = val.city_name;
          searchItem.appendChild(left);
          searchItem.appendChild(right);
          // 绑定事件
          searchItem.addEventListener('click', () => {
            window.localStorage.setItem('CITY_ID', val.city_id);
            window.localStorage.setItem('COMMUNITY_ID', val.community_id);
            window.location.hash = `#communityCloud`;
            removeSearchFn();
          });
        } else if (type === 'searchTerrace') { // 大数据分析搜索平台
          searchItem.innerHTML = val.name;
          searchItem.addEventListener('click', function () {
            window.location.hash = `#searchResult?id=${val.member_id}`;
            removeSearchFn();
          });
        }
        mineSearch.appendChild(searchItem);
      });
    })
  }
}
/*
* 点击页面其他位置，删除下拉列表
* */
function removeSearchFn () {
  let currentSearchDom = document.querySelector('.mineSearchList');
  if (!currentSearchDom) {
    return false;
  }
  if (currentSearchDom) {
    document.querySelector('body').removeChild(currentSearchDom);
  }
}
/*
* 当下拉列表为空时，展示未找到匹配项
* @params {Dom-Object} 下拉列表最终父节点
* */
function nullDom (mineSearch) {
  let nullDom = document.createElement('div');
  nullDom.innerHTML = '未找到匹配项';
  nullDom.classList.add('null-style');
  mineSearch.appendChild(nullDom);
}
/*
* 自定义滚动条
* @paramd {Array} searchList 当前搜索列表list
* @params {String} boxId 当前下拉框父元素，用于定位下拉列表
* @params {Function} createChild 创建当前下拉列表的所有子元素
* */
function createFrame (searchList, boxId, createChild) {
  let currentSearchDom = document.querySelector('.mineSearchList');
  if (currentSearchDom) {
    document.body.removeChild(currentSearchDom);
  }
  let mineSearch = document.createElement('div');
  let rootDom = document.querySelector('#root');
  let iptBox = document.getElementById(boxId);
  let top = iptBox.getBoundingClientRect().top;
  let left = iptBox.getBoundingClientRect().left;
  let boxHeight = iptBox.offsetHeight;
  let boxWidth = iptBox.offsetWidth;
  mineSearch.classList.add('mineSearchList');
  if (searchList.length === 0) {
    nullDom(mineSearch);
  } else {
    // 由调用者传入生成子节点的function
    createChild(mineSearch);
  }
  document.body.appendChild(mineSearch);
  mineSearch.style.left = `${left}px`;
  mineSearch.style.top = `${top + boxHeight}px`;
  mineSearch.style.width = `${boxWidth}px`;
  window.$('.mineSearchList').mCustomScrollbar({});
  rootDom.addEventListener('click', removeSearchFn);
  // 阻止搜索input click 事件冒泡--搜索历史功能用，暂未配置搜索历史功能
  // document.querySelector('.mine_search_ipt').addEventListener('click', (e) => {
  //   e.stopPropagation();
  // });
}

export { createFrame, removeSearchFn, addRecord, searchHistory };
