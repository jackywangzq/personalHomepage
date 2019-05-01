import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {log, logErr, logWarm} from '../../utils/logs';
import {Request} from '../../utils/request';
import {getUserId} from '../../utils/user';
import {dateFormat, dateDiff} from '../../utils/calendar';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Modal,
  Image
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { observer, inject } from 'mobx-react';
import { computed, action } from 'mobx';

import Colors from '../../constants/Colors.js'

import { SafeAreaView } from 'react-navigation';
import Header from '../../components/fromKirin/Header';
import ListInputItem from '../../components/fromKirin/ListInputItem';
import ListItem from '../../components/fromKirin/ListItem';
import Radios from '../../components/fromKirin/Radios';
import SectionRadios from '../../components/fromKirin/SectionRadios';
import DateChoose from '../../components/fromKirin/DateChoose';
import Profile from '../../components/fromKirin/Profile';
import { isTSTypeAliasDeclaration } from '@babel/types';

@inject('rootStore')
@observer
export default class AcrossHandle extends React.Component {

  @computed get ApplicationStore() {
    const { rootStore } = this.props;
    const { ApplicationStore } = rootStore;
    return ApplicationStore;
  }

  constructor(props) {
    super(props);
    this.state = {
      title:'审批意见',
      remark:'',
      userId:'',
      orgId:'',
      org2Id:'',

      isOk:false,
      taskId:'',
      style:'',
      currentTask:'',
      bizkey:'',
      fjStatus:''
    }

    this._submit = this._submit.bind(this);
  }
  async _getUserInfo() {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const {id, login, orgId, org2Id} = JSON.parse(userInfo);
    log(orgId)
    this.setState({
      userId: id,
      orgId,
      org2Id
    })
  }

  componentWillMount() {
    const { navigation } = this.props;
    this._getUserInfo();
    const data = navigation.getParam('data', null);
    this.setState({
      taskId:data.taskId,
      style:data.style,
      isOk:data.isOk,
      currentTask:data.currentTask,
      bizkey:data.bizkey,
      fjStatus:1
    })
  }
  async _submit() {

    const userId = this.state.userId;
    const taskId = this.state.taskId;
    const style = this.state.style;
    const remark = this.state.remark;
    const currentTask = this.state.currentTask;
    const bizkey = this.state.bizkey;
    const fjStatus = this.state.fjStatus;

    let result = '';
    if (remark.length === 0 && !this.state.isOk) {
      Alert.alert(
        '退回时审批意见不可为空',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    } else {
      
        if(currentTask == '集团派单' || this.state.currentTask == '领导审批') {
          try {
            result = await Request.post('oppo/completeTask', {
              taskId,
              remark,
              style,
              userId
            })
            const {retCode, msg,data} = result;
            if (retCode == 200) {
              this.ApplicationStore.fetchApplications();
              this.props.navigation.navigate('工作台')
            } else {
              Alert.alert(
                '出错啦',
                msg,
                [
                  {text: '确定'},
                ],
                { cancelable: false }
              )
            }
          } catch(err) {
            Alert.alert(
            '请求后台服务失败，请重试',
            '',
            [
              {text: '确定'},
            ],
            { cancelable: false }
          )
        }
      } else if(currentTask == '跨省支撑' && style == 'back') {
        try {
          result = await Request.post('oppo/taskEndOfProcess', {
            taskId,
            remark,
            condition:style,
            bizkey,
            fjStatus,
            userId
          })
          const {retCode, message,data} = result;
          if(retCode == 200) {
            result = await Request.post('oppo/deleteByOrderId', {
              bizkey
            })
            const {respCode,respDesc} = result;
            if (respCode == '001') {
              this.ApplicationStore.fetchApplications();
              this.props.navigation.navigate('工作台')
            } else {
              Alert.alert(
                '出错啦',
                respDesc,
                [
                  {text: '确定'},
                ],
                { cancelable: false }
              )
            }
          } else {
            Alert.alert(
              '出错啦',
              msg,
              [
                {text: '确定'},
              ],
              { cancelable: false }
            )
          }
        
        } catch(err) {
          Alert.alert(
          '请求后台服务失败，请重试',
          '',
          [
            {text: '确定'},
          ],
          { cancelable: false }
        )
      }
    } else if(currentTask == '支撑确认' && style == 'back') {
      try {
        result = await Request.post('oppo/taskEndOfProcess', {
          taskId,
          remark,
          condition:style,
          bizkey,
          fjStatus,
          userId
        })
        const {retCode, message,data} = result;
        if(retCode == 200) {
          result = await Request.post('oppo/updateByworkOrderId', {
            bizkey
          })
          const {respCode,respDesc} = result;
          if (respCode == '001') {
            this.ApplicationStore.fetchApplications();
            this.props.navigation.navigate('工作台')
          } else {
            Alert.alert(
              '出错啦',
              respDesc,
              [
                {text: '确定'},
              ],
              { cancelable: false }
            )
          }
        } else {
          Alert.alert(
            '出错啦',
            msg,
            [
              {text: '确定'},
            ],
            { cancelable: false }
          )
        }
      
      } catch(err) {
        Alert.alert(
        '请求后台服务失败，请重试',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    }
  }
  }
}

  render() {
    
    return (
    <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor: Colors.background}}>
      <Header
          title={this.state.title}
          style={styles.shadow}
        />
      <ScrollView>
      
        <View style={{paddingHorizontal: px(30), paddingVertical: px(40)}}>
          <ListInputItem
            autoFocus = {false}
            isNeeded = {!this.state.isOk}
            multiline = {true}
            numberOfLines = {4}
            placeholder={this.state.isOk ? "请填写审批意见" : "退回时审批意见为必须"}
            title = "审批意见"
            value = {this.state.remark}
            onChangeText = {(remark) => this.setState({remark})}
          /> 
        </View>
    
        </ScrollView>
        <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
    paddingHorizontal: px(30),}}>
        <TouchableOpacity 
          onPress={this._submit} 
          style={[styles.footerBtn, {width: '100%', backgroundColor: Colors.mainColorV2}]}>
          <Text style={styles.footerBtnText}>确认</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    )
  }
  
}

const styles = StyleSheet.create({
  header: {
    padding: px(30)
  },
  container: {
    paddingHorizontal: px(30),
    paddingTop: px(40),
    paddingBottom: px(10),
    borderTopLeftRadius: px(20),
    borderTopRightRadius: px(20)
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
        elevation: 4,
      },
    })
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: px(40)
  },
  card: {
    borderRadius:px(10), backgroundColor: '#fff', paddingHorizontal:px(30), paddingVertical: px(40)
  },
  footerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(40),
    borderRadius: px(40),
    height: px(80),
    width: '100%'
  },
  footerBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
});