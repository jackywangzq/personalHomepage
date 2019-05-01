import React from 'react';
import {TouchableOpacity,Dimensions,Text, View,Image} from 'react-native';
const {width,height} =  Dimensions.get('window');
export default class SearchItem extends React.Component {

    _onPress(id, type) {
        this.props.onPressed(id, type)
    }
    render() {
      return (
        <TouchableOpacity onPress={()=> this._onPress(this.props.item.id, this.props.item.type)} style={{marginTop:20,paddingBottom:20,borderBottomColor:'#eee',borderBottomWidth:1}}>
        <Text style={{color:'black',fontSize:17,fontWeight:'bold',marginTop:10}}>{this.props.item.name}</Text>
        <Text numberOfLines={2} style={{lineHeight:20,color:'grey',fontSize:13,marginTop:5}}>
        {this.props.item.discription}
        </Text>
        </TouchableOpacity>
      );

      }
}