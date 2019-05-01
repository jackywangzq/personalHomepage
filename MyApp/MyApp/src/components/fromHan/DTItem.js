import React from 'react';
import {Dimensions,Text, View,Image, StyleSheet} from 'react-native';
const {width,height} =  Dimensions.get('window');
export default class DTItem extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {
        const project = require('../../images/经典方案.png')
        const expert = require('../../images/专家1.png')
      return (
        <View 
            style={{marginTop:20,paddingBottom:20, borderBottomColor:'#eee',borderBottomWidth:StyleSheet.hairlineWidth}}

        >
        {
            false &&
            <View style={{flexDirection:'row'}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <Image source={expert} style={{width:34,height:34,borderRadius:17}}></Image>
                    <Text style={{color:'black',fontSize:15,fontWeight:'bold',marginTop:10,marginLeft:10}}>康桥的爱因斯坦</Text>
                </View>
                <Text style={{color:'grey',fontSize:11,marginTop:13}}>2019-01-03</Text>
            </View>
        }
        {
            true &&
            <Image source={this.props.picUrl} style={{borderRadius:5,flex:1,width:width - 30,height:135,marginTop:10}}></Image>
        }
        <Text style={{color:'black',fontSize:17,fontWeight:'bold',marginTop:10}}>{this.props.topic}</Text>
        <Text numberOfLines={2} style={{lineHeight:20,color:'grey',fontSize:13,marginTop:5}}>
            {this.props.desc}
        </Text>
        {
            false &&
            <View style={{flexDirection:'row',marginTop:11}}>
                <Text style={{color:'grey',fontSize:12}}>1234·看过</Text>
                <Text style={{marginLeft:5,color:'grey',fontSize:12,marginLeft:30}}>1234·评论</Text>
                
                <Text style={{marginLeft:5,color:'grey',fontSize:12,marginLeft:30}}>1234·下载</Text>
            </View>
        }
        
        </View>
      );

      }
}