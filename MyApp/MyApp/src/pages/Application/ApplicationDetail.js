import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {log, logErr, logWarm} from '../../utils/logs';
import {Request} from '../../utils/request';
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

import Colors from '../../constants/Colors.js'

// import { Tabs, Toast } from '@ant-design/react-native';
import { SafeAreaView } from 'react-navigation';
import Header from '../../components/fromKirin/Header';
import ListInputItem from '../../components/fromKirin/ListInputItem';
import ListItem from '../../components/fromKirin/ListItem';
import Profile from '../../components/fromKirin/Profile';
import Radios from '../../components/fromKirin/Radios';
import DateChoose from '../../components/fromKirin/DateChoose';

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

export default class ApplicationDetail extends React.Component {

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
    }
    this._submit = this._submit.bind(this);
    this._selectDate = this._selectDate.bind(this);
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
    const bizkey = navigation.getParam('bizkey', '');
    const taskId = navigation.getParam('taskId', '');
    const processId = navigation.getParam('processId', '');
    const isUnhandle = navigation.getParam('isUnhandle', '');
    this.setState({
      isUnhandle
    })
    this.getApplicationDetail(bizkey)
    if (isUnhandle) {
      this.getUnhandleProcess(bizkey,taskId,processId);
    } else {
      this.getProcess(bizkey);
    }
    
    
  }

  /**
   * 获取待办详情
   */
  async getUnhandleProcess(bizkey, taskId, processId) {
    try {
      const result = await Request.post(`userContl/getProcDetail`, {
        bizkey,
        taskId,
        processId
      });
      const {processVo, respCode, respDesc, variables} = result;
      if (respCode === '001') {
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
        let handleType = '';
        if (taskNow.taskName.split('审批').length > 1) {
          handleType = 'check'
        } else if (taskNow.taskName.split('负责人处理').length > 1) {
          handleType = 'handle'
        } else if (taskNow.taskName.split('申请人确认').length > 1) {
          handleType = 'confirm'
        } else if (taskNow.taskName.split('处理领导退单').length > 1) {
          handleType = 'handleNo'
        }
        let type = '';
        switch(processInfo.processName) {
          case '资质申请':
            type="INTE";
            break;
          default: 
            type="CASE"
        } 
        console.log(tasks)
        this.setState({
          statusNow: taskNow.taskName,
          handleType,
          tasks,
          taskIdNow: taskId,
          bizkeyNow: processInfo.bizkey,
          type
        })
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
      
    } catch(err) {
      console.log('1', err)
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
   * 
   * @param {*} bizkey 
   * 获取流程详情（已办、我的）
   */
  async getProcess(bizkey) {
    try {
      const result = await Request.post(`userContl/getMyAndFinishDetail`, {
        bizkey
      });
      const {processVo, respCode, respDesc} = result;
      if(respCode === '001') {
        const {processInfo, taskLogs} = processVo;
        const start = {
          taskId: '000',
          userName: processInfo.startUser,
          userPhone: processInfo.startUserPhone,
          processName: processInfo.processName,
          date: processInfo.startTime,
          word: '发布',
          remark: '',
        }
        let tasks=[start];
        for (let item of taskLogs) {
          const content = {
            taskId: item.taskId,
            userName: item.handler,
            userPhone: item.phone,
            date: item.endTime === '' ? item.startTime : item.endTime,
            processName: item.taskName,
            word: item.outFlowName,
            remark: item.remark
          }
          tasks.push(content)
        }
        this.setState({
          tasks,
          statusNow: '申请详情'
        })
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
      console.log('2', error)
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
      const result = await Request.post(`userContl/getKapplyInfoDetail`, {
        bizkey
      });
      log(JSON.stringify(result))
      const {kapplyInfo, respCode, respDesc} = result;
      if(respCode === '001') {
        const {
          topic,
          creatorName,
          creatorPhone,
          applyDate,
          applicant,
          applicantPhone,
          applicantEmail,
          materialNote,
          org2Name,
          org3Name,
          proName,
          proDes,
          proFee,
          fileType,
          original,
          scan,
          useDate,
          kapplyRelationId
        } = result.kapplyInfo;
        this.setState({
          title: topic,
          inChargeName: creatorName.split('：')[1],
          inChargeTel: creatorPhone,
          applicant,
          applicantEmail,
          applicantPhone,
          applyDate,
          org2Name,
          org3Name,
          proName,
          proDes,
          proFee,
          materialNote,
          fileType: fileType !== '' ? fileType.split(',').filter(item => item !== '') : [],
          original: original.split(',').filter(item => item !== ''),
          scan: scan.split(',').filter(item => item !== ''),
          useDate,
          kapplyRelationId
        })
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

  _submit(isOk) {
    this.props.navigation.navigate('handle', {
      data: {
        handleType : this.state.handleType,
        isOk,
        taskId: this.state.taskIdNow,
        bizkey: this.state.bizkeyNow,
        type: this.state.type,
        statusNow: this.state.statusNow,
        original: this.state.original,
        scan: this.state.scan,
        fileType: this.state.fileType,
        kapplyRelationId: this.state.kapplyRelationId
      },
      applyInfo: (this.state.handleType==='handleNo' && isOk) ?
        {
          proDes: this.state.proDes,
          proName: this.state.proName,
          proFee: this.state.proFee,
          topic: this.state.title,
          materialNote: this.state.materialNote,
          startDate: new Date(this.state.useDate.split('至')[0]).getTime(),
          endDate: new Date(this.state.useDate.split('至')[1]).getTime(),
        }
      : null
    })
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
          title={this.state.statusNow}
          style={styles.shadow}
        />
        <ScrollView>
          <View style={styles.container}>
            <View>
              <Text style={styles.title}>{this.state.title}</Text>
            </View>
            <View style={{marginBottom:px(45)}}>
              <View style={styles.card}>
                <ListItem
                  isColumn = {true} 
                  isLast = {true}
                  title="合同负责人"
                >
                  <Profile
                    avatar={null}
                    avatarName = {this.state.inChargeName}
                    name={this.state.inChargeName} 
                    describe={`${this.state.inChargeTel}`} 
                  />
                </ListItem>
              </View>
            </View>
            <View style={{marginBottom:px(45)}}>
                <Text style={{fontSize: 20, marginBottom:px(20)}}>申请详情</Text>
                <View style={styles.card}>
                  <ListItem
                    isColumn = {true} 
                    title="申请人"
                  >
                    <Profile
                      name={this.state.applicant}
                      avatar={null}
                      avatarName = {this.state.applicant}
                      describe={`${this.state.applicantPhone}    |    ${this.state.applicantEmail}`} 
                    />
                  </ListItem>
                  <ListItem title="申请时间" content={this.state.applyDate} />
                  <ListItem title="归属分公司" content={this.state.org2Name} />
                  <ListItem title="归属部门" content={this.state.org3Name} />
                  <ListItem title="项目说明"isColumn={true} content={this.state.proDes} />
                  <ListItem title="项目金额" content={this.state.proFee + ' 万元'} />
                  <ListItem title="客户名称" content={this.state.proName} />
                  {
                    this.state.fileType && this.state.fileType.length > 0 ?
                    <ListItem title="文件类型" content={this.state.fileType.join('    |    ')} />
                    :
                    <View>
                      {
                        (this.state.original && this.state.original.length > 0) && 
                        <ListItem title="原件申请" content={this.state.original.join('    |    ')} />
                      }
                      {
                        (this.state.scan && this.state.scan.length > 0) && 
                        <ListItem title="扫描件申请" content={this.state.scan.join('    |    ')} />
                      }
                    </View>
                  }
                  {
                    this.state.materialNote.length === '0'
                    &&
                    <ListItem title="申请备注" isColumn={true} content={this.state.materialNote} />
                  }
                  <ListItem title="使用时间" isLast={true} content={this.state.useDate} />
                </View>
              </View>
            
            <View>
              <Text style={{fontSize: 20, marginBottom:px(20)}}>流转日志</Text>
              <View style={styles.card}>
                <View>
                  <View style={{position:'absolute',height:'100%', width:px(2),backgroundColor:'#D2D2D2', top:0,left: px(44)}} />
                  {

                    this.state.tasks.map((task, index) => {
                    
                      const variables = task.variables;
                      let provideRes = [];
                      let express = null;
                      if (variables) {
                        const original = variables.original.map(item => {
                          return `${variables.fileNames[item.name]}原件 : ${variables.provider[item.provider]}`
                        });
                        const scan = variables.scan.map(item => {
                          return `${variables.fileNames[item.name]}扫描件 : ${variables.provider[item.provider]}`
                        })
                        provideRes = [...original, ...scan]
                        express = variables.express;
                      }
                      console.log(provideRes)
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
                            provideRes.length > 0 &&
                            <View style={{marginLeft: px(110), marginTop: px(20)}}>
                              {
                                provideRes.map((item,index) => {
                                  return (
                                    <Text key={index}>{item}</Text>
                                  )
                                })
                              }
                            </View>
                          }
                          {
                            !!express && 
                            <View style={{marginLeft: px(110), marginTop: px(20)}}>
                              {
                                <Text key={index}>{`快递单号 : ${express}`}</Text>
                              }
                            </View>
                          }
                          
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
            
          </View>
        </ScrollView>
        {
          (this.state.isUnhandle && this.state.handleType === 'check') &&
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>
                  <TouchableOpacity 
                    onPress={() => this._submit(false)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>退回</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => this._submit(true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>通过</Text>
                  </TouchableOpacity>
                </View>
        }
        {
          (this.state.isUnhandle && this.state.handleType === 'confirm') &&
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>
                  <TouchableOpacity 
                    onPress={() => this._submit(false)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>退回</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => this._submit(true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>通过</Text>
                  </TouchableOpacity>
                </View>
        }
        {
          (this.state.isUnhandle && this.state.handleType === 'handle') &&
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
    paddingHorizontal: px(30),}}>
                  <TouchableOpacity
                    onPress={() => this._submit(false)} 
                    style={[styles.footerBtn, {width: '100%', backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>处理</Text>
                  </TouchableOpacity>
                </View>
        }
        {
          (this.state.isUnhandle && this.state.handleType === 'handleNo') &&
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
          paddingHorizontal: px(30)}}>
                  <TouchableOpacity 
                    onPress={() => this._submit(false)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>关闭申请</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => this._submit(true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>重新发起</Text>
                  </TouchableOpacity>
                </View>
        }
        
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