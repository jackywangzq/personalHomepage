import React from 'react';
import {Alert,Linking,StatusBar, FlatList,ScrollView,Dimensions,TouchableOpacity,Image,TextInput,Platform, StyleSheet, Text, View} from 'react-native';
import BannerItem from '../../components/fromHan/BannerItem';
import HomeRecommendItem from '../../components/fromHan/HomeRecomandItem';
import HomeProduct from '../../components/fromHan/HomeProduct';
import HomeExpert from '../../components/fromHan/HomeExpert';
import HomeProject from '../../components/fromHan/HomeProject';

import HomeHeader from '../../components/fromKirin/HomeHeader';
import SearchBar from '../../components/fromKirin/SearchBar';
import {px} from '../../utils/px';
import {Request} from '../../utils/request';
import {versionNow} from '../../utils/Global';

import { SafeAreaView } from 'react-navigation';

const {width,height} =  Dimensions.get('window'); 

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
        FAList:[{
          id:'121082',
          phone:'18603658567',
          name:'智慧党建产品解决方案',
          date:'2019-01-30',
          username:'赵瑞欣',
          pic: require('../../images/party.jpeg'),
          discription:'智慧党建云平台是联通系统集成有限公司黑龙江省分公司（联通黑龙江产业互联网有限公司）自主研发的产品，面向省、市、县各级党委提供党建工作综合性解决方案。通过党建平台的建设，提高党员的凝聚力、党员的归属感，加强党员教育、管理，同时对党员教育、考试、活动等内容进行考评督办，提高党建水平和执行力。'
        },{
          id:'121053',
          phone:'18511665839',
          name:'智慧河长平台解决方案',
          date:'2019-01-30',
          username:'刘畅',
          pic: require('../../images/river.jpeg'),
          discription:'联通智慧河长平台建设符合河长工作规范制度要求，采用河道网格保障体系进行搭建，建设内容包含水环境监测物联网、数据中心、应用支撑层、智慧河长综合管理层、河长制信息服务门户、河长制办公移动应用、河长制公众服务应用等，为省、市、县、乡各级河长、河长办、河长相关部门及社会公众提供服务。。'
        },{
          id:'121157',
          phone:'18601722203',
          name:'城市精细化管理产品上海解决方案',
          date:'2019-01-30',
          username:'杨宏玉',
          pic: require('../../images/city.jpeg'),
          discription:'在城市管理过程中，综合运用云计算、大数据、物联网、人工智能等技术手段，形成一张综合“城市神经元”和“城市脉络”的综合性神经网络，实现城市人、物、事件等城市动态运行数据的有效感知；结合管理部门的实际业务场景和管理要求，面向公共管理、公共安全、公共服务三大领域形成城市机能，依托全流程标准化大数据管理，结合边缘云计算，形成各级城市大脑，形成智慧决策、纵横协同、政企协作、连接市民的城市管理精细化新机制'
        }],
        banners: [],
        productPics: [],
        projectPics: []
    }
    this.isV1 = false;
    this.isV2 = true;
    this._search = this._search.bind(this);
  }
  _onScrollEndDrag = (e) => {
    var scrollx = e.nativeEvent.contentOffset.x;
    var page = Math.round(scrollx / width)
    this.refs.bannerScroll.scrollTo({x:page * width,y:0,animated:true})
}

  /* _search =(e) => {
    console.log(e)
    if(e.nativeEvent.text == '')
      return;
    this.props.navigation.navigate('searchScreen',{value:e.nativeEvent.text})
  } */

  _search() {
    // this.props.navigation.navigate('searchScreen')
    this.props.navigation.navigate('searchAll')
  }

  componentDidMount() {
    // this._loadBanner();
    // this._loadProduct();
    // this._loadProject();
    this.checkVersion();
  }

  async _loadBanner() {
    try{
      const result = await Request.get('https://tt.wo.cn/mobile/static/images?type=banner');
      this.setState({
        banners: result
      })
    }catch (err) {
      console.log(err)
    }
  }

  async _loadProduct() {
    try{
      const result = await Request.get('https://tt.wo.cn/mobile/static/images?type=product');
      this.setState({
        productPics: result
      })
    }catch (err) {
      console.log(err)
    }
  }

  async _loadProject() {
    try{
      const result = await Request.get('https://tt.wo.cn/mobile/static/images?type=project');
      this.setState({
        projectPics: result
      })
    }catch (err) {
      console.log(err)
    }
  }

  goProductScreen = () => {
    this.props.navigation.navigate('ProductScreen');
  }

  async checkVersion() {
    try {
      const result = await Request.get('https://tt.wo.cn/mobile/version');
      const {version, url} = result;
      if (version) {
        if (version != versionNow) {
          Alert.alert('', 
            '已有新版本，是否更新', 
            [
              {
                text: '取消', 
                onPress: () => console.log('取消')
              }, 
              {
                text: '确定', 
                onPress: () => {Linking.openURL(url)}
              }
            ]
          );
        } 
      } else {
        Alert.alert('网络接口数据错误')
      }
    } catch(err) {
      Alert.alert('网络接口数据错误')
    }
  }

  _goProject(id) {
    this.props.navigation.navigate('projectDetail', {
      itemId: id
    })
  }

  _keyExtractor = (item) => item.id;

  _separator = () => {
    return <View style={{height:StyleSheet.hairlineWidth, backgroundColor:'#eee'}}/>;
  }

    render() {
      // this.checkVersion();
      const cpk = require('../../images/chanpinku.png')
      const fak = require('../../images/fanganku.png')
      const zzk = require('../../images/zizhiku.png')
      const htk = require('../../images/hetongku.png')
      const more = require('../../images/more.png')
      return (
        <SafeAreaView forceInset={{ top: 'never' }} style={{flex: 1,flexDirection:'column',backgroundColor: '#fff'}}>
          <HomeHeader
            style={{padding: px(30)}}
            left={<SearchBar onPressed={this._search} placeholder="找产品、找方案、找合同、找资质" editable={false}/>}
          />
          <ScrollView stickyHeaderIndices={[1]} >
            <View style={{paddingTop: px(10), paddingBottom: px(30)}}> 
              <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false} onScrollEndDrag={this._onScrollEndDrag} ref='bannerScroll'>
                <BannerItem key={0} count={2} select={0}></BannerItem>
                {
                  false &&
                  <BannerItem key={1} count={2} select={1}></BannerItem>
                }
                
              </ScrollView>
            </View>
            <View>
              <View style={{flexDirection:'row',paddingTop:px(30),paddingBottom: px(40),backgroundColor: '#fff',alignItems: 'center', justifyContent:'space-around'}}>
                {
                  !this.isV1 && 
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('productHome')}>
                    <View style={{flexDirection:'column'}}>
                      <Image source={cpk} style={{width:40,height:40}}></Image>
                      <Text>找产品</Text>
                    </View>
                  </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => this.props.navigation.navigate('projectHome')}>
                  <View style={{flexDirection:'column'}}>
                    <Image source={fak} style={{width:40,height:40}}></Image>
                    <Text>找方案</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('contractHome')}>
                  <View style={{flexDirection:'column'}}>
                    <Image source={htk} style={{width:40,height:40}}></Image>
                    <Text>找合同</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('aptitudeHome')}>
                  <View style={{flexDirection:'column'}}>
                    <Image source={zzk} style={{width:40,height:40}}></Image>
                    <Text>找资质</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {
              !this.isV2 &&
              <View style={{marginTop:35}}>
                <Text style={{marginLeft:15,fontSize:17,color:'black',fontWeight:'bold'}}>猜你想要</Text>
                <ScrollView horizontal={true} style={{marginLeft:5,marginTop:10,height:120}} showsHorizontalScrollIndicator="false" o>
                  <HomeRecommendItem></HomeRecommendItem>
                  <HomeRecommendItem></HomeRecommendItem>
                  <HomeRecommendItem></HomeRecommendItem>
                </ScrollView>
            </View>
            }
            {
              !this.isV1 &&
              <View style={{paddingLeft:15, marginTop: 30}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('productHome')} style={{flexDirection:'row',paddingRight:15}}>
                  <Text style={{flex:1,fontSize:17,color:'black',fontWeight:'bold'}}>重点产品</Text>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontSize: 13}}>更多</Text>
                    <Image source={more} style={{width:8,height:12, marginLeft: 6}}></Image>
                  </View>
                </TouchableOpacity>
                <ScrollView horizontal={true} style={{marginTop:20}} showsHorizontalScrollIndicator={false}>
                  <HomeProduct topic={'智慧党建-黑龙江'} id={120896} pic='party' navigate={this.props.navigation.navigate}></HomeProduct>
                  <HomeProduct topic={'智慧河（湖）长-云粒'} id={120890} pic='he' navigate={this.props.navigation.navigate}></HomeProduct>
                  <HomeProduct topic={'城市精细化管理-上海'} id={120922} pic='chengshi' navigate={this.props.navigation.navigate}></HomeProduct>
                  <HomeProduct topic={'网格化社会治理-山东'} id={120992} pic='wangge' navigate={this.props.navigation.navigate}></HomeProduct>
                  <HomeProduct topic={'城市管理-上海'} id={121011} pic='shanghai' navigate={this.props.navigation.navigate}></HomeProduct>
                </ScrollView>
              </View>
            }
            {
              !this.isV2 &&
              <View style={{paddingLeft:15,marginTop:35}}>
                <View style={{flexDirection:'row',paddingRight:15}}>
                  <Text style={{flex:1,fontSize:17,color:'black',fontWeight:'bold'}}>专家排行榜
                  <Text style={{color:'grey',fontSize:12}}>   国内领先人才</Text></Text>
                  <Image source={more} style={{width:8,height:16}}></Image>
                </View>
                <ScrollView horizontal={true} style={{marginTop:20}} showsHorizontalScrollIndicator={false}>
                  <HomeExpert rank={1} navigate={this.props.navigation.navigate}></HomeExpert>
                  <HomeExpert rank={2} navigate={this.props.navigation.navigate}></HomeExpert>
                  <HomeExpert rank={3} navigate={this.props.navigation.navigate}></HomeExpert>
                  <HomeExpert rank={4} navigate={this.props.navigation.navigate}></HomeExpert>
                  <HomeExpert rank={5} navigate={this.props.navigation.navigate}></HomeExpert>
                  <HomeExpert rank={6} navigate={this.props.navigation.navigate}></HomeExpert>
                </ScrollView>
              </View>
            }
            <View style={{paddingLeft:15,paddingRight:15,marginTop:30}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('projectHome')} style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{flex:1,fontSize:17,color:'black',fontWeight:'bold'}}>经典方案</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={{fontSize: 13}}>更多</Text>
                  <Image source={more} style={{width:8,height:12,marginLeft: 6}}></Image>
                </View>
                
              </TouchableOpacity>
              <FlatList
                style={{marginTop: -10}}
                data={this.state.FAList}
                renderItem={({item}) => <HomeProject onPressed={(id) => this._goProject(id)} item={item}></HomeProject>}
                keyExtractor={this._keyExtractor}
                ItemSeparatorComponent={this._separator}
              />
            </View>     
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  