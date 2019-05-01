import React from 'react';
import {px} from '../../utils/px';
import {
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity
} from 'react-native';

import ListItem from './ListItem';



export default class ListInputItem extends React.PureComponent {

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
    maxHeight: px(300),
    editable: true
  } 

  _onChangeText = (text) => {
    !!this.props.onChangeText && this.props.onChangeText(text)
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

  _onPress() {
    !!this.props.onPressed && this.props.onPressed()
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

    return (
      <View style={this.props.style}>
        <ListItem
          title = {this.props.title}
          isColumn = {true}
          isNeeded = {this.props.isNeeded}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity = {this.props.editable ? 1 : 0.2} 
              onPress={() => this._onPress()} 
              style={{width: this.props.unit ? '50%' : '100%',backgroundColor:'#fff', justifyContent:'center', paddingVertical: px(20),paddingHorizontal: px(30), borderRadius: px(10)}}>
              {this.props.editable ?
                <TextInput
                  editable = {this.props.editable} 
                  autoFocus = {this.props.autoFocus}
                  multiline = {this.props.multiline}
                  keyboardType = {this.props.keyboardType}
                  placeholder = {this.props.placeholder} 
                  placeholderTextColor = {'#BBBBBB'}
                  underlineColorAndroid = {'transparent'}
                  style={[ { height: this.props.multiline ? this.state.height : this.props.height, textAlignVertical: 'top', padding:0}]}
                  onChangeText={this._onChangeText}
                  defaultValue={this.props.value}
                  onChange = {this._onChange}
                  onContentSizeChange = {this._onContentSizeChange}
                /> :
                <View style={{height: this.props.height,justifyContent:'center'}}>
                  <Text style={{color: '#BBBBBB', paddingVertical:0}}>{this.props.value && this.props.value !== '' ? this.props.value : this.props.placeholder}</Text>
                </View>
              }
            </TouchableOpacity>
            <Text style={{paddingLeft: px(20)}}>{this.props.unit}</Text>
          </View>
        </ListItem>
      </View>
    )
  }
}