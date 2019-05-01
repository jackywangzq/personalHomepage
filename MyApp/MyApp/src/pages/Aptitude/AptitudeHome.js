import React from 'react';
import {px} from '../../utils/px';
import {Request} from '../../utils/request';
import {dateFormat} from '../../utils/calendar';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import VerticalCard from '../../components/fromKirin/VerticalCard';
import Filter from '../../components/fromKirin/Filter';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';



import Colors from '../../constants/Colors.js'

export default class AptitudeHome extends React.Component {
  /* static navigationOptions = ({navigation, screenProps}) => {
    return {
      title: '资质库',
      headerLeft: (
        <View style={{ width: 44, height: 44, alignItems:"center",justifyContent: "center"}}>
          <Ionicons
            name="ios-arrow-back"
            size={24}
            onPress={() => navigation.goBack()}
          />
        </View>
      ),
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 44, height: 44, alignItems:"center",justifyContent: "center"}}>
            <Badge text={navigation.getParam('cartCount', 0)}>
              <MaterialCommunityIcons 
                name="folder-multiple-outline"   
                size={24}  
              />
            </Badge>
          </View>
          <View style={{marginLeft: px(16), width: 44, height: 44, alignItems:"center",justifyContent: "center"}}>
            <Ionicons
              name="md-search"
              size={24}
              onPress={() => console.log(this)}
            />
          </View>
        </View>
        
      ),
      headerStyle: {
        borderBottomWidth: 0,
      }
    } 
  } */

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showExtra: true,
      aptitudes: [],
      filterItems: {
        condition: '',
        company: 'all'
      },
      pageNum: 1,
      filterNow: new Map(),
    }
    this._renderEmpty = this._renderEmpty.bind(this);
  }

  componentWillMount() {
    this.loadAptitudes();
  }

  async loadAptitudes() {
    const querys = this._getQuery();
    try {
      const result = await Request.get(`userContl/findKapplyInfo?${querys}`)
      if (result) {
        this.setState({
          aptitudes: result,
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

  _getQuery() {
    const filterItems = this.state.filterItems;
    let querys = `inputType=INTE&pageSize=1000&pageNum=${this.state.pageNum}`;
    for (let key in filterItems) {
      querys += `&${key}=${filterItems[key]}`
    }
    return querys
  }

  _keyExtractor = (item) => item.id;


  _onFilter = (options) => {
    this.setState({
      isLoading: true
    })
    if(this.state.aptitudes.length > 0) {
      this.refs.aptitudeList.scrollToIndex({
        index: 0,
        viewPosition: 0
      })
    }
    console.log(options)
    let filterItemsNow = JSON.parse(JSON.stringify(this.state.filterItems));
    for (let key of options.keys()) {
      const res = [...options.get(key)].filter(item => item[1]).map(item => item[0])
      filterItemsNow[key] = res.length > 0 ? [...options.get(key)].filter(item => item[1]).map(item => item[0]).join(',') : 'all';
    }
    this.setState({
      filterItems: filterItemsNow,
      filterNow: options
    }, () => {
      this.loadAptitudes();
    })
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

  _renderEmpty() {
    
    return (
      <View style={{flex: 1, marginTop: px(100),alignItems:'center',justifyContent:'center'}}>
        <Image style={{width: px(194), height: px(256)}} source={require('../../images/empty.png')} />
      </View> )
    
  }

  render() {

    const companies = [
      '系统集成公司',
      '云公司',
      '中网威信公司'
    ]
    const filters = [
      {
        name: '归属单位',
        value: 'company',
        isSingle: true,
        options: companies.map(item => {
          return {
            name: item,
            value: item
          }
        })
      }
    ]

    const rightBtn = 
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity 
          onPress={() => this.props.navigation.navigate('searchAll', {searchType: 'inte'})}
          style={{width: 44, height: 44, alignItems:"flex-end", justifyContent: "center"}}>
          <Image source={require('../../images/search_new.png')} style={{width: px(42), height: px(42)}}/>
        </TouchableOpacity>
      </View>
    
    const numColumns = 2;
    

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor:Colors.background}}>
        <Header title="资质证件" style={{zIndex: 2000}} rightBtn={rightBtn}/>
        <Filter
          backgroundColor="#fff"
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
          !this.state.isLoading &&
          <FlatList
            ref="aptitudeList"
            style={[ {paddingHorizontal: px(15), paddingVertical: px(30)}]}
            numColumns={numColumns}
            horizontal={false}
            data={this.state.aptitudes}
            ListEmptyComponent={this._renderEmpty}
            renderItem={({item}) => {
              const endDate = (item.endDate && item.endDate != '') ? dateFormat(item.endDate,'L') : '未知';
              return (
                <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('aptitudeDetail', {
                  itemId: item.id,
                  name: item.name,
                })} 
              >
                <VerticalCard 
                  id={item.id}
                  name={item.topic}
                  picUrl = {this._getIconUrl(item.secondClazz)} 
                  extra={
                    this.state.showExtra ?
                    <View>
                      <Text style={{marginTop: px(30), justifyContent: 'center',color: Colors.darkText, fontSize: 12}}>{`有效期: ${endDate}`}</Text>
                    </View>
                    :
                    <View style={{height: 0}} />
                  }
                  cardStyles = {{
                    width: px((750 - (numColumns + 1)*30) / numColumns),
                    padding: px(40),
                    marginLeft: px(15),
                    marginRight: px(15),
                    marginBottom: px(30),
                    borderRadius: px(16)
                  }}
                />
              </TouchableOpacity>
              )
            }
              
            }
            keyExtractor={this._keyExtractor}
          />
        }
       
        
      </SafeAreaView> 
    )
  }

  
}

