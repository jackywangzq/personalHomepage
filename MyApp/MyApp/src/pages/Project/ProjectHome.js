import React from 'react';
import {px} from '../../utils/px';
import {Request} from '../../utils/request';
import {
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  Alert
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import Filter from '../../components/fromKirin/Filter';
import Header from '../../components/fromKirin/Header';
import DTItem from '../../components/fromHan/DTItem';
import Colors from '../../constants/Colors';
import VerticalCard from '../../components/fromKirin/VerticalCard';


export default class ProjectHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showExtra: true,
      projectList: [],
      filterItems: {
        industry: '',
        provCode: '',
        condition: ''
      },
      pageNum: 1,
      filterNow: new Map()
    }
    this._renderEmpty = this._renderEmpty.bind(this);
    this.filters = [
      {
        name: '行业',
        value: 'industry',
        options: '党建 军民融合 政务 农业 教育 医疗健康 生态环境 金融 旅游 交通 工业互联网 传媒 零售 通用 物联网基础 云计算基础 5G 其它'.split(' ').map((item, index) => {
          return {
            name: item,
            value: ['100001', '100003', '100002', '100004', '100005', '100006', '100007', '100011', '100008', '100009', '100010', '100012', '100013', '100017', '100015', '100016', '100018', '100014'][index]
          }
        })
      },
      {
        name: '省分',
        value: 'provCode',
        options: '总部 北京 天津 河北 山西 内蒙古 辽宁 吉林 黑龙江 山东 河南 上海 江苏 浙江 安徽 福建 江西 湖北 湖南 广东 广西 海南 重庆 四川 贵州 云南 西藏 陕西 甘肃 青海 宁夏 新疆'.split(' ').map(item => {
          return {
            name: item,
            value: item
          }
        })
      }
    ]
    this.imageArr = [
      require('../../images/project/1.jpg'),
      require('../../images/project/2.jpg'),
      require('../../images/project/3.jpg'),
      require('../../images/project/4.jpg'),
      require('../../images/project/5.jpg'),
      require('../../images/project/6.jpg'),
      require('../../images/project/7.jpg'),
      require('../../images/project/8.jpg'),
      require('../../images/project/9.jpg'),
      require('../../images/project/10.jpg'),
      require('../../images/project/11.jpg'),
      require('../../images/project/12.jpg'),
      require('../../images/project/13.jpg'),
      require('../../images/project/14.jpg'),
    ];
  }

  componentDidMount() {
    this.loadProjects();
  }

  async loadProjects() {
    const querys = this._getQuery();
    try {
      const result = await Request.get(`schemeContl/getSchemeInfo?${querys}`)
      const {respCode, respDesc, data} = result;
      if (respCode === '001') {
        const resulFormat = data.map(item => {
          return {
            id: item[0] + '',
            topic: item[1],
            desc: item[2]
          }
        })
        this.setState({
          projectList: resulFormat,
          isLoading: false
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
      
    } catch (error) {
      console.log(error.message);
      Alert.alert(
        '请求失败，请重试',
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
    let querys = `inputType=PLAN&pageSize=1000&busiType=&pageNum=${this.state.pageNum}`;
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
    if(this.state.projectList.length > 0) {
      this.refs.projectList.scrollToIndex({
        index: 0,
        viewPosition: 0
      })
    }
    console.log(options)
    let filterItemsNow = JSON.parse(JSON.stringify(this.state.filterItems));
    for (let key of options.keys()) {
      const res = [...options.get(key)].filter(item => item[1]).map(item => item[0])
      filterItemsNow[key] = res;
    }
    console.log(filterItemsNow)
    this.setState({
      filterItems: filterItemsNow,
      filterNow: options
    }, () => {
      this.loadProjects();
    })
  }

  _renderEmpty() {
    
    return (
      <View style={{flex: 1, marginTop: px(100),alignItems:'center',justifyContent:'center'}}>
        <Image style={{width: px(194), height: px(256)}} source={require('../../images/empty.png')} />
      </View> )
    
  }

  render() {
    const rightBtn = 
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('searchAll', {searchType: 'plan'})} style={{width: 44, height: 44, alignItems:"flex-end", justifyContent: "center"}}>
          <Image source={require('../../images/search_new.png')} style={{width: px(42), height: px(42)}}/>
        </TouchableOpacity>
      </View>
    const numColumns = 2;
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1, backgroundColor:Colors.background}}>
        <Header title="解决方案" rightBtn={rightBtn}/>
        
        {
          false &&
          <View style={{paddingTop: 10, marginTop: -10, zIndex: 1000}}>
            <Filter
              backgroundColor = '#fff' 
              filters={this.filters} 
              onFilter={options => this._onFilter(options)}
              checked = {this.state.filterNow} 
              style = {[styles.shadow, {marginTop:0}]}
            />
            <View style={{position:'absolute',backgroundColor:'#fff',width:'100%', height: 10, top:0,zIndex: 2000}} />
          </View>
        }
        <Filter
          backgroundColor = '#fff' 
          filters={this.filters} 
          onFilter={options => this._onFilter(options)}
          checked = {this.state.filterNow} 
          style = {[{marginTop:0}]}
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
              ref="projectList"
              style={{paddingHorizontal: px(15), paddingVertical: px(30)}}
              horizontal={false}
              data={this.state.projectList}
              ListEmptyComponent={this._renderEmpty}
              numColumns={numColumns}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('projectDetail', {
                      itemId: item.id,
                      name: item.name,
                    })} 
                  >
                    <VerticalCard 
                      id={item.id}
                      name={item.topic}
                      hasImg={false} 
                      summary={item.desc}
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
                )}
              }
              keyExtractor={this._keyExtractor}
            />
          )
        }
        
      </SafeAreaView>
    )
  }

}

const styles = StyleSheet.create({
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
        elevation: 8,
      },
    })
  }
})