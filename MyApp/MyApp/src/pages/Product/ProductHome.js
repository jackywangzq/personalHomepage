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
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import VerticalCard from '../../components/fromKirin/VerticalCard';
import Filter from '../../components/fromKirin/Filter';
import Header from '../../components/fromKirin/Header';
import Profile from '../../components/fromKirin/Profile';

import Colors from '../../constants/Colors.js'

export default class ProductHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      industryNow: '100001',
      productListNow: [],
      productList: new Map()
    }
    this.pageNum = 1;
    this.pageSize = 100;
    this.industrys = [
      {
        name: '党建',
        value: '100001'
      },
      {
        name: '政务',
        value: '100002'
      },
      {
        name: '军民融合',
        value: '100003'
      },
      {
        name: '农业',
        value: '100004'
      },
      {
        name: '教育',
        value: '100005'
      },
      {
        name: '医疗健康',
        value: '100006'
      },
      {
        name: '生态环境',
        value: '100007'
      },
      {
        name: '旅游',
        value: '100008'
      },
      {
        name: '交通',
        value: '100009'
      },
      {
        name: '工业互联网',
        value: '100010'
      },
      {
        name: '金融',
        value: '100011'
      },
      {
        name: '传媒',
        value: '100012'
      },
      {
        name: '零售',
        value: '100013'
      },
      {
        name: '通用',
        value: '100017'
      },
      {
        name: '物联网基础',
        value: '100015'
      },
      {
        name: '云计算基础',
        value: '100016'
      },
      {
        name: '云光慧企',
        value: '100019'
      },
      {
        name: '其他',
        value: '100014'
      }
    ]
  }

  componentDidMount() {
    this.loadProducts(this.industrys[0].value);
  }

  async loadProducts(industry) {
    const list = new Map(this.state.productList);
    const industryListNow = list.get(industry);
    if (industryListNow && industryListNow.length > 0) {
      this.setState({
        productListNow: industryListNow
      })
    } else {
      try {
        const result = await Request.post(`product/findProdInfo`, {
          inputType: 'PROD',
          industry,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        if (result) {
          const types = Object.keys(result);
          const productListByType = types.map(item => {
            const names = Object.keys(result[item]);
            const list = names.map(name => {
              return {
                id: result[item][name][1],
                name,
                desc: result[item][name][0]
              }
            })
            return {
              title: item,
              data: [list]
            }
          })
          list.set(industry, productListByType);
          this.setState({
            productListNow: productListByType,
            productList: new Map(list)
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
        console.log(error);
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
    
  }

  _changeIndustry(industry) {
    if (this.state.productListNow.length > 0) {
      this.refs.sections.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: false,
        viewPosition: 0
      })
    }
    this.setState({
      industryNow: industry
    })
    this.loadProducts(industry);
  }

  render() {
    const numColumns = 2;
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor:Colors.background}}>
        <Header title="重点产品" />
        <View style={{flex:1,flexDirection: 'row', justifyContent:'space-between'}}>
          <ScrollView style={{width: px(200), borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Colors.unchoosed}}>
            {
              this.industrys.map((item, index) => {
                const isNow = this.state.industryNow === item.value
                return (
                  <TouchableOpacity onPress={() => this._changeIndustry(item.value)} key={item.value} style={{marginVertical: px(20),width:'100%',height:px(50),alignItems: 'center',justifyContent : 'center'}}>
                    <Text style={{color: isNow ? Colors.mainColorV2 : '#000'}}>{item.name}</Text>
                    {
                      isNow &&
                      <View style={{position:'absolute', left:0, top:0, width: px(10), height:'100%', backgroundColor: Colors.mainColorV2}} />
                    }
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
          <View style={{width: px(550)}}>
            <SectionList
              ref='sections'
              stickySectionHeadersEnabled = {true}
              renderItem={(section) => 
                <FlatList
                  style={{paddingHorizontal: px(25)}}
                  numColumns={numColumns}
                  horizontal={false}
                  data={section.item}
                  renderItem = {({item}) => 
                    <TouchableOpacity 
                      onPress={() => this.props.navigation.navigate('productDetail', {
                        itemId: item.id,
                        name: item.name,
                      })} 
                    >
                      <VerticalCard 
                        id={item.id}
                        name={item.name}
                        hasImg={false} 
                        summary={item.desc}
                        cardStyles = {{
                          width: px((550 - (numColumns + 1)*30 - 20) / numColumns),
                          padding: px(30),
                          marginHorizontal: px(15),
                          marginBottom: px(30),
                          borderRadius: px(16)
                        }}
                      />
                    </TouchableOpacity>
                  }
                  keyExtractor={(item) => item.id}
                />
              }
              renderSectionHeader={({ section: { title } }) => (
                <View style={{paddingTop: px(30), paddingBottom: px(20),backgroundColor: Colors.background, marginHorizontal: px(40)}}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>{title}</Text>
                </View>
              )}
              sections={this.state.productListNow}
              keyExtractor={(item, index) => index + item.length}
            />
          </View>
          
        </View>
      </SafeAreaView>
    )
  }
}