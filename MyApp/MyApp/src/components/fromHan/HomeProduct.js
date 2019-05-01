import React from 'react';
import {Text, TouchableOpacity,Image} from 'react-native';

export default class HomeProduct extends React.Component {


    render() {
      /* const pic = this.props.pic;
      let product;
      switch(pic) {
        case 'dang':
          product = require('../../images/products/dang.jpg');
          break;
          case 'party':
          product = require('../../images/products/party.jpg');
          break;
          case 'he':
          product = require('../../images/products/he.jpg');
          break;
          case 'chengshi':
          product = require('../../images/products/chengshi.jpg');
          break;
          case 'wangge':
          product = require('../../images/products/wangge.jpg');
          break;
          case 'shanghai':
          product = require('../../images/products/shanghai.jpg');
          break;
        default:
        product = require('../../images/products/dang.jpg');
      } */
      const id = this.props.id === 120992 ? 120963 : this.props.id;
      const picUrl = `https://tt.wo.cn/mobile/static/image?name=${id}.jpg`
        
      return (
        <TouchableOpacity style={{marginRight:20}} onPress={() => this.props.navigate('productDetail', {
          itemId: this.props.id
        })}>
            <Image source={{uri: picUrl}} style={{width:150,height:115,borderRadius:5}}></Image>
            <Text style={{color:'#333',fontSize:13,marginTop:10}}>{this.props.topic}</Text>
        </TouchableOpacity>
      );

      }
}