import React from 'react';
import {Text, View,Image} from 'react-native';

export default class HomeRecommendItem extends React.Component {

    _onPress = () => {
      this.props.navigation.navigate('ProductDetailScreen')
    }
    render() {
        const guess = require('../../images/猜你想要.png')
      return (
        <View style={{paddingLeft:15,
            margin:10,
            paddingTop:20,
            paddingRight:15,
            width:320,
            height:100,
            borderRadius:5,
            backgroundColor:'white',
            shadowColor: '#333',
            shadowOffset: {h: 10, w: 10},
            shadowRadius: 5,
            shadowOpacity: 0.2,
            flexDirection:'row'
         }}>
        <View style={{flexDirection:'column',flex:1,paddingRight:10}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>知识版权管理方案</Text>
            <Text numberOfLines={2} style={{lineHeight:20,color:'grey',fontSize:13,marginTop:5}}>应昆明环保局要求，“沃天宇”无人机在昆明市呈贡区按照划定航线巡查施工地的情况，监测施工过程中不符合环保要求的行为。</Text>
        </View>
        <Image style={{width:60,height:60,borderRadius:5}} source={guess}></Image>
          </View>
         
      );
    }
  }