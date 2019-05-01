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
  Alert,
  TouchableOpacity,
  View,
  ImageBackground
} from 'react-native';

import Colors from '../../constants/Colors.js'

import { SafeAreaView } from 'react-navigation';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';
import ListItem from '../../components/fromKirin/ListItem';


class FileList extends React.PureComponent {
  render() {
    return (
      <View>
        {
          this.props.files.map((item) => {
            console.log(item)
            const fileType = item.type ? item.type : 0;
            let picUrl;
            switch(fileType) {
              case 'pdf':
                picUrl =  require('../../images/file-pdf.png');
                break;
              case 'doc':
                picUrl =  require('../../images/file-doc.png');
                break;
              case 'ppt':
                picUrl =  require('../../images/file-ppt.png');
                break;
              default:
                picUrl =  require('../../images/file-0.png');
            } 
            return (
              <TouchableOpacity key={item.id} style={{marginVertical: px(20)}}>
                <Profile
                  nameColor='#000'
                  isCircle={false}
                  avatar={picUrl}
                  size={px(94)} 
                  name={item.name}
                  describe={item.size}
                />
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }
}

export default class ContractDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id : '',
      title: '',
      summary: '',
      businessType: '',
      industries: '',
      relatedProducts: '',
      inChargeName: '',
      inChargeTel: '',
      inChargeMail: '',
      location: '',
      contractId: '',
      customer: '',
      signBody: '',
      signDate: '',
      price: 0,
      files: [],
      headerNow: '案例合同详情',
      headerBackOpacity: 1,
      backContainerHeight: 0,
      navColor: '#000',
      hasHeaderBottom: false,
      contactDept: ''
    }
  }

  componentWillMount() {
    this.getContractDetail();
  }

  async getContractDetail() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', '111');
    const userId = await getUserId();
    try {
      const result = await Request.get(`userContl/getCaseDetail?baseId=${itemId}&inputType=CASE&userId=${userId}`);
      if (result) {
        const {baseId,contactDept, topic, desc, busiName, industryName, competency, contactName, contactPhone, contactEmail, relatedRegion, agreementId,companyName, startDate, custName, agreementFee} = result;
        this.setState({
          id: baseId,
          title: topic,
          summary: desc,
          businessType: busiName,
          industries: industryName,
          relatedProducts: competency instanceof Array ?  competency[0].items.map(item => item.topic).join('    |    ') : competency,
          inChargeName: contactName,
          inChargeTel: contactPhone,
          inChargeMail: contactEmail,
          location: relatedRegion,
          contractId: agreementId,
          customer: custName,
          signBody: companyName,
          signDate: startDate,
          price: agreementFee,
          contactDept
        })
        console.log(this.state.inChargeMail)
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
        headerNow: '案例合同详情'
      })
    }
  }
  

  render() {

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor: Colors.backgroundNew}}>
        <Header
          title={this.state.headerNow}
          style={[detailStyles.header, this.state.hasHeaderBottom ? detailStyles.borderBottom : {}]}
        />
        <ScrollView scrollEventThrottle = {10} onScroll={this._changeScroll.bind(this)}>
          <View style={detailStyles.container}>
            <View>
              <Text style={detailStyles.title}>{this.state.title}</Text>
              {this.state.summary.length > 0 && <Text numberOfLines={3} style={{marginBottom: px(40), lineHeight: 21}}>{this.state.summary}</Text>}
            </View>
            <View style={{marginBottom:px(30),borderRadius:px(10), backgroundColor: '#fff', paddingHorizontal:px(30), paddingVertical: px(20)}}>
              <ListItem
                isColumn = {true} 
                title="合同负责人"
              >
                  <Profile
                    name={this.state.inChargeName} 
                    avatar = {null}
                    avatarName = {this.state.inChargeName}
                    describe={this.state.inChargeTel} 
                    describe2={this.state.inChargeMail} 
                  />
              </ListItem>
              <ListItem title="部门" isColumn={true} content={this.state.contactDept} />
              <ListItem title="业务类型" content={this.state.businessType.split(',').join('  |  ')} />
              <ListItem title="关联行业" content={this.state.industries.split(',').join('  |  ')} />
              <ListItem title="关联产品">
                <Text style={{color: Colors.darkText}}>{this.state.relatedProducts}</Text>
                
              </ListItem>
            </View>
            <View style={{marginBottom:px(30),borderRadius:px(10), backgroundColor: '#fff', paddingHorizontal:px(30), paddingVertical: px(20)}}>
              <ListItem title="客户名称" content={this.state.customer} />
              <ListItem title="签约主体" content={this.state.signBody} />
              <ListItem title="地域" content={this.state.location} />
              <ListItem title="合同编号" content={this.state.contractId} />
              <ListItem title="合同金额" content={this.state.price + '万元'} />
              <ListItem title="签约时间" content={this.state.signDate} />
            </View>
          </View>
        </ScrollView>
        <View style={[detailStyles.footer]}> 
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('contractApplication', {
                contractId: this.state.id,
                contractName: this.state.title,
              })}  
              style={[detailStyles.footerBtn, {backgroundColor: Colors.mainColorV2}]}>
              <Text style={detailStyles.footerBtnText}>案例申请</Text>
            </TouchableOpacity>
          </View>
        </View>
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