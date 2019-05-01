import React from 'react';
import {px} from '../../utils/px';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../constants/Colors';
import {dateFormat, dateDiff} from '../../utils/calendar';

import DateChooseModal from './DateChooseModal';

export default class DateChoose extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    }

    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._selectDateRange = this._selectDateRange.bind(this);
  }

  _closeModal() {
    this.setState({
      modalVisible: false
    })
  }

  _openModal() {
    this.setState({
      modalVisible: true
    })
  }

  _selectDateRange(s,e) {
    this.props.onRangeSelected(s,e);
    this._closeModal();
  }

  render() {

    const usedDays = dateDiff(this.props.endDate, this.props.startDate, 'days') + '天';
    console.log(usedDays);

    return (
      <View>
        <TouchableOpacity onPress={this._openModal} style={[this.props.style, dateChooseStyles.container]}>
          <View style={dateChooseStyles.dateContainer}>
            <Text style={dateChooseStyles.dateStyle}>{dateFormat(this.props.startDate, 'llll')}</Text>
            <Text style={dateChooseStyles.describeStyle}>今天</Text>
          </View>
          <View style={dateChooseStyles.rangeContainer}>
            <View style={dateChooseStyles.line} />
            <Text style={dateChooseStyles.range}>{usedDays}</Text>
            <View style={dateChooseStyles.line} />
          </View>
          <View style={dateChooseStyles.dateContainer}>
            <Text style={dateChooseStyles.dateStyle}>{dateFormat(this.props.endDate, 'llll')}</Text>
            <Text style={dateChooseStyles.describeStyle}>明天</Text>
          </View>
        </TouchableOpacity>
        <DateChooseModal 
          modalVisible={this.state.modalVisible} 
          startDate = {this.props.startDate}
          endDate = {this.props.endDate}
          onModalClosed = {this._closeModal}
          onSelected =  {this._selectDateRange}
        />
      </View>
      
    )
  }
}

const dateChooseStyles = StyleSheet.create({
  container: {
    backgroundColor:'#fff',
    borderRadius: px(10), 
    height: px(90), 
    paddingHorizontal: px(30),
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  dateContainer: {
    flexDirection: 'row', 
    alignItems: 'flex-end'
  },
  dateStyle: {
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.mainColorV2
  },
  describeStyle: {
    color: Colors.lightText, 
    fontSize: 12, 
    marginLeft: px(10)
  },  
  rangeContainer: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  line: {width: px(20), height: px(1), backgroundColor: Colors.lightText},
  range: {paddingHorizontal: px(10), color: Colors.lightText}
})