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
  Modal,
  Image
} from 'react-native';

import Colors from '../../constants/Colors.js'

// import { Tabs, Toast } from '@ant-design/react-native';
import { SafeAreaView } from 'react-navigation';
import Header from '../../component/header';
import ListInputItem from '../../component/Base/ListInputItem';
import ListItem from '../../component/Base/ListItem';
import Radios from '../../component/Base/Radios';
import SectionRadios from '../../component/Business/SectionRadios';
import Profile from '../../component/Business/Profile';
import DateChoose from '../../component/Business/DateChoose';

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
      statusNow: '负责人处理',
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
      selectedOriginal: new Map(),
      selectedScan: new Map(),
      express: '',
      remark: '',
      isCheck: false,
      isUnhandle: false
    }
    this._submit = this._submit.bind(this);
  }

  componentWillMount() {
    const { navigation } = this.props;
    const bizkey = navigation.getParam('bizkey', '');
    const isUnhandle = navigation.getParam('isUnhandle', '');
    this.setState({
      isUnhandle
    })
    this.getApplicationDetail(bizkey)
    /* const isCheck = navigation.getParam('isCheck', false);
    if(isCheck) {
      this.setState({
        isCheck,
        statusNow: '领导审批'
      })
    } */

    
  }

  /**
   * 获取当前申请信息
   * 
   */
  async getApplicationDetail(bizkey) {
    try {
      const result = await Request.post2(`userContl/getKapplyInfoDetail`, {
        bizkey
      });
      log(JSON.stringify(result))
      if(result.respCode === '001') {
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
          useDate
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
          useDate
        })
      } else {
        console.error(result.respDesc);
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  _changeProvide(value, name, type) {
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
  }

  _submit(isOk) {
    this.props.navigation.navigate('handle', {
      isCheck : this.state.isCheck,
      isOk
    })
  }

  render() {

    const provider = [
      {
        label: '附件上传',
        value: 0
      },
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
                    describe={`${this.state.applicantPhone}    |    ${this.state.applicantEmail}`} 
                  />
                </ListItem>
                <ListItem title="申请时间" content={this.state.applyDate} />
                <ListItem title="归属分公司" content={this.state.org2Name} />
                <ListItem title="归属部门" content={this.state.org3Name} />
                <ListItem title="项目说明"isColumn={true} content={this.state.proDes} />
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
                
                <ListItem title="申请备注" isColumn={true} content={this.state.materialNote} />
                <ListItem title="使用时间" isLast={true} content={this.state.useDate} />
              </View>
            </View>
            <View>
              <Text style={{fontSize: 20, marginBottom:px(20)}}>流转日志</Text>
              <View style={styles.card}>
                <View>
                  <View style={{position:'absolute',height:'100%', width:px(2),backgroundColor:'#D2D2D2', top:0,left: px(44)}} />
                  <View style={{marginBottom: px(60)}}>
                  <Profile
                    name="案例申请"
                    textSize={13} 
                    avatar={null}
                    avatarName = "安晓峰"
                    nameColor='#000'
                    describe="安晓峰 发布了 申请" 
                    extraName="2019-03-01 15:14"
                  />
                  </View>
                  {
                    this.state.isCheck ?
                    <View>
                    <Profile
                      name="地市级领导审批"
                      avatar={null}
                      avatarName = "李里" 
                      nameColor='#000'
                      extraName="2019-03-01 16:34" 
                    >
                      <View style={{flexDirection:'row', alignItems: 'center', marginTop: px(14)}}>
                        <Text style={{fontSize: 13, color: Colors.darkText}}>李里 </Text>
                        <Text style={{fontSize: 13, color: 'orange'}}>审批中</Text>
                      </View>
                    </Profile>
                  </View>
                  :
                  <View style={{marginBottom: px(60)}}>
                  <Profile
                    name="地市级领导审批"
                    avatar={null}
                    avatarName = "李里" 
                    nameColor='#000'
                    extraName="2019-03-01 16:34" 
                  >
                    <View style={{flexDirection:'row', alignItems: 'center', marginTop: px(14)}}>
                      <Text style={{fontSize: 13, color: Colors.darkText}}>李里 </Text>
                      <Text style={{fontSize: 13, color: 'green'}}>通过了</Text>
                      <Text style={{fontSize: 13, color: Colors.darkText}}> 申请</Text>
                    </View>
                  </Profile>
                  <View style={{marginLeft: px(110), marginTop: px(20)}}>
                    <Text>
                      同意
                    </Text>
                  </View>
                </View>
                  }
                  
                  {
                    !this.state.isCheck && 
                    <View>
                    <Profile
                      name="负责人处理"
                      avatar={null}
                      avatarName = "凌栋" 
                      nameColor='#000'
                      extraName="2019-03-02 15:34" 
                    >
                      <View style={{flexDirection:'row', alignItems: 'center', marginTop: px(14)}}>
                        <Text style={{fontSize: 13, color: Colors.darkText}}>凌栋 </Text>
                        <Text style={{fontSize: 13, color: 'orange'}}>处理中</Text>
                      </View>
                    </Profile>
                  </View>
                  }
                  
                  
                </View>
              </View>
            </View>
            {
              this.state.statusNow === '领导审批2' &&
              <View>
                <ListInputItem
                  placeholder="请输入意见"
                  title = "审核意见"
                />
                <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between'}}>
                  <TouchableOpacity 
                    onPress={this._submit(false)} 
                    style={[styles.footerBtn, {width: px(330),borderColor:Colors.mainColorV2,borderWidth:px(2)}]}>
                    <Text style={[styles.footerBtnText, {color: Colors.mainColorV2}]}>退回</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={this._submit(true)} 
                    style={[styles.footerBtn, {width: px(330), backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>通过</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            {
              this.state.statusNow === '负责w人处理' &&
              <View>
                <ListItem
                  title = "文件列表"
                  isColumn = {true}
                  isNeeded = {true}
                > 
                  <View style={{marginTop: -px(26)}}>
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
                  </View>
                </ListItem>
                <ListInputItem
                  placeholder="请填写快递单号及快递公司，以空格隔开"
                  title = "快递单号"
                  value = {this.state.express}
                  onChangeText = {(express) => this.setState({express})}
                />
                <ListInputItem
                  autoFocus = {false}
                  multiline = {true}
                  numberOfLines = {4}
                  placeholder="请填写处理说明"
                  title = "处理说明"
                  value = {this.state.remark}
                  onChangeText = {(remark) => this.setState({remark})}
                />
                
              </View>
            }
            
          </View>
        </ScrollView>
        {
          this.state.isCheck && this.state.isUnhandle ?
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
          :
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between',height: px(120),
    paddingHorizontal: px(30),}}>
                  <TouchableOpacity
                    onPress={this._submit} 
                    style={[styles.footerBtn, {width: '100%', backgroundColor: Colors.mainColorV2}]}>
                    <Text style={styles.footerBtnText}>处理</Text>
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
        elevation: 20,
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