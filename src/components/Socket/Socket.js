export function mineSocket (dispatch, mateWebSocketList) {
  /*
  * 创建socket连接
  * */
  function connect () {
    let ws = new WebSocket('wss://hzsw.elive99.com');
    ws.onopen = onopen;
    ws.onmessage = onmessage;
    ws.onclose = onclose;
    ws.onerror = onerror;
    window.ws = ws; // 将websocket对象存入全局变量
    /*
    * 监听路由变化，当进入云图或者首页的时候要向socket send不同数据
    * */
    window.onhashchange = (e) => {
      if (window.ws && window.ws.readyState == 1) {
        let token = sessionStorage.getItem('GAT_TOKEN');
        let newURL = e.newURL;
        // 每次进入社区云图页面后，需要发送一次请求
        if (newURL.indexOf('communityCloud') !== -1) {
          let community_id = localStorage.getItem('COMMUNITY_ID');
          let cloudData = {
            type: 'login',
            token: token,
            data: { community_id: community_id }
          };
          ws.send(JSON.stringify(cloudData));
        } else if (newURL.indexOf('homePage') !== -1) { // 每次进入首页页面后，需要发送一次请求
          let homeData = {
            type: 'login',
            token: token,
            data: { community_id: 0 }
          };
          ws.send(JSON.stringify(homeData));
        }
      }
    };
    /*
    * 50s发送一次心跳，服务端1分钟内无心跳，判断为已失效，会主动断开连接
    * */
    function keepalive (ws) {
      let token = sessionStorage.getItem('GAT_TOKEN');
      let heartData = {
        type: 'heart',
        token: token,
        data: {
          heart: 'heart',
        }
      };
      ws.send(JSON.stringify(heartData));//发送任意字符串
    }
    setInterval(function () {
      if (window.ws.bufferedAmount == 0) {
        keepalive(ws);
      }
    }, 50000);
  }
  /*
  * 监听socket连接成功，并发送首次连接数据
  * */
  function onopen (e) {
    console.log('WebSocket已连接');
    let token = sessionStorage.getItem('GAT_TOKEN');
    let initData = {
      type: 'login',
      token: token,
      data: { community_id: 0 }
    };
    window.ws.send(JSON.stringify(initData));
  }
  /*
  * 监听socket推送消息，并且将数据同步到各自的store中
  * */
  function onmessage (res) {
    let current = JSON.parse(res.data);
    let event = current.event;
    let data = current.data;
    let community_id_local = localStorage.getItem('COMMUNITY_ID');
    let community_id = data.community_id;
    console.log(`socket推送数据,event类型: ${event}`);
    // 更新store函数
    let updateFn = () => {
      let currentHash = window.location.hash.toLocaleUpperCase();
      if (event in mateWebSocketList) {
        mateWebSocketList[event].forEach((val, index) => {
          let route = val.route.toLocaleUpperCase();
          if (currentHash.indexOf(route) !== -1) {
            dispatch({
              type: `${val.route}Model/${val.dispatchType}`,
              payload: { data: data, eventType: event }
            })
          }
        })
      }
    };
    // 判断推送数据的id是否与当前小区的id相等，相等则更新
    if (community_id) {
      if (community_id_local == community_id) {
        updateFn();
      }
    } else {
      updateFn();
    }
  }
  /*
  * 监听socket断开连接，并且重新连接socket，最多连接10次
  * */
  function onclose () {
    console.log('socket连接已经断开');
    // 重新连接
    reconnect();
  }
  /*
  * 监听socket出现Error，输出error
  * */
  function onerror (err) {
    console.log(`socket error: ${JSON.stringify(err)}`);
  }
  let reconnectCount = 1; // 重连次数
  let reconnectMax = 10; // 最大允许重连10次
  let reconnectTimer; //定时器ID
  let seconds = 60000;
  /*
  * 重新连接socket
  * */
  function reconnect () { // 重连
    if (reconnectCount >= reconnectMax || window.ws.readyState == 1) { // 超过次数或者连接成功，清除定时器
      clearTimeout(reconnectTimer);
    } else {
      reconnectCount = reconnectCount + 1; // 重连次数+1
      if (window.ws.readyState == 3) { // close状态
        seconds = seconds + 60000;
        reconnectTimer = setTimeout(function () {
          connect();
        }, seconds); // 1分钟重连一次
      }
    }
  }
  /*
  * 首次连接socket
  * */
  if (!window.ws) {
    connect();
  }
}
