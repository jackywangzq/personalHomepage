import React from 'react';
import {px} from '../../utils/px';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform
} from 'react-native';
const light = require('../../images/light.png')
const unlight = require('../../images/unlight.png')

var comment = {
    support:5,
    cap:5,
    rate:5
}
export default class Comment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            supports:[1,1,1,1,1],
            caps:[1,1,1,1,1],
            rates:[1,1,1,1,1]
          }
    }
    static defaultProps = {
      
    }

    _onSuportPress = (index) => {
        comment.support = index + 1;
        var supports = this.state.supports;
        for(var i = 0;i < supports.length;i++) {
            if(i <= index) {
                supports[i] = 1;
            } else {
                supports[i] = 0;
            }
        }
        this.setState({
            supports:supports
        })
    }
    _onCapPress = (index) => {
        comment.cap = index + 1;
        var caps = this.state.caps;
        for(var i = 0;i < caps.length;i++) {
            if(i <= index) {
                caps[i] = 1;
            } else {
                caps[i] = 0;
            }
        }
        this.setState({
            caps:caps
        })
    }
    _onRatePress = (index) => {
        comment.rate = index + 1;
        var rates = this.state.rates;
        for(var i = 0;i < rates.length;i++) {
            if(i <= index) {
                rates[i] = 1;
            } else {
                rates[i] = 0;
            }
        }
        this.setState({
            rates:rates
        })
    }

    _onCancelPress =() => {
        !!this.props.onCancelPressed && this.props.onCancelPressed()
    }

    _onConfirmPress =() => {
        !!this.props._onConfirmPressd && this.props._onConfirmPressd(comment)
    }
    
    render() {
        
      return (
        <View style={styles.container}>
            <View style={styles.title}><Text style={{color:'#999999',lineHeight:px(90),fontSize:px(31),textAlign:'center'}}>评价</Text></View>
            <View style={styles.chooseContainer}>
                <Text style={styles.subtitle}>支撑效果</Text>
                <View style={{flex:1,alignContent:'space-between',flexDirection:'row',paddingLeft:px(20)}}>
                <TouchableOpacity style={styles.star} onPress={() => this._onSuportPress(0)}>
                    <Image source={this.state.supports[0]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onSuportPress(1)}>
                    <Image source={this.state.supports[1]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onSuportPress(2)}>
                    <Image source={this.state.supports[2]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onSuportPress(3)}>
                    <Image source={this.state.supports[3]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onSuportPress(4)}>
                    <Image source={this.state.supports[4]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.chooseContainer}>
                <Text style={styles.subtitle}>赋能推荐</Text>
                <View style={{flex:1,alignContent:'space-between',flexDirection:'row',paddingLeft:px(20)}}>
                <TouchableOpacity  style={styles.star} onPress={() => this._onCapPress(0)}>
                    <Image source={this.state.caps[0]==0?unlight:light} style={styles.star} resizeMode="contain"></Image>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.star}onPress={() => this._onCapPress(1)}>
                    <Image source={this.state.caps[1]==0?unlight:light} style={styles.star} resizeMode="contain"></Image>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.star} onPress={() => this._onCapPress(2)}>
                    <Image source={this.state.caps[2]==0?unlight:light} style={styles.star} resizeMode="contain"></Image>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.star} onPress={() => this._onCapPress(3)}>
                    <Image source={this.state.caps[3]==0?unlight:light} style={styles.star}resizeMode="contain"></Image>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.star} onPress={() => this._onCapPress(4)}>
                    <Image source={this.state.caps[4]==0?unlight:light} style={styles.star} resizeMode="contain"></Image>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.chooseContainer}>
                <Text style={styles.subtitle}>中台流转效率</Text>
                <View style={{flex:1,alignContent:'space-between',flexDirection:'row',paddingLeft:px(20)}}>
                <TouchableOpacity style={styles.star} onPress={() => this._onRatePress(0)}>
                    <Image source={this.state.rates[0]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onRatePress(1)}>
                    <Image source={this.state.rates[1]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onRatePress(2)}>
                    <Image source={this.state.rates[2]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onRatePress(3)}>
                    <Image source={this.state.rates[3]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => this._onRatePress(4)}>
                    <Image source={this.state.rates[4]==0?unlight:light} resizeMode="contain" style={styles.star}></Image>
                </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.bottomBtns,styles.shadow]}>
            
                <TouchableOpacity onPress={()=>this._onCancelPress()} style={{flex:1,backgroundColor:'white',borderBottomLeftRadius:px(10)}}><Text style={{fontSize:px(34),lineHeight:px(90),textAlign:'center',color:'black'}}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._onConfirmPress()} style={{flex:1,backgroundColor:'#33a6fa',borderBottomRightRadius:px(10)}}><Text style={{fontSize:px(34),lineHeight:px(90),textAlign:'center',color:'white'}}>确定</Text>
                </TouchableOpacity>
            </View>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        borderRadius:px(10)
    },
    title:{
        height:px(90),
        borderColor:'rgb(232,232,232)',
        borderBottomWidth:0.5,
        marginBottom:px(40)
    },
    subtitle:{
        textAlign:'right',
        width:px(200),
        fontSize:px(28)
    },
    chooseContainer:{
        flexDirection:'row',
        marginTop:px(30),
        alignItems:'center',
        paddingRight:px(50)
    },
    star:{
        flex:1,
        width:19,
        height:18
    },
    bottomBtns:{
        height:px(90),
        marginTop:px(80),
        flexDirection:'row',
        borderBottomLeftRadius:px(10),
        borderBottomRightRadius:px(10)
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