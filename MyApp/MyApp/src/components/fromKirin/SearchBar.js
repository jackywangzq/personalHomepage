import React from 'react';
import {px, isIphoneX} from '../../utils/px';

import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  Text
} from 'react-native';



export default class SearchBar extends React.PureComponent {

  static defaultProps = {
    height: px(90)
  } 

  _onChange = (text) => {
    !!this.props.onChangeText && this.props.onChangeText(text)
  }

  _onPress = () => {
    !!this.props.onPressed && this.props.onPressed()
  }

  _onSubmit = (e) => {
    !!this.props.onSubmit && this.props.onSubmit(e)
  }

  _onFocus = () => {
    !!this.props.onFocus && this.props.onFocus()
  }

  _onBlur = () => {
    !!this.props.onBlur && this.props.onBlur()
  }

  render() {
    const searchInput = require('../../images/search_input.png');
    return (
      <TouchableOpacity 
        activeOpacity = {this.props.editable ? 1 : 0.2}
        onPress = {() => this._onPress()}
        style={[this.props.style, searchBarstyles.container,searchBarstyles.shadow, {height: this.props.height, borderRadius: this.props.height / 2}]}
      >
        <Image source={searchInput} style={{width: px(30), height: px(30)}} />
        {
          this.props.editable ?
          <TextInput
            editable = {this.props.editable}
            placeholder = {this.props.placeholder} 
            placeholderTextColor = {'#BBBBBB'}
            underlineColorAndroid = {'transparent'}
            style={{ paddingVertical:0, paddingLeft: px(10), height: '100%', flex: 1 }}
            onChangeText={this._onChange}
            value={this.props.value}
            returnKeyType="search"
            autoFocus = {true}
            onSubmitEditing = {(e) => this._onSubmit(e)}
            onFocus = {() => this._onFocus()}
            onBlur = {() => this._onBlur()}
          />:
          <Text style={{color: '#BBBBBB', paddingVertical:0, paddingLeft: px(10) }}>{this.props.placeholder}</Text>
        }
        
      </TouchableOpacity>
    )
  }
}

const searchBarstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal:px(30),
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
          width: 0,
          height: 0.5
        },
        shadowRadius: 5,
        shadowOpacity: 1
      },
      android: {
        elevation: 5,
      },
    })
  },
})