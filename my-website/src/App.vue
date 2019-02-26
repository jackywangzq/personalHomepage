<template>

  <div id="app" class="container-fluid" style="margin-top: 0px; padding: 0px;">
  	<div class="row" >
			  
			  <aside id="aside" class="col-lg-4 col-md-4 col-sm-4 col-xs-4 " style="background-color: white; font-size: 16px; padding-top: 25px; " >		  
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
