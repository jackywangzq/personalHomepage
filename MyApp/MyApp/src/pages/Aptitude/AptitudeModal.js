import React from 'react';
import {px} from '../../utils/px';
import {Request} from '../../utils/request';
import {getUserId} from '../../utils/user';
import md5 from 'md5';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Modal,
  Text,
  Platform,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import RNFetchBlob from 'rn-fetch-blob';


import Colors from '../../constants/Colors';

import Header from '../../components/fromKirin/Header';
import ListItem from '../../components/fromKirin/ListItem';
import Profile from '../../components/fromKirin/Profile';


import { SafeAreaView } from 'react-navigation';

export default class AptitudeModal extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      progress: '',
      fileProcessModalVisible: false,
    }
    this.find = '可通过资质证件模块查询资质证件的基本信息'
    this.apply = '如需使用资质，请联系本省接口人，接口人名单详见下表'
    this.fill = '按要求填写《公司资质使用申请表》发送至接口人邮箱，申请表模版下载见下表'
    this.contact = '申请流程包括：初审-分公司审批-总部审批，审批通过后获取资质'
    this.taskNow = null;
    this.eventEmitter = new NativeEventEmitter(NativeModules.RNReactNativeDocViewer);
    this.eventEmitter.addListener('DoneButtonEvent', (data) => {
      if (data.close == 1) {
        this._closefileProcessModal()
      }
    })
    this._opendoc = this._opendoc.bind(this);
    this._openfileProcessModal = this._openfileProcessModal.bind(this);
    this._closefileProcessModal = this._closefileProcessModal.bind(this);
    this._stopDownload = this._stopDownload.bind(this);
  }

  componentDidMount() {
    this.getAptitudeInstruction();
  }

  async getAptitudeInstruction() {
    const userId = await getUserId();
    try {
      const result = await Request.post(`userContl/getAttachListMini`, {
        infoId: '999999',
        infoType: 'jichenggongsiMobile',
        userId
      });
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

  _download(location, nameCh,size) {
    const ts = new Date().getTime() + '';
    const token = md5(ts + 'salt');
    console.log(ts)
    console.log(token)
    this._openfileProcessModal();
    let dirs = RNFetchBlob.fs.dirs
    const pathNow = dirs.DocumentDir + '/kirin/' + nameCh
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
      console.log(received)
      this.setState({
        progress: Math.floor(received / size / 10) + '%',
      })
    });
    this.taskNow = taskNow;
    this.taskNow.then((res) => {
      const path = res.path()
      this._readfile(path, nameCh)
    }).catch(err => {
      RNFetchBlob.fs.unlink(pathNow)
    })
  }

  

  _stopDownload() {
    if (this.taskNow) {
      this.taskNow.cancel((err) => { 
        console.log(err);
      })
    }
    this._closefileProcessModal()
  }

  _opendoc(location, nameCh, size) {
    let dirs = RNFetchBlob.fs.dirs
    const filePathNow = dirs.DocumentDir + '/kirin/' + nameCh;
    RNFetchBlob.fs.exists(filePathNow)
    .then((exist) => {
      if (exist) {
        this._readfile(filePathNow, nameCh);
      } else {
        this._download(location, nameCh, size)
      }
    })
    .catch((err) => {
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

  _readfile(path, name) {
    
    if(Platform.OS === 'ios'){
      OpenFile.openDoc([{url:path,
      fileNameOptional: name
    }], (error, url) => {
       if (error) {
        console.log(error)
       } else {
        console.log(url)
       }
     })
    }else{
      const fileType = name.split('.')[name.split('.').length - 1]
      OpenFile.openDoc([{url:'file://' + path,
        fileName:name,
        cache:false,
        fileType
      }], (error, url) => {
        if (error) {
          console.log(error)
        } else {
          console.log(url)
          this._closefileProcessModal()
        }
      })
    }
  }

  _openfileProcessModal() {
    this.setState({
      fileProcessModalVisible: true
    })
  }

  _closefileProcessModal() {
    this.setState(prev => {
      return {
        fileProcessModalVisible: false
      }
    })
  }

  componentWillUnmount (){
    console.log('unmount')
    this.eventEmitter.removeListener();
  }

  
  render() {

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{flex: 1, backgroundColor: Colors.background}}>
        <Header
          title="资质申请说明"
        />
        <ScrollView>
          <View style={styles.container}>
              <View style={styles.card}>
                <ListItem isColumn = {true}  title="信息查找" content={this.find} />
                <ListItem isColumn = {true}  title="资质申请" content={this.apply} />
                <ListItem isColumn = {true}  title="填写申请表" content={this.fill} />
                <ListItem isLast={true} isColumn = {true}  title="接口人申请" content={this.contact} />
              </View>
              <View style={{marginTop: px(30)}}>
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
                  case 'xls' :
                    avatar = require('../../images/file-xls.png');
                    break;
                  case 'xlsx' :
                    avatar = require('../../images/file-xls.png');
                    break;
                  default:
                    avatar = require('../../images/file-0.png');
                }
                return (
                  <TouchableOpacity onPress={() => this._opendoc(item.location, item.nameCh, item.fileSize)} key={item.nameCh + index} style={{
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
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.fileProcessModalVisible}
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
  card: {
    borderRadius:px(10), backgroundColor: '#fff', paddingHorizontal:px(30), paddingVertical: px(40)
  },
})