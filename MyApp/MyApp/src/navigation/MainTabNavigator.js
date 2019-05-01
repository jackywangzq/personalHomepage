import React from 'react';
import {px} from '../utils/px';
import { Image, Button, StyleSheet } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';


/* import AptitudeHome from '../pages/Aptitude/AptitudeHome';
import AptitudeDetail from '../pages/Aptitude/AptitudeDetail';
import AptitudeApplication from '../pages/Aptitude/AptitudeApplication';
import CartList from '../pages/Aptitude/CartList';

import ContractHome from '../pages/Contract/ContractHome';
import ContractDetail from '../pages/Contract/ContractDetail';
import ContractApplication from '../pages/Contract/ContractApplication';



import HomeScreen from '../pages/Home/Home';
import MyScreen from '../pages/Home/My';
import Concern from '../pages/Home/Concern';

import WorkScreen from '../pages/Home/Work';
import ApplicationDetail from '../pages/Application/ApplicationDetail';


import ProductHome from '../pages/Product/ProductHome';
import ProductDetail from '../pages/Product/ProductDetailScreen'; */

// import HomeScreen from '../pages/Home/Home';
import MyScreen from '../pages/Home/My';
import HomeScreen from '../pages/Home/HomeScreen';

import ProjectHome from '../pages/Project/ProjectHome';
import ProjectDetail from '../pages/Project/ProjectDetail';

import ContractHome from '../pages/Contract/ContractHome';
import ContractDetail from '../pages/Contract/ContractDetail';
import ContractApplication from '../pages/Contract/ContractApplication';

import AptitudeHome from '../pages/Aptitude/AptitudeHome';
import AptitudeDetail from '../pages/Aptitude/AptitudeDetail';
import AptitudeApplication from '../pages/Aptitude/AptitudeApplication';

import AcrossApplication from '../pages/Across/AcrossApplication';
import AcrossSearch from '../pages/Across/AcrossSearch';
import AcrossDetail from '../pages/Across/AcrossDetail';
import reInitAcross from '../pages/Across/reInitAcross';
import AcrossHandle from '../pages/Across/AcrossHandle';
import AptitudeModal from '../pages/Aptitude/AptitudeModal';

import WorkScreen from '../pages/Home/Work';
import SearchWork from '../pages/Search/SearchWork';
import ApplicationDetail from '../pages/Application/ApplicationDetail';
import Handle from '../pages/Application/Handle';

import SearchAll from '../pages/Search/SearchAll';

import ProductDetail from '../pages/Product/ProductDetail';
import ProductHome from '../pages/Product/ProductHome';

const HomeStack = createStackNavigator({
  Home: HomeScreen
}, {
  headerMode: 'none'
})

const MyStack = createStackNavigator({
  My: MyScreen,
}, {
  headerMode: 'none'
})

const WorkStack = createStackNavigator({
  Work: WorkScreen
}, {
  headerMode: 'none'
})


const MainTabNavigator = createBottomTabNavigator(
  {
    '首页': HomeStack,
    '工作台': WorkStack,
    '我的': MyStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch(routeName) {
          case '首页':
            iconName = focused ? require('../images/active_home.png') : require('../images/home.png');
            break;
          case '工作台':
            iconName = focused ? require('../images/active_work.png') : require('../images/work.png');
            break;
          default:
            iconName = focused ? require('../images/active_my.png') : require('../images/my.png');
        }
        return <Image source={iconName} style={{width: px(46), height: px(42)}} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#000',
      inactiveTintColor: '#000',
      style: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderTopColor: '#E9E9E9',
        /* position:'absolute',
        width: '100%',
        bottom: 0,
        height: px(104),
        zIndex: 2000 */
      }
    }
  }
)

MainTabNavigator.navigationOptions = {
  header: null
}

const MainStack = createStackNavigator(
  {
    /* HomeStack: {
      screen: HomeStack
    },
    AptitudeStack: {
      screen: AptitudeStack
    } */
    MainTabNavigator: MainTabNavigator,
    projectHome: ProjectHome,
    projectDetail: ProjectDetail,
    contractHome: ContractHome,
    contractDetail: ContractDetail,
    contractApplication: ContractApplication,
    aptitudeHome: AptitudeHome,
    aptitudeDetail: AptitudeDetail,
    aptitudeApplication: AptitudeApplication,
    applicationDetail: ApplicationDetail,
    acrossApplication: AcrossApplication,
    acrossSearch: AcrossSearch,
    acrossDetail:AcrossDetail,
    AcrossHandle:AcrossHandle,
    reInitAcross:reInitAcross,
    handle: Handle,
    searchAll: SearchAll,
    productDetail: ProductDetail,
    productHome: ProductHome,
    searchWork: SearchWork,
    aptitudeModal: AptitudeModal,
    /* aptitudeHome: AptitudeHome,
    aptitudeDetail: AptitudeDetail,
    aptitudeApplication: AptitudeApplication,
    aptitudeCart: CartList,
    contractHome: ContractHome,
    contractDetail: ContractDetail,
    contractApplication: ContractApplication,
    applicationDetail: ApplicationDetail,
    projectHome: ProjectHome,
    
    ConcernScreen: Concern,
    productHome: ProductHome,
    productDetail: ProductDetail,
    handle: Handle */
  },{
    initialRouteName: 'MainTabNavigator',
    headerMode: 'none',
    /* defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      
    }, */
  }
)



export default MainStack;