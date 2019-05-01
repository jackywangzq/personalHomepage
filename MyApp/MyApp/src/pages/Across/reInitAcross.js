import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {log, logErr, logWarm} from '../../utils/logs';
import {Request, getDomain} from '../../utils/request';
import {dateFormat, dateDiff} from '../../utils/calendar';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  Picker
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Colors from '../../constants/Colors.js'

// import { Tabs, Toast } from '@ant-design/react-native';
import { SafeAreaView } from 'react-navigation';
import ListInputItem from '../../components/fromKirin/ListInputItem';
import ListSearchItem from '../../components/fromHan/ListSearchItem';
import Radios from '../../components/fromKirin/Radios';
import SingleRadios from '../../components/fromKirin/SingleRadios';
import DateChoose from '../../components/fromKirin/DateChoose';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';
import ListItem from '../../components/fromKirin/ListItem';
import PickerWidget from '../../components/fromKirin/PickerWidget';

import { observer, inject } from 'mobx-react';
import { computed, action } from 'mobx';

@inject('rootStore')
@observer
export default class reInitAcross extends React.Component {

  @computed get ApplicationStore() {
    const { rootStore } = this.props;
    const { ApplicationStore } = rootStore;
    return ApplicationStore;
  }

  constructor(props) {
    super(props);
    this.state = {
      productDescribe: '',
      customer: '',
      customername: '',
      income:'',
      tel: '',
      area:'点击选择添加',
      managername:'点击选择添加',
      managerId:'',
      productname:'点击选择添加关联产品',
      productId:'',
      resourceOriginal: new Map(),
      resourcevalue:'',
      selectkeywords:new Map(),
      keywords:'点击添加业务类型',
      keywordsVisible:false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime() + 86400000 * 3,
      workload:'',
      hasHeaderBottom: false,
      headerNow: '跨省支撑申请',
      approverModalVisible: false,
      approverPerson:[],
      approverId: '',
      dealModalVisible: false,
      userId: '',
      org2Id: '',
      orgId: '',
      login: '',
      intro:'',
      remark:'',
      across:new Map().set(0,true),
      acrossvalue:0,
      oppoNum:'',
      
      dealer:[],
      dealId: '',
      groupHandler:[],
      yunGuangHandler:[],
      industry1options:[],
      industry2options:[],
      industry3options:[],
      
      resourceOptions: [],
      keywordsOptions: [],

      source:'',

      industry1Visible: false,
      industry1: '',
      industry1name:'点击选择所属行业',

      industry2Visible: false,
      industry2: '',
      industry2name:'点击选择二级行业',

      industry3Visible: false,
      industry3: '',
      industry3name:'点击选择三级行业',

      bizkey: '',
      taskId:'',


      oppoid:"",
      orderid:''
    };

    this.acrossOptions = [
      {
        label: '跨省产品',
        value: 0
      },
      {
        label: '云光慧企',
        value: 1
      }
    ];
    this._selectDate = this._selectDate.bind(this);
    this._openApproverModal = this._openApproverModal.bind(this);
    this._closeApproverModal = this._closeApproverModal.bind(this);
    this._closeDealModal = this._closeDealModal.bind(this);
    this._closekeywordModal = this._closekeywordModal.bind(this);
    this._openDealModal = this._openDealModal.bind(this);
    this._submit = this._submit.bind(this);
  }
  

