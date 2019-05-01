import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Text,
  Picker
} from 'react-native';

import Colors from '../../constants/Colors';


export default class PickerWidget extends React.PureComponent {

  constructor(props) {
    super(props);
    if(props.options != null && props.options.length > 0) {
      var value = props.options[0]
      this.state = {
        valueNow: value
      }
    } else {
      this.state = {
        valueNow: null
      }
    }
    this._closeModal = this._closeModal.bind(this);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _closeModal() {
    !!this.props.onCanceled && this.props.onCanceled();
  }

  _onConfirm() {
    //console.warn(this.state.valueNow);
    var value = this.state.valueNow;
    if(value == null) {
      if(this.props.options != null && this.props.options.length > 0) {
        value = this.props.options[0]
      }
    }
    if(value != null) {
      !!this.props.onConfirmed && this.props.onConfirmed(value)
    }
    
  }
  
  render() {

    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.visible}
        >
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent:'flex-end'}}>
          <View style={{backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',paddingHorizontal:px(30), justifyContent:'space-between', alignItems:'center', height: px(90)}}>
              <TouchableOpacity onPress={this._closeModal}>
                <Text style={{fontSize: 16, color: Colors.mainColor}}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._onConfirm}>
                <Text style={{fontSize: 16, color: Colors.mainColor, fontWeight:'bold'}}>确认</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={this.state.valueNow != null?this.state.valueNow.value :null}
              onValueChange={(value,itemIndex) => (this.setState({valueNow:this.props.options[itemIndex]}))}
            >
              {this.props.options.map(item => {
                return (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                )
              })}
            </Picker>
          </View>
        </View>
        {
          isIphoneX && <View style={{height: 34}}></View>
        }
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