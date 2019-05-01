import React from 'react';
import {px} from '../../utils/px';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import Colors from '../../constants/Colors';

export default class Profile extends React.PureComponent {

  static defaultProps = {
    imgSize: px(90),
    imgSize2: null,
    name: '',
    avatar: null,
    isCircle: true,
    range: px(20),
    textRange: px(14),
    nameSize: 13,
    textSize: 12,
    nameColor: Colors.darkText,
    textColor: '#999999',
    avatarName: null,
    canTouch: false
  }

  _onPress() {
    this.props.onPress()
  }
  
  render() {

    return (
      <View style={[profileStyles.container, this.props.style]}>
        <View 
          style={{
            backgroundColor: this.props.isCircle ? Colors.background : 'transparent', 
            height: !!this.props.imgSize2 ? this.props.imgSize2 : this.props.imgSize, 
            width: this.props.imgSize, 
            borderRadius: this.props.isCircle ? this.props.imgSize / 2 : 0
          }}
        >
          <TouchableOpacity onPress={() => {this.props.canTouch && this._onPress()}} activeOpacity={this.props.canTouch ? 0.2 : 1}>
            {
              this.props.avatar && this.props.avatar !== '' 
              ?
              <Image 
                style={{width:'100%',height:'100%',borderRadius: this.props.isCircle ? this.props.imgSize / 2 : 0}} 
                source={this.props.avatar}
              />
              :
              <View style={{
                height: '100%', width: '100%', borderRadius: this.props.imgSize / 2, backgroundColor: Colors.mainColorV2,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{color: '#fff', fontSize: Math.ceil(this.props.imgSize / 3) - 1}}>{this.props.avatarName ? this.props.avatarName.slice(this.props.avatarName.length - 2, this.props.avatarName.length) : this.props.name.slice(this.props.name.length - 2, this.props.name.length)}</Text>
              </View>
            }
          </TouchableOpacity>  
        </View>
        <View style={[{marginLeft: this.props.range}, profileStyles.info]}>
          <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
            <Text style={{fontSize: this.props.nameSize, color: this.props.nameColor}}>{this.props.name}</Text>
            <Text style={{fontSize: this.props.nameSize, color: '#D2D2D2'}}>{this.props.extraName}</Text>
          </View>
          
          {
            (!!this.props.describe || !!this.props.describe2) && 
            (
              <View style={[profileStyles.describe, {marginTop: this.props.textRange, flexWrap:'wrap'}]}>
                {
                  !!this.props.describe &&
                  <Text style={[{fontSize: this.props.textSize, color: this.props.textColor}]}>{this.props.describe}</Text>
                }
                {
                  !!this.props.describe2 &&
                  <Text style={[{fontSize: this.props.textSize,color: this.props.textColor}]}>{this.props.describe2}</Text>
                }
              </View>
            )
          }
          {
            !!this.props.orgName &&
                  <Text style={[{marginTop:px(10),fontSize:this.props.textSize,color: this.props.textColor}]}>{this.props.orgName}</Text>
          }
          { 
            !!this.props.children && this.props.children
          }
        </View>
      </View>
    )
  }
}

const profileStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  info: {
    flex: 1
  },
  describe: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between'
  }
})