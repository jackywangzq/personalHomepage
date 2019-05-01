import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {Request} from '../../utils/request';
import {dateFormat} from '../../utils/calendar';
import {log, logWarm, logError} from '../../utils/logs';
import {
  Platform,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Button,
  PixelRatio,
  FlatList,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import VerticalCard from '../../components/fromKirin/VerticalCard';
import Filter from '../../components/fromKirin/Filter';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';

import Colors from '../../constants/Colors.js'

export default class ContractHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showExtra: true,
      contractList: [],
      filterItems: {
        condition: '',
        industry: '',
        busiType: '',
        provCode: '',
        startMoney: 0,
        endMoney: 1000000000000,
        startDate: '1753-01-01',
        endDate: '9999-12-31',
      },
      filterNow: new Map(),
      pageNum: 1
    }
    this._renderEmpty = this._renderEmpty.bind(this);
  }

  componentDidMount() {
    this.loadContracts();
  }

  async loadContracts() {
    const querys = this._getQuery();
    try {
      const result = await Request.get(`userContl/getCaseInfo?${querys}`)
      if (result) {
        const resulFormat = result.map(item => {
          return {
            id: item[0],
            name: item[1],
            signDateFormat: dateFormat(item[4], 'L'),
            price: item[5] 
          }
        })
        this.setState({
          contractList: resulFormat,
          isLoading: false
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

  componentWillUnmount() {
    
  }

  _getQuery() {
    const filterItems = this.state.filterItems;
    let querys = `inputType=CASE&company=all&pageSize=1000&pageNum=${this.state.pageNum}`;
    for (let key in filterItems) {
      querys += `&${key}=${filterItems[key]}`
    }
    return  querys
  }

  _keyExtractor = (item) => item.id;

  _onFilter = (options) => {
    this.setState({
      isLoading: true
    })
    if(this.state.contractList.length > 0) {
      this.refs.contractList.scrollToIndex({
        index: 0,
        viewPosition: 0
      })
    }
    console.log(options)

    let filterItemsNow = JSON.parse(JSON.stringify(this.state.filterItems));
    for (let key of options.keys()) {
      filterItemsNow[key] = [...options.get(key)].filter(item => item[1]).map(item => item[0]).join(',');
    }
    this.setState({
      filterItems: filterItemsNow,
      filterNow: options
    }, () => {
      this.loadContracts();
    })
    
  }

  _renderEmpty() {
    
    return (
      <View style={{flex: 1, marginTop: px(100),alignItems:'center',justifyContent:'center'}}>
        <Image style={{width: px(194), height: px(256)}} source={require('../../images/empty.png')} />
      </View> )
    
  }

  render() {
    

    // const tabs = this._getTabs(this.state.aptitudes);
    const contracts = this.state.contractList;
    const filters = [
      {
        name: '行业',
        value: 'industry',
        options: '党建 军民融合 政务 农业 教育 医疗健康 生态环境 金融 旅游 交通 工业互联网 传媒 零售 通用 物联网基础 云计算基础 其它'.split(' ').map(item => {return {name: item, value: item}})
      },
      {
        name: '业务',
        value: 'busiType',
        options: [
          {
            name: '产业互联网应用',
            value :'1001'
          },
          {
            name: '云计算',
            value: '1003'
          },
          {
            name: '大数据',
            value: '1000'
          },
          {
            name: '物联网',
            value: '1014'
          }
        ]
      },
      {
        name: '省分',
        value: 'provCode',
        options: '总部 北京 天津 河北 山西 内蒙古 辽宁 吉林 黑龙江 山东 河南 上海 江苏 浙江 安徽 福建 江西 湖北 湖南 广东 广西 海南 重庆 四川 贵州 云南 西藏 陕西 甘肃 青海 宁夏 新疆'.split(' ').map(item => {return {name: item, value: item}})
      }
    ]

    const rightBtn = 
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity 
          onPress={() => this.props.navigation.navigate('searchAll', {searchType: 'case'})}
          style={{width: 44, height: 44, alignItems:"flex-end", justifyContent: "center"}}>
          <Image source={require('../../images/search_new.png')} style={{width: px(42), height: px(42)}}/>
        </TouchableOpacity>
      </View>
    
    const numColumns = 2;
    

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor:Colors.background}}>
        <Header title="案例合同" rightBtn={rightBtn}/>
        <Filter
          backgroundColor = '#fff' 
          filters={filters} 
          checked = {this.state.filterNow} 
          onFilter={options => this._onFilter(options)}
        />
          {
            this.state.isLoading && (
              <View style={{flex:1, padding:50}}>
                <ActivityIndicator />
              </View>
            )
          }
        {
          !this.state.isLoading && (
            <FlatList
          ref="contractList"
          style={{paddingHorizontal: px(15), paddingVertical: px(30)}}
          numColumns={numColumns}
          horizontal={false}
          data={contracts}
          ListEmptyComponent={this._renderEmpty}
          renderItem={({item}) =>
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('contractDetail', {
                itemId: item.id,
                name: item.name,
              })} 
            >
              <VerticalCard 
                id={item.id}
                name={item.name}
                hasImg={false} 
                extra={
                  this.state.showExtra ?
                  <View>
                    {
                      false &&
                      <Profile imgSize={px(60)} style={{marginTop: px(10)}} name={item.user_name} describe={item.user_tel} />
                    }
                    <Text style={{marginTop: px(30), justifyContent: 'center',color: Colors.darkText, fontSize: 12}}>{`签约时间: ${item.signDateFormat}`}</Text>
                    <Text style={{marginTop: px(30), justifyContent: 'center',color: Colors.darkText, fontSize: 12}}>{`金额: ${item.price}万`}</Text>
                  </View>
                  :
                  <View style={{height: 0}} />
                }
                cardStyles = {{
                  width: px((750 - (numColumns + 1)*30) / numColumns),
                  padding: px(30),
                  marginLeft: px(15),
                  marginRight: px(15),
                  marginBottom: px(30),
                  borderRadius: px(16)
                }}
              />
            </TouchableOpacity>
          }
          keyExtractor={this._keyExtractor}
        />
          )
        }
        
        
      </SafeAreaView> 
    )
  }

  
}

