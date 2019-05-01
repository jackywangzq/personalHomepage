import React from 'react';
import {px} from '../../utils/px';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import Colors from '../../constants/Colors';

import Radios from './Radios';

export default class SectionRadios extends React.PureComponent {
  static defaultProps = {
    sectionIcon: require('../../images/file_select.png')
  }

  render() {
    
    return (
      <View style={[styles.container, {borderBottomWidth: this.props.isLast ? 0 : StyleSheet.hairlineWidth}]}>
        <View style={styles.section}>
          <Image style={styles.sectionImage} source={this.props.sectionIcon} />
          <Text style={styles.sectionText}>{this.props.text}</Text>
        </View>
        <Radios
          style={{marginBottom: this.props.isLast ? 0 : px(36)}}
          options = {this.props.provider}
          selected = {this.props.selected}
          onChange = {this.props.onChange}
        />
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.unchoosed,
    marginHorizontal: px(30),
    alignItems: 'flex-start'
  },
  section: {
    flexDirection:'row', alignItems:'center',marginVertical: px(36)
  },
  sectionImage: {
    width: px(30), height: px(34), marginRight:px(10)
  },
  sectionText: {
    color: Colors.darkText, fontSize: 13
  }
})