import React from 'react';
import {px, device} from '../../utils/px';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';

// import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../../constants/Colors';
import FilterPanel from './FilterPanel';

export default class Filter extends React.Component {
  static defaultProps = {
    zIndex: 1000,
    barHeight: px(110)
  }

  constructor(props) {
    super(props);
    this.state = {
      filterOpened: false,
      openedInex: null,
      checked: new Map()
    }
  }

  _openFilter(index) {
    this.setState(prevState => {
      return {
        openedInex: index,
        filterOpened: (prevState.openedInex === index && prevState.filterOpened) ? false : true
      }
    })
  }

  _closeFilter = () => {
    console.log('close')
    this.setState({
      filterOpened: false
    })
  }

  _onLayout = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, height, pageX, pageY) => {
      console.log(pageY)
    })
  }

  _checking = (checkedItems, index) => {
    const checked = new Map(this.props.checked);
    checked.set(this.props.filters[index].value, new Map(checkedItems));
    console.log(checked)
    this.setState({
      // checked: checked,
      filterOpened: false
    })
    /* let checkedData=[];
    for (let key of checked.keys()) {
      const name = key;
      const data = [...checked.get(key)].filter(item => item[1]).map(item => item[0]);
      checkedData.push({
        name,
        data
      })
    } */
    
    this.props.onFilter(checked);
  }
  
  render() {
    const filtersCount = this.props.filters.length;
    const filterBtnWidth = filtersCount > 1 ? (690 - 30*(filtersCount - 1)) / filtersCount : 220;

    return (
      <View style={[Platform.OS === 'ios' && {zIndex: this.props.zIndex},this.props.style]}>
        
        {this.state.filterOpened && <TouchableOpacity onPress={() => {console.log('fuck');this._closeFilter()} } style={[filterStyles.modal, {top: this.props.barHeight}]}></TouchableOpacity>}
        {
          (this.props.filters[this.state.openedInex] && this.state.filterOpened) && 
          <FilterPanel
            style={[filterStyles.filterPanel, {top: this.props.barHeight}]}
            backgroundColor = {Colors.backgroundV2} 
            list={this.props.filters[this.state.openedInex].options}
            single={this.props.filters[this.state.openedInex].isSingle} 
            checked = {this.props.checked.get(this.props.filters[this.state.openedInex].value)}
            itemChecked={(checkedItems) => this._checking(checkedItems, this.state.openedInex)}
          />
        }
        
        <View onLayout={(e) => this._onLayout(e)} 
          style={[filterStyles.filterBar, {backgroundColor: this.props.backgroundColor}]}
        >
          {
            this.props.filters.map((filter, index) => {
              const checked = this.props.checked.get(filter.value);
              const hasChecked = checked ? [...checked].filter(item => item[1]).map(item => item[0]) : [];
              const hasCheckedName = hasChecked.map(item => {
                const option = filter.options.find(option => option.value === item);
                return option ? option.name : ''
              })
              const colorNow = hasChecked.length > 0 ? Colors.mainColorV2 : '#000';
              const isOpenNow = this.state.filterOpened && this.state.openedInex === index;
              
              return (
                <View key={filter.name} style={{width: px(filterBtnWidth - 2)}}>
                  <View 
                    style={[filterStyles.borderView, {height: px(55), opacity: isOpenNow ? 1 :0}]} 
                  />
                  <TouchableOpacity
                    onPress={() => this._openFilter(index)} 
                    activeOpacity={1}
                    style={[filterStyles.filterBtn, {backgroundColor: (hasChecked.length > 0 && !isOpenNow) ? Colors.mainLightV2 : Colors.backgroundV2}]}
                  >
                    <Text numberOfLines={1} style={{color: colorNow, fontSize: 13}}>{hasChecked.length > 0 ? hasCheckedName.join(',') : filter.name}</Text>
                    {
                      hasChecked.length === 0 &&
                      <Icon
                        style={{marginLeft: px(20)}}
                        name={ isOpenNow ? "md-arrow-dropup": "md-arrow-dropdown"}
                        color = "#989898"
                        size={px(30)}
                      />
                    }
                  </TouchableOpacity>
                  
                </View>
              )
            })
          }
        </View>
            
      </View>
    )
  }
}

const filterStyles =  StyleSheet.create({
  filterBar: {
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: px(30),
    paddingVertical: px(30),
  },
  filterBtn: {
    borderRadius: px(25),
    backgroundColor: Colors.backgroundV2,
    paddingHorizontal: px(20),
    height: px(50), 
    alignItems: 'center', 
    justifyContent:'center', 
    flexDirection: 'row'
  },
  borderView: {
    position: 'absolute',
    top:px(25),
    width: '100%',
    backgroundColor: Colors.backgroundV2,
  },
  filterPanel: {
    position:'absolute',
    opacity: 1,
    zIndex: 2000
  },
  btns: {
    flexDirection: 'row',
    alignItems: 'center',
    height: px(88)
  },
  btn: {
    width: px(750 / 2),
    height: '100%',
    alignItems:'center',
    justifyContent: 'center'
  },
  clearBtn: {
    backgroundColor: '#F2F3F3',
  },
  confirmBtn: {
    backgroundColor: Colors.mainColor
  },
  confirmText: {
    color: '#fff'
  },
  modal: {
    position:"absolute",
    width: px(750),
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: device.height,
    zIndex: 1000
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
})