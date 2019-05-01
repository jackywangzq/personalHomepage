import React from 'react';
import {px} from '../../utils/px';
import {
  Text,
  View,
} from 'react-native';

import Colors from '../../constants/Colors';

export default class ListItem extends React.PureComponent {

  static defaultProps = {
    isNeeded: false,
    isColumn: false,
    keyboardType: 'default',
    isLast: false
  } 

  _onChange = (text) => {
    this.props.onChangeText(text)
  }

  render() {

    return (
      <View style={{alignItems:this.props.isColumn ? 'flex-start' : 'center', flexDirection: this.props.isColumn ? 'column' : 'row' , marginBottom: this.props.isLast ? 0 : px(45)}}>

        <View style={{ flexDirection: 'row',alignItems:'center', marginRight: px(30), marginBottom: this.props.isColumn ? px(20) : 0}}>
          {
            this.props.isNeeded && 
            <Text style={{color: 'red', marginRight: px(10)}}>*</Text>
          }
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{this.props.title}</Text>
        </View>
        {this.props.children 
          ? this.props.children
          : <Text style={{flex: 1, color: Colors.darkText, fontSize: 13, lineHeight: 19}}>{this.props.content}</Text>
        }
      </View>
    )
  }
}