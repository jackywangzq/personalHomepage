import React from 'react';
import {dateFormat} from '../../utils/calendar';
import {Alert,FlatList,ScrollView,Platform,Image,SafeAreaView,Text,TextInput,View,Dimensions,TouchableOpacity} from 'react-native';
import SearchItem from '../../components/fromHan/SearchItem';
const {width,height} =  Dimensions.get('window');
const isIphoneX = (Platform.OS === 'ios' && (Number(((height/width)+"").substr(0,4)) * 100) === 216); 
const cateViewRefs = []
const cateBarRefs = []
const cateBarTextRefs = []
var old_Cate_index = 0;

import HomeHeader from '../../components/fromKirin/HomeHeader';
import SearchBar from '../../components/fromKirin/SearchBar';
import {px} from '../../utils/px';
import Colors from '../../constants/Colors';
import {Request} from '../../utils/request';

export default class SearchScreen extends React.Component {

  constructor(props) {
    super(props);
    // var value = this.props.navigation.state.params.value
    this.state = {
      value:'',
      FAlist :[],
      HTlist :[],
      ZZlist :[],
      pageNumFA: 1,
      pageNumHT: 1,
      pageNumZZ: 1,
      showTabs: false,
      isFocus: true
    }
    this.searchType = this.props.navigation.getParam('searchType', 'all');
    let searchWord;
    switch(this.searchType) {
      case 'FA':
        searchWord = '我要找方案'
        break;
      case 'HT':
        searchWord = '我要找合同'
        break;
      case 'ZZ':
        searchWord = '我要找资质'
        break;
      default:
        searchWord = '找方案、找合同、找资质'
    }
    this.searchWord = searchWord;
    
    this.pageSize = 1000;
    this._search = this._search.bind(this);
    this._goback = this._goback.bind(this);
    this._onSearchFocus = this._onSearchFocus.bind(this);
    this._onSearchBlur = this._onSearchBlur.bind(this);
    this._renderEmpty = this._renderEmpty.bind(this);
  }

  componentDidMount() {
    cateViewRefs[0] = this.refs.dt;
    cateViewRefs[1] = this.refs.fa;
    cateViewRefs[2] = this.refs.sc;

    cateBarRefs[0] = this.refs.dtbar;
    cateBarRefs[1] = this.refs.fabar;
    cateBarRefs[2] = this.refs.scbar;

    cateBarTextRefs[0] = this.refs.dtbarText;
    cateBarTextRefs[1] = this.refs.fabarText;
    cateBarTextRefs[2] = this.refs.scbarText; 

    // const value = this.props.navigation.state.params.value;
    // this.searchFA(value)
    // this.searchHT(value)
    // this.searchZZ(value)

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
  _search =(e) => {
    console.log(this.state.value);
    if (this.state.value == '') {
      return
    }
    this._searchByType(this.searchType, this.state.value);
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
      case 'FA':
        this.searchFA(value);
        break;
      case 'HT':
        this.searchHT(value);
        break;
      case 'ZZ':
        this.searchZZ(value);
        break;
      default:
        this.searchFA(value);
        this.searchHT(value);
        this.searchZZ(value);
    }
  }

