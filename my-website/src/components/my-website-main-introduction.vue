<template>
	<div  class="col-lg-8 col-md-8 col-lg-offset-2" style="background-color: lightyellow; ">
		</br>
        <h4 style="margin: 0px; padding-top: 30px;">基本资料</h4>
        <br />
        <table class="table table-striped table-bordered" style="margin-bottom: 0px; padding-bottom: 0px;">
        	<tbody >
        		<tr class="row" style="background-color: white;"><th class="col-lg-2">姓名</th><td class="col-lg-4">王子奇</td><th class="col-lg-2">性别</th><td class="col-lg-4">男</td></tr>
        		<tr class="row" ><th class="col-lg-2">年龄</th><td class="col-lg-4">33</td><th class="col-lg-2">婚姻状况</th><td class="col-lg-4">未婚</td></tr>
        		<tr class="row" style="background-color: white;"><th class="col-lg-2">电话</th><td class="col-lg-4">18601052688</td><th class="col-lg-2">邮箱</th><td class="col-lg-4">jackywangzq@gmail.com</td></tr>
        		<tr class="row" ><th class="col-lg-2">学历</th><td class="col-lg-4">本科</td><th class="col-lg-2">状态</th><td class="col-lg-4">在职</td></tr>
        		<tr class="row" style="background-color: white;"><th class="col-lg-2">职位</th><td class="col-lg-4">开发负责人</td><th class="col-lg-2">公司</th><td class="col-lg-4">联通研究院</td></tr>
        	</tbody>    	
        </table>
    	 <table class="table  table-bordered">   	
        	<tbody>
        		<tr class="row" ><th class="col-lg-2">学校</th><td class="col-lg-5">北京邮电大学</td><td class="col-lg-5">英国玛丽女王学院</td></tr>
        	</tbody>
        </table>
        <br /> <br /> <br />
        <h4 style="margin: 0px; padding-top: 30px;">技术特长</h4>
        <br />
        <ul class="list-group" id="tech">
		  <li class="list-group-item">扎实的Html+Css+JavaScrip基本功</li>
		  <li class="list-group-item" >精通BootStrap+Vue+Vuex+VueRouter，具备独立构建SPA及开发组件的能力</li>
		  <li class="list-group-item">掌握ES6、LESS语言，熟练使用NPM/Webpcack/Babel/VueCLI等工程化工具</li>
		  <li class="list-group-item" >掌握Python+Flask编程能力，具备搭建Web服务器及开发基本后台处理程序的能力</li>
		  <li class="list-group-item">掌握网络、安全相关知识</li>
		  <li class="list-group-item" > 优秀的技术文档读写和沟通表达能力，擅于快速阅读英文技术文档</li>
		</ul>
 		<br /> <br /> <br />
        <h4 style="margin: 0px; padding-top: 30px;">工作经历</h4>
        <br />
        <ul class="list-group" id="tech">
		  <li class="list-group-item">2014-2018，前端设计与开发</li>
		  <li class="list-group-item" >2010-2013，流媒体业务研究与实现</li>
		  <li class="list-group-item" > 2008-2010，终端与网络的研究与测试</li>
		</ul>
		
		<br /> <br /> <br />
        <h4 style="margin: 0px; padding-top: 30px;">教育经历</h4>
        <br />
        <ul class="list-group" id="edu">
		  <li class="list-group-item" >2009-2014，北京邮电大学，电信工程专业，工程硕士学位</li>
		  <li class="list-group-item" >2004-2008，北京邮电大学/伦敦玛丽女王学院，电信工程专业，工学学士双学位</li>
		</ul>
	</div>
	
</template>

<script>
	export default {
  		name: 'MyWebsitemainintroduction',
		data: function () {
		  return {
		    	i : 0,
		  	}
		},
		methods:{
			n_console(){
			console.log("123");
			}
		},
		computed: {
/*		    count() {
		        return this.$store.state.menu_state;
			  },*/
			para(){
				return this.$store.state.list_item;
			}
		},
		watch: {
		   /* count() {
		       	if(this.$store.state.menu_state == 0){
						this.i = 0;
						console.log(this.content[this.i].title);
					
					}
					else if(this.$store.state.menu_state == 1){
						this.i = 1;
						console.log(this.content[this.i].title);
						
					}
					else if(this.$store.state.menu_state == 2){
						this.i = 2;
						console.log(this.content[this.i].title);
					}		
					else if(this.$store.state.menu_state == 3){
						this.i = 3;
						console.log(this.content[this.i].title);
					}		
					else if(this.$store.state.menu_state == 4){
						this.i = 4;
						console.log(this.content[this.i].title);
					}		
					else if(this.$store.state.menu_state == 5){
						this.i = 5;
						console.log(this.content[this.i].title);
					}		
		    },*/
		    para(){
		    	console.log(this.$store.state.list_item+"123");
		    }
		},
	}
</script>

<style>
	#tech li:nth-child(even){
		background: lightyellow;
	}
</style>