import React from 'react';
import {px} from '../../utils/px';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';

import SingleRadio from './SingleRadio';
const {height,width} =  Dimensions.get('window');
export default class SingleRadios extends React.Component {

  static defaultProps = {
    
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.selected == this.props.selected) {
      return false;
    }
    return true
  }

  _select =(value)=> {
    this.props.onChange(value)
  }

  render() {

    return (
      <View style={[radiosStyles.container, this.props.style]}>
        {
          this.props.options.map(item => {
            return (
              <SingleRadio
                style={{width:'30%'}}
                unSelectedIcon = 'md-checkmark-circle'
                key={item.value}
                selected = {this.props.selected.get(item.value)}
                textMargin = {px(10)}
                text = {item.label}
                onPressed = {() => this._select(item.value)}
              />
            )
            
          })
        }
        
      </View>
    )
  }
}

const radiosStyles = StyleSheet.create({
  container: {
    flexWrap:'wrap',
    width:'100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  }
})