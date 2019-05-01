import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {log, logErr, logWarm} from '../../utils/logs';
import {Request} from '../../utils/request';
import md5 from 'md5';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Modal,
  Image,
  FlatList,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import OpenFile from 'react-native-doc-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import Colors from '../../constants/Colors.js'
import { SafeAreaView } from 'react-navigation';
import Header from '../../components/fromKirin/Header';
import ListInputItem from '../../components/fromKirin/ListInputItem';
import ListItem from '../../components/fromKirin/ListItem';
import Profile from '../../components/fromKirin/Profile';
import Radios from '../../components/fromKirin/Radios';
import DateChoose from '../../components/fromKirin/DateChoose';
import AsyncStorage from '@react-native-community/async-storage';
import Comment from '../../components/fromHan/Comment';


import { observer, inject } from 'mobx-react';
import { computed, action } from 'mobx';

class ListProfileItem extends React.PureComponent {
  render() {

    return (
      <ListItem
        isColumn = {true} 
        title={this.props.title}
      >
        <Profile
          name={this.props.name}
          describe={this.props.describe}
        />
      </ListItem>
    )
  }
}

@inject('rootStore')
@observer
export default class AcrossDetail extends React.Component {

  @computed get ApplicationStore() {
    const { rootStore } = this.props;
    const { ApplicationStore } = rootStore;
    return ApplicationStore;
  }

  constructor(props) {
    super(props);
    this.state = {
      statusNow: '',
      title: '',
      inChargeName: '',
      inChargeTel: '',
      inChargeMail: '',
      applicant: '',
      applicantPhone: '',
      applicantEmail: '',
      applyDate: '',
      materialNote: '',
      org2Name: '',
      org3Name: '',
      proName: '',
      proDes: '',
      proFee: '',
      original: [],
      scan: [],
      fileType: [],
      tasks: [],
      handleType: '',
      isUnhandle: false,
      taskIdNow: '',
      bizkeyNow: '',
      type: '',
      kapplyRelationId:'',
      useDate: '',

      currentTask:'',
      oppoMessage:null,
      procImg:null,

      userId:'',
      orgId:'',

      bizkey:'',
      taskId:'',

      outFlows:null,

      logtype:1,


      files:[],
      progress: '',
      approverModalVisible: false,
      attachList:null,

      supptDetail:null,
      clAttachList:null,
      jtAttachStrList:null,
      kjAttachList:null,
      zsAttachList:null,
      otherAttachlist:null,
      costlist:null,
      commentModalVisible:false

    }

    this.eventEmitter = new NativeEventEmitter(NativeModules.RNReactNativeDocViewer);
    this.eventEmitter.addListener('DoneButtonEvent', (data) => {
      console.log(data)
      if (data.close == 1) {
        this._closeApproverModal()
      }
      // this.setState({donebuttonclicked: data.close});
    })

    this._submit = this._submit.bind(this);
    this._selectDate = this._selectDate.bind(this);
    this._opendoc = this._opendoc.bind(this);
    this._openApproverModal = this._openApproverModal.bind(this);
    this._closeApproverModal = this._closeApproverModal.bind(this);
    this._stopDownload = this._stopDownload.bind(this);

    this.commentConfirmPressd = this.commentConfirmPressd.bind(this);
  }

  _openApproverModal() {
    this.setState({
      approverModalVisible: true
    })
  }

  _closeApproverModal() {
    this.setState(prev => {
      return {
        approverModalVisible: false
      }
    })
  }


