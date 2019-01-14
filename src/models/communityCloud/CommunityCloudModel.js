import HomePageService from './../../services/HomePageService';
const { getCommunityCloud } = HomePageService;

export default {
  namespace: 'CommunityCloudModel',
  state: {
    resident: [],
    customTotal: [],
    visibleMap: false,
    inCar: "",
    visitor_car: "",
    community_name: "",
    car_dynamic: [],//停车动态
    pepole_dynamic: [],//人行通道
    electro_dynamic: [],//电瓶车
    mac_dynamic: [],//MAC信息
    pepole_total: "",
    location: []
  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'getCommunityCloud', payload: {
          community_id: localStorage.getItem("COMMUNITY_ID"),
        }
      });
    },
    *getCommunityCloud({ payload }, { call, put, select }) {
      const { data, code } = yield call(getCommunityCloud, payload);
      let arr = [];
      arr.push({
        lat: data.lat,
        lon: data.lon
      });
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            resident: data ? data.pepole_proportion : [],
            customTotal: data ? data.traffic : [],
            inCar: data.garage_car,
            visitor_car: data.visitor_car,
            community_name: data.community_name,
            car_dynamic: data ? data.car_dynamic : [],
            pepole_dynamic: data ? data.pepole_dynamic : [],
            electro_dynamic: data ? data.electro_dynamic : [],
            mac_dynamic: data ? data.mac_dynamic : [],
            latitude: data.latitude,
            longitude: data.longitude,
            pepole_total: data.pepole_total,
            location: arr
          }
        });
      }
    },
    *socketUpdate({ payload }, { call, put, select }) {
      let { data, eventType } = payload;
      let CommunityCloudModel = yield select(state => state.CommunityCloudModel);
      let { pepole_total, resident, pepole_dynamic, car_dynamic, mac_dynamic, electro_dynamic } = CommunityCloudModel;

      switch (eventType) {
        case 'RESIDENT':
          pepole_total = `${parseInt(pepole_total) + 1}`;
          resident.forEach((val, index) => {
            if (val.type === data.identity_type) {
              resident[index].count = resident[index].count + 1;
            }
          });
          yield put({
            type: 'concat', payload: {
              pepole_total: pepole_total,
              resident: resident
            }
          });
          break;
        case 'DOOR':
          pepole_dynamic.unshift({
            "user_name": data.username,
            "open_type": data.open_type,
            "open_lable": data.open_label,
            "user_type": data.user_type,
            "user_type_lable": data.user_type_label,
            "device_name": data.device_name,
            "create_at": data.create_at,
            "id": data.id
          });
          yield put({
            type: 'concat', payload: {
              pepole_dynamic: pepole_dynamic.slice(0, 5)
            }
          });
          break;
        case 'CAR':
          car_dynamic.unshift({
            "car_num": data.car_num,
            "car_type": data.car_type,
            "address": data.address,
            "car_type_lable": data.car_type_label,
            "in_out_lable": data.in_out_label,
            "in_out_time": data.in_out_time,
            "id": data.id
          })
          yield put({
            type: 'concat', payload: {
              car_dynamic: car_dynamic.slice(0,5),
              inCar: data.garage_car,
              visitor_car: data.visitor_car
            }
          });
          break;
        case 'MAC':
          mac_dynamic.unshift({
            "devicename": data.devicename,
            "identity_type": data.identity_type,
            "identity_type_lable": data.identity_type_label,
            "location": data.location,
            "mac": data.mac,
            "username": data.username,
            "create_at": data.create_at,
            "id": data.id
          })
          yield put({
            type: 'concat', payload: {
              mac_dynamic: mac_dynamic.slice(0,5)
            }
          });
          break;
        case 'ELECTROMOBILE':
          electro_dynamic.unshift({
            "channel": data.channel,
            "plate": data.plate,
            "type": data.type,
            "type_lable": data.type_label,
            "create_at": data.create_at,
            "id": data.id
          })

          yield put({
            type: 'concat', payload: {
              electro_dynamic: electro_dynamic.slice(0,5)
            }
          });
          break;
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/communityCloud') {
          dispatch({ type: 'init' })
        }
      })
    }
  }
}
