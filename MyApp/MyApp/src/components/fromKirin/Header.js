import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {
  Image,
  Platform,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  NativeModules,
  View,
} from 'react-native';

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

import { withNavigation } from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons'


const BackBtn = withNavigation((props) => {
  return (
    <TouchableOpacity onPress={() => {props.navigation.goBack()}} style={[topStyles.btns, {flexDirection:'row',justifyContent:'flex-start', alignItems:'center'}]}>
      
      <Icon
        name='ios-arrow-back'
        size={24}
        color={props.color}
      />
      {props.isLeftTitle ? <Text style={[topStyles.title,  {color: props.color, paddingLeft: 10, fontSize: 20}] }>{props.title}</Text> : <Text />} 
      
    </TouchableOpacity>
  )
})

class Header extends React.Component {
  
  static defaultProps = {
    title : '',
    headerBackground: '#fff',
    color: '#000',
    withTopBox: true,
    translucent: true
  } 

  render() {

    

    return (
      <View style={[topStyles.header, this.props.style, {backgroundColor: this.props.headerBackground}]}>
        <StatusBar translucent={this.props.translucent} backgroundColor={this.props.headerBackground} barStyle="dark-content" />
        {(Platform.OS === 'ios' && this.props.withTopBox) && <View style={topStyles.topBox}></View>}
        {(Platform.OS !== 'ios' && this.props.translucent) && <View style={topStyles.androidTop}></View>}
        <View style={[topStyles.bar, this.props.boxStyles]}>
          <View style={topStyles.leftBtn}>
            {this.props.leftBtn ? this.props.leftBtn : <BackBtn color={this.props.color} isLeftTitle={this.props.isLeftTitle} title={this.props.title}/>}
          </View>
          {this.props.isLeftTitle ? <Text /> : <Text numberOfLines={1} style={[topStyles.title,  {color: this.props.color}]}>{this.props.title}</Text>}
          <View style={topStyles.rightBtn}>
            {this.props.rightBtn}
          </View>
        </View>
        <View style={{backgroundColor: this.props.headerBackground, height: this.props.isHigh ? 126 : 0}}/>
      </View>
    )
  }
}

export default withNavigation(Header);

const topStyles = StyleSheet.create({
  header: {
    width: px(750)
  },
  topBox: {
    width: px(750),
    height: isIphoneX ? 44 : 20,
  },
  androidTop: {
    width: px(750),
    height: STATUSBAR_HEIGHT,
  },  
  bar: {
    width: px(750),
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#333',
    maxWidth: px(390)
  },
  leftBtn: {
    marginLeft: px(30),
    minWidth: px(150),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rightBtn: {
    marginRight: px(30),
    width: px(150),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  btns: {
    minWidth: 44, 
    height: 44, 
    alignItems:'flex-start',
    justifyContent: 'center'
  }

})