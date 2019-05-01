import React from 'react';
import {px} from '../../utils/px';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../../constants/Colors';

export default class Radio extends React.PureComponent {

  static defaultProps = {
    text: '',
    size: px(44),
    selected: false,
    selectedColor: Colors.mainColorV2,
    unSelectedColor: Colors.unchoosed,
    textMargin: px(20),
    unSelectedIcon: 'md-radio-button-off'
  } 

  _onPress = () => {
    this.props.onPressed()
  }
  changeState=(state) => {

  }
  render() {

    const hasText = this.props.text && this.props.text.length > 0;
    const text = hasText ? <Text style={[radioStyles.text, {marginLeft: this.props.textMargin}]}>{this.props.text}</Text> : <View />

    return (
      <TouchableOpacity style={[radioStyles.container, this.props.style]} onPress={this._onPress}>
        <Icon 
          name={this.props.selected ? 'md-checkmark-circle' : this.props.unSelectedIcon} 
          size={px(40)}
          color={this.props.selected ? this.props.selectedColor : this.props.unSelectedColor}
        />
        {text}
      </TouchableOpacity>
    )
  }
}

const radioStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:px(20),
  },
  text: {
    fontSize: 13
  }
})