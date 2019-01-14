import React from 'react';
import { Input, Form, Spin, message } from 'antd';
import { connect } from 'dva';
import './SearchTerrace.less'
import { createFrame, removeSearchFn } from '../../components/SearchFrame/SearchFrame';

const Search = Input.Search;

class SearchTerrace extends React.Component {
  constructor (props) {
    super(props);
  }
  componentDidMount () {
    // window.$(".searchList").mCustomScrollbar({});
    // 在切换路由的时候dragscroll之前绑定的拖动效果已经消失，dragscroll.reset()方法用于更新元素，重新绑定滑动效果。
    window.dragscroll.reset();
  }
  searchChange (e) {
    const { dispatch } = this.props;
    const val = e.target.value;
    dispatch({
      type: 'SearchTerraceModel/concat',
      payload: { searchValue: val }
    })
  }
  showSearchFn () {
    const { dispatch, SearchTerraceModel  } = this.props;
    const { searchValue } = SearchTerraceModel;
    if (searchValue === '') {
      message.info('搜索内容为空，请输入！');
      return false;
    }
    dispatch({
      type: 'SearchTerraceModel/concat',
      payload: { loading: true }
    });
    // 星汇半岛
    dispatch({
      type: 'SearchTerraceModel/search',
      payload: { keyword: searchValue },
      callback: (searchList) => {
        createFrame(searchList, 'ipt_box', (mineSearch) => {
          searchList.forEach((val, index) => {
            let searchItem = document.createElement('div');
            searchItem.classList.add('search-item');
            searchItem.innerHTML = val.name;
            searchItem.style.fontSize = '14px';
            // 匹配当前搜索值，样式高亮
            if (val.name.indexOf(searchValue) !== -1) {
              let list = val.name.split(searchValue);
              let html = list.join(`<b>${searchValue}</b>`);
              searchItem.innerHTML = html;
            }
            searchItem.addEventListener('click', function () {
              window.location.hash = `#searchResult?id=${val.member_id}`;
              removeSearchFn();
            });
            mineSearch.appendChild(searchItem);
          });
        });
        dispatch({
          type: 'SearchTerraceModel/concat',
          payload: { loading: false }
        });
      }
    });
  }
  /*
  * 图片列表回到顶部/底部
  * @params {String} type 判断是回到顶部还是回到底部
  * */
  // goTop (type) {
  //   const { SearchTerraceModel } = this.props;
  //   const { photoList } = SearchTerraceModel;
  //   let trolleyDom = document.getElementById('trolleyId');
  //   if (type === 'top') {
  //     trolleyDom.scrollLeft = 0;
  //   } else if (type === 'bottom') {
  //     let imgItemDom = document.querySelector('.imgItem');
  //     let max = imgItemDom.offsetWidth * 1.052 * photoList.length;  // 0.052是标签imgItemDom的margin值
  //     trolleyDom.scrollLeft = max;
  //   }
  // }
  render () {
    const { SearchTerraceModel } = this.props;
    const { photoList, loading } = SearchTerraceModel;
    return (
      <Spin spinning={loading} wrapperClassName="search-terrace-spin">
        <div className="search-terrace" style={{height: `${window.innerHeight - 64}px`}}>
          <div className="search">
            <div className="ipt_box" id="ipt_box">
              <span className="camera"></span>
              <Search
                placeholder="请输入人名、身份证、车牌、手机号、标签"
                enterButton="搜索"
                size="large"
                style={{height: '100%'}}
                onChange={(e) => this.searchChange(e)}
                onSearch={() => this.showSearchFn()}
              />
            </div>
          </div>
          <div className="faceList" id="faceList">
            <div className="trolleyId dragscroll" id="trolleyId">
              {photoList.map((val ,index) => {
                return (
                  <div key={index} className="imgItem" style={{background: `url(${val.photo}) no-repeat`}}>
                    <span className={val.name === '陌生人' ? 'label stranger' : 'label name'}>{val.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Spin>
    )
  }
}

function mapStateToProps(state){
  return {
    SearchTerraceModel: state.SearchTerraceModel
  };
}
export default connect(mapStateToProps)(Form.create()(SearchTerrace));
