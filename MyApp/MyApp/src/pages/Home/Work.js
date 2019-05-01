import React from 'react';
import {px} from '../../utils/px';
import {Platform, Image, StyleSheet,FlatList, View,ActivityIndicator, TouchableOpacity, RefreshControl, Text, ScrollView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import HomeHeader from '../../components/fromKirin/HomeHeader';
import SearchBar from '../../components/fromKirin/SearchBar';
import Filter from '../../components/fromKirin/Filter';
import Profile from '../../components/fromKirin/Profile';
import Colors from '../../constants/Colors';
import RefreshFlatList from '../../components/fromKirin/RefreshFlatList';

import Shadows from '../../components/fromKirin/Shadows';

import { observer, inject } from 'mobx-react';
import { computed, action } from 'mobx';

function StatusTabs(props) {

  const _onPress = (item) => {
    props.onTabChanged(item)
  }

  return (
    <View style={{flexDirection: 'row', paddingTop: px(50),paddingBottom: px(90), backgroundColor: Colors.darkHeader}}>
      {props.data.map(item => {
        const colorNow = item.name === props.tabNow ? Colors.mainColorV2 : '#fff';
        return (
          <TouchableOpacity onPress={() => _onPress(item.name)} key={item.name} style={{justifyContent:'center', alignItems: 'center', flex:1}}>
            <Text style={[props.isSearching && {display: 'none'},{fontSize: 32, color: colorNow}]}>{item.count}</Text>
            <Text style={{fontSize: 16, marginTop: px(10), color: colorNow}}>{item.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function ApplicationCard(props) {
  return (
    <View style={[{paddingBottom: px(30)}]}>
    <TouchableOpacity 
      style={[{zIndex: 0 ,backgroundColor: '#fff', borderRadius: px(20), paddingHorizontal:px(30)}]}
      onPress = {() => props.onPressed(props.bizkey, props.taskId, props.processId, props.processName,props.currentTask)}
    >
      <View style={{paddingVertical: px(30), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor:'#E9E9E9'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{props.bizinfo}</Text>
      </View>
      <View style={{ paddingVertical: px(30), flexDirection:'row', alignItems: 'center'}}>
        <Profile
          size={px(70)} 
          range={px(20)}
          nameSize={13}
          avatar = {null}
          avatarName = {props.startUser}
          nameColor='#000'
          textColor='#989898'
          name={`${props.startUser} 提交的 ${props.processName}`}
          describe={`发起时间: ${props.startTime}`}
        />
        <View style={{alignItems:'center',justifyContent:'center'}}>
          {
            props.currentHandler !== '' &&
            <Text style={{fontSize: 12, color: Colors.mainColorV2}}>{props.currentHandler}</Text>
          }
          <Text style={{marginTop: px(10),fontSize: 12, color: Colors.mainColorV2}}>{props.currentTask}</Text>
        </View>
      </View>
    </TouchableOpacity>
    </View>
  )
}

@inject('rootStore')
@observer
export default class WorkScreen extends React.Component {

  @computed get ApplicationStore() {
    const { rootStore } = this.props;
    const { ApplicationStore } = rootStore;
    return ApplicationStore;
  }

  constructor(props) {
    super(props);
    this.state = {
      isAddVisible: false,
      height: 0,
      width: 0,
      refreshing: false,
      refreshState: 0,
      isSearching: false,
      searchValue: ''
    }
    this._add = this._add.bind(this);
    this._close = this._close.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._goToDetail = this._goToDetail.bind(this);
    this._onEndReach = this._onEndReach.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderEmpty = this._renderEmpty.bind(this);
    this._searchConfirm = this._searchConfirm.bind(this);
    this._search = this._search.bind(this);
    this._cancelSearching = this._cancelSearching.bind(this)
  }

  componentDidMount() {
    this.ApplicationStore.fetchApplications()
  }

  _add() {
    this.refs.add.measure((a,b,c,d,e,f) => {
      this.setState((prevState) => {
        if (d + f === prevState.height && c === prevState.width) {
          return {
            isAddVisible: !prevState.isAddVisible
          } 
        } else {
          return {
            isAddVisible: !prevState.isAddVisible,
            height: d + f,
            width: c
          }
        }
      })
    });
  }

  _close() {
    this.setState({
      isAddVisible: false
    })
  }

  _onRefresh() {
    this.ApplicationStore.fetchApplications()
  }

  /* _onRefresh() {
    this.setState({
      refreshing: true
    });
    setTimeout(() => {
      this.setState({
        refreshing: false
      })
    }, 1000)
  } */

  @action
  changeStatus = status => {
    this.ApplicationStore.changeStatus(status);
  }


  @action
  filter = options => {
    this.ApplicationStore.filter(options)
  }

  @action
  nextPage = () => {
    this.ApplicationStore.nextPage()
  }

  _fetchNext() {
    this.nextPage()
  }

  _changeStatus(status) {
    if(this.ApplicationStore.listNow.length > 0) {
      this.refs.worklist.scrollToIndex({
        animated: false,
        index: 0,
        viewPosition: 0
      }); 
    }
    this.changeStatus(status);
  }

  _goToDetail(id, taskId, processId, processName,currentTask) {
    if (processName.split('案例申请').length > 1 || processName.split('资质申请').length > 1 || processName.split('合同').length > 1) {
      this.props.navigation.navigate('applicationDetail', {
        bizkey: id,
        isUnhandle: this.ApplicationStore.statusNow === 'unhandle' ? true : false,
        taskId,
        processId
      });
    } else if(processName.split('跨省支撑申请') .length > 1) {
      this.props.navigation.navigate('acrossDetail', {
        bizkey: id,
        isUnhandle: this.ApplicationStore.statusNow === 'unhandle' ? true : false,
        taskId,
        processId,
        currentTask
      });
    } else {
      Alert.alert(
        '当前不支持该流程，请移步PC端处理',
        '功能即将上线，敬请期待',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    }
    
  }

  _onFilter(options) {
    if(this.ApplicationStore.listNow.length > 0) {
      this.refs.worklist.scrollToIndex({
        animated: false,
        index: 0,
        viewPosition: 0
      }); 
    }
    
    this.filter(options)
    console.log(options)
  }

  _keyExtractor = (item) => item.bizkey;

  _onEndReach() {
    /* const totalLength = this.ApplicationStore.applicationNum[`${this.ApplicationStore.statusNow}Num`];
    console.log(totalLength > this.ApplicationStore.listNow.length)
    if (totalLength > this.ApplicationStore.listNow.length && !this.ApplicationStore.isFootLoading) {
      this._fetchNext();
    } */
    console.log('end')
  }

  _renderFooter() {
    /* const isFootLoading = this.ApplicationStore.isFootLoading;
    const hasNext = this.ApplicationStore.applicationNum[`${this.ApplicationStore.statusNow}Num`] > this.ApplicationStore.listNow.length
    if (isFootLoading) {
      return (
        <View style={{ flex: 1, height: px(88), alignItems: 'center'}} >
          <ActivityIndicator size="small" color="#888888" />
        </View>
      )
    } else {
      if (hasNext || this.ApplicationStore.listNow.length === 0) {
        return (
          <View />
        )
      } else {
        return (
          <View style={{ flex: 1, height: px(88), alignItems: 'center'}} >
            <Text style={{color : '#888888'}}>—— 已经到底啦 ——</Text>
          </View>
        )
      }
    } */
    if (this.ApplicationStore.listNow.length === 0) {
      return (
        <View />
      )
    } else {
      return (
        <View style={{ flex: 1, height: px(88), alignItems: 'center'}} >
          <Text style={{color : '#888888'}}>—— 已经到底啦 ——</Text>
        </View>
      )
    }
  }

  _renderEmpty() {
    
    return (
      <View style={{flex: 1, marginTop: px(100),alignItems:'center',justifyContent:'center'}}>
        <Image style={{width: px(194), height: px(256)}} source={require('../../images/empty.png')} />
      </View> )
    
  }

  _search() {
    /* this.setState({
      isSearching: true
    }) */
    this.props.navigation.navigate('searchWork')
  }

  _searchConfirm() {
    console.log(this.state.searchValue)
  }

  _cancelSearching() {
    this.setState({
      isSearching: false
    })
  }


  render() {

    const statusNow = this.ApplicationStore.statusNow;
    const tabsData = [
      {
        name: 'unhandle',
        label: '待办',
        count: this.ApplicationStore.applicationNum.unhandleNum
      },
      {
        name: 'handle',
        label: '已办',
        count: this.ApplicationStore.applicationNum.handleNum
      },
      {
        name: 'mylaunch',
        label: '发起',
        count: this.ApplicationStore.applicationNum.mylaunchNum
      }
    ];

    const listNow = this.ApplicationStore.listNow;
    const filters = [
      {
        name: '时间',
        value: 'date',
        isSingle: true,
        options: [
          {
            name: '今天',
            value: 0
          },
          {
            name: '昨天',
            value: 1
          },
          {
            name: '近五天',
            value: 2
          }
        ]
      },
      {
        name: '类型',
        value: 'procType',
        isSingle: true,
        options: [
          {
            name: '合同',
            value: 'material_approval'
          },
          {
            name: '资质',
            value: 'aptitude'
          },
          {
            name: '产品',
            value: 'product'
          },
          {
            name: '方案',
            value: 'plan'
          },
          {
            name: '跨省支撑',
            value: 'oppo_process'
          }
        ]
      },
    ]

    const statusFilter = {
      name: '状态',
      value: 'procStatus',
      isSingle: true,
      options: [
        {
          name: '已完成',
          value: 1
        },
        {
          name: '正在处理',
          value: 2
        },
        {
          name: '已废弃',
          value: 3
        },
      ]
    }

    const shadowOpt = {
      width:px(750),
			height:px(110),
			color:"#000",
			border:2,
			radius:3,
			opacity:0.2,
			x:0,
			y:1,
    }

    const isLoading = this.ApplicationStore.isLoading;

    const filterNow = this.ApplicationStore.filterNow;

    return (

      <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
        {
          !!this.state.isAddVisible &&
          <TouchableOpacity onPress={this._close} style={[StyleSheet.absoluteFill, {zIndex: 1000}]} />
        }
        {
          !!this.state.isAddVisible &&
          <View style={{width: px(300),borderRadius:px(10), zIndex: 2000,backgroundColor:'#fff',position:'absolute', top:this.state.height + px(30),right: px(20)}}>
            <View
              style={{
                position:'absolute',
                top: -px(20), 
                right: this.state.width / 2,
                width: 0,
                height: 0,
                borderColor: 'transparent',
                borderLeftWidth: px(14),
                borderRightWidth: px(14),
                borderBottomWidth: px(20),
                borderBottomColor: '#fff'
              }}
            />
            <TouchableOpacity 
              style={{height: px(80),justifyContent:'center',alignItems:'center', borderBottomColor:'#E9E9E9', borderBottomWidth: StyleSheet.hairlineWidth}}
              onPress = {() => this.props.navigation.navigate('contractHome')}
            >
              <Text>案例合同申请</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{height: px(80),justifyContent:'center',alignItems:'center', borderBottomColor:'#E9E9E9', borderBottomWidth: StyleSheet.hairlineWidth}}
              onPress = {() => this.props.navigation.navigate('aptitudeHome')}
            >
              <Text>资质申请</Text>
            </TouchableOpacity>
          
              <TouchableOpacity onPress = {() => this.props.navigation.navigate('acrossApplication')}
                style={{height: px(80),justifyContent:'center',alignItems:'center', borderBottomColor:'#E9E9E9'}}
              >
                <Text>跨省支撑申请</Text>
              </TouchableOpacity>
            
          </View>
        }
        
        <HomeHeader
          style={styles.header}
          theme = 'dark'
          left = {
            <SearchBar 
              placeholder="输入工单号、发起人查询" 
              editable={this.state.isSearching}
              value = {this.state.searchValue}
              onPressed={this._search}
              onChangeText = {(searchValue) => this.setState({searchValue})}
              onSubmit = {this._searchConfirm}
            />
          }
          right = {
            <TouchableOpacity ref='add' onPress={this.state.isSearching ? this._cancelSearching : this._add} style={{minHeight: px(80),justifyContent:'center'}}>
              <Text style={{color: '#fff'}}>{this.state.isSearching ? '取消' : '发起'}</Text>
            </TouchableOpacity>
          }
        />
        {
          isLoading && (
            <View style={{padding:px(40), backgroundColor: Colors.darkHeader}}>
              <ActivityIndicator size={'large'} />
            </View>
          )
        }
        <View>
          <StatusTabs 
            data={tabsData} 
            tabNow={statusNow}
            isSearching = {this.state.isSearching}
            onTabChanged = {this._changeStatus}
          />
        </View>
        <Shadows style={{zIndex: 1000}} height={px(110)}>
          <Filter
            backgroundColor = '#fff' 
            style = {styles.shadow}
            filters={
              this.ApplicationStore.statusNow === 'unhandle' ?
              filters :
              [...filters, statusFilter]
            }
            checked = {filterNow} 
            onFilter={options => this._onFilter(options)}
          />
        </Shadows>
        {
          false && 
          <View style={[this.state.isSearching && {display: 'none'}, {paddingTop: 10, marginTop: -10, zIndex: 1000}]}>
            <Filter
              style = {styles.shadow}
              backgroundColor = '#fff' 
              filters={
                this.ApplicationStore.statusNow === 'unhandle' ?
                filters :
                [...filters, statusFilter]
              }
              checked = {filterNow} 
              onFilter={options => this._onFilter(options)}
            />
            <View style={{position:'absolute',backgroundColor:'#fff',width:'100%', height: 10, top:0,zIndex: 2000}} />
          </View>
        }
        
        <FlatList
          style = {{paddingTop: px(30), paddingHorizontal: px(30)}}
          horizontal={false}
          data={listNow}
          ref="worklist"
          onEndReached = {this._onEndReach}
          onEndReachedThreshold = {1}
          ListFooterComponent={this._renderFooter}
          ListEmptyComponent={this._renderEmpty}
          renderItem ={({item, index}) => {
            const {
              processCode,
              bizkey,
              bizinfo,
              startUser,
              processName,
              startTime,
              currentHandler,
              status,
              taskId,
              processId
            } = item;

            let currentTask = item.currentTask;

            if (currentTask === '' && status === 1) {
              currentTask = '已完成';
            } else if (currentTask === '' && status === 3) {
              currentTask = '已废弃';
            } else {
              currentTask = currentTask;
            }
            const isLast = index === listNow.length - 1;

            return (
              <ApplicationCard
                isLast = {isLast}
                bizkey = {bizkey}
                key = {processCode}
                taskId = {taskId}
                processId = {processId}
                bizinfo = {bizinfo}
                startUser = {startUser}
                processName = {processName}
                startTime = {startTime}
                currentHandler = {currentHandler}
                currentTask = {currentTask}
                onPressed = {this._goToDetail}
              />
            )
          }}
          keyExtractor={this._keyExtractor}
        />
        
          
          
     
          
        
      </SafeAreaView>
    );
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: px(30)
  },
  shadow: {
    ...Platform.select({
      ios: {
        /* shadowColor: 'black',
        
        shadowOffset: { height: -3 },
        shadowOpacity: 0.7,
        shadowRadius: 3, */
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
          width: 0,
          height: 0.5
        },
        shadowRadius: 5,
        shadowOpacity: 1
      },
      android: {
        
      },
    })
  }
});