import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../constants/Colors';
import {dateFormat} from '../../utils/calendar';

import Icon from 'react-native-vector-icons/Ionicons'
import Calendar from 'react-native-whc-calendar';
import Header from './Header';

export default class DateChoose extends React.PureComponent {

  constructor(props) {
    super(props);
    this._closeModal = this._closeModal.bind(this);
    this._selectDate = this._selectDate.bind(this);
  }

  _closeModal() {
    this.props.onModalClosed();
  }

  _selectDate(s,e) {
    this.props.onSelected(s,e);
  }  
  
  render() {

    const start = dateFormat(this.props.startDate, 'L');
    const end = dateFormat(this.props.endDate, 'L');

    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.modalVisible}
        >
        <View style={{flex: 1}}>
          <Header
            headerBackground={Colors.aliHeader}
            title="日期选择"
            leftBtn = {
              <TouchableOpacity onPress={this._closeModal} style={{minWidth: 44, 
                height: 44, 
                alignItems:'flex-start',
                justifyContent: 'center', flexDirection:'row',justifyContent:'flex-start', alignItems:'center'}}>
                <Icon
                  name='md-close'
                  size={24}
                />
              </TouchableOpacity>
            }
          />
          <Calendar  
            days={180}
            startDateStr={start}
            endDateStr={end}
            selectedColor={Colors.mainColor}
            selectedMidColor={Colors.mainLight}
            onSelectedDateBlock={this._selectDate}
          />
          {
            isIphoneX && <View style={{height: 34}}></View>
          }
        </View>
      </Modal>
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
    color: Colors.mainColor
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