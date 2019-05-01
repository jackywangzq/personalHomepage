import React from 'react';
import {px} from '../../utils/px';
import Colors from '../../constants/Colors';
import {Request} from '../../utils/request';
import {Alert,ActivityIndicator, StyleSheet, FlatList,Platform,Image,Text,View,TouchableOpacity} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import HomeHeader from '../../components/fromKirin/HomeHeader';
import SearchBar from '../../components/fromKirin/SearchBar';
import SearchItem from '../../components/fromKirin/SearchItem';

function FixTabs(props) {
  const _onPress = (item) => {
    props.onTabChanged(item)
  }
  return (
    <View style={[!!props.height && {height: props.height}, {flexDirection: 'row', backgroundColor: '#fff'}, props.style]}>
      {props.data.map(item => {
        const isNow =  item.name === props.tabNow
        const colorNow = isNow ? Colors.mainColor : '#000';
        return (
          <TouchableOpacity onPress={() => _onPress(item.name)} key={item.name} style={{justifyContent:'center', alignItems: 'center', flex:1}}>
            <Text style={isNow && {fontWeight: 'bold'}}>{item.label}</Text>
            <View style={[isNow && {width:'100%'},{left: 0}, tabStyles.tabs_line]}></View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}


export default class SearchAll extends React.Component {
  constructor(props) {
    super(props);
    /**
     * 简称：
     * prod： 产品
     * plan： 方案
     * case： 合同
     * inte： 资质
     */
    this.state = {
      /**
       * 待渲染的各种搜索结果列表
       * 
       */
      prodList: [],
      planList: [],
      caseList: [],
      inteList: [],
      /**
       * 当前的搜索类型，初始状态设为”产品“
       */
      clazzNow: 'prod',
      /**
       * 搜索关键字
       */
      keywordNow: '',
      /**
       * 各类搜索结果的当前页，初始状态下设为0，即还没有搜索结果
       */
      pageNumprod: 0,
      pageNumplan: 0,
      pageNumcase: 0,
      pageNuminte: 0,
      /**
       * 各类搜索结果的数量
       */
      totalNum: {
        prod: 0,
        plan: 0,
        case: 0,
        inte: 0,
      },
      
      /**
       * 判断参数
       * isFocus 判断是否已重新开启输入，在搜索成功后，显示搜索类型的tab及搜索结果，将isFocus设为false
       * isLoading 是否在加载
       * isFootLoading 是否在下拉加载中
       * isAll 是否全局搜索
       */
      isFocus: true,
      isLoading: true,
      isFootLoading: false,
      isAll: true,
      placeholder: ''
    };
    this._changeClazz = this._changeClazz.bind(this);
    this._searchConfirm = this._searchConfirm.bind(this);
    this._onSearchFocus = this._onSearchFocus.bind(this); 
    this._cancelSearching = this._cancelSearching.bind(this);
    this._onEndReach = this._onEndReach.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
  }

  componentDidMount() {
    const clazzNow = this.props.navigation.getParam('searchType', 'all');
    let placeholder = ''
    switch(clazzNow) {
      case 'plan':
      placeholder = '我要找方案'
        break;
      case 'case':
      placeholder = '我要找合同'
        break;
      case 'inte':
      placeholder = '我要找资质'
        break;
      default:
      placeholder = '找产品、找方案、找合同、找资质'
    }
    if (clazzNow !== 'all') {
      this.setState({
        clazzNow,
        isAll: false,
        placeholder
      })
    }
  }

  async _fetchSearchCount() {
    const keyword = this.state.keywordNow;
    try {
      const result = await Request.post('elasticsearch/esAggregationsSearch', {
        keyword
      });
      const {respDesc,respCode, clazzCount} = result;
      if (respCode === '001') {
        let clazzCountObj = JSON.parse(JSON.stringify(this.state.totalNum));
        for (let key in clazzCountObj) {
          const countObj = clazzCount.find(item => item.key === key);
          const count = countObj && countObj.doc_count ? countObj.doc_count : 0;
          clazzCountObj[key] = count;
        }
        this.setState({
          totalNum: clazzCountObj
        })
      }
    } catch (err) {

    }
  }

  async _fetchSearchResult(pageNum, isNext) {
    const keyword = this.state.keywordNow;
    const clazz = this.state.clazzNow;
    try {
      const result = await Request.post('elasticsearch/esSearch', {
        clazz,
        pageNum,
        keyword
      })
      const {total, respDesc,respCode, DATA} = result;
      if (respCode === '001') {
        let clazzCountObj = JSON.parse(JSON.stringify(this.state.totalNum));
        clazzCountObj[clazz] = total;
        /**
         * 通过isNext参数判断是否是分页的情况，从而判断是重新赋值数组还是在当前数组后添加
         */
        if (isNext) {
          this.setState(prevState => ({
            [`${clazz}List`]: [...prevState[`${clazz}List`], ...DATA],
            isFocus: false,
          }))
        } else {
          this.setState({
            [`${clazz}List`]: DATA,
            isFocus: false,
            totalNum: clazzCountObj
          })
        }
        if (total > DATA.length) {
          this.setState({
            [`pageNum${clazz}`]: pageNum
          })
        }
        setTimeout(() => {
          this.setState({
            isLoading: false,
            isFootLoading: false
          })
        }, 500)
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
      console.log(error)
    }
  }

  /**
   * 点击取消，回到上一页
   */
  _cancelSearching() {
    this.props.navigation.goBack(null);
  }

  /**
   * 搜索
   */
  _searchConfirm() {
    /**
     * 每次搜索，从第一页开始，isNext参数为false，即不用传入该参数
     */
    this._fetchSearchCount();
    this._fetchSearchResult(1);
  }

  _renderEmpty() {
    
    return (
      <View style={{flex: 1, marginTop: px(100),alignItems:'center',justifyContent:'center'}}>
        <Image style={{width: px(194), height: px(256)}} source={require('../../images/empty.png')} />
      </View> )
    
  }

  _onSearchFocus() {
    this.setState({
      isFocus: true
    })
  }

  _changeClazz(clazz) {
    const clazzNow = this.state.clazzNow;
    const listNow = this.state[`${this.state.clazzNow}List`];
    const lengthNow = listNow && listNow.length ? listNow.length : 0;
    if(lengthNow > 0) {
      this.refs.resultlist.scrollToOffset({
        animated: false,
        offset: 0
      }); 
    }
    if (clazzNow !== clazz) {
      this.setState({
        clazzNow: clazz,
        isLoading: true
      }, () => {
        
        this._fetchSearchResult(1)
      })
    }
  }

  _filterHighLight(text) {
    return text.replace(/<span class = "highlighter" >/g,'').replace(/<\/span>/g, '');
  }

  _getHeaderText(industry, busi) {
    const industryText = !!industry ? industry : '';
    const busiText = !!busi ? busi : '';
    const separator = (!!busi && !!industry) ? ' / ' : '';
    return (`${industryText}${separator}${busiText}`); 
  }

  _keyExtractor(item, index) {
    return item.id + index
  }

  _onEndReach() {
    const totalNow = this.state.totalNum[this.state.clazzNow];
    const listNow = this.state[`${this.state.clazzNow}List`];
    const lengthNow = listNow && listNow.length ? listNow.length : 0;
    if (totalNow > lengthNow && !this.state.isFootLoading) {
      console.log('end')
      const pageNumNow = this.state[`pageNum${this.state.clazzNow}`]
      console.log(pageNumNow)
      this.setState({
        isFootLoading : true
      }, () => {
        this._fetchSearchResult(pageNumNow + 1, true)
      })
    }
  }

  _renderFooter() {
    const totalNow = this.state.totalNum[this.state.clazzNow];
    const listNow = this.state[`${this.state.clazzNow}List`];
    const lengthNow = listNow && listNow.length ? listNow.length : 0;
    if (lengthNow <= 10) {
      return (
        <View style={{height: px(30)}} />
      )
    } else if (lengthNow < totalNow){
      return (
        <View style={{flex: 1, padding:px(30)}}>
          <ActivityIndicator />
        </View>
      )
    }else {
      return (
        <View style={{ flex: 1, height: px(88), alignItems: 'center', justifyContent:'center'}} >
          <Text style={{color : '#888888'}}>—— 已经到底啦 ——</Text>
        </View>
      )
    }
  }

  goDetail(id, clazz) {
    console.log(id, clazz)
    let url = '';
    switch(clazz) {
      case 'prod':
        url = 'productDetail';
        break;
        case 'plan':
        url = 'projectDetail';
        break;
        case 'case':
        url = 'contractDetail';
        break;
        case 'inte':
        url = 'aptitudeDetail';
        break;
      default: 
        url = ''
    }
    this.props.navigation.navigate(url , {
      itemId: id
    })
  }

  render() {
    const tabsData = [
      {
        name: 'prod',
        label: `产品(${this.state.totalNum.prod})`,
      },
      {
        name: 'plan',
        label: `方案(${this.state.totalNum.plan})`,
      },
      {
        name: 'case',
        label: `合同(${this.state.totalNum.case})`,
      },
      {
        name: 'inte',
        label: `资质(${this.state.totalNum.inte})`,
      }
    ];

    const listNow = this.state[`${this.state.clazzNow}List`];

    const isLoading = this.state.isLoading;

    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
        <HomeHeader
          style={{padding: px(30)}}
          left = {
            <SearchBar 
              placeholder={this.state.placeholder} 
              editable={true}
              value = {this.state.keywordNow}
              onChangeText = {(keywordNow) => this.setState({keywordNow})}
              onSubmit = {this._searchConfirm}
              onFocus = {this._onSearchFocus}
            />
          }
          right = {
            <TouchableOpacity ref='add' onPress={this._cancelSearching} style={{minHeight: px(80),justifyContent:'center'}}>
              <Text style={{color: Colors.mainColor}}>取消</Text>
            </TouchableOpacity>
          }
        />
        <View style={[this.state.isFocus && {display: 'none'}, {flex: 1}]}>
          {
            this.state.isAll &&
            <FixTabs 
              data={tabsData} 
              height={px(90)}
              tabNow={this.state.clazzNow}
              onTabChanged = {this._changeClazz} 
            />
          }
          
          {
            isLoading && (
              <View style={{flex:1, padding:px(100)}}>
                <ActivityIndicator />
              </View>
            )
          }
          <FlatList
            style = {[isLoading && {display:'none'}, {paddingHorizontal: px(30)}]}
            horizontal={false}
            ItemSeparatorComponent = {() => 
              ( 
                <View style={styles.separator} /> 
              )
            }
            data={listNow}
            ref="resultlist"
            onEndReached = {this._onEndReach}
            onEndReachedThreshold = {1}
            ListHeaderComponent={() =>
              (
                <View style={{height: px(30)}} />
              )
            }
            ListFooterComponent={this._renderFooter}
            ListEmptyComponent={this._renderEmpty}
            renderItem ={({item, index}) => {
              return (
                <SearchItem 
                  onPressed = {(id, clazz) => this.goDetail(id, clazz)}
                  style={{borderRadius: px(10)}}
                  name = {item.contact_name}
                  id = {item.id}
                  clazz = {item.clazz}
                  headerText = {this._getHeaderText(item.industry_name, item.busi_name)}
                  topic = {item.topic ? this._filterHighLight(item.topic) : ''}
                  describ = {item.descr ? this._filterHighLight(item.descr) : ''}
                />
              )
            }}
            keyExtractor={this._keyExtractor}
          />
        </View>
        
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
  separator: {
    height: px(30)
  }
})

const tabStyles = StyleSheet.create({
  tabs_line: {
    position: 'absolute',
    bottom: (0),
    height: px(6),
    backgroundColor: Colors.mainColor
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