import React from 'react';
import {TouchableOpacity,Dimensions,Text, View,Image} from 'react-native';
import Colors from '../../constants/Colors';
const {width,height} =  Dimensions.get('window');
export default class HomeProject extends React.Component {

    _onAvatarPress() {
        //this.props.navigate('OtherScreen')
    }
    _onFAPress(id) {
        this.props.onPressed(id)
    }
    render() {
        const project = require('../../images/经典方案.png')
        const expert = null;
        // const expert = require('../images/头像.png')
        // console.warn(this.props.item)
        const picUrl = `https://tt.wo.cn/mobile/static/image?name=${this.props.item.id}.jpg`
      return (
        <TouchableOpacity onPress={()=> this._onFAPress(this.props.item.id)} style={{marginTop:20,paddingBottom:20}}>
        {
            false &&
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=> this._onAvatarPress()} style={{flex:1,flexDirection:'row'}}>
                {
                    expert ?
                    <Image source={expert} style={{width:34,height:34,borderRadius:17}}></Image>
                    :
                    <View style={{justifyContent:'center',alignItems: 'center', width:34, height:34, borderRadius: 17, backgroundColor: Colors.mainColorV2}}>
                        <Text style={{fontSize: 12, color:'#fff'}}>{this.props.item.username.slice(this.props.item.username.length - 2, this.props.item.username.length)}</Text>
                    </View>
                }
                <Text style={{color:'black',fontSize:15,fontWeight:'bold',marginTop:10,marginLeft:10}}>{this.props.item.username}</Text>
            </TouchableOpacity>
            <Text style={{color:'grey',fontSize:11,marginTop:13}}>{this.props.item.date}</Text>
        </View>
        }
        
        <Image source={{uri: picUrl}} style={{borderRadius:5,flex:1,width:width - 30,height:135,marginTop:10}}></Image>
        <Text style={{color:'black',fontSize:17,fontWeight:'bold',marginTop:10}}>{this.props.item.name}</Text>
        <Text numberOfLines={2} style={{lineHeight:20,color:'grey',fontSize:13,marginTop:5}}>
        {this.props.item.discription}
        </Text>
        <View style={{display:'none',flexDirection:'row',marginTop:11}}>
            <Text style={{marginLeft:5,color:'grey',fontSize:12}}>1234·看过</Text>
            <Text style={{marginLeft:5,color:'grey',fontSize:12,marginLeft:30}}>1234·评论</Text>
            <Text style={{marginLeft:5,color:'grey',fontSize:12,marginLeft:30}}>1234·下载</Text>
        </View>
        </TouchableOpacity>
      );

      }
}