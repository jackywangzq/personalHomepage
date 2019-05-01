import React from 'react';
import {Text, ScrollView,View,Dimensions,Platform,Image,TouchableOpacity, StyleSheet} from 'react-native';
import {px} from '../../utils/px';
import {Request} from '../../utils/request';
import {getUserId} from '../../utils/user';

import CpRecommendItem from '../../components/fromHan/CpRecommandItem';
const {height,width} =  Dimensions.get('window');

import { Tabs } from '@ant-design/react-native';

import { SafeAreaView } from 'react-navigation';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';
import ListItem from '../../components/fromKirin/ListItem';
import Colors from '../../constants/Colors';
import Shadows from '../../components/fromKirin/Shadows';

export default class ProductDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      headerNow: '产品详情',
      tabNow: 0,
      tabPosition: [],
      tabs_line_left: 0,
      tabs_line_width: 0,
      topic: '',
      industryName: '',
      second_clazz: '',
      startDate: '',
      desc: '',
      targetCust: '',
      prodModel: '',
      contactName: '',
      contactPhone: '',
      contactDept: '',
      contactEmail: '',
      teachCust: [],
          prodAdv: [],
          prodFun: [],
          prodQues: [],
          howToSale: [],
      projects: []
    }
    this.tabs = [
      { title: '基本信息', value: 0 },
      { title: '怎么讲解', value: 1 },
      { title: '怎么卖', value: 2 },
      { title: '产品功能', value: 3 },
      { title: '产品优势', value:4 },
      { title: '常见问题', value: 5 },
      { title: '关联方案', value:6 },
    ];
    this.tabPosition = {};
    this.tabbarLength = 0;
    this.contentPosition = {}
  }

  componentWillMount() {
    this.getProductDetail();
  }

  async getProductDetail() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', '');
    const userId = await getUserId();
    try {
      const result = await Request.post('product/getProdDetail', {
        baseId: itemId,
        userId,
        status: 2
      })
      const {res, respDesc, respCode} = result;
      if (respCode === '001') {
        
        const {
          topic,
          industryName,
          second_clazz,
          startDate,
          desc,
          targetCust,
          prodModel,
          contactDept,
          contactPhone,
          contactName,
          contactEmail,
          teachCust,
          prodAdv,
          prodFun,
          prodQues,
          howToSale,
          competency
        } = res
        this.setState({
          topic,
          industryName,
          second_clazz,
          startDate,
          desc,
          targetCust,
          prodModel,
          contactDept,
          contactPhone,
          contactName,
          contactEmail,
          teachCust,
          prodAdv,
          prodFun,
          prodQues,
          howToSale,
          projects: competency[0].items
        })
      }
      
    } catch(err) {
      console.log(err);
    }
  }

  _changeTab(value, needContentScroll) {
    const scrollMaxTarget = this.tabbarLength - px(750);
    const width = this.tabPosition[value].width;
    const target = (px(750) - width) / 2;
    const xNow = this.tabPosition[value].x;
    let scrollTarget;
    if (xNow - target > scrollMaxTarget) {
      scrollTarget = scrollMaxTarget;
    } else if (xNow - target > 0) {
      scrollTarget = xNow - target;
    }else {
      scrollTarget = 0;
    }
    this.refs.tabbar.scrollTo({
      x: scrollTarget,
      y: 0,
      animated: false
    })
    if (needContentScroll) {
      this.refs.content.scrollTo({
        x: 0,
        y: this.contentPosition[value].y,
        animated: false
      })
    }
    this.setState({
      tabNow: value,
      tabs_line_left: xNow - scrollTarget,
      tabs_line_width: width
    })
  }



  _tabPosition(tabNow, x,y,width,height) {
    this.tabPosition[tabNow] = {x, width}
    this.tabbarLength += (width + px(20))
    if (tabNow === 0) {
      this.setState({
        tabs_line_left: x,
        tabs_line_width: width
      })
    }
  }

  _contentPosition(contentNow, x,y,width,height) {
    this.contentPosition[contentNow] = {y, height}
  }

  _changeScroll(e) {
    const scrollNow = e.nativeEvent.contentOffset.y;
    if (scrollNow > this.contentPosition[6].y - px(80)) {
      this._changeTab(6)
    } else if (scrollNow > this.contentPosition[5].y - px(200)) {
      this._changeTab(5)
    } else if (scrollNow > this.contentPosition[4].y - px(200)) {
      this._changeTab(4)
    } else if (scrollNow > this.contentPosition[3].y - px(200)) {
      this._changeTab(3)
    } else if (scrollNow > this.contentPosition[2].y - px(200)) {
      this._changeTab(2)
    } else if (scrollNow > this.contentPosition[1].y - px(200)) {
      this._changeTab(1)
    } else {
      this._changeTab(0)
    }
  }

  render() {

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{flex: 1, backgroundColor: Colors.background}}>
        <Header
          title={this.state.headerNow}
        />
          <Shadows height={px(90)} style={{paddingTop: 10, marginTop: -10, zIndex: 1000}}>
            <View style={[{height:px(90), backgroundColor:'#fff', }, tabStyles.shadow]}>
              <ScrollView ref='tabbar'
                showsHorizontalScrollIndicator = {false}
                horizontal={true}>
                {
                  this.tabs.map((item, index) => {
                    return (
                      <View 
                        key={item.value} style={[{marginHorizontal:px(10), paddingHorizontal:px(20)}]}
                        onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
                          this._tabPosition(item.value, x,y,width,height)
                        }}
                      >
                        <TouchableOpacity
                          style={[{height:'100%', justifyContent:'center', alignItems: 'center'}]}
                          onPress = {() => this._changeTab(item.value, true)}  
                        >
                          <Text style={(this.state.tabNow === item.value) && {fontWeight: 'bold'}}>{item.title}</Text>
                          <View style={[(this.state.tabNow === item.value) && {width:'100%'},{left: 0}, tabStyles.tabs_line]}></View>
                        </TouchableOpacity>
                        
                      </View>
                    )
                  })
                }
              </ScrollView>
              {
                false &&
                <View style={[{left: this.state.tabs_line_left, width: this.state.tabs_line_width}, tabStyles.tabs_line]}></View>
              }
            </View>
            <View style={{position:'absolute',backgroundColor:'#fff',width:'100%', height: 10, top:Platform.OS === 'ios' ? 0 : -4,zIndex: 2000}} />
          </Shadows>
        
        <ScrollView bounces={false}ref="content" onScroll={this._changeScroll.bind(this)} scrollEventThrottle={10}>
          <View
            onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
              this._contentPosition(0, x,y,width,height)
            }}
            style = {contentStyles.container}
          >
            <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'flex-end'}}>
              <View style={{flexDirection:'row', flex: 1}}>
                <View style={{position: 'absolute',top:0,left:-px(30),backgroundColor:Colors.mainColorV2,width:px(10),height:px(45),borderBottomRightRadius:px(10)}}></View>
                <Text style={{fontWeight:'bold',fontSize:22}}>{this.state.topic}</Text>
              </View>
              <View style={{flexDirection:'row',  alignItems:'center'}}>
                <Text style={{color:'rgba(0,0,0,.45)'}}>{this.state.industryName + '  /  '}</Text>
                <Text style={{fontSize:13, color:'rgba(0,0,0,.7)'}}>{this.state.second_clazz}</Text>
              </View>
            </View>
            <View style={{marginTop:px(20), justifyContent:'center'}}>
              <Text style={{textAlign:'center',borderColor:'rgb(255, 68, 68)',color:'rgb(255, 68, 68)',lineHeight:px(40),borderRadius:px(4), width:px(120),height:px(44),fontSize:12,borderWidth:px(2)}}>{this.state.prodModel}</Text>
            </View>
            <View style={{paddingTop:px(50), paddingBottom: px(40)}}>
              <Text style={{lineHeight:20,lineHeight: 24, color:'#333',fontSize:14}}>{this.state.desc}</Text>
            </View>
            <ListItem
              isColumn = {true} 
              title="产品联系人"
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
            <ListItem isLast={true} isColumn={true} title="目标客户" content={this.state.targetCust} />
          </View>
          <View 
            style={contentStyles.container}
            onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
              this._contentPosition(1, x,y,width,height)
            }}
          >
            <View>
              <View style={{marginBottom: px(40), flexDirection:'row'}}>
                <Text style={{fontSize: 20}}>怎么讲解</Text>
              </View>
              {
                this.state.teachCust.map(item => {
                  return (
                    <View key={item.subId}>
                      <Text style={{color: '#fff', fontSize: 16, padding: px(20), backgroundColor:'#333'}}>{item.title}</Text>
                      <Text style={{paddingVertical: px(20), lineHeight: 24, color: Colors.darkText}}>{item.content}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View 
            style={contentStyles.container}
            onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
              this._contentPosition(2, x,y,width,height)
            }}
          >
            <View>
              <View style={{marginBottom: px(40), flexDirection:'row'}}>
                <Text style={{fontSize: 20}}>怎么卖</Text>
              </View>
              {
                this.state.howToSale.map(item => {
                  return (
                    <View key={item.subId}>
                      <View>
                        <View style={{position: 'absolute',top:0,left:0,backgroundColor:Colors.mainColorV2,width:px(10),height:'100%',borderBottomRightRadius:px(10)}}></View>
                        <Text style={{color: '#333',fontWeight:'bold', fontSize: 16,paddingHorizontal:px(30), paddingVertical:px(12)}}>{item.title}</Text>
                      </View>
                      <Text style={{paddingVertical: px(20), lineHeight: 24, color: Colors.darkText}}>{item.content}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View 
            style={contentStyles.container}
            onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
              this._contentPosition(3, x,y,width,height)
            }}
          >
            <View>
              <View style={{marginBottom: px(40), flexDirection:'row'}}>
                <Text style={{fontSize: 20}}>产品功能</Text>
              </View>
              {
                this.state.prodFun.map(item => {
                  return (
                    <View key={item.subId}>
                      <View>
                        <View style={{position: 'absolute',top:0,left:0,backgroundColor:Colors.mainColorV2,width:px(10),height:'100%',borderBottomRightRadius:px(10)}}></View>
                        <Text style={{color: '#333',fontWeight:'bold', fontSize: 16,paddingHorizontal:px(30), paddingVertical:px(12)}}>{item.title}</Text>
                      </View>
                      <Text style={{paddingVertical: px(20), lineHeight: 24, color: Colors.darkText}}>{item.content}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View 
            style={contentStyles.container}
            onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
              this._contentPosition(4, x,y,width,height)
            }}
          >
            <View>
              <View style={{marginBottom: px(40), flexDirection:'row'}}>
                <Text style={{fontSize: 20}}>产品优势</Text>
              </View>
              {
                this.state.prodAdv.map(item => {
                  return (
                    <View key={item.subId}>
                      {
                        !(item.title == '产品优势' && this.state.prodAdv.length == 1) &&
                        <View>
                          <View style={{position: 'absolute',top:0,left:0,backgroundColor:Colors.mainColorV2,width:px(10),height:'100%',borderBottomRightRadius:px(10)}}></View>
                          <Text style={{color: '#333',fontWeight:'bold', fontSize: 16,paddingHorizontal:px(30), paddingVertical:px(12)}}>{item.title}</Text>
                        </View>
                      }
                      <Text style={{paddingVertical: px(20), lineHeight: 24, color: Colors.darkText}}>{item.content}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View 
            style={contentStyles.container}
            onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
              this._contentPosition(5, x,y,width,height)
            }}
          >
            <View>
              <View style={{marginBottom: px(20), flexDirection:'row'}}>
                <Text style={{fontSize: 20}}>常见问题</Text>
              </View>
              {
                this.state.prodQues.map((item, index) => {
                  return (
                    <View key={item.subId} style={[{paddingVertical: px(20)}, (this.state.prodQues.length !== index + 1) && contentStyles.bottomHair]}>
                      {
                        item.title != '常见问题' &&
                        <View>
                          <View style={{position: 'absolute',top:px(12),left:-px(30),backgroundColor:Colors.mainColorV2,borderBottomRightRadius:px(10)}}>
                            <Text style={{padding: px(6), color:'#fff'}}>问</Text>
                          </View>
                          <Text style={{color: '#333',fontWeight:'bold', fontSize: 16,paddingHorizontal:px(20), paddingVertical:px(12)}}>{item.title}</Text>
                        </View>
                      }
                      
                      <Text style={{paddingVertical: px(20), lineHeight: 24, color: Colors.darkText}}>{item.content}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View style={contentStyles.container}
            onLayout = {({nativeEvent: { layout: {x, y, width, height}}}) => {
              this._contentPosition(6, x,y,width,height)
            }}
          >
            <View>
              <View style={{marginBottom: px(20), flexDirection:'row'}}>
                <Text style={{fontSize: 20}}>关联方案</Text>
              </View>
              <ScrollView>
                {
                  this.state.projects.map((item, index) => {
                    const noPic = true;
                    return (
                      <TouchableOpacity key={item.id} 
                          onPress = {() => this.props.navigation.navigate('projectDetail', {
                            itemId: item.id
                          })}
                          style={[ {
                          borderRadius: px(10),
                          backgroundColor: "#ffffff",
                          paddingHorizontal: px(30),
                          paddingVertical: px(36)
                        }]}>
                          <View style={[tabStyles.shadow,{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }]}>
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
                              false &&
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
              </ScrollView>
              
            </View>
          </View>
          
          
          
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  const tabStyles = StyleSheet.create({
    tabs_line: {
      position: 'absolute',
      bottom: (0),
      height: px(6),
      backgroundColor: Colors.mainColorV2
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
          
        },
      })
    }
  })

  const contentStyles = StyleSheet.create({
    container: {backgroundColor:'#fff',paddingHorizontal: px(30),marginBottom:px(20), paddingTop:px(40), paddingBottom: px(40)},
    bottomHair: {borderBottomColor:Colors.hairlineColor, borderBottomWidth: StyleSheet.hairlineWidth}
  })