  componentWillMount() {
    const { navigation } = this.props;
    const bizkey = navigation.getParam('bizkey')
    const taskId = navigation.getParam('taskId')
    this.setState({
      bizkey:bizkey,
      taskId:taskId
    })
    
    this.setState({
      kBaseId: 0,
      topic: '跨省申请'
    })
    this._getUserInfo();
    setTimeout(() => {
      this.getNext();
      this.getIndustry1();
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
      const result = await Request.post(`oppo/editOppoNeed?orgId=${this.state.orgId}&userId=${this.state.userId}&bizkey=${this.state.bizkey}&taskId=${this.state.taskId}&org2Id=$oppoNumber=`);
      const {approverPerson, attachList, busin,groupHandler,source,taskMess,yunGuangHandler} = result;
      const oppoMessage = taskMess.oppoMessage;
      let keywords = oppoMessage.KeywordIds;
      let keywordsarr = keywords.split(',');
      let selectkeywords = new Map();
      let acrossvalue = Number.parseInt(oppoMessage.productTypeCode);
      for(let i = 0;i < keywordsarr.length;i++) {
        selectkeywords.set(keywordsarr[i],true)
      }
      var resourceOptionstmp = [];
      for(var i = 0;i < source.length;i++) {
        resourceOptionstmp.push({
          label:source[i].codeValue,
          value:source[i].codeName
        })
      }
      var keywordsOptionstmp = [];
      for(var i = 0;i < busin.length;i++) {
        keywordsOptionstmp.push({
          label:busin[i].codeValue,
          value:busin[i].codeName
        })
      }
      console.log(approverPerson)
      this.setState({
      productDescribe: oppoMessage.oppoName,
      customer: oppoMessage.custName,
      customername: oppoMessage.custContact,
      income:oppoMessage.estimatedIncome + "",
      tel: oppoMessage.contactTelephone,
      managername:oppoMessage.custManagerName,
      managerId:oppoMessage.custManagerId,
      productname:oppoMessage.productName,
      productId:oppoMessage.productId,
      resourceOriginal: new Map().set(oppoMessage.sourceCode,true),
      resourcevalue:oppoMessage.sourceCode,
      selectkeywords:selectkeywords,
      keywords:taskMess.oppoMessage.Keywords,
      startDate: oppoMessage.timeReq,
      endDate: oppoMessage.timeEnd,
      workload:oppoMessage.days.split('人')[0],
      approverPerson:approverPerson,
      approverId: oppoMessage.suppManagerId,
      
      intro:oppoMessage.custReq,
      remark:oppoMessage.remark,
      across:new Map().set(acrossvalue,true),
      acrossvalue:acrossvalue,
      oppoNum:oppoMessage.oppoNum,
      dealer:acrossvalue == 0?groupHandler:yunGuangHandler,
      dealId: '',
      groupHandler:groupHandler,
      yunGuangHandler:yunGuangHandler,

      ///industry1options:[],
      ///industry2options:[],
      ///industry3options:[],
      
      resourceOptions: resourceOptionstmp,
      keywordsOptions: keywordsOptionstmp,
      source:oppoMessage.sourceCode,
      industry1: oppoMessage.industry1Code,
      industry1name:oppoMessage.industry1,
      industry2: oppoMessage.industry2Code,
      industry2name:oppoMessage.industry2,
      industry3: oppoMessage.industry3Code,
      industry3name:oppoMessage.industry3,
      oppoid:oppoMessage.oppoId,
      orderid:oppoMessage.orderId
    })
   
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

  async getIndustry1() {
    try {
      const result = await Request.post(`oppo/industry`);
      var industry = []
      for(var i = 0;i < result.length;i++) {
        industry.push({
          label:result[i].codeValue,
          value:result[i].codeName
        })
      }
      this.setState({
        industry1options:industry
      })  
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

  async getIndustry23(level,codeName) {
    try {
      const result = await Request.post(`oppo/industry${level}?codeName=${codeName}`);
      var industry = []
      for(var i = 0;i < result.length;i++) {
        industry.push({
          label:result[i][3],
          value:result[i][2]
        })

        if(level == 2) {
          this.setState({
            industry2options:industry
          })
        } else if(level == 3) {
          this.setState({
            industry3options:industry
          })
        }
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
  addkeywords = () => {
    this.setState({
      keywordsVisible:true
    })
  }
  searchClick =(type) => {
    let that = this;
    this.props.navigation.navigate('acrossSearch',{
      type:type,
      choose:(item,type) => {
        if(type == 'manager') {
          that.setState({
            managerId:item.id,
            managername:item.name
          })
        } else if(type == 'product') {
          that.setState({
            productId:item.id,
            productname:item.topic
          })
        }
      }
    });
  }
  _changeScroll(e) {

  }

  _changeRadio(value, name) {
    var selected = new Map(this.state[name]);
    if(name != 'selectkeywords') {
      for (let item of selected.keys()) {
        selected.set(item,false);
      }
      selected.set(value, true);
    } else { //业务类型多选
      selected.set(value, !selected.get(value));
    }
    switch(name) {
      case 'resourceOriginal':
        this.setState({
          resourceOriginal: selected,
          resourcevalue:value
        })
        break;
      case 'selectkeywords':
        this.setState({
          selectkeywords: selected
        })
        break;
      case 'across':
        this.setState({
          across: selected,
          acrossvalue:value,
          dealer: value == 0?this.state.groupHandler:this.state.yunGuangHandler,
          dealId: ''
        })
        break;
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
  _closekeywordModal() {
    this.setState({
      keywordsVisible: false
    })
  }
  _confirmkeywordModal = () => {
    const keytexts = [...this.state.selectkeywords].filter(item => item[1]).map(item => {
      return this.state.keywordsOptions.find(item2 => item2.value === item[0]).label;
    }).join(',');
    if(keytexts == '') {
      this.setState({
        keywords:'点击添加业务类型',
        keywordsVisible: false
      })
      return;
    }
    this.setState({
      keywords:keytexts,
      keywordsVisible: false
    })
  }
  _chooseApprover(id) {
    this.setState({
      approverId: id,
      approverModalVisible: false
    })
  }
  
  _openDealModal() {
    this.setState({
      dealModalVisible: true
    })
  }

  _closeDealModal() {
    this.setState({
      dealModalVisible: false
    })
  }

  _chooseDeal(id) {
    this.setState({
      dealId: id,
      dealModalVisible: false
    })
  }

  async _submit() {
    const {
      oppoNum, //上级编号
      productDescribe, //商机名称
      resourcevalue, //线索涞源
      customer,  //客户名称
      customername, //客户联系人名称
      tel, //客户联系人电话
      industry1, //一级行业
      industry2, //二级行业
      industry3, //三级行业
      income, //预计收入
      managerId, //客户经理
      managername,//客户经理名称
      selectkeywords, //业务类型
      keywords,//业务类型文字
      intro,// 需求介绍
      remark, //备注
      acrossvalue, //跨省支撑
      startDate, //支撑开始时间
      endDate, //支撑结束时间
      workload, // 预计人天
      approverId, //审批人id
      dealId, //集团处理人id
      productId,//相关产品id
      productname,//关联产品名称
      userId
    } = this.state;

    if (oppoNum === '' || productDescribe === '' || resourcevalue === '' || customer === '' || customername===''
    || tel === '' || industry1 === '' || income === '' || managerId==='' || managername === '' 
    ||keywords == '点击添加业务类型' ||keywords == '' || productId==='' || productname === '' || acrossvalue === '' || intro === '' || startDate === '' || endDate===''
    || workload === '' || approverId === '' || dealId === '') {
      Alert.alert(
        '请填写完整信息 ',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
    } else {

      const keywords = [...selectkeywords].filter(item => item[1]).map(item => {
        return this.state.keywordsOptions.find(item2 => item2.value === item[0]).value;
      }).join(',');

        const req = {
          oppoName: productDescribe,
          oppoNumber:oppoNum,
          source:resourcevalue,
          custName:customer,
          custContact:customername,
          contactTelephone:tel,
          industry:industry1,
          industry2:industry2,
          industry3:industry3,
          estimatedIncome:income,
          custMgr:managerId,
          projectname:managername,
          reqKeywords:keywords,
          custReq:intro,
          remark:remark,
          productId:productId,
          productType:acrossvalue,
          projectname1:productname,
          timeReq:dateFormat(startDate, 'L'),
          timeEnd:dateFormat(endDate, 'L'),
          days:workload,
          groupManager:dealId,
          suppManager:approverId,
          userId:userId,
          oppoId:this.state.oppoid,
          orderId:this.state.orderid,
          taskId:this.state.taskId
      };
      try {
        const result = await Request.post(`oppo/initiateBack`, req);
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
            </View>
            
            <View style={{marginBottom:px(30), paddingVertical: px(20)}}>
              <ListInputItem
                autoFocus = {false}
                multiline = {false}
                placeholder="请输入商机名称"
                title = "商机名称"
                value = {this.state.productDescribe}
                onChangeText = {(productDescribe) => this.setState({productDescribe})}
              />
              <Text style={{fontWeight: 'bold', fontSize: 16}}> 商机编号</Text>
              <Text style={{fontSize: 13,color:'#999',marginTop:px(20),marginBottom:px(45)}}> {this.state.oppoNum}</Text>
              
              {
                this.state.resourceOptions.length > 0 &&
              <ListItem
                title = "线索来源"
                isColumn = {true}
                isNeeded = {true}
              >
                <SingleRadios
                  options = {this.state.resourceOptions}
                  selected = {this.state.resourceOriginal}
                  onChange = {(value) => this._changeRadio(value, 'resourceOriginal')}
                />
              </ListItem>
              }
              <ListInputItem
                placeholder="请输入客户名称"
                title = "客户名称"
                value = {this.state.customer}
                onChangeText = {(customer) => this.setState({customer})}
              />
              <ListInputItem
                placeholder="请输入客户联系人姓名"
                title = "客户联系人姓名"
                value = {this.state.customername}
                onChangeText = {(customername) => this.setState({customername})}
              />
              <ListInputItem
                placeholder="请输入客户联系人电话"
                title = "客户联系人电话"
                value = {this.state.tel}
                onChangeText = {(tel) => this.setState({tel})}
              />
              <ListSearchItem
                value={this.state.industry1name}
                title = "所属行业"
                onSearch = {() => this.setState({industry1Visible: true})}
              />
              <ListSearchItem
               isNeeded={false}
                value={this.state.industry2name}
                title = "二级行业"
                onSearch = {() => this.setState({industry2Visible: true})}
              />
              <ListSearchItem
               isNeeded={false}
                value={this.state.industry3name}
                title = "三级行业"
                onSearch = {() => this.setState({industry3Visible: true})}

              />
              <ListInputItem
                placeholder="请填写金额"
                title = "预计收入金额"
                unit="万元"
                value = {this.state.income}
                onChangeText = {(income) => this.setState({income})}
              />
              <ListSearchItem
                title = "客户经理"
                value = {this.state.managername}
                onChangeText = {(manager) => this.setState({manager})}
                onSearch={() => this.searchClick('manager')}
              />
              <ListSearchItem
                title = "业务类型"
                value = {this.state.keywords}
                onChangeText = {(keywords) => this.setState({keywords})}
                onSearch={() => this.addkeywords()}
              />
        
              <ListInputItem
                placeholder="请输入客户需求简介"
                title = "客户需求简介"
                value = {this.state.intro}
                onChangeText = {(intro) => this.setState({intro})}
              />
              <ListInputItem
                isNeeded={false}
                placeholder="请输入备注内容"
                title = " 备注"
                value = {this.state.remark}
                onChangeText = {(remark) => this.setState({remark})}
              />
              <ListItem
                title = "跨省产品"
                isColumn = {true}
                isNeeded = {true}
              >
                <SingleRadios
                  options = {this.acrossOptions}
                  selected = {this.state.across}
                  onChange = {(value) => this._changeRadio(value, 'across')}
                />
                <ListSearchItem
                title = ""
                isNeeded={false}
                value = {this.state.productname}
                onSearch={() => this.searchClick('product')}
              />
              </ListItem>
              <ListItem
                title = "预计支撑时间"
                isColumn = {true}
                isNeeded = {true}
              >
                <DateChoose 
                  startDate={this.state.startDate} 
                  endDate={this.state.endDate} 
                  onRangeSelected = {this._selectDate}
                />
              </ListItem>
              <ListInputItem
                placeholder="请填写工作量"
                title = "预计支撑工作量"
                isNeeded={true}
                value = {this.state.workload}
                unit="人/天"
                keyboardType='number-pad'
                onChangeText = {(workload) => this.setState({workload})}
              />
              <ListItem
                title = "集团处理人"
                isColumn = {true}
                isNeeded = {true}
              >
                {
                  this.state.dealId !== '' ?
                    <Profile
                      nameColor='#000' 
                      avatar={null}
                      canTouch={this.state.dealer.length > 0}
                      onPress={() => this._openDealModal()}
                      avatarName={this.state.dealer.find(item => item.id === parseInt(this.state.dealId)).name}
                      name={this.state.dealer.find(item => item.id === parseInt(this.state.dealId)).name}
                      describe={this.state.dealer.find(item => item.id === parseInt(this.state.dealId)).phone}
                    />
                  :
                  <TouchableOpacity onPress={this._openDealModal}>
                    <View style={{justifyContent:'center',alignItems: 'center', height:px(90), width:px(90), borderRadius: px(45), backgroundColor: '#fff'}}>
                      <View style={{backgroundColor: Colors.lightText, marginTop:-px(2), position:'absolute', top: '50%', width: px(45), height: px(4)}} />
                      <View style={{backgroundColor: Colors.lightText, marginLeft:-px(2), position:'absolute', left: '50%', height: px(45), width: px(4)}} />
                    </View>
                  </TouchableOpacity>
                }
              </ListItem>

              <ListItem
                title = "审批人"
                isLast={true}
                isColumn = {true}
                isNeeded = {true}
              >
                {
                  (this.state.approverId !== '' && this.state.approverPerson.length > 0) ?
                    <Profile
                      nameColor='#000' 
                      avatar={null}
                      canTouch={this.state.approverPerson.length > 0}
                      onPress={() => this._openApproverModal()}
                      avatarName={this.state.approverPerson.find(item => item.id === parseInt(this.state.approverId)).name}
                      name={this.state.approverPerson.find(item => item.id === parseInt(this.state.approverId)).name}
                      describe={this.state.approverPerson.find(item => item.id === parseInt(this.state.approverId)).phone}
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
                this.state.approverPerson.map((item, index) => {
                  const isLast = this.state.approverPerson.length === index + 1;
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

        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.dealModalVisible}
          >
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor: '#fff', marginHorizontal: px(30),borderRadius:px(20),  width: px(690)}}>
              <View style={{ height: px(120),borderBottomWidth: 1, borderBottomColor: Colors.hairlineColor, width: '100%', justifyContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>请选择集团处理人</Text>
              </View>
              <View style={{height: px(800)}}>
              <ScrollView>
              {
                this.state.dealer.map((item, index) => {
                  const isLast = this.state.dealer.length === index + 1;
                  return (
                    <TouchableOpacity key={item.id} onPress={() => this._chooseDeal(item.id)} style={{paddingHorizontal:px(30), padding:px(12), borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth, borderBottomColor: '#ebedf0'}}>
                      <Profile
                        size={px(90)}
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
              
              
              <TouchableOpacity onPress={this._closeDealModal} style={{height:px(120), width:'100%', justifyContent: 'center', alignItems:'center', borderTopWidth: 1, borderTopColor: Colors.hairlineColor,}}>
                <Text>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.keywordsVisible}
          >
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor: '#fff', marginHorizontal: px(30),borderRadius:px(20),  width: px(690)}}>
              <View style={{ height: px(120),borderBottomWidth: 1, borderBottomColor: Colors.hairlineColor, width: '100%', justifyContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>请选择业务类型</Text>
              </View>
              <View style={{padding:px(40),height: px(800)}}>
              <Radios
                  options = {this.state.keywordsOptions}
                  selected = {this.state.selectkeywords}
                  onChange = {(value) => {this._changeRadio(value, 'selectkeywords')}}
                />
              </View>
              <View style={{display:'flex',height:px(100),width:'100%',flexDirection:'row'}}>
              <TouchableOpacity onPress={this._confirmkeywordModal} style={{backgroundColor:'#3ca8f7',height:px(100), flex:1, justifyContent: 'center', alignItems:'center', borderTopWidth: 1, borderTopColor: Colors.hairlineColor,}}>
                <Text style={{color:'white'}}>确定</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._closekeywordModal} style={{height:px(100),  flex:1, justifyContent: 'center', alignItems:'center', borderTopWidth: 1, borderTopColor: Colors.hairlineColor,}}>
                <Text>取消</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <PickerWidget
          visible = {this.state.industry1Visible}
          onCanceled = {() => {this.setState({industry1Visible: false})}}
          onConfirmed = {(value) => {this.setState({
            industry1Visible: false,
            industry1:value.value,
            industry1name:value.label,
            industry2options:[],
            industry3options:[],
            industry2name:'点击选择二级行业',
            industry2:'',
            industry3name:'点击选择三级行业',
            industry3:'',
          });
          this.getIndustry23(2,value.value);
        }}
          options = {
            this.state.industry1options
          }
        ></PickerWidget>

        <PickerWidget
          visible = {this.state.industry2Visible}
          onCanceled = {() => {this.setState({industry2Visible: false})}}
          onConfirmed = {(value) => {this.setState({
            industry2Visible: false,
            industry2:value.value,
            industry2name:value.label,
            industry3options:[],
            industry3name:'点击选择三级行业',
            industry3:'',
          });
          this.getIndustry23(3,value.value);
        }}
          options = {
            this.state.industry2options
          }
        ></PickerWidget>

        <PickerWidget
          visible = {this.state.industry3Visible}
          onCanceled = {() => {this.setState({industry3Visible: false})}}
          onConfirmed = {(value) => {this.setState({
            industry3Visible: false,
            industry3:value.value,
            industry3name:value.label
          })}}
          options = {
            this.state.industry3options
          }
        ></PickerWidget>

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