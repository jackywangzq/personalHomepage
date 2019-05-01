import React from 'react';
import {px} from '../../utils/px';
import {
  Text,
  TextInput,
  View,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';

import ListItem from '../fromKirin/ListItem';
import { regExpLiteral } from '@babel/types';



export default class ListSearchItem extends React.PureComponent {

  constructor(props) {
    super(props);
    this._onContentSizeChange = this._onContentSizeChange.bind(this);
    this._onChange = this._onChange.bind(this);
    this.state = {
      height: 0
    }
  }

  static defaultProps = {
    isNeeded: true,
    keyboardType: 'default',
    height: px(50),
    minHeight: px(150),
    maxHeight: px(300)
  } 

  _onChange = (text) => {
    this.props.onChangeText(text)
  }

  _onChange(event) {
    if (this.props.multiline && Platform.OS === 'android') {
      let height = event.nativeEvent.contentSize.height;
      this.changeHeight(height);
    }
  }

  _onContentSizeChange(event) {
    if (this.props.multiline) {
      let height = event.nativeEvent.contentSize.height;
      this.changeHeight(height);
    }
  }
  _onSearch = () => {
      this.props.onSearch()
  }
  changeHeight(height) { 
    let { minHeight, maxHeight } = this.props;
    if (height < minHeight) {
      height = minHeight;
    } else if (maxHeight && height > maxHeight) {
      height = maxHeight;
    }
    if (height !== this.state.height) {
      this.setState({
        height
      });
    }
  }



  render() {
    const searchicon = require('../../images/关注.png');
    return (
      <View style={this.props.style}>
      <ListItem
        title = {this.props.title}
        isColumn = {true}
        isNeeded = {this.props.isNeeded}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={this._onSearch} style={{width: this.props.unit ? '50%' : '100%',backgroundColor:'#fff', justifyContent:'center', paddingVertical: px(20),paddingHorizontal: px(30), borderRadius: px(10)}}>
            <Text style={{color:'#666',height:px(50),lineHeight:px(50),paddingRight:px(70)}}>{this.props.value}</Text>
            <Image source={searchicon} style={{position:'absolute',width:px(36),height:px(36),right:px(30),top:px(25)}}></Image>
          </TouchableOpacity>
        </View>
      </ListItem>
      </View>
    )
  }
}