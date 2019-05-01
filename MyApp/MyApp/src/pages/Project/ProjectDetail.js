import React from 'react';
import {px} from '../../utils/px';
import {Request} from '../../utils/request';
import {getUserId} from '../../utils/user';
import md5 from 'md5';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import RNFetchBlob from 'rn-fetch-blob';

import Colors from '../../constants/Colors.js'

import { Carousel } from '@ant-design/react-native';
import { SafeAreaView } from 'react-navigation';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';
import ListItem from '../../components/fromKirin/ListItem';

export default class ProjectDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      desc: '',
      contact: 'zhangq01',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      busiType: '',
      industry_name: '',
      competency: [],
      startDate: '',
      files:[],
      progress: '',
      contactDept: '',
      approverModalVisible: false,
      headerNow: '方案详情',
      hasHeaderBottom: false
      
    }
    this.taskNow = null;
    this.eventEmitter = new NativeEventEmitter(NativeModules.RNReactNativeDocViewer);
    this.eventEmitter.addListener('DoneButtonEvent', (data) => {
      console.log(data)
      if (data.close == 1) {
        this._closeApproverModal()
      }
      // this.setState({donebuttonclicked: data.close});
    })
    this.id = this.props.navigation.getParam('itemId', '111');
    this._opendoc = this._opendoc.bind(this);
    this._openApproverModal = this._openApproverModal.bind(this);
    this._closeApproverModal = this._closeApproverModal.bind(this);
    this._stopDownload = this._stopDownload.bind(this);
  }

  componentWillMount() {
    this.getProjectDetail();
    this.getFiles();
  }

  async getProjectDetail() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', '111');
    const userId = await getUserId();
    try {
      const result = await Request.get(`schemeContl/getSchemeDetail?baseId=${itemId}&userId=${userId}`);
      const {respDesc, respCode, data} = result;
      if(respCode === '001') {
        const {baseId, contactDept, topic, desc, busiName, industryName, competency, contactName, contactPhone, contactEmail, relatedRegion, startDate} = data;
        this.setState({
          topic,
          desc,
          contactName,
          contactPhone,
          contactEmail,
          busiName,
          contactDept,
          industryName,
          competency: competency[0].items ? competency[0].items : [],
          startDate
        })
      } else {
        Alert.alert(
          respDesc,
          '请重试',
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
    const ts = new Date().getTime() + '';
    const token = md5(ts + 'salt');
    console.log(ts)
    console.log(token)
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
        console.log('exist', exist)
        if (exist) {
          this._readfile(filePathNow, nameCh, flowId);
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
        headerNow: this.state.topic
      })
    } else {
      this.setState({
        headerNow: '方案详情'
      })
    }
  }

  _openApproverModal() {
    this.setState({
      approverModalVisible: true
    })
  }

  _closeApproverModal() {
    console.log('closess')
    this.setState(prev => {
      return {
        approverModalVisible: false
      }
    })
  }

  componentWillUnmount (){
    console.log('unmount')
    this.eventEmitter.removeListener();
  }

  render() {

    

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor: Colors.background}}>
        <Header
          title={this.state.headerNow}
          style={this.state.hasHeaderBottom ? styles.borderBottom : {}}
        />
        <ScrollView scrollEventThrottle = {10} onScroll={this._changeScroll.bind(this)}>
          <View style={styles.container}>
            <View>
              <Text style={styles.title}>{this.state.topic}</Text>
            </View>
            <View>
              <Text numberOfLines={3} style={{
                fontSize: 13,
                lineHeight: 20,
                color: '#000',
              }}>
                {this.state.desc}
              </Text>
            </View>
            <View style={{marginTop:px(40), marginBottom:px(30)}}>
              <View style={styles.card}>
                <ListItem
                  isColumn = {true} 
                  title="方案发布人"
                >
                  <Profile
                    name={this.state.contactName}
                    avatar={null}
                    avatarName={this.state.contactName} 
                    describe={`${this.state.contactPhone}`} 
                    describe2={`${this.state.contactEmail}`} 
                  />
                </ListItem>
                <ListItem title="部门" isColumn={true} content={this.state.contactDept} />
                <ListItem title="上传时间" content={this.state.startDate} />
                <ListItem title="业务类型" content={this.state.busiName} />
                <ListItem isLast={true} title="关联行业" content={this.state.industryName} />
              </View>
            </View>
            {
              this.state.competency.length > 0 &&
              <View style={{paddingVertical: px(12)}}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: px(30)
                }}>
                  <Text style={{fontSize: 16, fontWeight:'bold'}}>关联产品</Text>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontSize: 12, color: '#999999'}}>{`共${this.state.competency.length}个产品`}</Text>
                  </View>
                </View>
                <Carousel 
                  style={{paddingBottom: px(30)}}
                  dotStyle = {{
                    height: this.state.competency.length > 1 ? px(8) : 0,
                    width: px(8),
                    marginTop: this.state.competency.length > 1 ? px(40) : 0
                  }}
                >
                  {
                    this.state.competency.map(item => {
                      const noPic = true;
                      return (
                        <TouchableOpacity key={item.id} 
                          onPress = {() => this.props.navigation.navigate('productDetail', {
                            itemId: item.id
                          })}
                          style={{
                          borderRadius: px(10),
                          backgroundColor: "#ffffff",
                          paddingHorizontal: px(30),
                          paddingVertical: px(36)
                        }}>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <View style={[!noPic && {height: px(120)}, {flex: 1, justifyContent:'center'}]}>
                              <Text style={{fontSize: 16}}>{item.topic}</Text>
                              {
                                (item.desc && item.desc.length > 0)
                                &&
                                <Text numberOfLines={2} style={{
                                  fontSize: 13,
                                  lineHeight: 17,
                                  color: "#999999"
                                }}>{item.desc}</Text>
                              }
                            </View>
                            {
                              !noPic &&
                              <Image 
                                source={require('../../images/猜你想要.png')} 
                                style={{
                                  height: px(120),
                                  width: px(120),
                                  borderRadius: px(10),
                                  marginLeft: px(96)
                                }}
                              />
                            }
                            
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                </Carousel>
              </View>
            }

            <View style={{marginTop: px(20)}}>
                {this.state.files.map((item, index) => {
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
                    default:
                      avatar = require('../../images/file-0.png');
                  }
                  return (
                    <TouchableOpacity onPress={() => this._opendoc(item.location, item.nameCh, item.fileSize, item.flowId)} key={item.nameCh + index} style={{
                      paddingHorizontal: px(40),
                      paddingVertical: px(22),
                      borderRadius: px(10),
                      backgroundColor: '#fff',
                      marginBottom: this.state.files.length === index + 1 ? 0 : px(30)
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
        </ScrollView>
        {
          false && 
          <View style={styles.tools}>
          <TouchableOpacity style={styles.btns}>
            <Text style={styles.btnText}>评价</Text>
          </TouchableOpacity>
          <View style={styles.separate}></View>
          <TouchableOpacity style={styles.btns}>
            <Text style={styles.btnText}>收藏</Text>
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
        
        
      </SafeAreaView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: px(30),
    paddingVertical: px(40)
  },
  header: {
    padding: px(30)
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
          width: 0,
          height: 0.5
        },
        shadowRadius: 5,
        shadowOpacity: 1
      },
      android: {
        elevation: 5,
      },
    })
  },
  borderBottom: {
    borderBottomColor: '#ebedf0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: px(40)
  },
  card: {
    borderRadius:px(10), backgroundColor: '#fff', paddingHorizontal:px(30), paddingVertical: px(40)
  },
  tools: {
    zIndex: 2000,
    width: px(750),
	  height: px(100),
    backgroundColor: "#fff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btns: {
    width: px(315),
    marginHorizontal: px(30),
    alignItems: 'center',
    justifyContent:'center'
  },
  btnText: {
    fontSize: 18
  },
  separate: {
    height: px(80),
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#e8e8e8'
  }
});