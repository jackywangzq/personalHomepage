import React from 'react';
import {Alert,TextInput,SafeAreaView,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight,Text,View} from 'react-native';
import {Request} from '../utils/request';
import AsyncStorage from '@react-native-community/async-storage';
import Comment from '../components/fromHan/Comment';
import { tsVoidKeyword, typeParameter } from '@babel/types';
var state = false;
var verState = false;
var count = 60;
export default class CenterScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type:1,
            verCodeText:"获取验证码",
            loginBtnColor:'#9bd3fb',
            name:'',
            password:'',
            phone:'',
            vercode:''
        }
        state = false;
    }

    verPress() {
        if(verState) {
            return;
        }
        verState = true;
        count = 60;
        this.setState({
            verCodeText:"重新发送(60)"
        })
        
        this.timer = setInterval(() => {
            if(--count == 0) {
                this.setState({
                    verCodeText:"发送验证码"
                })
                verState = false;
                clearInterval(this.timer);
            } else {
                this.setState({
                    verCodeText:"重新发送(" + count + ")"
                })
            }

        },1000)
    }
    async loginPress() {
        if(!state) {
            return;
        } else {
            try {
                var result;
                if(this.state.type == 1) {
                    result = await Request.post('appUser/loginByUsernamePassword', {
                        username: this.state.name,
                        password: this.state.password
                    });
                } else if(this.state.type == 2) {
                    result = await Request.post('appUser/loginByUsernamePassword', {
                        username: this.state.name,
                        password: this.state.password
                    });
                }
                const {user, code, msg} = result;
                if (code === '001') {
                    const that = this;
                    AsyncStorage.setItem('userInfo', JSON.stringify(user), function (error) {
                        if (error) {
                            // alert('存储失败')
                        }else {
                            that.props.navigation.navigate('Main')
                            // alert('存储完成')
                        }
                    })
                    
                } else {
                    const message = msg ? msg : '用户名或密码错误';
                    Alert.alert('', message)
                    
                    /* const user2 = {
                        id: 1005546,
                        email: 'anxiaofeng@chinaunicom.cn',
                        login: "anxiaofeng",
                        name: "安晓峰",
                            orgId: 20,
                            orgName: "山东省分公司",
                            org2Id: 431,
                            org2Name: "山东省分公司本部",
                            org3Name: "山东省分公司网络优化中心",
                            password: null,
                            phone: "15605311556",
                    }
                    await AsyncStorage.setItem('userInfo', JSON.stringify(user2));
                    this.props.navigation.navigate('Main') */
                }
            } catch (err) {
                console.log(err)
                Alert.alert('', '网络错误，请重试');
            }
        }
    }

    nameInputChange(value) {
        this.setState({
            name:value
        })
        if(value == '' || this.state.password == '') {
            state = false;
            this.setState({
                loginBtnColor:'#9bd3fb'
            })
        } else if(value != '' && this.state.password != ''){
            state = true;
            this.setState({
                loginBtnColor:'#33a6fa'
            })
        }
    }
    passInputChange(value) {
        this.setState({
            password:value
        })
        if(this.state.name == '' || value == '') {
            state = false;
            this.setState({
                loginBtnColor:'#9bd3fb'
            })
        } else if(this.state.name != '' && value != ''){
            state = true;
            this.setState({
                loginBtnColor:'#33a6fa'
            })
        }
    }
    phoneInputChange(value) {
        this.setState({
            vercode:value
        })
    
        if(value == '' || this.state.vercode == '') {
            state = false;
            this.setState({
                loginBtnColor:'#9bd3fb'
            })
        } else if(value != '' && this.state.vercode != ''){
            state = true;
            this.setState({
                loginBtnColor:'#33a6fa'
            })
        }
    }

    verInputChange(value) {
        this.setState({
            vercode:value
        })
    
        if(value == '' || this.state.vercode == '') {
            state = false;
            this.setState({
                loginBtnColor:'#9bd3fb'
            })
        } else if(value != '' && this.state.vercode != ''){
            state = true;
            this.setState({
                loginBtnColor:'#33a6fa'
            })
        }
    }

    changeType(type) {
        this.setState({
            type:type,
            name:'',
            password:'',
            phone:'',
            vercode:'',
            loginBtnColor:'#9bd3fb',
            
        })
    }
    render() {
      
      const close = require('../images/close.png')
      return (
        <SafeAreaView style={{flex: 1,backgroundColor: 'white'}}>
        <KeyboardAvoidingView behavior="position" enabled>
            <View style={{paddingLeft:30,paddingRight:30}}>

            <Text style={{fontSize:36,marginTop:30,fontWeight:'bold'}}>登录</Text>
            <Text style={{fontSize:26,marginTop:15}}>欢迎来到创新头条！</Text>

            {this.state.type == 1
            ?
            <View>
                <View>
                 <TextInput ref="nameInput" value={this.state.name} onChangeText={(value)=>this.nameInputChange(value)} style={{fontSize:16,marginTop:40,borderColor:'#666',borderBottomWidth:0.5,paddingBottom:22,paddingTop:22}} placeholder="请输入OA用户名"></TextInput>
                </View>
            
                <View>
                    <TextInput secureTextEntry={true} value={this.state.password} ref="passInput" onChangeText={(value)=>this.passInputChange(value)} style={{fontSize:16,marginTop:40,borderColor:'#666',borderBottomWidth:0.5,paddingBottom:22,paddingTop:22}} placeholder="请输入OA密码"></TextInput>
                </View>
                <Text onPress={()=> this.changeType(2)} style={{display:'none',width:120,fontSize:15,color:'#33a6fa',marginTop:20}}>短信验证码登录</Text>
            </View>
            :
            <View>
                <View>
                    <TextInput ref="phoneInput" onChangeText={(value)=>this.phoneInputChange(value)} style={{fontSize:16,marginTop:40,borderColor:'#666',borderBottomWidth:0.5,paddingBottom:22,paddingTop:22}} placeholder="请输入手机号"></TextInput>
                </View>
                <View>
                <TextInput onChangeText={(value)=>this.verInputChange(value)} style={{fontSize:16,marginTop:40,borderColor:'#666',borderBottomWidth:0.5,paddingBottom:22,paddingTop:22}} placeholder="请输入验证码"></TextInput>
                <TouchableHighlight style={{position:'absolute',right:0,bottom:15,width:120,height:32,backgroundColor:'#f5f5f5',borderRadius:15,alignItems: "center"}}>
                <Text style={{color:'#2a9df3',height:32,lineHeight:32,fontSize:14}} onPress={() => this.verPress()}>
                {this.state.verCodeText}
                </Text>
                </TouchableHighlight>
                </View>
                <Text onPress={()=> this.changeType(1)} style={{width:120,fontSize:15,color:'#33a6fa',marginTop:20}}>账号密码登录</Text>
            </View>
            }
            <TouchableOpacity ref="loginBtn" onPress={() => this.loginPress()} style={{marginTop:40,height:47,backgroundColor:this.state.loginBtnColor,borderRadius:25,alignItems: "center"}}>
                <Text style={{color:'white',height:47,lineHeight:47,fontSize:19}}>
                登录
                </Text>
            </TouchableOpacity>
            <View style={{display:'none'}}>
            <Comment _onConfirmPressd={(comment) => Alert.alert(JSON.stringify(comment))} onCancelPressed={() => Alert.alert("1")}></Comment>
            </View>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }