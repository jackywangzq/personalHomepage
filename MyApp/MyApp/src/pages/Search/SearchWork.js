import React from 'react';
import {px} from '../../utils/px';
import {Platform, Image, StyleSheet,FlatList, View,ActivityIndicator, TouchableOpacity, RefreshControl, Text, ScrollView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import HomeHeader from '../../components/fromKirin/HomeHeader';
import SearchBar from '../../components/fromKirin/SearchBar';
import Filter from '../../components/fromKirin/Filter';
import Profile from '../../components/fromKirin/Profile';
import Colors from '../../constants/Colors';

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
      onPress = {() => props.onPressed(props.bizkey, props.taskId, props.processId, props.processName)}
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
export default class SearchWork extends React.Component {
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
      searchValue: '',
      isFocus: true
    }
    this._cancelSearching = this._cancelSearching.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._searchConfirm = this._searchConfirm.bind(this);
    this._onSearchFocus = this._onSearchFocus.bind(this);
    this._onSearchBlur = this._onSearchBlur.bind(this);
  }

  @action
  changeStatus = status => {
    this.ApplicationStore.changeSearchStatus(status);
  }

  @action
  searchValue = value => {
    this.ApplicationStore.search(value);
  }

  _cancelSearching() {
    this.props.navigation.goBack(null);
  }

  _changeStatus(status) {
    /* if(this.ApplicationStore.listNow.length > 0) {
      this.refs.worklist.scrollToIndex({
        animated: false,
        index: 0,
        viewPosition: 0
      }); 
    } */
    this.changeStatus(status);
  }

  _searchConfirm() {
    console.log(this.state.searchValue)
    this.searchValue(this.state.searchValue)
  }

  _renderEmpty() {
    
    return (
      <View style={{flex: 1, marginTop: px(100),alignItems:'center',justifyContent:'center'}}>
        <Image style={{width: px(194), height: px(256)}} source={require('../../images/empty.png')} />
      </View> )
    
  }

  _onSearchFocus() {
    this.setState({
      isFocus: true
    })
  }

  _onSearchBlur() {
    this.setState({
      isFocus: false
    })
  }

  _keyExtractor = (item) => item.bizkey;

  render() {
    const statusNow = this.ApplicationStore.searchStatusNow;
    const tabsData = [
      {
        name: 'unhandle',
        label: '待办',
      },
      {
        name: 'handle',
        label: '已办',
      },
      {
        name: 'mylaunch',
        label: '发起',
      }
    ];
    const isLoading = this.ApplicationStore.isSearchLoading;

    const listNow = this.ApplicationStore.searchListNow;
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
        <HomeHeader
          style={styles.header}
          theme = 'dark'
          left = {
            <SearchBar 
              placeholder="输入工单号、发起人查询" 
              editable={true}
              value = {this.state.searchValue}
              onChangeText = {(searchValue) => this.setState({searchValue})}
              onSubmit = {this._searchConfirm}
              onFocus = {this._onSearchFocus}
              onBlur = {this._onSearchBlur}
            />
          }
          right = {
            <TouchableOpacity ref='add' onPress={this._cancelSearching} style={{minHeight: px(80),justifyContent:'center'}}>
              <Text style={{color: '#fff'}}>取消</Text>
            </TouchableOpacity>
          }
        />
        <View style={[this.state.isFocus && {display: 'none'}, {flex: 1}]}>
          <StatusTabs 
            data={tabsData} 
            tabNow={statusNow}
            onTabChanged = {this._changeStatus}
          />
          {
            isLoading && (
              <View style={{flex:1, padding:50}}>
                <ActivityIndicator />
              </View>
            )
          }
          <FlatList
            style = {[isLoading && {display:'none'},{paddingTop: px(30), paddingHorizontal: px(30)}]}
            horizontal={false}
            data={listNow}
            ref="worklist"
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
        </View>
      </SafeAreaView>
    )
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
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    })
  }
});