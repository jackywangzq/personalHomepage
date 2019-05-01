import React from 'react';
import {px} from '../../utils/px';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import Colors from '../../constants/Colors';
const FilterItem = props => {
  return (
    <TouchableOpacity style={[{width: px(750) / props.columnNum}, filterPanelStyles.filterItem]} onPress={() => props.onItemPress(props.itemValue)}>
      <View style={[filterPanelStyles.checkBtn, {opacity: props.checked ? 1 : 0}]}>
      </View>
      <View style={filterPanelStyles.itemText}>
        <Text style={{fontSize: 14, color: props.checked ? Colors.mainColorV2 : '#000'}}>{props.itemName}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default class FilterPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checking: new Map(this.props.checked)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checking: new Map(nextProps.checked)
    })
  }

  _selectItem(name) {
    // this.props.onSelected(name);
    console.log('fuvk')
    let checking = new Map(this.state.checking);
    if (this.props.single) {
      if(checking.get(name)) {
        checking = new Map()
      } else {
        checking = new Map();
        checking.set(name, true)
      }
    } else {
      checking.set(name, !checking.get(name));
    }
    this.setState({
      checking
    });
  }

  _clearChecked = () => {
    this.setState({
      checking: new Map()
    });
  }

  _confirmChecked = () => {
    this.props.itemChecked(this.state.checking);
  }
  
  render() {
    const columnNum = this.props.list.length > 2 ? 3 : 2;
    return (
      <View style={[filterPanelStyles.container, {backgroundColor: this.props.backgroundColor},this.props.style]}>
        <ScrollView contentContainerStyle={filterPanelStyles.scroll}>
          {
            this.props.list.map((item, index) => {
              return (
                <FilterItem
                  columnNum = {columnNum}
                  key={item.value + index} 
                  itemName={item.name}
                  itemValue={item.value} 
                  onItemPress={(value) => this._selectItem(value)}
                  checked={this.state.checking.get(item.value)} 
                />
              )
            })
          }
        </ScrollView>
        <View style={filterPanelStyles.btns}>
          <TouchableOpacity onPress={this._clearChecked} style={[filterPanelStyles.btn, filterPanelStyles.clearBtn]}>
            <Text>重置</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._confirmChecked} style={[filterPanelStyles.btn, filterPanelStyles.confirmBtn]}>
            <Text style={filterPanelStyles.confirmText}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const filterPanelStyles =  StyleSheet.create({
  container: {
    maxHeight: px(800),
    backgroundColor: '#fff'
  },
  scroll: {
    flexDirection: 'row',
    flexWrap:'wrap',
    alignItems: 'center',
    paddingVertical: px(25)
  },
  filterItem: {
    paddingVertical: px(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    
  },
  checkBtn: {
    width: px(6),
    height: px(12),
    backgroundColor: Colors.mainColorV2,
    marginRight: px(12),
    borderRadius: px(3)
  },
  btns: {
    flexDirection: 'row',
    alignItems: 'center',
    height: px(90)
  },
  btn: {
    width: px(750 / 2),
    height: '100%',
    alignItems:'center',
    justifyContent: 'center'
  },
  clearBtn: {
    backgroundColor: '#ffffff',
  },
  confirmBtn: {
    backgroundColor: Colors.mainColorV2
  },
  confirmText: {
    color: '#fff'
  }
})