  async getFiles() {
    try {
      let result = await Request.post('userContl/getAttachList', {
        infoId: this.id,
        infoType: 'KbaseBase'
      });
      console.log(result)
      if (result) {
        this.setState({
          files: result
        })
      } else {
        Alert.alert(
          '获取附件信息失败',
          '',
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

  
  _download(pathNow, location, nameCh,size) {
    console.log(1)
    const ts = new Date().getTime() + '';
    const token = md5(ts + 'salt');
    this._openApproverModal();
    let taskNow = 
    RNFetchBlob
    .config({
      path : pathNow
    })
    .fetch('GET', `https://tt.wo.cn/mobile/docView?filename=${encodeURI(location)}`,{
      token,
      ts
    })
    .progress((received) => {
      this.setState({
        progress: Math.floor(received / size / 10) + '%',
      })
    });
    this.taskNow = taskNow;
    this.taskNow.then((res) => {
      console.log('res', res)
      const path = res.path()
      console.log('path', path)
      this._readfile(path, nameCh)
    }).catch(err => {
      console.log('downloaderr', err)
      RNFetchBlob.fs.unlink(pathNow)
    })
  }

  

  _stopDownload() {
    if (this.taskNow) {
      this.taskNow.cancel((err) => { 
        console.log(err);
      })
    }
    this._closeApproverModal()
  }
  _opendoc(location, nameCh, size, flowId) {
    let dirs = RNFetchBlob.fs.dirs
    const filePathNow = dirs.DocumentDir + '/kirin/' + nameCh;
    RNFetchBlob.fs.exists(filePathNow)
    .then((exist) => {
      if (exist) {
        this._download(filePathNow, location, nameCh, size)
        //this._readfile(filePathNow, nameCh, flowId);
      } else {
        this._download(filePathNow, location, nameCh, size)
      }
    })
    .catch((err) => {
      console.log('openerr', err)
      Alert.alert(
        '请求失败',
        '请重试',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    })
  }

  _readfile(path, name, flowId) {
    if(Platform.OS === 'ios'){
      OpenFile.openDoc([{url:path,
      fileNameOptional: name
    }], (error, url) => {
       if (error) {
        console.log(error)
       } else {
        console.log('url', url)
       }
     })
    }else{
      const fileType = name.split('.')[name.split('.').length - 1]
      OpenFile.openDoc([{url:'file://' + path,
        fileName: flowId + '.' +fileType,
        cache:false,
        fileType
      }], (error, url) => {
        if (error) {
          console.log('readerror', error)
        } else {
          console.log('url', url)
          this._closeApproverModal()
        }
      })
    }
  }

  async _getUserInfo() {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const {id, login, orgId, org2Id} = JSON.parse(userInfo);
    this.setState({
      userId: id,
      orgId,
      org2Id,
      login
    })
  }

  componentWillMount() {
    const { navigation } = this.props;
    const bizkey = navigation.getParam('bizkey', '');
    const taskId = navigation.getParam('taskId', '');
    const processId = navigation.getParam('processId', '');
    const isUnhandle = navigation.getParam('isUnhandle', '');
    const currentTask = navigation.getParam('currentTask', '');
    this._getUserInfo();
    this.setState({
      isUnhandle,
      currentTask,
      bizkey,
      taskId
    })

    setTimeout(() => {
      if (isUnhandle) {
        this.getUnhandleApplicationDetail(taskId);
      } else {
        this.getApplicationDetail(bizkey)
      }
    }, 100)

    
    
  }

  async getUnhandleApplicationDetail(taskId) {
    try {
      const orgId = this.state.orgId
      const result = await Request.post(`oppo/leaderApproval?taskId=${this.state.taskId}&orgId=${this.state.orgId}`);
      const {attachList,clAttachList, jtAttachStrList, kjAttachList,oppoProcess,zsAttachList,outFlows} = result;

        let otherAttachlist = [];
        otherAttachlist.concat(kjAttachList).concat(jtAttachStrList).concat(zsAttachList).concat(clAttachList);
        
        const processVo = oppoProcess.processVo;
        const oppoMessage = oppoProcess.oppoMessage;
        const supptDetail = oppoProcess.supptDetail;

        let costlist = [];
        if(supptDetail != null) {
          costlist = costlist.concat(supptDetail.listCostConfirm).concat(supptDetail.listCostNotSubmit).concat(supptDetail.listCostVoIsSubmt);
        }
        
        const {processInfo, taskInfos, taskLogs} = processVo;
        let taskNow = taskInfos.find(item => item.status === 0);
        if (!taskNow) {
          taskNow = taskLogs[taskLogs.length - 1];
        }
        const start = {
          taskId: '000',
          userName: processInfo.startUser,
          userPhone: processInfo.startUserPhone,
          processName: processInfo.processName,
          date: processInfo.startTime,
          remark: '',
          word: '发布'
        }
        let tasks=[start];
        for (let [index,item] of taskLogs.entries()) {
          const content = {
            taskId: item.taskId,
            userName: item.handler,
            userPhone: item.phone,
            date: item.endTime === '' ? item.startTime : item.endTime,
            processName: item.taskName,
            word: item.outFlowName,
            variables: (index === taskLogs.length - 2 && item.taskName === '负责人处理' && taskNow.taskName === "申请人确认") ? variables : null,
            remark: item.remark
          }
          tasks.push(content)
        }
        this.setState({
          oppoMessage:oppoMessage,
          tasks:tasks,
          outFlows:outFlows,
          attachList:attachList,
          supptDetail:supptDetail,
          clAttachList:clAttachList,
          jtAttachStrList:jtAttachStrList,
          kjAttachList:kjAttachList,
          zsAttachList:zsAttachList,
          otherAttachlist:otherAttachlist,
          costlist:costlist
        })      
    } catch (error) {
      console.log('3', error)
      Alert.alert(
        '请求失败，请重试',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    }
  }

  /**
   * 获取申请详情
   * 
   */
  async getApplicationDetail(bizkey) {
    try {
      const result = await Request.post(`oppo/getWorkbenchOppoDetail?bizkey=${bizkey}`, {
      });
      const {attachList,clAttachList, jtAttachStrList, kjAttachList,oppoProcess,zsAttachList} = result;
        let otherAttachlist = [];
        otherAttachlist = otherAttachlist.concat(kjAttachList).concat(jtAttachStrList).concat(zsAttachList).concat(clAttachList);
        const processVo = oppoProcess.processVo;
        const oppoMessage = oppoProcess.oppoMessage;
        const supptDetail = oppoProcess.supptDetail;

        let costlist = [];
        if(supptDetail != null) {
          costlist = costlist.concat(supptDetail.listCostConfirm).concat(supptDetail.listCostNotSubmit).concat(supptDetail.listCostVoIsSubmt);
        }
        console.log(costlist)
        const {processInfo, taskInfos, taskLogs} = processVo;
        let taskNow = taskInfos.find(item => item.status === 0);
        if (!taskNow) {
          taskNow = taskLogs[taskLogs.length - 1];
        }
        const start = {
          taskId: '000',
          userName: processInfo.startUser,
          userPhone: processInfo.startUserPhone,
          processName: processInfo.processName,
          date: processInfo.startTime,
          remark: '',
          word: '发布'
        }
        let tasks=[start];
        for (let [index,item] of taskLogs.entries()) {
          const content = {
            taskId: item.taskId,
            userName: item.handler,
            userPhone: item.phone,
            date: item.endTime === '' ? item.startTime : item.endTime,
            processName: item.taskName,
            word: item.outFlowName,
            variables: (index === taskLogs.length - 2 && item.taskName === '负责人处理' && taskNow.taskName === "申请人确认") ? variables : null,
            remark: item.remark
          }
          tasks.push(content)
        }
        this.setState({
          oppoMessage:oppoMessage,
          tasks:tasks,
          attachList:attachList,
          supptDetail:supptDetail,
          clAttachList:clAttachList,
          jtAttachStrList:jtAttachStrList,
          kjAttachList:kjAttachList,
          zsAttachList:zsAttachList,
          otherAttachlist:otherAttachlist,
          costlist:costlist
        })
    } catch (error) {
      console.log('3', error)
      Alert.alert(
        '请求失败，请重试',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    }
  }

  /* _changeProvide(value, name, type) {
    const selected = new Map(this.state[type].get(name));
    selected.set(value, !selected.get(value));
    const selectedAll = new Map(this.state[type]);
    selectedAll.set(name, selected);
    if (type === 'selectedOriginal') {
      this.setState({
        selectedOriginal: selectedAll 
      })
    } else {
      this.setState({
        selectedScan: selectedAll 
      })
    }
  } */

  commentCancelPressed = () => {
    this.setState({
      commentModalVisible:false
    })

  }

  getCommentText(comment) {
    var text = '';
    switch(comment) {
      case 1 :
        text = '1星 非常差';
        break;
      case 2 :
        text = '2星 差';
        break;
      case 3 :
        text = '3星 一般';
        break;
      case 4 :
        text = '4星 好';
        break;
      case 5 :
        text = '5星 非常好';
        break;
      default:
        text = '5星 非常好';
    }
    return text;
  }
  async commentConfirmPressd(comment) {
    let suppEva = this.getCommentText(comment.support);
    let empoEva = this.getCommentText(comment.cap);
    let middleEva = this.getCommentText(comment.rate);

    try {
      result = await Request.post('oppo/taskEndOfProcess', {
        taskId:this.state.taskId,
        remark:'',
        condition:'confirm',
        bizkey:this.state.bizkey,
        fjStatus:1,
        userId:this.state.userId
      })
      const {retCode, message,data} = result;
      if(retCode == 200) {
        result = await Request.post('oppo/saveEvaAndSaveConIntegral', {
          bizkey:this.state.bizkey,
          suppEva:suppEva,
          empoEva:empoEva,
          middleEva:middleEva,
          type:1
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
  _submit(item,gooutFlow) {
    if(!gooutFlow) {
      if(item) {
        this.props.navigation.navigate('reInitAcross', {
          bizkey:this.state.bizkey,
          taskId:this.state.taskId,
        })
      }
    } else {
      if(this.state.currentTask == '支撑确认') {
        if(item == 'back') {
          let isOk = item == 'back'?false:true;
          this.props.navigation.navigate('AcrossHandle', {
            data: {
              isOk,
              taskId: this.state.taskId,
              style:item,
              currentTask:this.state.currentTask,
              bizkey:this.state.bizkey,
              fjStatus:1
            }
          })
        } else if(item == 'confirm') {
          console.log(1)
            this.setState({
              commentModalVisible:true
            })
        }
      } else if(this.state.currentTask == '跨省支撑') {
        if(item == 'back') {
          let isOk = item == 'back'?false:true;
          this.props.navigation.navigate('AcrossHandle', {
            data: {
              isOk,
              taskId: this.state.taskId,
              style:item,
              currentTask:this.state.currentTask,
              bizkey:this.state.bizkey,
              fjStatus:1
            }
          })
        } else if(item == 'end_support') {
          Alert.alert(
            '当前不支持该流程，请移步PC端处理',
            '功能即将上线，敬请期待',
            [
              {text: '确定'},
            ],
            { cancelable: false }
          )
        }
      } else if(this.state.currentTask == '集团派单' || this.state.currentTask == '领导审批' ) {
        let isOk = item == 'back'?false:true;
        this.props.navigation.navigate('AcrossHandle', {
          data: {
            isOk,
            taskId: this.state.taskId,
            style:item,
            currentTask:this.state.currentTask,
            bizkey:this.state.bizkey,
            fjStatus:1
          }
        })
      }
    }
  }

  _getColor(text) {
    let color = '';
    switch (text) {
      case '未处理':
        color = 'orange';
        break;
      case '通过':
        color = 'green';
        break;
      case '退回':
        color = 'red';
        break;
      case '处理':
        color = 'green'
        break;
      default:
        color = Colors.darkText
    }
    return color
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

    console.log(this.state.scan)

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor: Colors.backgroundV2}}>
        <Header
          title='跨省支撑'
          style={styles.shadow}
        />

        {this.state.oppoMessage != null &&
        <ScrollView>
          <View style={styles.container}>
            <View>
              <Text style={styles.title}>商机详情</Text>
            </View>
            <View style={{marginBottom:px(45)}}>
              <View style={styles.card}>
              <ListItem title="商机名称" content={this.state.oppoMessage.oppoName} />
              <ListItem title="商机编号" content={this.state.oppoMessage.oppoNum} />
              <ListItem title="线索来源" content={this.state.oppoMessage.source} />
              <ListItem title="客户名称" content={this.state.oppoMessage.custName} />
              <ListItem
                    isColumn = {true}
                    title="客户联系人信息"
                  >
                    <Profile
                      name={this.state.oppoMessage.custContact}
                      avatar={null}
                      avatarName = {this.state.oppoMessage.custContact}
                      describe={this.state.oppoMessage.contactTelephone}
                    />
                </ListItem>
                <ListItem title="所属行业" content={this.state.oppoMessage.industry3} />
                <ListItem title="预计收入" content={this.state.oppoMessage.estimatedIncome + '万元'} />
                <ListItem
                    isColumn = {true} 
                    title="客户经理信息"
                  >
                    <Profile
                      name={this.state.oppoMessage.custManagerName}
                      avatar={null}
                      avatarName = {this.state.oppoMessage.custManagerName}
                      describe={this.state.oppoMessage.custManagerPhone}
                      describe2={this.state.oppoMessage.custManagerEmail}
                    />
                </ListItem>
                <ListItem title="业务类型" content={this.state.oppoMessage.Keywords + '万元'} />
                <ListItem isLast={true} title="客户需求简介" isColumn = {true} content={this.state.oppoMessage.custReq}></ListItem>
            </View>
            </View>
            
            {(this.state.attachList != null && this.state.attachList.length > 0) &&
            <View style={{marginBottom:px(45)}}>
              <View style={styles.card}>
              {this.state.attachList.map((item, index) => {
                  let avatar = null;
                  const nameNow = item.nameCh && item.nameCh.split('.').length ? item.nameCh.split('.')[item.nameCh.split('.').length - 1] : '';
                  switch(nameNow) {
                    case 'docx' :
                      avatar = require('../../images/word.png');
                      break;
                    case 'doc' :
                      avatar = require('../../images/word.png');
                      break;
                    case 'pdf' :
                      avatar = require('../../images/pdf.png');
                      break;
                    case 'ppt' :
                      avatar = require('../../images/ppt.png');
                      break;
                    case 'pptx' :
                      avatar = require('../../images/ppt.png');
                      break;
                    case 'xlsx' :
                      avatar = require('../../images/file-xls.png');
                      break;
                    default:
                      avatar = require('../../images/file-0.png');
                  }
                  return (
                    <TouchableOpacity onPress={() => this._opendoc(item.location, item.nameCh, item.fileSize, item.flowId)} key={item.nameCh + index} style={{
                      borderRadius: px(10),
                      backgroundColor: '#fff',
                      marginBottom: this.state.attachList.length === index + 1 ? 0 : px(30)
                    }}>
                      <Profile
                        isCircle={false}
                        avatar={avatar}
                        imgSize = {px(84)}
                        imgSize2={px(94)}
                        range={px(30)}
                        textRange={px(10)}
                        name={item.nameCh}
                        describe={item.fileSize + 'kb'}
                        nameColor='#000'
                        textColor='#d2d2d2'
                      />
                    </TouchableOpacity>
                  )
                })}
            </View>
            </View>
            }

            <View style={{marginBottom:px(45)}}>
              <View style={styles.card}>
              <ListItem title="备注信息" isColumn = {true} content={this.state.oppoMessage.remark == '' ? '无':this.state.oppoMessage.remark}></ListItem>
              <ListItem title="预计支撑时间" isColumn = {true} content={this.state.oppoMessage.timeReq + '至' + this.state.oppoMessage.timeEnd}></ListItem>
              <ListItem isLast={true} title="预计支撑工作量" isColumn = {true} content={this.state.oppoMessage.days}></ListItem>
            </View>
            </View>

            <View style={{marginBottom:px(45)}}>
            <Text style={[styles.title,{fontSize:px(32)}]}>{this.state.oppoMessage.productType}</Text>
              <View style={styles.card}>
              <View style={{height:px(60),lineHeight:px(60),fontSize:px(32),marginBottom:px(20),borderBottomColor:'#eee',borderBottomWidth:px(1)}}><Text>{this.state.oppoMessage.productName}</Text></View>
              <Profile 
                    name={this.state.oppoMessage.productContactName}
                    canTouch={false}
                    avatar={null}
                    avatarName={this.state.oppoMessage.productContactName} 
                    describe={this.state.oppoMessage.productContactPhone} 
                    describe2={this.state.oppoMessage.productContactEmail}
              >
              </Profile>
            </View>
            </View>

            <View>
              <Text style={styles.title}>流转日志</Text>
            </View>
            <View style={{marginBottom:px(45)}}>
            <View style={styles.card}>
                <View>
                  <View style={{position:'absolute',height:'100%', width:px(2),backgroundColor:'#D2D2D2', top:0,left: px(44)}} />
                  {
                    this.state.tasks.map((task, index) => {

                      return (
                        <View style={{marginBottom: index === this.state.tasks.length - 1 ? 0 : px(60)}} key={index}>
                          <Profile
                            name={task.processName}
                            textSize={13} 
                            avatar={null}
                            avatarName = {task.userName}
                            nameColor='#000'
                            extraName= {task.date}
                          >
                            <View style={{flexDirection:'row', alignItems: 'center', marginTop: px(14)}}>
                              <Text style={{fontSize: 13, color: Colors.darkText}}>{task.userName}</Text>
                              <Text style={{fontSize: 13, color: this._getColor(task.word)}}>{' ' + task.word}</Text>
                            </View>
                          </Profile> 
                          {
                            !!(task.remark.length > 0 && task.remark !== '无') &&
                            <View style={{marginLeft: px(110), marginTop: px(20)}}>
                              <Text>
                                {task.remark}
                              </Text>
                            </View>
                          }
                          
                        </View>
                      )
                    })
                  }               
                </View>
              </View>
            </View>

            <View style={{flexDirection:'row',justifyContent:'space-around',marginBottom:px(30)}}>
              <TouchableOpacity onPress={() => this.setState({logtype:1})} style={[{fontSize:px(30)},this.state.logtype==1 ? {paddingBottom:px(10),color:'#33a6fa',borderBottomColor:'#33a6fa',borderBottomWidth:px(4)} : {color:'#000000'}]}><Text style={[ {fontSize:px(30)},this.state.logtype==1 ? {color:'#33a6fa',borderBottomColor:'#33a6fa',borderBottomWidth:px(1)} : {color:'#000000'}]}>支撑记录</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({logtype:2})} style={[{fontSize:px(30)},this.state.logtype==2 ? {paddingBottom:px(10),color:'#33a6fa',borderBottomColor:'#33a6fa',borderBottomWidth:px(4)} : {color:'#000000'}]}><Text style={[ {fontSize:px(30)},this.state.logtype==2 ? {color:'#33a6fa',borderBottomColor:'#33a6fa',borderBottomWidth:px(1)} : {color:'#000000'}]}>费用凭证</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({logtype:3})} style={[{fontSize:px(30)},this.state.logtype==3 ? {paddingBottom:px(10),color:'#33a6fa',borderBottomColor:'#33a6fa',borderBottomWidth:px(4)} : {color:'#000000'}]}><Text style={[ {fontSize:px(30)},this.state.logtype==3 ? {color:'#33a6fa',borderBottomColor:'#33a6fa',borderBottomWidth:px(1)} : {color:'#000000'}]}>其他信息</Text></TouchableOpacity>
        </View>
        
        <View style={this.state.logtype==1 ? {display:'flex'}:{display:'none'}}>
          <View style={{marginBottom:px(45)}}>
          {
            (this.state.supptDetail == null || this.state.supptDetail.feedbackList == null || this.state.supptDetail.feedbackList.length == 0)?
                  <View style={[styles.card,{marginBottom:px(30)}]}>
                    <Text style={{fontSize:px(26),color:'#000000'}}>暂无</Text>
                  </View>
                  :
            <View>
                  {this.state.supptDetail.feedbackList.map((item, index) => {
                    return (
                      <View style={[styles.card,{paddingLeft:0,marginBottom:px(30)}]}>
                      <View style={{flexDirection:'row',flexWrap:'nowrap',alignItems:'center',paddingBottom:px(22)}}>
                        <View style={styles.logname}><Text style={{marginLeft:px(10),fontSize:px(24),lineHeight:px(40),color:'white'}}>{item.user.name}</Text></View> 
                        <Text style={{marginLeft:px(25),marginRight:px(50),flex:1,fontSize:px(24),color: "#666666"}}>{item.user.orgName}</Text>
                        <Text style={{width:px(150),fontSize:px(24),color: "#d2d2d2"}}>{item.feedback.createTime}</Text>
                      </View>
                      <View style={{marginLeft:px(29),borderTopColor:'#e8e8e8',borderTopWidth:px(1)}}>
                      <Text style={{fontSize:px(26),color:'#000000',marginTop:px(29)}}>提交了  支撑记录</Text>
                      <Text style={{marginTop:px(21),fontSize: px(26),lineHeight: px(30),color: "#666666"}}>{item.feedback.supptRecord}</Text>
                      </View>
                    </View>
                    )
                  })}
            </View>
          }
          </View>
          </View>

          <View style={this.state.logtype==2 ? {display:'flex'}:{display:'none'}}>
          <View style={{marginBottom:px(45)}}>
          {
            (this.state.costlist == null || this.state.costlist.length == 0)?
            <View style={[styles.card,{marginBottom:px(30)}]}>
            <Text style={{fontSize:px(26),color:'#000000'}}>暂无</Text>
          </View>
                  :
            <View>
                  {this.state.costlist.map((item, index) => {
                    return (
                      <View style={[styles.card,{paddingLeft:0,marginBottom:px(30)}]}>
                      <View style={{flexDirection:'row',flexWrap:'nowrap',alignItems:'center',paddingBottom:px(22)}}>
                        <View style={styles.logname}><Text style={{marginLeft:px(10),fontSize:px(24),lineHeight:px(40),color:'white'}}>{item.user.name}</Text></View> 
                        <Text style={{marginLeft:px(25),marginRight:px(50),flex:1,fontSize:px(24),color: "#666666"}}>{item.user.orgName}</Text>
                        <Text style={{width:px(150),fontSize:px(24),color: "#d2d2d2"}}>{item.cost.createTime}</Text>
                      </View>

                      <View style={{marginLeft:px(29),borderTopColor:'#e8e8e8',borderTopWidth:px(1)}}>
                      <Text style={{fontSize:px(26),color:'#000000',marginTop:px(29)}}>提交了  费用凭证</Text>
                      <Text style={{marginTop:px(21),fontSize: px(26),lineHeight: px(30),color: "#666666"}}>{item.cost.startTime + ' ' + item.cost.startSite + '  -  ' + item.cost.endTime + ' ' + item.cost.endSite}</Text>
                      <Text style={{marginTop:px(10),fontSize: px(26),lineHeight: px(30),color: "#666666"}}>{'交通：' + item.cost.carFare + '元    住宿：' + item.cost.quarterage + '元    综合补助：' + item.cost.grants + '元'}</Text>
                      </View>
                    </View>
                    )
                  })}
            </View>
          }
          </View>
          </View>

          <View style={this.state.logtype==3 ? {display:'flex'}:{display:'none'}}>
          <View style={{marginBottom:px(30)}}>
          <View style={[styles.card,{paddingLeft:0}]}>
                <View style={{flexDirection:'row',flexWrap:'nowrap',alignItems:'center',paddingBottom:px(22)}}>
                  <View style={styles.logname}><Text style={{marginLeft:px(10),fontSize:px(24),lineHeight:px(40),color:'white'}}>贡献度</Text></View>
                </View>

                <View style={{marginLeft:px(29),borderTopColor:'#e8e8e8',borderTopWidth:px(1)}}>
                {(this.state.supptDetail == null || this.state.supptDetail.supptContributionList == null || this.state.supptDetail.supptContributionList.length == 0)?
                  <Text style={{fontSize:px(26),color:'#000000',marginTop:px(29)}}>暂无</Text>
                  :
                  <View style={{flexWrap:'wrap',flexDirection:'row',marginTop:px(20)}}>
                    {
                      this.state.supptDetail.supptContributionList.map((item, index) => {
                      return (
                      <Text style={{fontSize:px(26),color:'#000000',marginRight:px(35)}}>{item.userName + ': ' + item.contribution + '%'}</Text>
                      )
                    })
                    }
                  </View>
                }
                </View>
          </View>
          </View>
            {(this.state.otherAttachlist != null && this.state.otherAttachlist.length > 0) &&
            <View style={styles.card}>
              {this.state.otherAttachlist.map((item, index) => {
                  let avatar = null;
                  const nameNow = item.nameCh && item.nameCh.split('.').length ? item.nameCh.split('.')[item.nameCh.split('.').length - 1] : '';
                  switch(nameNow) {
                    case 'docx' :
                      avatar = require('../../images/word.png');
                      break;
                    case 'doc' :
                      avatar = require('../../images/word.png');
                      break;
                    case 'pdf' :
                      avatar = require('../../images/pdf.png');
                      break;
                    case 'ppt' :
                      avatar = require('../../images/ppt.png');
                      break;
                    case 'pptx' :
                      avatar = require('../../images/ppt.png');
                      break;
                    case 'xlsx' :
                      avatar = require('../../images/file-xls.png');
                      break;
                    default:
                      avatar = require('../../images/file-0.png');
                  }
                  return (
                    <TouchableOpacity onPress={() => this._opendoc(item.location, item.nameCh, item.fileSize, item.flowId)} key={item.nameCh + index} style={{
                      borderRadius: px(10),
                      backgroundColor: '#fff',
                      marginBottom: this.state.otherAttachlist.length === index + 1 ? 0 : px(30)
                    }}>
                      <Profile
                        isCircle={false}
                        avatar={avatar}
                        imgSize = {px(84)}
                        imgSize2={px(94)}
                        range={px(30)}
                        textRange={px(10)}
                        name={item.nameCh}
                        describe={item.fileSize + 'kb'}
                        nameColor='#000'
                        textColor='#d2d2d2'
                      />
                    </TouchableOpacity>
                  )
                })}
            </View>
            }
          </View>
          </View>
          
        </ScrollView>
        }

        {
          (this.state.isUnhandle && this.state.currentTask === '商机录入') &&
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>
                  
                  <TouchableOpacity 
                    onPress={() => this._submit(true,false)}
                    style={[styles.footerBtn, {width: '100%', backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>重新发起</Text>
                  </TouchableOpacity>
                </View>
        }

        {
          (this.state.isUnhandle && this.state.currentTask == '领导审批' && this.state.outFlows != null && this.state.outFlows.length == 2) &&
          
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>

              <TouchableOpacity 
                    onPress={() => this._submit(this.state.outFlows[1].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>{this.state.outFlows[1].name}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                    onPress={() => this._submit(this.state.outFlows[0].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>{this.state.outFlows[0].name}</Text>
                  </TouchableOpacity>

          </View>
        }

        {
          (this.state.isUnhandle && this.state.currentTask == '集团派单' && this.state.outFlows != null && this.state.outFlows.length == 2) &&
          
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>

              <TouchableOpacity 
                    onPress={() => this._submit(this.state.outFlows[0].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>{this.state.outFlows[0].name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                    onPress={() => this._submit(this.state.outFlows[1].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>{this.state.outFlows[1].name}</Text>
              </TouchableOpacity>

          </View>
        }

        {
          (this.state.isUnhandle && this.state.currentTask == '跨省支撑' && this.state.outFlows != null && this.state.outFlows.length == 2) &&
          
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>

              <TouchableOpacity 
                    onPress={() => this._submit(this.state.outFlows[1].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>{this.state.outFlows[1].name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                    onPress={() => this._submit(this.state.outFlows[0].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>{this.state.outFlows[0].name}</Text>
              </TouchableOpacity>

          </View>
        }

        {
          (this.state.isUnhandle && this.state.currentTask == '支撑确认' && this.state.outFlows != null && this.state.outFlows.length == 2) &&
          
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>

              <TouchableOpacity 
                    onPress={() => this._submit(this.state.outFlows[1].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>{this.state.outFlows[1].name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                    onPress={() => this._submit(this.state.outFlows[0].flowConditon,true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>{this.state.outFlows[0].name}</Text>
              </TouchableOpacity>

          </View>
        }
        


        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.approverModalVisible}
          >
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor: '#fff', marginHorizontal: px(30),borderRadius:px(20),  width: px(690)}}>
              <View style={{width: '100%', justifyContent: 'center', alignItems:'center',height: px(300)}}>
                <Text style={{fontSize: 16,marginTop:px(20), fontWeight: 'bold'}}>加载中</Text>
                {
                  true &&
                  <Text style={{marginTop: px(20)}}>{this.state.progress}</Text>
                }
              </View>
              {
                true &&
                <TouchableOpacity onPress={this._stopDownload} style={{height:px(80),marginBottom:px(20), width:'100%',fontSize:16,color:Colors.mainColorV2, justifyContent: 'center', alignItems:'center'}}>
                  <Text>取消</Text>
                </TouchableOpacity>
              }
              
            </View>
          </View>
        </Modal>
        

        <Modal 
          animationType={"fade"}
          transparent={true}
          visible={this.state.commentModalVisible}>
          <View style={{width:'100%',height:'100%',backgroundColor:'rgba(0,0,0,0.8)',justifyContent:'center'}}>
          <View style={{width:'90%',marginLeft:'5%'}}>
            <Comment _onConfirmPressd={(comment) => this.commentConfirmPressd(comment)} onCancelPressed={ () => this.commentCancelPressed()}></Comment>
          </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundV2,
    paddingHorizontal: px(30),
    paddingVertical: px(40)
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
        elevation: 4,
      },
    })
  },
  title: {
    fontSize: px(40),
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
  logname:{
    paddingRight:px(10),
    minWidth:px(120),
    height: px(40),
	  borderTopLeftRadius: 0,
	  borderTopRightRadius: 10,
	  borderBottomLeftRadius: 0,
	  borderBottomRightRadius: 10,
	  backgroundColor: "#33a6fa"
  }
});