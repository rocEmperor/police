export function getUrl(){
  let location = window.location,
    hostname = location.hostname;
  if(hostname=='localhost' || hostname == "127.0.0.1"){   //本地启动接口地址
    if(location.port == "8080"){
      // return 'https://hzdt-api.elive99.com'
      return 'http://test-police-api.elive99.com'
    }else{
      return 'http://41.188.65.121:81'
    } 
  } else if (hostname =='hzdt.elive99.com'){  //线上接口地址
    return 'https://hzdt-api.elive99.com'
  } else if (hostname == 'test-police.elive99.com') {
    return 'http://test-police-api.elive99.com'
  } else if(hostname == '41.188.65.121'){
    return 'http://41.188.65.121:81'
  }
}
export function download(url){
  if (url && Object.prototype.toString.call(url) === '[object String]') {
    let a = document.createElement('a')
    a.href = encodeURI(url);
    a.download = 'excel';
    a.id = 'downLoad';
    a.style.display = 'none';
    // a.click()
    document.body.appendChild(a);
    document.getElementById('downLoad').click()
    document.body.removeChild(document.getElementById('downLoad'))
    a = null
  }
}
import validator from './validator.js'
export function isBuildingsEmpty(buildings2){
  if (validator.validator.isArrayEmpty(buildings2)) {
    return true
  } else {
    return buildings2.every((element, index, array) => validator.validator.isArrayEmpty(element.children))
  }
}

export function author(auth){
  let res=false;
  // const reg = /(?<=\/).*?(?=\?)|(?<=\/).*/;
  // let hash = reg.exec(location.hash)[0];
  let hash = location.hash.replace("#/","");
  hash = hash.split('?')[0];
  const menu=sessionStorage.menus?JSON.parse(sessionStorage.menus):[];
  menu.map(item1=>{
    item1.children&&item1.children.map(item2=>{
      if(item2.url === hash){
        item2.children&&item2.children.map(item3=>{
          if (item3.key == auth || item3.en_key == auth){
            res = true;
          }
        })
      }
    })
  });
  return res;
}
/**
 * 将一个浮点数转成整数，返回整数和倍数
 * @param {number} floatNum
 * @return {number} num
 */
export function toInteger(floatNum){
  let ret = {times: 1,num: 0};
  let isNegative = floatNum < 0;
  if(Math.floor(floatNum) === floatNum){
    ret.num = floatNum;
    return ret;
  }
  let toStr = floatNum + '';
  let dot = toStr.indexOf('.');
  let len = toStr.substr(dot+1).length;
  let times = Math.pow(10,len);
  let intNum = parseInt(Math.abs(floatNum)*times+0.5,10);
  ret.times = times;
  if(isNegative){
    intNum = -intNum;
  }
  ret.num = intNum;
  return ret;
}
/**
 * table
 * @param {*} text
 * @param {Object} record
 */
export function noData(text, record){
  return text?text:'-'
}

export function cutStr(str,start,end){
  return str.slice(start,end)
}
export function checkPhone(rule, value, callback) {
  let regex = /^1[0-9]{10}$/;//手机号
  if (value && !regex.test(value)) {
    //react使用正则表达式变量的test方法进行校验，直接使用value.match(regex)显示match未定义
    callback('请输入正确的手机号码！');
  } else {
    callback();
  }
}

export function checkAlipay(rule, value, callback) {
  let regex = /^((\w)+(\.\w+)*@([\w-])+((\.[\w-]+)+)|(1\d{10}))$/;//支付宝账号
  if (value && !regex.test(value)) {
    callback('请输入正确的支付宝账号！');
  } else {
    callback();
  }
}

export function checkTel(rule, value, callback) {
  let regex = /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/;//固话或者手机号
  if (value && !regex.test(value)) {
    callback('请输入正确的固话或手机号！');
  } else {
    callback();
  }
}

export function checkHttp(rule, value, callback) {
  let regex = /^(http[s]?|ftp):\/\/[^\\/\\.]+?\..+(\w|\/)$/;//网址
  if (value && !regex.test(value)) {
    callback('请输入正确的网址！');
  } else {
    callback();
  }
}

export function checkEmail(rule, value, callback) {
  let regex = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (value && !regex.test(value)) {
    callback('请输入正确的邮箱！');
  } else {
    callback();
  }
}

export function getToken() {
  let resToken = '';
  let curToken = sessionStorage.getItem('GAT_TOKEN');
  if (curToken) {
    resToken = curToken;
  }
  return resToken
}

export function getCommunityId() {
  let resToken = '';
  let curToken = sessionStorage.getItem('communityId');
  if (curToken) {
    resToken = curToken;
  }
  return resToken
}

export function isNumber (value) {
  return Object.prototype.toString.call(value) === '[object Number]'
}

export function isObject (value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

let awaitStatus = true
export function notRepeating(fun) {
  setTimeout(() => awaitStatus = true, 2000)
  if (awaitStatus) {
    awaitStatus = false
    fun()
  }
}

export function format(date,format='yyyy-MM-dd hh:mm:ss'){
  let formatNum = function(num){
    num += "";
    return num.replace(/^(\d)$/,"0$1");
  }
  let formatData={
    yyyy : date.getFullYear(),
    yy : date.getFullYear().toString().substring(2),
    M  : date.getMonth() + 1 ,
    MM : formatNum(date.getMonth() + 1),
    d  : date.getDate(),
    dd : formatNum(date.getDate()),
    hh : date.getHours(), 
    mm : date.getMinutes(),
    ss : date.getSeconds(),
  }
  return format.replace(/([a-z])(\1)*/ig,function(m){return formatData[m];});
}