import React from 'react';
import {px, isIphoneX} from '../../utils/px';
import {
  Platform,
  StyleSheet,
  StatusBar,
  View,
  NativeModules
} from 'react-native';

import Colors from '../../constants/Colors';
import SearchBar from './SearchBar';

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

class HomeHeader extends React.PureComponent {
  
  static defaultProps = {
    title : '',
    headerBackground: '#fff',
    color: '#000',
    left: <SearchBar placeholder="输入工单名称或工单号" editable={false}/>,
    hasContent: true,
    needTop: true,
    translucent: true
  } 

  render() {

    return (
      <View style={[topStyles.header, this.props.style, {backgroundColor: this.props.theme === 'dark' ? Colors.darkHeader : this.props.headerBackground}]}>
        <StatusBar translucent={this.props.translucent} backgroundColor={this.props.theme === 'dark' ? Colors.darkHeader : this.props.headerBackground} barStyle={this.props.theme==="dark" ? 'light-content' : 'dark-content'} />
        {(Platform.OS === 'ios' && this.props.needTop) && <View style={topStyles.topBox}></View>}
        {(Platform.OS !== 'ios' && this.props.translucent) && <View style={topStyles.androidTop}></View>}
        {
          this.props.hasContent && 
          <View style={[topStyles.bar, this.props.boxStyles]}>
            {this.props.left}
            {
              !!this.props.right && 
              <View style={topStyles.right}>
                {this.props.right}
              </View>
            }
          </View>
        }
      </View>
    )
  }
}

export default HomeHeader;

const topStyles = StyleSheet.create({
  header: {
    width: px(750),
    // paddingVertical: px(30)
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  androidTop: {
    width: px(750),
    height: STATUSBAR_HEIGHT,
  },  
  left: {
    flex: 1
  },
  topBox: {
    width: px(750),
    height: isIphoneX ? 44 : 20
  },
  right: {
    paddingLeft: px(30)
  }
})