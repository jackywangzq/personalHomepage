<template>
	<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-lg-offset-1  col-md-offset-1  col-sm-offset-1" >
			<!--<span class="glyphicon" v-bind:class="{'glyphicon glyphicon-menu-left': !back }" aria-hidden="true" @click="js_click($event)"></span>
			<h4>{{titleTemp}}</h4>
			<ul >
			  <li class="list-group-item" v-for="item,index in contentTemp" @click="js_click($event,index)">{{contentTemp[index]}}</li>
			  
			</ul>-->
		<el-row class="tac">
			    <h4 >{{titleTemp}}</h4>
			    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" v-for="item,index in contentTemp">
			      <el-submenu v-bind:index="index" >
			        <template slot="title" >
			          <i v-bind:class="icon[i][index]"></i>
			          <span @click="js_click($event,index)" style="font-size:16px">{{contentTemp[index]}}</span>
			        </template>
			      </el-submenu>
			    </el-menu>
		</el-row>
	</div>
</template>


<script>
	export default {
  	name: 'MyWebsitenavmain',
		data: function () {
		  return {
		    	content : [{title:"个人简介",subTitle:["基本资料","技术特长","工作经历","教育经历"]},{title:"项目经验",subTitle:["客户欠费预测系统","联通ERP系统设计与实现","流媒体视频质量监测平台设计与实现","3G终端及网络研究"]},{title:"甜品案例",subTitle:["token验证","websocket","Vue"]}],
		    	i : 0,
		    	titleTemp: "",
		    	contentTemp : [],
		    	back : true,
		    	icon : [["el-icon-tickets","el-icon-menu","el-icon-loading","el-icon-edit-outline"],["el-icon-star-on","el-icon-message","el-icon-picture-outline","el-icon-mobile-phone"],["el-icon-tickets","el-icon-star-on","el-icon-loading","el-icon-edit-outline"]]
		  	}
		},
		methods:{
			js_click(ev,index){
				if(ev.target.innerHTML === "基本资料"){
					this.$store.state.list_item = "基本资料";
//					console.log(this.$store.state.list_item);
				}
				else if(ev.target.innerHTML === "技术特长"){
					this.$store.state.list_item = "技术特长";
//					console.log(this.$store.state.list_item);
				}
				else if(ev.target.innerHTML === "工作经历"){
					this.$store.state.list_item = "工作经历";
//					console.log(this.$store.state.list_item);
				}
				else{
					this.$store.state.list_item = "教育经历";
//					console.log(this.$store.state.list_item);				
				}
			
			},
			ini(){
				this.$store.state.menu_state = 0;
				this.i = 0;
				this.titleTemp= this.content[this.i].title;
			    this.contentTemp = this.content[this.i].subTitle
			},
		},
		created: function(){
			this.ini();
		},
		computed: {
		    count() {
		        return this.$store.state.menu_state;
			  },
		},
		watch: {
		    count() {
		       	if(this.$store.state.menu_state == 0){
						this.i = 0;
						this.titleTemp= this.content[this.i].title;
						this.contentTemp = this.content[this.i].subTitle
					}
					else if(this.$store.state.menu_state == 1){
						this.i = 1;
						this.titleTemp = this.content[this.i].title;
						this.contentTemp = this.content[this.i].subTitle
					}
					else if(this.$store.state.menu_state == 2){
						this.i = 2;
						this.titleTemp= this.content[this.i].title;
						this.contentTemp = this.content[this.i].subTitle
					}		
		    }
		},
	}
</script>

<style>
	li{
		cursor:pointer; 
	}
</style>