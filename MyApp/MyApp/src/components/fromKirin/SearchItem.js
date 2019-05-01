import React from 'react';
import {TouchableOpacity, Text,StyleSheet, View} from 'react-native';
import {px} from '../../utils/px';

import Profile from './Profile';

export default class SearchItem extends React.PureComponent {

    _onPress(id, clazz) {
      !!this.props.onPressed && this.props.onPressed(id, clazz)
    }

    render() {
      return (
        <TouchableOpacity onPress={()=> this._onPress(this.props.id, this.props.clazz)} style={[this.props.style, searchItemStyles.container]}>
          <View style={searchItemStyles.header}>
            <Profile
              imgSize={px(60)} 
              range={px(18)}
              nameSize={14}
              avatarName = {this.props.name}
              nameColor='#000'
              name = {this.props.name}
            />
            <Text style={searchItemStyles.headerText}>{this.props.headerText}</Text>
          </View>
          <View style={searchItemStyles.topic}>
            <Text style={searchItemStyles.topicText}>{this.props.topic}</Text>
          </View>
          <View style={searchItemStyles.describ}>
            <Text numberOfLines={2} style={searchItemStyles.describText}>
              {this.props.describ}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
}

const searchItemStyles = StyleSheet.create({
  container: {
    padding: px(30),
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  headerText: {
    color: '#999999',
    fontSize: 12
  },  
  topic: {
    marginTop: px(30),
  },
  topicText: {
    fontSize: 16
  },
  describ: {
    marginTop: px(20),
  },
  describText: {
    lineHeight:20,color:'#999999',fontSize:13
  }
})