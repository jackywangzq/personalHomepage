import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {log, logErr, logWarm} from '../../utils/logs';
import {Request, getDomain} from '../../utils/request';
import {dateFormat, dateDiff} from '../../utils/calendar';
import {getUserId} from '../../utils/user';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Colors from '../../constants/Colors.js'

// import { Tabs, Toast } from '@ant-design/react-native';
import { SafeAreaView } from 'react-navigation';
import ListInputItem from '../../components/fromKirin/ListInputItem';
import Radios from '../../components/fromKirin/Radios';
import DateChoose from '../../components/fromKirin/DateChoose';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';
import ListItem from '../../components/fromKirin/ListItem';
import PickerWidget from '../../components/fromKirin/PickerWidget';


export default class ContractApplication extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      kBaseId: '',
      topic: '',
      productDescribe: '',
      customer: '',
      price: '',
      other: '',
      selectOriginal: new Map(),
      selectScan: new Map(),
      startDate: new Date().getTime(),
      endDate: new Date().getTime() + 86400000 * 3,
      hasHeaderBottom: false,
      headerNow: '案例合同申请',
      approverModalVisible: false,
      approverList: [],
      approverId: '',
      userId: '',
      org2Id: '',
      orgId: '',
      login: '',


      pickerVisible: false,
      productType: ''


    };
    this.fileOptions = [
      {
        label: '合同关键页',
        value: '合同关键页'
      },
      {
        label: '中标通知书',
        value: '中标通知书'
      },
      {
        label: '验收报告',
        value: '验收报告'
      }
    ];
    this._selectDate = this._selectDate.bind(this);
    this._openApproverModal = this._openApproverModal.bind(this);
    this._closeApproverModal = this._closeApproverModal.bind(this);
    this._submit = this._submit.bind(this);
  }
  

  componentWillMount() {
    const { navigation } = this.props;
    const contractId = navigation.getParam('contractId', '111');
    const contractName = navigation.getParam('contractName', '111');
    this.setState({
      kBaseId: contractId,
      topic: contractName + ' - 案例申请'
    })
    this._getUserInfo();
    setTimeout(() => {
      this.getNext();
    }, 100)
  }

  async _getUserInfo() {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const {id, login, orgId, org2Id} = JSON.parse(userInfo);
    log(orgId)
    this.setState({
      userId: id,
      orgId,
      org2Id,
      login
    })
  }

  async getNext() {
    try {
      const result = await Request.get(`userContl/findProcRole?orgId=${this.state.org2Id}&roleCode=dept_leader`);
      const {respCode, respDesc, userList} = result;
      if(respCode === '001') {
        if (userList.length === 0) {
          /* Alert.alert(
            '您暂时无法进行案例合同申请',
            '',
            [
              {text: '确定', onPress: () => this._goBack()},
            ],
            { cancelable: false }
          ) */
        } else {
          this.setState({
            approverList: userList,
            approverId: userList.length === 1 ? userList[0].id : ''
          });
        }
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
    } catch (error) {
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

  _goBack() {
    this.props.navigation.goBack();
  }

  _changeScroll(e) {
    const scrollNow = e.nativeEvent.contentOffset.y;
    if (scrollNow > 0) {
      this.setState({
        hasHeaderBottom: true
      })
    } else {
      this.setState({
        hasHeaderBottom: false
      })
    }
    if(scrollNow > px(90)) {
      this.setState({
        headerNow: this.state.title
      })
    } else {
      this.setState({
        headerNow: '案例合同申请'
      })
    }
  }

  _changeRadio(value, name) {
    const selected = new Map(this.state[name]);
    selected.set(value, !selected.get(value));
    switch(name) {
      case 'selectOriginal':
        this.setState({
          selectOriginal: selected
        })
        break;
      default :
        this.setState({
          selectScan: selected
        })
    }
  }

  _selectDate(s,e) {
    this.setState({
      startDate: new Date(s).getTime(),
      endDate: new Date(e).getTime()
    })
  }

  _openApproverModal() {
    this.setState({
      approverModalVisible: true
    })
  }

  _closeApproverModal() {
    this.setState({
      approverModalVisible: false
    })
  }

  _chooseApprover(id) {
    this.setState({
      approverId: id,
      approverModalVisible: false
    })
  }

  async _submit() {
    const {
      kBaseId,
      topic,
      productDescribe,
      customer,
      price,
      other,
      selectOriginal,
      selectScan,
      startDate,
      endDate,
      approverId
    } = this.state;
    if (productDescribe === '' || customer === '' || price === '' || approverId==='') {
      Alert.alert(
        '请填写完整信息 ',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    } else {
      const req = {
        remark: productDescribe,
        applyType: 'CASE',
        kBaseId: kBaseId,
        topic,
        login: this.state.login,
        applyPerson: this.state.userId,
        personName: customer,
        estimatedAmount: price,
        selectId: JSON.stringify([...selectOriginal].filter(item => item[1]).map(item => item[0])),
        selectidCopy: JSON.stringify([...selectScan].filter(item => item[1]).map(item => item[0])),
        fileType: '[]',
        applyDate: new Date().getTime(),
        applyText: other,
        startTime: dateFormat(startDate, 'L'),
        endTime: dateFormat(endDate, 'L'),
        approvalPerson: approverId
      };
      try {
        const result = await Request.post(`userContl/saveApply`, req);
        const {respCode, respDesc} = result;
        if (respCode === '001') {
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
      } catch (err) {
        Alert.alert(
          '请求后台服务失败，请重试',
          '',
          [
            {text: '确定'},
          ],
          { cancelable: false }
        )
      } 
      console.log(req)
    }
    
  }

  render() {

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor: Colors.backgroundNew}}>
        <Header
          headerBackground={Colors.aliHeader}
          title={this.state.headerNow}
          style={[ this.state.hasHeaderBottom ? detailStyles.borderBottom : {}]}
        />
        <ScrollView scrollEventThrottle = {10} onScroll={this._changeScroll.bind(this)}>
          <View style={detailStyles.container}>
            <View>
              <Text style={detailStyles.title}>{this.state.topic}</Text>
            </View>
            <View style={{marginBottom:px(30), paddingVertical: px(20)}}>
              <ListInputItem
                autoFocus = {false}
                multiline = {true}
                placeholder="请填写项目说明"
                title = "项目说明"
                value = {this.state.productDescribe}
                onChangeText = {(productDescribe) => this.setState({productDescribe})}
              />
              <ListInputItem
                placeholder="请填写客户名称"
                title = "客户名称"
                value = {this.state.customer}
                onChangeText = {(customer) => this.setState({customer})}
              />
              
              <ListInputItem
                placeholder="请填写金额"
                title = "项目预计金额"
                unit="万元"
                value = {this.state.price}
                onChangeText = {(price) => this.setState({price})}
              />
              <ListItem
                title = "原件申请"
                isColumn = {true}
                isNeeded = {false}
              >
                <Radios
                  options = {this.fileOptions}
                  selected = {this.state.selectOriginal}
                  onChange = {(value) => this._changeRadio(value, 'selectOriginal')}
                />
              </ListItem>
              <ListItem
                title = "扫描件申请"
                isColumn = {true}
                isNeeded = {false}
              >
                <Radios
                  options = {this.fileOptions}
                  selected = {this.state.selectScan}
                  onChange = {(value) => this._changeRadio(value, 'selectScan')}
                />
              </ListItem>
              <ListInputItem
                placeholder="请填写其它申请内容"
                title = "申请备注"
                multiline = {true}
                isNeeded = {false}
                value = {this.state.other}
                onChangeText = {(other) => this.setState({other})}
              />
              <ListItem
                title = "使用时间"
                isColumn = {true}
                isNeeded = {true}
              >
                <DateChoose 
                  startDate={this.state.startDate} 
                  endDate={this.state.endDate} 
                  onRangeSelected = {this._selectDate}
                />
              </ListItem>
              <ListItem
                title = "审批人"
                isLast={false}
                isColumn = {true}
                isNeeded = {true}
              >
                {
                  this.state.approverId !== '' ?
                    <Profile
                      nameColor='#000' 
                      avatar={null}
                      canTouch={this.state.approverList.length > 0}
                      onPress={() => this._openApproverModal()}
                      avatarName={this.state.approverList.find(item => item.id === this.state.approverId).name}
                      name={this.state.approverList.find(item => item.id === this.state.approverId).name}
                      describe={this.state.approverList.find(item => item.id === this.state.approverId).phone}
                    />
                  :
                  <TouchableOpacity onPress={this._openApproverModal}>
                    <View style={{justifyContent:'center',alignItems: 'center', height:px(90), width:px(90), borderRadius: px(45), backgroundColor: '#fff'}}>
                      <View style={{backgroundColor: Colors.lightText, marginTop:-px(2), position:'absolute', top: '50%', width: px(45), height: px(4)}} />
                      <View style={{backgroundColor: Colors.lightText, marginLeft:-px(2), position:'absolute', left: '50%', height: px(45), width: px(4)}} />
                    </View>
                  </TouchableOpacity>
                }
              </ListItem>

            </View>
          </View>
          <View style={[detailStyles.footer]}> 
            <View style={{flexDirection: 'row', alignItems:'center'}}>
              <TouchableOpacity 
                onPress={this._submit} 
                style={[detailStyles.footerBtn, {backgroundColor: Colors.mainColorV2}]}>
                <Text style={detailStyles.footerBtnText}>提交申请</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.approverModalVisible}
          >
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor: '#fff', marginHorizontal: px(30),borderRadius:px(20),  width: px(690)}}>
              <View style={{ height: px(120),borderBottomWidth: 1, borderBottomColor: Colors.hairlineColor, width: '100%', justifyContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>请选择审批人</Text>
              </View>
              <View style={{height: px(800)}}>
              <ScrollView>
              {
                this.state.approverList.map((item, index) => {
                  const isLast = this.state.approverList.length === index + 1;
                  return (
                    <TouchableOpacity key={item.id} onPress={() => this._chooseApprover(item.id)} style={{paddingHorizontal:px(30), padding:px(12), borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth, borderBottomColor: '#ebedf0'}}>
                      <Profile
                        size={px(80)} 
                        range={px(30)}
                        nameSize={16}
                        avatar={null}
                        avatarName = {item.name}
                        name={item.name}
                      />
                    </TouchableOpacity>
                  )
                })  
              }
              </ScrollView>
              </View>
              <TouchableOpacity onPress={this._closeApproverModal} style={{height:px(120), width:'100%', justifyContent: 'center', alignItems:'center', borderTopWidth: 1, borderTopColor: Colors.hairlineColor,}}>
                <Text>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}

const detailStyles = StyleSheet.create({
  backHeader: {
    height: px(480),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    position: 'absolute'
  },
  container: {
    paddingHorizontal: px(30),
    paddingTop: px(40),
    paddingBottom: px(10),
    backgroundColor: Colors.backgroundNew,
    borderTopLeftRadius: px(20),
    borderTopRightRadius: px(20)
  },
  title: {
    marginBottom: px(40),
    fontSize: 24,
    lineHeight: 30
  },
  borderBottom: {
    borderBottomColor: '#ebedf0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  borderTop: {
    borderTopColor: '#ebedf0',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    height: px(100),
    flexDirection: 'row',
    paddingHorizontal: px(30),
    backgroundColor: Colors.backgroundNew,
    justifyContent: 'center',
    alignItems:'center'
  },
  footerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(40),
    borderRadius: px(40),
    height: px(80),
    width: '100%'
  },
  footerBtnLeft: {
    backgroundColor: Colors.mainLight,
    borderTopRightRadius : 0,
    borderBottomRightRadius: 0
  },
  footerBtnRight: {
    backgroundColor: Colors.mainColor,
    borderTopLeftRadius : 0,
    borderBottomLeftRadius: 0
  },
  footerBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
})