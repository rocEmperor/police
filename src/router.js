import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {

  const Login = dynamic({
    app,
    models: () => [
      import('./models/login/LoginModal.js'),
    ],
    component: () => import('./components/Login/Login.js'),
  });
  const Register = dynamic({
    app,
    models: () => [
      import('./models/register/RegisterModal.js'),
    ],
    component: () => import('./components/Register/Register.js'),
  });
  const Container = dynamic({
    app,
    models: () => [
      import('./models/mainLayout/MainLayoutModel.js'),
    ],
    component: () => import('./components/MainLayout/MainLayout.js'),
  });
  /********************首页**************************/
  const HomePage = dynamic({
    app,
    models: () => [
      import('./models/homePage/HomePageModel'),
    ],
    component: () => import('./routes/homePage/HomePage.js')
  });
  // 社区云图
  const CommunityCloud = dynamic({
    app,
    models: () => [
      import('./models/communityCloud/CommunityCloudModel'),
    ],
    component: () => import('./routes/communityCloud/CommunityCloud.js')
  });

  // 房屋管理
  const HouseManage = dynamic({
    app,
    models: () => [
      import('./models/propertyManagement/houseManage/HouseManageModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/propertyManagement/houseManage/HouseManage.js')
  });

  // 流动人口
  const FlowPopulation = dynamic({
    app,
    models: () => [
      import('./models/flowPopulation/FlowPopulationModel'),
      import('./models/Community'),
    ],
    component: () => import('./routes/flowPopulation/FlowPopulation.js')
  });
  const ResidentsViewOne = dynamic({
    app,
    models: () => [
      import('./models/flowPopulation/ResidentsViewOneModel'),
    ],
    component: () => import('./routes/flowPopulation/ResidentsViewOne.js')
  });

  /********************搜索结果页**************************/
  const SearchResult = dynamic({
    app,
    models: () => [
      import('./models/searchResult/SearchResultModel'),
    ],
    component: () => import('./routes/searchResult/SearchResult.js')
  });
  /********************搜索平台**************************/
  const SearchTerrace = dynamic({
    app,
    models: () => [
      import('./models/searchTerrace/SearchTerraceModel'),
    ],
    component: () => import('./routes/searchTerrace/SearchTerrace.js')
  });

  /********************物业管理**************************/
    /*----人形道闸 ----*/
  const HumanWayBrake = dynamic({
    app,
    models: () => [
      import('./models/propertyManagement/HumanWayBrake/HumanWayBrakeModel.js'),
    ],
    component: () => import('./routes/propertyManagement/humanWayBrake/HumanWayBrake.js')
  });
    /*-------出入详情 --------*/
  const EntryDetail = dynamic({
    app,
    models: () => [
      import('./models/propertyManagement/HumanWayBrake/EntryDetailModel.js'),
      import('./models/Community'),
    ],
    component: () => import('./routes/propertyManagement/humanWayBrake/EntryDetail.js')
  });
  /*-------------- 停车系统 --------------*/
  const ShutdownTemperature = dynamic({
    app,
    models: () => [
      import('./models/propertyManagement/ShutdownTemperature/ShutdownTemperatureModel.js'),
    ],
    component: () => import('./routes/propertyManagement/shutdownTemperature/ShutdownTemperature.js')
  });
  const ShutdownDetail = dynamic({
    app,
    models: () => [
      import('./models/propertyManagement/ShutdownTemperature/ShutdownDetailModel.js'),
    ],
    component: () => import('./routes/propertyManagement/shutdownTemperature/ShutdownDetail.js')
  });
  /*----------------告警管理 --------------------*/
  const AlarmCentre = dynamic({
    app,
    models: () => [
      import('./models/alarmManagement/AlarmCentreModel.js'),
    ],
    component: () => import('./routes/alarmManagement/AlarmCentre.js')
  });
  /*----------------视频监控 --------------------*/
  const RealTimeMonitoring = dynamic({
    app,
    component: () => import('./routes/videoMonitoring/RealTimeMonitoring.js')
  });
  /********************家园**************************/
  const Homeland = dynamic({
    app,
    models: () => [
      import('./models/homeland/HomelandModel'),
    ],
    component: () => import('./routes/homeland/Homeland.js')
  });
  // 消防系统
  const FireSystem = dynamic({
    app,
    models: () => [
      import('./models/fireSystem/FireSystemModel'),
    ],
    component: () => import('./routes/fireSystem/FireSystem.js')
  });
  // 小区聚合
  const CommunityPictures = dynamic({
    app,
    models: () => [
      import('./models/communityPictures/CommunityPicturesModel'),
    ],
    component: () => import('./routes/communityPictures/CommunityPictures.js')
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Container>
          <Route path="/homePage" component={HomePage} />
          <Route path="/communityCloud" component={CommunityCloud} />
          <Route path="/communityPictures" component={CommunityPictures} />
          <Route path="/houseManage" component={HouseManage} />
          <Route path="/flowPopulation" component={FlowPopulation} />
          <Route path="/residentPopulation" component={FlowPopulation} />
          <Route path="/searchResult" component={SearchResult} />
          <Route path="/searchTerrace" component={SearchTerrace} />
          <Route path="/humanWayBrake" component={HumanWayBrake} />
          <Route path="/residentsViewOne" component={ResidentsViewOne} />

          <Route path="/entryDetail" component={EntryDetail} />
          <Route path="/shutdownTemperature" component={ShutdownTemperature} />
          <Route path="/shutdownDetail" component={ShutdownDetail} />
          <Route path="/alarmCentre" component={AlarmCentre} />
          <Route path="/homeland" component={Homeland} />
          <Route path="/realTimeMonitoring" component={RealTimeMonitoring} />
          <Route path="/fireSystem" component={FireSystem} />
        </Container>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
