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

@inject('rootStore')
@observer
export default class Handle extends React.PureComponent {

  @computed get ApplicationStore() {
    const { rootStore } = this.props;
    const { ApplicationStore } = rootStore;
    return ApplicationStore;
  }

  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
      statusNow: '',
      title: '',
      original: [],
      scan: [],
      fileType: [],
      selectedOriginal: new Map(),
      selectedScan: new Map(),
      express: '',
      remark: '',
      isOk: false,
      isHandle: false,
      taskId: '',
      bizkey: '',
      userId: '',
      orgId: '',
      org2Id: '',
      approverList: [],
      approverId: '',
      approverModalVisible: false,
      step: '',
      type: '',
      needLeader: false,

      topic: '',
      proDes: '',
      proName: '',
      proFee: '',
      selectOriginal: new Map(),
      selectScan: new Map(),
      selectFile: new Map(),
      materialNote: '',
      startDate: new Date().getTime(),
      endDate: new Date().getTime() + 86400000 * 3,
    }
    /* this.isCheck = navigation.getParam('isCheck', false);
    this.isOk = navigation.getParam('isOk', false);
    this.taskId = navigation.getParam('taskId', '');
    this.bizkey = navigation.getParam('bizkey', '');
    this.processType = navigation.getParam('processType', '');
    this.statusNow = navigation.getParam('statusNow', ''); */
    this._submit = this._submit.bind(this);
    this._selectDate = this._selectDate.bind(this);
    this._openApproverModal = this._openApproverModal.bind(this);
    this._closeApproverModal = this._closeApproverModal.bind(this);

    this.fileOptions = [
      {
        label: '原件',
        value: '原件'
      },
      {
        label: '扫描件',
        value: '扫描件'
      }
    ];
    this.fileOptionsCase = [
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
  }

  componentWillMount() {
    const { navigation } = this.props;
    this._getUserInfo();
    const data = navigation.getParam('data', null);
    console.log(data)
    if (data) {
      const needLeader = data.statusNow.split('地市').length > 1 && data.type === 'INTE';
      const needInfo = data.handleType === 'handleNo' && data.isOk;
      console.log(needLeader)
      const step = data.statusNow.split('地市').length > 1 ? 's1' : 's2';
      let title = '';
      switch(data.handleType) {
        case 'handle':
          title = '增加处理过程';
          break;
        case 'check':
          title = '增加审批意见';
          break;
        case 'handleNo':
          title = '关闭申请';
          break;
        case 'confirm':
          title = '增加确认意见';
          break;
        default:
          title = ''
      }
      if(needInfo) {
        title = '重新发起申请'
      }
      this.setState({
        handleType: data.handleType,
        title,
        isOk: data.isOk,
        taskId: data.taskId,
        bizkey: data.bizkey,
        type: data.type,
        step,
        needLeader,
        kapplyRelationId: data.kapplyRelationId
      })
      if(data.handleType === 'handle') {
        this.setState({
          fileType: data.fileType,
          original: data.original,
          scan: data.scan
        })
      }
      if (needInfo) {
        const info = navigation.getParam('applyInfo', null);
        if(info) {
          const {proDes, proName, proFee, materialNote, startDate, endDate, topic} = info;
          this.setState({
            proDes,
            proName,
            proFee,
            selectOriginal: new Map(data.original.map(item => [item, true])),
            selectScan: new Map(data.scan.map(item => [item, true])),
            selectFile: new Map(data.fileType.map(item => [item, true])),
            materialNote,
            startDate,
            endDate,
            topic
          })
        }
        setTimeout(() => {
          this.getNext(false);
        }, 1)
      }
      !!needLeader && this.getNext(true);
    }
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

  async getNext(isProvince) {
    const querys = isProvince ? `orgId=${this.state.orgId}&roleCode=prov_leader` : `orgId=${this.state.org2Id}&roleCode=dept_leader`;
    try {
      const result = await Request.get(`userContl/findProcRole?${querys}`);
      const {respCode, respDesc, userList} = result;
      if(respCode === '001') {
        this.setState({
          needLeader: true,
          approverList: userList,
          approverId: userList.length === 1 ? userList[0].id : ''
        });
      } else {
        this.setState({
          needLeader: false,
          step: 's2'
        })
        /* Alert.alert(
          respDesc,
          '',
          [
            {text: '确定'},
          ],
          { cancelable: false }
        ) */
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

  _changeProvide(value, name, type) {
    const selected = new Map(this.state[type].get(name));
    selected.set(value, !selected.get(value));
    const selectedAll = new Map(this.state[type]);
    selectedAll.set(name, selected);
    console.log(selectedAll)
    if (type === 'selectedOriginal') {
      this.setState({
        selectedOriginal: selectedAll 
      })
    } else {
      this.setState({
        selectedScan: selectedAll 
      })
    }
  }

  _formatFile(res) {
    const format = [...res].map(item => {
      return {
        name: this._formatFileName(item[0]),
        provider: [...item[1]].filter(item => item[1]).map(item => item[0])[0]
      }
    })
    return format
  }

  _formatFileName(name) {
    let result = '';
    switch(name) {
      case '合同关键页':
        result = 0;
        break;
      case '中标通知书':
        result = 1;
        break;
      case '验收报告':
        result = 2;
        break;
      case '原件':
        result = 0;
        break;
      case '扫描件':
        result = 1;
        break;
      default:
        result = name;
    }
    return result;
  }

  async _submit() {
    const userId = await getUserId();
    const taskId = this.state.taskId;
    const applyInfoId = this.state.bizkey;
    const type = this.state.type;
    if(this.state.handleType === 'handle') {
      const selectedOriginal = this.state.selectedOriginal;
      const selectedScan = this.state.selectedScan;
      const data = {
        express: this.state.express,
        remark: this.state.remark,
        original: JSON.stringify(this._formatFile(selectedOriginal)),
        scan: JSON.stringify(this._formatFile(selectedScan))
      }
      try {
        const result = await Request.post('userContl/headDeal', {
          taskId,
          applyInfoId,
          type,
          userId,
          data: JSON.stringify(data)
        })
        const {status, msg} = result;
        if (status === 0) {
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
    } else if (this.state.handleType === 'confirm') {
      if (this.state.remark.length === 0 && !this.state.isOk) {
        Alert.alert(
          '退回时审批意见不可为空',
          '',
          [
            {text: '确定'},
          ],
          { cancelable: false }
        )
      } else {
        try {
          result = await Request.post('userContl/applyDeal', {
            taskId,
            applyInfoId,
            remark: this.state.remark,
            type,
            result: this.state.isOk ? 'Y' : 'N',
            userId
          })
          const {status, msg} = result;
          if (status === 0) {
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
      }
      
    } else if (this.state.handleType === 'check') {
      console.log()
      if (this.state.remark.length === 0 && !this.state.isOk) {
        Alert.alert(
          '退回时审批意见不可为空',
          '',
          [
            {text: '确定'},
          ],
          { cancelable: false }
        )
        return
      }
      try {
        let result;
        if (this.state.type === 'INTE') {
          result = await Request.post('userContl/qualificationLeaderDeal', {
            taskId,
            applyInfoId: this.state.bizkey,
            step: this.state.step,
            remark: this.state.remark,
            result: this.state.isOk ? 'Y' : 'N',
            provLeader: this.state.approverId,
            userId
          })
        } else {
          result = await Request.post('userContl/caseLeaderDeal', {
            taskId,
            applyInfoId,
            approvalText: this.state.remark,
            result: this.state.isOk ? 'Y' : 'N',
            userId
          })
        }
        const {status, msg} = result;
        if (status === 0) {
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
    } else if (this.state.handleType === 'handleNo') {
      let result;
      try {
        if (!this.state.isOk) {
          result = await Request.post('userContl/applyClose', {
            taskId,
            applyInfoId,
            remark: this.state.remark,
            type,
            result: 'fail',
            userId
          })
          const {status, msg} = result;
          if (status === 0) {
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
        } else {
          result = await Request.post('userContl/toReSaveApplyCase', {
            remark: this.state.proDes,
            kapplyInfoId: this.state.bizkey,
            kapplyRelationId: this.state.kapplyRelationId,
            taskId,
            applyType: this.state.type,
            topic: this.state.topic,
            userId,
            applyDate: new Date().getTime(),
            personName: this.state.proName,
            estimatedAmount: this.state.proFee + '',
            selectId: JSON.stringify([...this.state.selectOriginal].filter(item => item[1]).map(item => item[0])),
            selectidCopy: JSON.stringify([...this.state.selectScan].filter(item => item[1]).map(item => item[0])),
            fileType: JSON.stringify([...this.state.selectFile].filter(item => item[1]).map(item => item[0])),
            applyText: this.state.materialNote,
            startTime: dateFormat(this.state.startDate, 'L'),
            endTime: dateFormat(this.state.endDate, 'L'),
            approvalPerson: this.state.approverId
          })
          const {respCode, respDesc} = result;
          if (respCode === '001') {
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
        }
      } catch(err) {
        console.log(err)
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

  _openApproverModal() {
    console.log(this.state.approverList)
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

  _selectDate(s,e) {
    this.setState({
      startDate: new Date(s).getTime(),
      endDate: new Date(e).getTime()
    })
  }

  _changeRadio(value, name) {
    if (this.state.type === 'INTE') {
      const selected = new Map(this.state.selectFile);
      selected.set(value, !selected.get(value));
      this.setState({
        selectFile: selected
      })
    } else {
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
  }

  render() {
    const provider = [
      {
        label: '邮寄',
        value: 1
      },
      {
        label: '现场支撑',
        value: 2
      },
      {
        label: '不提供',
        value: 3
      }
    ];
    return (

    
    <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor: Colors.background}}>
      <Header
          title={this.state.title}
          style={styles.shadow}
        />
      <ScrollView>
      {
        this.state.handleType === 'check' &&
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
          {
            this.state.needLeader &&
            <ListItem
                title = "审批人"
                isLast={true}
                isColumn = {true}
                isNeeded = {true}
              >
                {
                  this.state.approverId !== '' ?
                    <Profile
                      nameColor='#000' 
                      avatar={null}
                      canTouch={this.state.approverList.length > 1}
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
          }
          
        </View>
        
      }
      {
        (this.state.handleType === 'handleNo' && !this.state.isOk) && 
        <View style={{paddingHorizontal: px(30), paddingVertical: px(40)}}>
          <ListInputItem
            autoFocus = {false}
            isNeeded = {false}
            multiline = {true}
            numberOfLines = {4}
            placeholder={"请填写申请人意见"}
            title = "申请人意见"
            value = {this.state.remark}
            onChangeText = {(remark) => this.setState({remark})}
          />
        </View>
      }
      {
        (this.state.handleType === 'handleNo' && this.state.isOk) && 
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>{this.state.topic}</Text>
          </View>
          <View style={{marginBottom:px(30), paddingVertical: px(20)}}>
            <ListInputItem
              autoFocus = {true}
              multiline = {true}
              placeholder="请填写项目说明"
              title = "项目说明"
              value = {this.state.proDes}
              onChangeText = {(proDes) => this.setState({proDes})}
            />
            <ListInputItem
              placeholder="请填写客户名称"
              title = "客户名称"
              value = {this.state.proName}
              onChangeText = {(proName) => this.setState({proName})}
            />
            <ListInputItem
              placeholder="请填写金额"
              keyboardType="numeric"
              title = "项目预计金额"
              unit="万元"
              value = {this.state.proFee}
              onChangeText = {(proFee) => this.setState({proFee})}
            />
            {
              this.state.type === 'INTE' ? 
              <ListItem
                title = "文件类型"
                isColumn = {true}
                isNeeded = {false}
              >
                <Radios
                  style = {{justifyContent: 'flex-start'}}
                  itemStyle = {{marginRight: px(50)}}
                  options = {this.fileOptions}
                  selected = {this.state.selectFile}
                  onChange = {(value) => this._changeRadio(value)}
                />
              </ListItem>
              :
              <View>
                <ListItem
                  title = "原件申请"
                  isColumn = {true}
                  isNeeded = {false}
                >
                  <Radios
                    options = {this.fileOptionsCase}
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
                    options = {this.fileOptionsCase}
                    selected = {this.state.selectScan}
                    onChange = {(value) => this._changeRadio(value, 'selectScan')}
                  />
                </ListItem>
              </View>
            }
            <ListInputItem
              placeholder="请填写其它申请内容"
              title = "申请备注"
              multiline = {true}
              isNeeded = {false}
              value = {this.state.materialNote}
              onChangeText = {(materialNote) => this.setState({materialNote})}
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
              isLast={true}
              isColumn = {true}
              isNeeded = {true}
            >
              {
                this.state.approverId !== '' ?
                  <Profile
                    nameColor='#000' 
                    avatar={null}
                    canTouch={this.state.approverList.length > 1}
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
      }
      {
        this.state.handleType === 'confirm' &&
        <View style={{paddingHorizontal: px(30), paddingVertical: px(40)}}>
          <ListInputItem
            autoFocus = {false}
            isNeeded = {!this.state.isOk}
            multiline = {true}
            numberOfLines = {4}
            placeholder={this.state.isOk ? "请填写确认意见" : "退回时确认意见为必须"}
            title = "确认意见"
            value = {this.state.remark}
            onChangeText = {(remark) => this.setState({remark})}
          />
        </View>
      }

      {
        this.state.handleType === 'handle' && 
        <View style={{paddingHorizontal: px(30), paddingVertical: px(40)}}>
          <ListItem
            title = "文件列表"
            isColumn = {true}
            isNeeded = {true}
          > 
            <View style={{marginTop: -px(26), width:'100%'}}>
              {
                this.state.original.map((item, index) => {
                  const isLast = (this.state.original.length === index + 1) && this.state.scan.length === 0;
                  return (
                    <SectionRadios
                      key = {`original${index}`}
                      text = {`${item}原件`}
                      isLast = {isLast}
                      provider = {provider}
                      selected = {this.state.selectedOriginal.get(item) ? this.state.selectedOriginal.get(item) : new Map()}
                      onChange = {(value) => this._changeProvide(value, item, 'selectedOriginal')}
                    />
                    
                  )
                })
              }
              {
                this.state.scan.map((item, index) => {
                  const isLast = this.state.scan.length === index + 1;
                  return (
                    <SectionRadios
                      key = {`scan${index}`}
                      text = {`${item}扫描件`}
                      isLast = {isLast}
                      provider = {provider}
                      selected = {this.state.selectedScan.get(item) ? this.state.selectedScan.get(item) : new Map()}
                      onChange = {(value) => this._changeProvide(value, item, 'selectedScan')}
                    />
                  )
                })
              }
              {
                this.state.fileType.map((item, index) => {
                  const selectedNow = item === '原件' ? 'selectedOriginal' : 'selectedScan';
                  const textNow = item === '原件' ? '原件' : '扫描件';
                  const isLast = index === this.state.fileType.length - 1;
                  return (
                    <SectionRadios
                      key = {`${index}`}
                      text = {textNow}
                      isLast = {isLast}
                      provider = {provider}
                      selected = {this.state[selectedNow].get(item) ? this.state[selectedNow].get(item) : new Map()}
                      onChange = {(value) => this._changeProvide(value, item, selectedNow)}
                    />
                  )
                })
              }
            </View>
          </ListItem>
          <ListInputItem
            placeholder="请填写快递单号及快递公司，以空格隔开"
            isNeeded = {false}
            title = "快递单号"
            value = {this.state.express}
            onChangeText = {(express) => this.setState({express})}
          />
          <ListInputItem
            autoFocus = {false}
            isNeeded = {false}
            multiline = {true}
            numberOfLines = {4}
            placeholder="请填写处理说明"
            title = "处理说明"
            value = {this.state.remark}
            onChangeText = {(remark) => this.setState({remark})}
          />
          
        </View>
      }
      
    </ScrollView>
      <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
    paddingHorizontal: px(30),}}>
        <TouchableOpacity 
          onPress={this._submit} 
          style={[styles.footerBtn, {width: '100%', backgroundColor: Colors.mainColorV2}]}>
          <Text style={styles.footerBtnText}>确认</Text>
        </TouchableOpacity>
      </View>
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