import React from 'react';
import {px} from '../../utils/px';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '../../constants/Colors';

export default class VerticalCard extends React.PureComponent {

  static defaultProps = {
    showTools: false,
    hasImg: true
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id)
  }

  render() {
    return (
      <View style={[styles.container, this.props.cardStyles]}>
        {
          this.props.hasImg && 
          <View style={{flex:1,alignItems:"center"}}>
            <Image source={this.props.picUrl} style={{height: px(120), width: px(120)}}/>
          </View>
        }
        <Text numberOfLines={2} style={{textAlign: "center" ,fontSize: 14, fontWeight: "bold", lineHeight:21, height: 44, marginTop:px(20)}}>{this.props.name}</Text>
        {
          this.props.summary &&
          <View style={{marginVertical: px(20)}}>
            <Text numberOfLines={3} style={{color: Colors.darkText, fontSize: 12, height:56, lineHeight: 18}}>{this.props.summary}</Text>
          </View>
        
        }
        {
          this.props.extra
        }
        {
          this.props.date && <Text style={{justifyContent: 'center',color: Colors.lightText, fontSize: 12}}>{this.props.date}</Text>
        }
        {
          this.props.showTools && 
          <View style={{flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',}}>
            <Ionicons
              onPress={this._onPress}
              name={this.props.selected ? "md-checkmark-circle" : "md-add-circle-outline"}   
              size={px(60)}   
              color={this.props.selected ? Colors.mainColor : Colors.lightText} 
              />
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
})