  async searchFA(value) {
    const querys = `inputType=PLAN&condition=${value}&pageNum=${this.state.pageNumFA}&pageSize=${this.pageSize}&company=all&industry=&busiType=&provCode=`
    try {
      const result = await Request.get(`schemeContl/getSchemeInfo?${querys}`);
      const {respCode, respDesc, data} = result;
      if (respCode === '001') {
        const resulFormat = data.map(item => {
          return {
            id: item[0] + '',
            name: item[1],
            discription: item[2],
            type: '方案'
          }
        })
        this.setState({
          FAlist: resulFormat
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

  async searchHT(value) {
    const querys = `inputType=CASE&condition=${value}&pageNum=${this.state.pageNumHT}&pageSize=${this.pageSize}&company=all&industry=&busiType=&provCode=&startMoney=0&endMoney=1000000000000&startDate=1753-01-01&endDate=9999-12-31`
    try {
      const result = await Request.get(`userContl/getCaseInfo?${querys}`);
      if (result) {
        const resulFormat = result.map(item => {
          return {
            id: item[0] + '',
            name: item[1],
            discription: item[5] + '万',
            type: '合同'
          }
        })
        this.setState({
          HTlist: resulFormat
        })
      } else {
        Alert.alert(
          '请求后台服务失败，请重试',
          '',
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

  async searchZZ(value) {
    const querys = `inputType=INTE&condition=${value}&pageNum=${this.state.pageNumZZ}&pageSize=${this.pageSize}&company=all`
    try {
      const result = await Request.get(`userContl/findKapplyInfo?${querys}`);
      if (result) {
        const resulFormat = result.map(item => {
          return {
            id: item.id + '',
            name: item.topic,
            discription: this.date(item.endDate),
            type: '资质'
          }
        })
        this.setState({
          ZZlist: resulFormat
        })
      } else {
        Alert.alert(
          '请求后台服务失败，请重试',
          '',
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

  _goDetail(id, type) {
    let routeNow;
    switch(type) {
      case '方案':
        routeNow = 'projectDetail';
        break;
      case '合同':
        routeNow = 'contractDetail';
        break;
      case '资质':
        routeNow = 'aptitudeDetail';
        break;
      default:
        routeNow = '';
    }
    this.props.navigation.navigate(routeNow, {
      itemId: id
    })
  }

  _goback() {
    this.props.navigation.goBack(null);
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
        <Text>{`无“${this.state.value}”的搜索结果`}</Text>
      </View>
    )
  }

  _keyExtractor = (item) => item.id + '';

    render() {
      const search_input = require('../../images/search_input.png')
      const back = require('../../images/back.png');
      return (
        <SafeAreaView style={{flex: 1,flexDirection:'column',backgroundColor: '#fff',justifyContent:'flex-start'}}>
          <HomeHeader
            style={{padding: px(30)}}
            needTop = {false}
            left={
              <SearchBar 
                onChangeText = {(value) => this.setState({value})} 
                placeholder={this.searchWord} 
                editable={true}
                value = {this.state.value}
                onSubmit = {this._search}
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
          <ScrollView style={this.state.isFocus && {display: 'none'}}>
            
            
              <View style={[!this.state.showTabs && {display: "none"}, {height:50,paddingTop:20,marginTop: -px(30), flexDirection:'row',justifyContent:'space-around',borderBottomColor:'#eee',borderBottomWidth:1}]}>
                <TouchableOpacity activeOpacity={1} onPress={() => this._onCatepress(0)}  ref="dtbar" style={{width:(width-240)/4,borderBottomColor:'#33a6fa',borderBottomWidth:2,alignItems:'center'}}><Text ref="dtbarText" style={{color:'#33a6fa'}}>方案</Text></TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => this._onCatepress(1)} ref="fabar" style={{width:(width-240)/4,borderBottomColor:'#33a6fa',alignItems:'center'}}><Text ref="fabarText">合同</Text></TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => this._onCatepress(2)} ref="scbar" style={{width:(width-240)/4,borderBottomColor:'#33a6fa',alignItems:'center'}}><Text ref="scbarText">资质</Text></TouchableOpacity>
              </View>
            
        

            <View ref="dt" style={[(this.searchType !== 'all' && this.searchType !=='FA') && {display: 'none'}, {paddingLeft:15,paddingRight:15}]}>
            <FlatList
              data={this.state.FAlist}
              ListEmptyComponent={this._renderEmpty}
              renderItem={({item}) => <SearchItem onPressed={(id,type) => this._goDetail(id,type)} item={item}></SearchItem>}
              keyExtractor={this._keyExtractor}
            />
            </View>

            <View ref="fa" style={[(this.searchType !=='HT') && {display: 'none'},{paddingLeft:15,paddingRight:15}]}>
            <FlatList
              data={this.state.HTlist}
              ListEmptyComponent={this._renderEmpty}
              renderItem={({item}) => <SearchItem onPressed={(id,type) => this._goDetail(id,type)} item={item}></SearchItem>}
              keyExtractor={this._keyExtractor}
            />
            </View>

            <View ref="sc" style={[(this.searchType !=='ZZ') && {display: 'none'},{paddingLeft:15,paddingRight:15}]}>
            <FlatList
              data={this.state.ZZlist}
              ListEmptyComponent={this._renderEmpty}
              renderItem={({item}) => <SearchItem onPressed={(id,type) => this._goDetail(id,type)} item={item}></SearchItem>}
              keyExtractor={this._keyExtractor}
            />
            </View>
          </ScrollView>
        </SafeAreaView>
        )
    }
  }