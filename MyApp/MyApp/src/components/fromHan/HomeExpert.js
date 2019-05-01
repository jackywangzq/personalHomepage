import React from 'react';
import {Text, TouchableOpacity,Image} from 'react-native';

export default class HomeExpert extends React.Component {

    _onPress() {
        this.props.navigate('OtherScreen',{expert:0})
    }
    render() {
        const expert = require('../../images/专家2.png')
        const top1 = require('../../images/top1.png')
        const top2 = require('../../images/top2.png')
        const top3 = require('../../images/top3.png')
        var rank = this.props.rank;
        var myTop;
        if(rank == 1) {
            myTop = top1;
        } else if(rank == 2) {
            myTop = top2;
        } else if(rank == 3) {
            myTop = top3;
        } 
      return (
        <TouchableOpacity onPress={()=> this._onPress()} style={{marginRight:15}}>
            <Image source={myTop} style={{position:'absolute',width:25,height:10,top:50,zIndex:100,borderRadius:3}}></Image>
            <Image source={expert} style={{width:60,height:60,borderRadius:30}}></Image>
            <Text style={{color:'#333',fontSize:13,marginTop:10}}>吴晓波</Text>
        </TouchableOpacity>
      );

      }
}