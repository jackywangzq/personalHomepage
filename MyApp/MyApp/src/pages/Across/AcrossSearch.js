import React from 'react';
import {dateFormat} from '../../utils/calendar';
import {Alert,FlatList,ScrollView,Platform,Image,SafeAreaView,Text,TextInput,View,Dimensions,TouchableOpacity} from 'react-native';
const {width,height} =  Dimensions.get('window');
const isIphoneX = (Platform.OS === 'ios' && (Number(((height/width)+"").substr(0,4)) * 100) === 216); 

import HomeHeader from '../../components/fromKirin/HomeHeader';
import SearchBar from '../../components/fromKirin/SearchBar';
import {px} from '../../utils/px';
import Colors from '../../constants/Colors';
import {Request} from '../../utils/request';
import Profile from '../../components/fromKirin/Profile';

export default class SearchScreen extends React.Component {

  constructor(props) {
    super(props);
    // var value = this.props.navigation.state.params.value

    this.state = {
      value:'',
      managerlist :[],
      productlist :[],
      showTabs: false,
      isFocus: true
    }
    this.searchType = this.props.navigation.getParam('type');
    this.orgId = this.props.navigation.getParam('orgId');
    this.acrossvalue = this.props.navigation.getParam('acrossvalue');

    let searchWord = '';
    switch(this.searchType) {
      case 'manager':
        searchWord = '客户经理检索'
        break;
      case 'product':
        searchWord = '关联产品检索'
        break;
    }
    this.searchWord = searchWord;
    
    this.pageSize = 1000;
    this._search = this._search.bind(this);
    this._goback = this._goback.bind(this);
    this._onSearchFocus = this._onSearchFocus.bind(this);
    this._onSearchBlur = this._onSearchBlur.bind(this);
    this._renderEmpty = this._renderEmpty.bind(this);
    this._onChoose = this._onChoose.bind(this);
  }

  componentDidMount() {
    
  }

  
  _search =(value) => {
    this.setState({
      value:value
    })
    if (value == '') {
      return
    }
    this._searchByType(this.searchType, value);
    if (
      this.searchType === 'all'
    ) {
      this.setState({
        showTabs: true
      })
    }
    
  }

  _searchByType(type, value) {
    switch(type) {
      case 'manager':
        this.searchManager(value);
        break;
      case 'product':
        this.searchProduct(value);
        break;
    }
  }

  async searchManager(value) {
    const querys = `orgId=${this.orgId}&inputText=${value}`
    try {
      const result = await Request.post(`common/getUserInfoBySearch?${querys}`);
      if (result != null) {
        let resultFormat = [];
        for(var i = 0;i < result.length;i++) {
          resultFormat.push({
            id: result[i].id,
            name: result[i].name,
            phone: result[i].phone,
            email: result[i].email,
            orgName:result[i].orgName
          })
        }
        console.log(resultFormat)
        this.setState({
          managerlist: resultFormat
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

  async searchProduct(value) {
    const querys = `topic=${value}&clazz=PROD&productType=${this.acrossvalue}`
    try {
      const result = await Request.post(`common/retuProdInfo?${querys}`);
      if (result != null) {
        let resultFormat = [];
        for(var i = 0;i < result.length;i++) {
          resultFormat.push({
            id: result[i].id,
            name: result[i].contactName,
            phone: result[i].phone,
            email: result[i].email,
            topic:result[i].topic
          })
        }
        console.log(resultFormat)
        this.setState({
          productlist: resultFormat
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

  date (date,fomatter){
    if (!date)return '';
    var fmt = fomatter || 'yyyy年M月d日';
    return dateFormat(date, 'L');
  }

  _goback() {
    this.props.navigation.goBack(null);
  }
  _onChoose = (item) => {
    
    this.props.navigation.state.params.choose(item,this.searchType)
    this._goback();
  }
  _onSearchFocus() {
    this.setState({
      isFocus: true
    })
  }

  _onSearchBlur() {
    this.setState({
      isFocus: false
    })
  }

  _renderEmpty() {
    return (
      <View style={{flex: 1, marginTop: px(100),paddingHorizontal:px(80), alignItems:'center',justifyContent:'center'}}>
        <Text></Text>
      </View>
    )
  }

  _keyExtractor = (item) => item.id + '';

    render() {
      const search_input = require('../../images/search_input.png')
      const back = require('../../images/back.png');
      return (
        <SafeAreaView style={{flex: 1,flexDirection:'column',backgroundColor: 'white',justifyContent:'flex-start'}}>
          <HomeHeader
            style={{padding: px(30),backgroundColor:'white'}}
            needTop = {false}
            left={
              <SearchBar 
                onChangeText = {(value) => this._search(value)} 
                placeholder={this.searchWord} 
                editable={true}
                value = {this.state.value}
                onFocus = {this._onSearchFocus}
                onBlur = {this._onSearchBlur}
                
              />
            }
            right = {
              <TouchableOpacity onPress={this._goback} style={{minHeight: px(80),justifyContent:'center'}}>
                <Text style={{color: Colors.mainColorV2}}>取消</Text>
              </TouchableOpacity>
            }
          />
          <ScrollView style={[(this.searchType === 'manager') && {backgroundColor: 'white'},(this.searchType !== 'manager') && {backgroundColor: 'rgb(245,245,245)'}]}>
           

            <View style={[(this.searchType !== 'manager') && {display: 'none'}, {backgroundColor: 'white',paddingLeft:15,paddingRight:15}]}>
            <FlatList
              data={this.state.managerlist}
              ListEmptyComponent={this._renderEmpty}
              renderItem={({item}) => 
              <TouchableOpacity onPress={() => this._onChoose(item)} style={{marginTop:px(20),backgroundColor:'white',borderBottomColor:px(1),borderBottomWidth:px(1),paddingBottom:px(20),borderBottomColor:'#eee'}}>
              <Profile 
              imgSize={px(120)}
              name={item.name}
              canTouch={false}
              avatar={null}
              avatarName={item.name} 
              describe={item.phone} 
              describe2={item.email}
              orgName={item.orgName}
              item={item}>
            </Profile>
            </TouchableOpacity>
              }
              keyExtractor={this._keyExtractor}
            />
            </View>

            <View style={[(this.searchType !=='product') && {display: 'none'},{paddingLeft:15,paddingRight:15}]}>
            <FlatList
              data={this.state.productlist}
              ListEmptyComponent={this._renderEmpty}
              renderItem={({item}) => 
              <TouchableOpacity onPress={() => this._onChoose(item)} style={{backgroundColor:'white',borderRadius:px(5),marginTop:px(30),borderBottomColor:px(1),borderBottomWidth:px(1),paddingLeft:px(30),paddingRight:px(30),paddingTop:px(20),paddingBottom:px(20),borderBottomColor:'#eee'}}>
              <View style={{height:px(60),lineHeight:px(60),fontSize:px(32),marginBottom:px(20),borderBottomColor:'#eee',borderBottomWidth:px(1)}}><Text>{item.topic}</Text></View>
              <Profile 
                    name={item.name}
                    canTouch={false}
                    avatar={null}
                    avatarName={item.name} 
                    describe={item.phone} 
                    describe2={item.email} 
                    item={item}>
              </Profile>
              </TouchableOpacity>}
              keyExtractor={this._keyExtractor}
            />
            </View>
          </ScrollView>
        </SafeAreaView>
        )
    }
  }