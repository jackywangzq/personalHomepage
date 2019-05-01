import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {Request} from '../../utils/request';
import {getUserId} from '../../utils/user';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
  findNodeHandle
} from 'react-native';

import Colors from '../../constants/Colors.js'
import { BlurView } from "@react-native-community/blur";



import { SafeAreaView } from 'react-navigation';
import ListItem from '../../components/fromKirin/ListItem';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';

export default class AptitudeDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      summary: '',
      userName: '',
      userTel: '',
      userMail: '',
      owner: '',
      company: '',
      expiryDate: '',
      headerNow: '',
      headerBackOpacity: 0,
      backContainerHeight: px(400),
      navColor: '#fff',
      hasHeaderBottom: false,
      orderedDate: [],
      orderedDateFormat: [],
      secondClazz: '',
      icon: null,
      picRate: 1,
      companyCode: null,
      startDate: '',
      modalVisible: false,
      viewRef: null,
      contactDept: ''
    }
    this.id = this.props.navigation.getParam('itemId', '111');
    this._closeModal = this._closeModal.bind(this);
    this._openModal = this._openModal.bind(this);
  }

  componentWillMount() {
    this.getAptitudeDetail();
  }

  

  async getAptitudeDetail() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', '111');
    const userId = await getUserId();
    try {
      const result = await Request.get(`userContl/getCaseDetail?baseId=${itemId}&inputType=INTE&userId=${userId}`);
      if (result) {
        const {company,startDate,contactDept, secondClazz, icon, baseId, topic, desc, busiName, industryName, contactName, contactPhone, contactEmail,companyName, endDate, inteAwardUnit} = result;
        if (icon && icon !== '') {
          Image.getSize(icon, (width, height) => {
            this.setState({picRate: height / width});
          });
        }
        this.setState({
          id: baseId,
          title: topic,
          summary: desc,
          businessType: busiName,
          industries: industryName,
          userName: contactName,
          userTel: contactPhone,
          userMail: contactEmail,
          owner: companyName,
          company: inteAwardUnit,
          expiryDate: (endDate && endDate != '') ? endDate : '未知',
          secondClazz,
          icon,
          companyCode: company,
          startDate,
          contactDept
        }) 
      } else {
        Alert.alert(
          '后台数据返回失败，请重试',
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

  _changeScroll(e) {
    const scrollNow = e.nativeEvent.contentOffset.y;
    const opacity = scrollNow > 0 ? scrollNow / (this.state.backContainerHeight - 44) : 0;
    this.setState({
      headerBackOpacity: opacity
    })
    if (opacity > 0.5) {
      this.setState({
        navColor: '#000'
      })
    } else {
      this.setState({
        navColor: '#fff'
      })
    }
    if (opacity >= 1) {
      this.setState({
        hasHeaderBottom: true
      })
    } else {
      this.setState({
        hasHeaderBottom: false
      })
    }
    if(scrollNow > this.state.backContainerHeight) {
      this.setState({
        headerNow: this.state.title
      })
    } else {
      this.setState({
        headerNow: ''
      })
    }
  }

  _getIconUrl(clazz) {
    let picUrl;
    switch(clazz) {
      case 'CAICT':
        picUrl = require('../../images/aptitude/CAICT.jpg');
        break;
      case 'CMMI':
        picUrl = require('../../images/aptitude/CMMI.png');
        break;
      case 'CSC':
        picUrl = require('../../images/aptitude/CSC.jpg');
        break;
      case 'ECI':
        picUrl = require('../../images/aptitude/ECI.png');
        break;
      case 'ISCCC':
        picUrl = require('../../images/aptitude/ISCCC.png');
        break;
      case 'ISO (1)':
        picUrl = require('../../images/aptitude/ISO (1).jpg');
        break;
      case 'ISO':
        picUrl = require('../../images/aptitude/ISO.jpg');
        break;
      case 'NASSP':
        picUrl = require('../../images/aptitude/NASSP.png');
        break;
      case 'NCAC':
        picUrl = require('../../images/aptitude/NCAC.jpg');
        break;
      case 'TRC':
        picUrl = require('../../images/aptitude/TRC.jpg');
        break;
      default:
        picUrl = null
    }
    return picUrl
  }

  _goApply() {
    if (this.state.companyCode == 36) {
      this.props.navigation.navigate('aptitudeApplication', {
        AptitudeId: this.id,
        AptitudeName: this.state.title,
      });
    } else {
      this.props.navigation.navigate('aptitudeModal');
    }
  }

  _closeModal() {
    this.setState({
      modalVisible: false
    })
  }

  _openModal() {
    this.setState({
      modalVisible: true
    })
  }

  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }
  

  render() {

    const backContainerHeight = this.state.backContainerHeight;
    const iconUrl = this._getIconUrl(this.state.secondClazz);
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor: Colors.backgroundNew}}>
        {
          !!iconUrl && (
            <View style={detailStyles.backHeader}>
              
              <ImageBackground
                imageRef={img => {
                  this.backgroundImage = img;
                }}
                onLoadEnd={this.imageLoaded.bind(this)}
                style={StyleSheet.absoluteFill}
                source={iconUrl}>
              </ImageBackground>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={10}
                viewRef={this.state.viewRef}
              />
            </View>
          )
          
        }
        <Header
          color = {this.state.navColor} 
          translucent = {true}
          headerBackground={ `rgba(255,255,255,${this.state.headerBackOpacity})`}
          title={this.state.headerNow}
          style={[detailStyles.header, this.state.hasHeaderBottom ? detailStyles.borderBottom : {}]}
        />
        
        <ScrollView scrollEventThrottle = {10} onScroll={this._changeScroll.bind(this)}>
          {
            !!iconUrl &&
            <View style={{marginTop: -44, justifyContent:'center', alignItems:'center',  height: backContainerHeight}}>
              <View style={{ justifyContent:'center', alignItems:'center',backgroundColor:'#fff', borderRadius:backContainerHeight / 2 - 45, height: backContainerHeight - 90, width: backContainerHeight - 90}}>
                <Image source={iconUrl} style={{height: '67%', width: '67%'}}/>
              </View>
            </View>
          }
          
          <View style={detailStyles.container}>
            <View>
              <Text style={detailStyles.title}>{this.state.title}</Text>
              {(this.state.summary.length > 0 && this.state.summary !== '无') && <Text style={{marginBottom: px(40)}}>{this.state.summary}</Text>}
            </View>
            <View style={{marginBottom:px(30),borderRadius:px(10), backgroundColor: '#fff', paddingHorizontal:px(30), paddingVertical: px(20)}}>
              <ListItem
                  isColumn = {true} 
                  title="资质负责人"
                >
                  <Profile
                    name={this.state.userName}
                    avatar={null}
                    avatarName={this.state.userName} 
                    describe={`${this.state.userTel}`}
                    describe2={`${this.state.userMail}`} 
                  />
                </ListItem>
              <ListItem title="部门" isColumn={true} content={this.state.contactDept} />
              <ListItem title="归属单位" content={this.state.owner} />
              <ListItem title="资质授予单位" isColumn={true} content={this.state.company} />
              <ListItem title="资质颁发时间" content={this.state.startDate} />
              <ListItem title="资质到期时间" content={this.state.expiryDate} />
            </View>
            {
              !! this.state.icon &&
              <View style={{marginBottom:px(30),borderRadius:px(10), backgroundColor: '#fff', paddingHorizontal:px(30), paddingVertical: px(20)}}>
                <View style={{paddingVertical: px(20),flexDirection: 'column' }}>
                  <Image style={{width: px(630), height: px(630) * this.state.picRate}} source={{uri: this.state.icon}}/>
                </View>
              </View>
            }
            
          </View>
          
        </ScrollView>
        <View style={[detailStyles.footer]}> 
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <TouchableOpacity 
              onPress={() => this._goApply()} 
              style={[detailStyles.footerBtn, {backgroundColor: Colors.mainColorV2}]}>
              <Text style={detailStyles.footerBtnText}>立即申请</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const detailStyles = StyleSheet.create({
  backHeader: {
    height: '50%',
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
    fontSize: 24
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
    height: px(120),
    flexDirection: 'row',
    paddingHorizontal: px(30),
    backgroundColor: Colors.backgroundNew,
    justifyContent: 'flex-end',
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