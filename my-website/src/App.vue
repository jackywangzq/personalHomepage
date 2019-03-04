<template>

  <div id="app" class="container-fluid" style="margin-top: 0px; padding: 0px;">
  	<div class="row" >
			  <aside id="aside" class="col-lg-4 col-md-4 col-sm-4 col-xs-4 " style="background-color: white; font-size: 16px; padding-top: 25px; " >
						<button type="button" @click="getData()" value="测试">测试</button>		  
			  	<div id="aside_nav" class="row" >
			  		<MyWebsitelogo> </MyWebsitelogo>
		  			<MyWebsitenav v-bind:class="{ 'aside_main_visiblity' : this.$store.state.data_ }" > </MyWebsiteNav>
		  			<MyWebsitemenu> </MyWebsiteMenu>
			  	</div>
					<div id="aside_main" class="row" style="position: relative;" >		
								<MyWebsitenavmain v-bind:class="{ 'aside_main_display' : this.$store.state.data_ }" style="position: absolute; left:50%; transform:translate(-60%,150px);"></MyWebsitenavmain>
								<MyWebsiteMenumain v-bind:class="{ 'aside_main_display' : !this.$store.state.data_ }" style="position: absolute; left:50%; transform:translate(-60%,150px);"></MyWebsiteMenumain>	
					</div>	
		  	</aside>
			 
			 <main class="col-lg-8 col-md-8 col-sm-8 col-xs-8 row" style="padding: 0px; min-height: 1024px; <!--background-color: lightyellow;--> position: relative;" v-bind:style="{ backgroundColor: this.$store.state.activeColor, }">
			  	<router-view style=""></router-view>
			 </main>			 
		</div>
	</div>

</template>

<script>
// import axios from 'axios';
import HelloWorld from './components/HelloWorld'
import MyWebsitelogo from './components/my-website-logo'
import MyWebsitenav from './components/my-website-nav'
import MyWebsitemenu from './components/my-website-menu'
import MyWebsiteMenumain from './components/my-website-menu-main'
import MyWebsitenavmain from './components/my-website-nav-main'
import MyWebsitemaincase from './components/my-website-main-case'
import MyWebsitemainintroduction from './components/my-website-main-introduction'
import MyWebsitemainPorExpe from './components/my-website-main-ProExpe'

export default {
  name: 'App',
  
  components: { HelloWorld:HelloWorld, MyWebsitelogo:MyWebsitelogo, MyWebsitenav:MyWebsitenav, MyWebsitemenu:MyWebsitemenu, MyWebsiteMenumain:MyWebsiteMenumain, MyWebsitenavmain:MyWebsitenavmain, MyWebsitemaincase:MyWebsitemaincase, MyWebsitemainintroduction:MyWebsitemainintroduction,MyWebsitemainPorExpe}, 
  

  data: function () {
  return {
    clientHeight : document.documentElement.clientHeight,
    menu_state : this.$store.state.menu_state,
  	}
  },
	methods:{
		getData(){
				var that = this;
				// 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
				const path = 'http://127.0.0.1:5000/';
				let param = new URLSearchParams()
				param.append('username', 'admin')
				param.append('pwd', '123')
					this.$http({
                url: 'http://127.0.0.1:5000/',
                method:'post',
                //发送格式为json
								data:param,
								// headers:
								//        {
								// 				//  'Content-Type': 'application/json'
								// 				 'Content-Type': 'text/plain;charset=UTF-8'
								//        }
               }).then(function (response) {
								// 这里服务器返回的 response 为一个 json object，可通过如下方法需要转成 json 字符串
								// 可以直接通过 response.data 取key-value
								// 坑一：这里不能直接使用 this 指针，不然找不到对象
								// if(window.localStorage){
								// alert('This browser supports localStorage');
								// }else{
								// alert('This browser does NOT support localStorage');
								// }
								console.log("sucess")
								var msg = response.data[0].username;
								var msg_ = response.data[0].password;
								window.localStorage.token = response.data;
								// 坑二：这里直接按类型解析，若再通过 JSON.stringify(msg) 转，会得到带双引号的字串
								that.serverResponse = msg;
								console.log(window.localStorage.token);}).catch(function (error) {
														console.log(error);})
		},
			// 	this.$http.post(configIp.apiConfig.user.login, this.param). then(res => {
      //       if (res.data != null) {
      //         this.$Message.success('登陆成功');
      //         //全局存储token
      //         window.localStorage["token"] = JSON.stringify(res.data);
      //       } else {
      //         this.$Message.error('登录失败');
      //         this.forgetPassword = true;
      //       }
      //     }).catch(err => {
      //     console.log("登录失败");
      //   })
      // },

								// 这里服务器返回的 response 为一个 json object，可通过如下方法需要转成 json 字符串
								// 可以直接通过 response.data 取key-value
								// 坑一：这里不能直接使用 this 指针，不然找不到对象
								// if(window.localStorage){
								// alert('This browser supports localStorage');
								// }else{
								// alert('This browser does NOT support localStorage');
								// }


							// axios.get(path).then(function (response) {
							// 	// 这里服务器返回的 response 为一个 json object，可通过如下方法需要转成 json 字符串
							// 	// 可以直接通过 response.data 取key-value
							// 	// 坑一：这里不能直接使用 this 指针，不然找不到对象
							// 	var msg = response.data.msg;
							// 	// 坑二：这里直接按类型解析，若再通过 JSON.stringify(msg) 转，会得到带双引号的字串
							// 	that.serverResponse = msg;

							// 	console.log(response.data);
							// }).catch(function (error) {
							// 	alert(error);
							// })

		m_alert(width){
			console.log(width);
		},
		handleScroll () {
    	document.getElementById("aside").style.marginTop = $(window).scrollTop()+'px';
  },
	
	},
	
	mounted(){
		const that = this;
    document.getElementById("aside").style.height = `${document.documentElement.clientHeight}px`;
    document.getElementById("aside_main").style.height = document.getElementById("aside").clientHeight-25-document.getElementById("aside_nav").clientHeight+'px';
    window.onresize = function temp() {
        that.clientHeight = `${document.documentElement.clientHeight}px`;
        document.getElementById("aside").style.height = that.clientHeight;
        console.log(document.getElementById("aside").clientHeight-25-document.getElementById("aside_nav").clientHeight+'px');
        
        document.getElementById("aside_main").style.height = document.getElementById("aside").clientHeight-25-document.getElementById("aside_nav").clientHeight+'px';
    };
    window.addEventListener('scroll', that.handleScroll);
  },
	
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.fix-position{
	position: fixed;
}

.aside_main_visiblity{
	visibility: hidden;
}

.aside_main_display{
	display: none;
}

</style>
