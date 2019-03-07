<template>

  <div id="app" class="container-fluid" style="margin-top: 0px; padding: 0px;">
		<Hello></Hello> 
  	<div class="row" v-bind:class="{ 'aside_main_display' : !this.$store.state.login}" >
			  <aside id="aside" class="col-lg-4 col-md-4 col-sm-4 col-xs-4 " style="background-color: white; font-size: 16px; padding-top: 25px; " >
			  	<div id="aside_nav" class="row" >
		  			<MyWebsitenav v-bind:class="{ 'aside_main_visiblity' : this.$store.state.data_ }" > </MyWebsiteNav>
		  			<MyWebsitemenu> </MyWebsiteMenu>
			  	</div>
					<div id="aside_main" class="row" style="position: relative;" >		
								<MyWebsitenavmain v-bind:class="{ 'aside_main_display' : this.$store.state.data_ }" style="position: absolute; padding-top:25%"></MyWebsitenavmain>
								<MyWebsiteMenumain v-bind:class="{ 'aside_main_display' : !this.$store.state.data_ }" style="position: absolute; padding-top:25%"></MyWebsiteMenumain>	
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
import Hello from './components/Hello'
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
  
  components: { Hello:Hello, HelloWorld:HelloWorld, MyWebsitelogo:MyWebsitelogo, MyWebsitenav:MyWebsitenav, MyWebsitemenu:MyWebsitemenu, MyWebsiteMenumain:MyWebsiteMenumain, MyWebsitenavmain:MyWebsitenavmain, MyWebsitemaincase:MyWebsitemaincase, MyWebsitemainintroduction:MyWebsitemainintroduction,MyWebsitemainPorExpe}, 
  

  data: function () {
  return {
    clientHeight : document.documentElement.clientHeight,
		menu_state : this.$store.state.menu_state,
		username : 12,
		login : this.$store.state.login,
  	}
	},
	
	methods:{
		handleScroll () {
    	document.getElementById("aside").style.marginTop = $(window).scrollTop()+'px';
		},

		getRem(pwidth,prem){
			var html = document.getElementsByTagName("html")[0];
			var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
			html.style.fontSize = oWidth/pwidth*prem + "px";
			console.log(document.body.clientWidth || document.documentElement.clientWidth);
			console.log(html.style.fontSize);
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
				that.getRem(750,75);
    };
		window.addEventListener('scroll', that.handleScroll);
		window.onload = function(){
			that.getRem(1000,100)
		};
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
