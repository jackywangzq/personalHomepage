import React from 'react';
import {ScrollView,Picker,Platform,Image,SafeAreaView,StyleSheet,Text,View,Dimensions,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import DTItem from '../../component/DTItem';
import HomeHeader from '../../components/fromKirin/HomeHeader';
import {px} from '../../utils/px';
import Colors from '../../constants/Colors';
const {width,height} =  Dimensions.get('window');
const isIphoneX = (Platform.OS === 'ios' && (Number(((height/width)+"").substr(0,4)) * 100) === 216);  
var Xtop = 0;
const cateViewRefs = []
const cateBarRefs = []
const cateBarTextRefs = []
if(isIphoneX) {
  Xtop = 0
}
var old_Cate_index = 0;
export default class CenterScreen extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        name: '',
        phone: '',
        email: '',
        company: '',
        department: '',
        language: ''
      }
    }


    _onCatepress =(index) => {

      cateViewRefs[old_Cate_index].setNativeProps({
        display:'none',
      });
      cateBarRefs[old_Cate_index].setNativeProps({
        borderBottomWidth:0,
      });
      cateBarTextRefs[old_Cate_index].setNativeProps({
        style:{
          color:'#000',
        }
      });
      cateViewRefs[index].setNativeProps({   
        display:'flex',
      });
      cateBarRefs[index].setNativeProps({   
        borderBottomWidth:2,
      });
      cateBarTextRefs[index].setNativeProps({
        style:{
          color:'#33a6fa',
        }
       
        
      });
      old_Cate_index = index;
    }

    componentWillMount() {
      this._getUserInfo();
    }

    async _getUserInfo() {
      const user = await AsyncStorage.getItem('userInfo');
      console.log(user)
      const {name, email, phone, orgName, org2Name, org3Name} = JSON.parse(user);
      const departmentArr = [];
      if(org2Name) {
        departmentArr.push(org2Name)
      };
      if(org3Name) {
        departmentArr.push(org3Name)
      };
      this.setState({
        name,
        phone,
        email,
        company: orgName,
        department: departmentArr.join(' - ') 
      })
    }

    
    componentDidMount() {
      /* cateViewRefs[0] = this.refs.dt;
      cateViewRefs[1] = this.refs.fa;
      cateViewRefs[2] = this.refs.sc;
      cateViewRefs[3] = this.refs.ll;

      cateBarRefs[0] = this.refs.dtbar;
      cateBarRefs[1] = this.refs.fabar;
      cateBarRefs[2] = this.refs.scbar;
      cateBarRefs[3] = this.refs.llbar;

      cateBarTextRefs[0] = this.refs.dtbarText;
      cateBarTextRefs[1] = this.refs.fabarText;
      cateBarTextRefs[2] = this.refs.scbarText;
      cateBarTextRefs[3] = this.refs.llbarText; */
     
    }

    _signOutAsync =  () => {
      const that = this;
      AsyncStorage.clear(function(err) {
        if (err) {
          console.log(err)
        } else {
          that.props.navigation.navigate('Auth');
        }
      });
      // 
    };

    render() {
      const zjicon = require('../../images/profess_icon.png')
      const job = require('../../images/comp.png')
      const phone = require('../../images/phone.png')
      const email = require('../../images/email.png')
      const avatar = null
      const setting = require('../../images/setting.png')
      /* const tabs = [
        { title: '动态' },
        { title: '方案' },
        { title: '收藏' },
        { title: '浏览' },
        { title: '动态' },
        { title: '方案' },
        { title: '收藏' },
        { title: '浏览' }
      ]; */
      const style = {
        minHeight: 150,
        backgroundColor: '#fff',
      };
      return (
        <View style={{flex: 1,flexDirection:'column',backgroundColor: '#fff',justifyContent:'flex-start'}}>
          <HomeHeader 
            theme = 'dark'
            left = {
              <TouchableOpacity  onPress={this._signOutAsync} style={{padding: px(30)}}>
                {
                  false && 
                  <Image source={setting} style={{zIndex:1000,width:px(44),height:px(44)}}></Image>
                }
                <View style={{zIndex:1000,height:px(44),justifyContent:'center', alignItems:'center'}}>
                  <Text style={{color: '#fff',fontSize: 16}}>退出登录</Text>
                </View>           
              </TouchableOpacity>
            }
          />
          <ScrollView>
          
          <View style={{width: px(750), height: px(265), backgroundColor: Colors.darkHeader}} />

          <View style={{position:'absolute',top:Xtop + px(22),right:40,zIndex:1000,width:px(180),height:px(180)}}>
            <View style={{width: px(180), height:px(180),borderRadius:px(90), backgroundColor: Colors.mainColorV2, alignItems:'center',justifyContent:'center'}}>
              <Text style={{color: '#fff',fontSize: 28}}>{this.state.name.slice(this.state.name.length - 2, this.state.name.length)}</Text>
            </View>
            {
              avatar && 
              <Image source={avatar} style={{width:px(180),height:px(180),borderRadius:px(90),borderColor:'white',borderWidth:px(4)}}></Image>
            }
          </View>
          <View style={{
            shadowColor: '#333',
            shadowOffset: {h: px(20), w: px(20)},
            shadowRadius: px(10),
            shadowOpacity: 0.2,
            backgroundColor:'white',
            marginHorizontal: px(30),
            marginTop: -px(153),
            borderRadius:px(10),width:width-px(60),
            paddingTop:px(50),paddingHorizontal:px(30),paddingBottom:px(40)
            }}>
            <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
              <Text style={{fontSize: 22,color: "#000"}}>{this.state.name}</Text>
              {
                false && 
                <Image source={zjicon} style={{marginLeft:8,width:45,height: 17,marginTop:2}}></Image>
              }
            </View>
            <View style={{flexDirection:'row',marginTop:18,justifyContent:'flex-start'}}>
              <Image source={job} style={{width:14,height: 14}}></Image>
              <Text style={{fontSize: 14,marginLeft:15,color: "#000000"}}>{this.state.company}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:18,justifyContent:'flex-start'}}>
              <Image source={job} style={{width:14,height: 14}}></Image>
              <Text style={{flex: 1,fontSize: 14,marginLeft:15,color: "#666666"}}>{this.state.department}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:18,justifyContent:'flex-start'}}>
              <Image source={phone} style={{marginTop:2,width:14,height: 14}}></Image>
              <Text style={{fontSize: 14,marginLeft:15,color: "#666666"}}>{this.state.phone}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:18,justifyContent:'flex-start'}}>
              <Image source={email} style={{marginTop:2,width:14,height: 14}}></Image>
              <Text style={{fontSize: 14,marginLeft:15,color: "#666666"}}>{this.state.email}</Text>
            </View>
            {
              this.isV1 && 
              <View style={{height:0.5,backgroundColor:'#eee',marginTop:20}}></View>
            }
            
            {
              this.isV1 && 
            <View style={{flexDirection:'row',height:15,marginTop:20}}>
              <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ConcernScreen',{type:1})}} style={{flex:1,borderRightColor:'#eee',borderRightWidth:0.5,alignItems:'center'}}><Text style={{fontSize: 15,lineHeight:15}}>108我关注的</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ConcernScreen',{type:2})}} style={{flex:1,alignItems:'center'}}><Text style={{fontSize: 15,lineHeight:15}}>89关注我的</Text></TouchableOpacity>
            </View>
            }
            
          </View>
          {
            this.isV1 && 
            <View>
              <View style={{marginTop:px(32),height:px(100),paddingTop:px(40),flexDirection:'row',justifyContent:'space-around',borderBottomColor:'#eee',borderBottomWidth:StyleSheet.hairlineWidth}}>
              <TouchableOpacity activeOpacity={1} onPress={() => this._onCatepress(0)}  ref="dtbar" style={{width:(width-240)/4,borderBottomColor:'#33a6fa',borderBottomWidth:2,alignItems:'center'}}><Text ref="dtbarText" style={{color:'#33a6fa'}}>动态</Text></TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => this._onCatepress(1)} ref="fabar" style={{width:(width-240)/4,borderBottomColor:'#33a6fa',alignItems:'center'}}><Text ref="fabarText">方案</Text></TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => this._onCatepress(2)} ref="scbar" style={{width:(width-240)/4,borderBottomColor:'#33a6fa',alignItems:'center'}}><Text ref="scbarText">收藏</Text></TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => this._onCatepress(3)} ref="llbar" style={{width:(width-240)/4,borderBottomColor:'#33a6fa',alignItems:'center'}}><Text ref="llbarText" >浏览</Text></TouchableOpacity>
            </View>
    
            <View ref="dt" style={{paddingLeft:15,paddingRight:15}}>
            <DTItem></DTItem>
            <DTItem></DTItem>
            <DTItem></DTItem>
          
            </View>

            <View ref="fa" style={{paddingLeft:15,paddingRight:15,display:'none'}}>
            <DTItem></DTItem>
            <DTItem></DTItem>
           
            </View>

            <View ref="sc" style={{paddingLeft:15,paddingRight:15,display:'none'}}>
            <DTItem></DTItem>
            
            </View>

            <View ref="ll" style={{paddingLeft:15,paddingRight:15,display:'none'}}>
            <DTItem></DTItem>
            <DTItem></DTItem>
            <DTItem></DTItem>
            <DTItem></DTItem>
          
            </View>
            </View>
          }
            
         
            </ScrollView>
        </View>
        )
    }
  }