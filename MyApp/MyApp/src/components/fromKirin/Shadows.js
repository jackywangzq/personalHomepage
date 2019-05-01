import React from 'react';
import {View,Platform, StyleSheet} from 'react-native';
import {px} from '../../utils/px';

import {BoxShadow} from 'react-native-shadow'

export default class Shadows extends React.PureComponent {
  

  render() {
    const shadowOpt = {
      width:px(750),
      height: this.props.height,
      color:'#000',
      border:2,
      radius: 3,
      x: 0,
      y: 1,
      opacity:0.2,
      style: [{marginTop: 0, marginBottom: 3}]
    }

    
    return (
      
      Platform.OS === 'ios' ?
      <View style={[this.props.style]}>
        {this.props.children}
      </View>
      :
      <BoxShadow setting={shadowOpt}>
        {this.props.children}
      </BoxShadow>
      
    )
  }
}