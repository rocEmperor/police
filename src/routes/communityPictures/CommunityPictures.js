import React from 'react';
import { connect } from 'dva';
import { Form, Pagination, Modal } from 'antd';
import carlogo from "../../../static/images/carlogo.png";
import facelogo from "../../../static/images/facelogo.png";
import airFire from "../../../static/images/airFire.png";
import "./index.less";

function CommunityPictures(props) {

  let { dispatch, community, community_id, type, totals, list, page, previewVisible, previewImage } = props;

  function changeCommunity(val){    
    dispatch({
      type: 'CommunityPicturesModel/concat',
      payload: {
        community_id: val,
        type: 1,
        page:1,
      }
    });
    dispatch({
      type: 'CommunityPicturesModel/getPhoto',
      payload: {
        type: 1,
        communityId:val ,
        rows:24,
        page:1,
      }
    });
  }

  function changeType(id){
    dispatch({
      type: 'CommunityPicturesModel/concat',
      payload: {
        type: id,
        page:1,
      }
    });
    dispatch({
      type: 'CommunityPicturesModel/getPhoto',
      payload: {
        type: id,
        communityId:community_id ,
        rows:24,
        page:1,
      }
    });
  }

  function onChange(id){
    dispatch({
      type: 'CommunityPicturesModel/concat',
      payload: {
        page: id,
      }
    });
    dispatch({
      type: 'CommunityPicturesModel/getPhoto',
      payload: {
        communityId:community_id ,
        type:type,
        rows:24,
        page:id,
      }
    });
  }

  function showImagedetail(val){
    console.log(val,99);
    
    dispatch({
      type: 'CommunityPicturesModel/concat',
      payload: {
        previewVisible:true,
        previewImage:val
      }
    });
  }

  function handleCancel(){
    dispatch({
      type: 'CommunityPicturesModel/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    });
  }

  return (
    <div className="pictures" style={{ minHeight: `${window.innerHeight - 64}px`}}>
      <div className="left-pictures">
        <ul style={{ height: `${window.innerHeight - 64}px`}}>
          {community && community.length>0?community.map((item,index)=>{
            return <li key={index} className={item.community_id==community_id?"active":""} onClick={changeCommunity.bind(this,item.community_id)}>{index+1}{item.community_name}</li>
          })
            :null
          }
        </ul>
      </div>
      <div className="right-pictures">
        <div className="tab">
          <p className={type==1?'tab1 active-tab':'tab1'} onClick={changeType.bind(this,'1')}><img src={facelogo}/>人脸照片 </p>
          <p className={type==2?'tab2 active-tab':'tab2'} onClick={changeType.bind(this,'2')}><img src={carlogo}/>车脸照片</p>
        </div>
        <div className="main" style={{ height: `${window.innerHeight - 134}px` ,overflowY:'scroll'}}>
          <ul className="imgs">
            {list && list.length>0?list.map((item,index)=>{
              return <li key={index}>
                <img src={item.photo} onClick={() => { showImagedetail(item.photo)}}/>
                <div>
                  <span>{item.name}</span><br />
                  <span>{item.times}</span>
                </div>
              </li>
            })
              : <div style={{textAlign: 'center', color: '#fff' }}>
                <img src={airFire} style={{ marginTop: '20%' }} />
                <div>暂无数据</div>
              </div>
            }
          </ul>
          {totals > 0 ? <Pagination style={{ clear: 'both', margin: '50px 0 50px 600px', paddingTop: '50px' }} defaultCurrent={1} current={page} pageSize={24} total={+totals} onChange={onChange.bind(this)} showTotal={total => `共 ${totals} 条`} />:null}
          <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
            <img alt="" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </div>
    </div>
  )
} ''
function mapStateToProps(state) {
  return {
    ...state.CommunityPicturesModel,
  };
}
export default connect(mapStateToProps)(Form.create()(CommunityPictures));
