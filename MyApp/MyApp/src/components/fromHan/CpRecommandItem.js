import React from 'react';
import {Text, View,Image} from 'react-native';

export default class CpRecommendItem extends React.Component {

    _onPress = () => {
      this.props.navigation.navigate('ProductDetailScreen')
    }
    render() {
        const p1 = require('../../images/p1.png')
      return (
        <View style={{paddingLeft:15,
            paddingTop:20,
            paddingRight:15,
            width:320,
            height:140,
            borderRadius:5,
            backgroundColor:'white',
            shadowColor: '#333',
            shadowOffset: {h: 10, w: 10},
            shadowRadius: 5,
            shadowOpacity: 0.2,
            marginRight:10
         }}>
            <Text style={{fontSize:18,fontWeight:'bold'}}>昆明环保局工地执法项目</Text>
            <View style={{flexDirection:'row',marginTop:10}}>
            <View style={{paddingRight:5,flex:1,marginRiht:5}}>
              <Text numberOfLines={2} style={{lineHeight:20,color:'grey',fontSize:14,marginTop:5}}>应昆明环保局要求，“沃天宇”无人机在昆明市呈贡区按照划定航线巡查施工地的情况，监测施工过程中不符合环保要求的行为。</Text>
              <Text style={{fontSize:14,fontWeight:'bold',color:'#333',marginTop:10}}>云南分公司</Text>              
            </View>
            <Image style={{width:100,height:70,borderRadius:10}} source={p1}></Image>
            </View>
          </View>
      );
    }
  }