import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {px} from '../../utils/px';
import {Text, View,Image,Dimensions,TouchableOpacity,BVLinearGradient} from 'react-native';
const {height,width} =  Dimensions.get('window');
export default class BannerItem extends React.Component {

    renderItem(item, index) {
       
        if(item == 0) {
            return( <Text key={item + '' + index} style={{fontSize:28,marginLeft:20,color:'grey'}}>.</Text>)
        } else {
            return( <Text key={item + '' + index} style={{fontSize:35,marginLeft:20,color:'white'}}>.</Text>)
        }
      }
    render() {
        var banner;

        if(this.props.select ==0) {
            banner = require('../../images/banner_1.jpg')
        } else {
            banner = require('../../images/首页banner--.jpg')
        }
        
        let dots = [];
        for(var i = 0;i < this.props.count;i++) {
            if(i == this.props.select)
                dots.push(1)
            else
                dots.push(0)
        }
        return(
            <View style={{width:width,backgroundColor:'white',paddingHorizontal: px(30)}}>
                <Image source={banner} style={{width:'100%',height:px(270),resizeMode:'stretch',borderRadius:5}}></Image>
                <Text style={{color:'white',position:'absolute',bottom:25,left:25,fontSize:13}}></Text>
                {
                    false &&
                    <Text style={{color:'grey',position:'absolute',bottom:20,right:30,fontSize:20}}>
                        {dots.map( (item, index) => this.renderItem(item, index) )}
                    </Text>
                }
                
            </View>
        );
    }
}