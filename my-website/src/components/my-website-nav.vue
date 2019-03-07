<template>
	<div class="col-lg-7 col-md-7  col-sm-7 col-lg-offset-1  col-md-offset-1  col-sm-offset-1 "  >
		<ul class="list-inline">
		  <!--<li v-for="(item, index) in data_content" @click="js_click($event,index)">{{data_content[index]}}</li>-->
		 
		   <li v-for="(item, index) in data_content" @click="js_click($event,index)"> <router-link class="nav" v-bind:to= "data_url[index]" tag="li" style="font-size:0.1rem">{{data_content[index]}}</router-link></li>
		</ul>
	</div>
</template>


<script>
	export default {
  		name: 'MyWebsitenav',
		data: function () {
		  return {
		    	data_content : ["个人简介","项目经验","甜品案例"],
		    	data_url : ["/MyWebsitemainintroduction","/MyWebsitemainproexpe","/MyWebsitemaincase"],
		  	}
		}, 
		methods:{
			js_click(ev,index){
				this.$store.state.data_1 = false;
				this.$store.state.data_2 = true;
				this.$store.state.data_3 = true;
				
					if(index == 0){
						this.$store.state.menu_state = 0;
						this.$store.state.activeColor = "lightyellow";
						
					}					
					else if(index == 1){
						this.$store.state.menu_state = 1;
						this.$store.state.activeColor = "gainsboro";
						
					}
					else{
						this.$store.state.menu_state = 2;
						this.$store.state.activeColor = "#b38977";
						
					}
			},
		},
	}
</script>

<style>
	li{
		cursor:pointer; 
	};
	a{
		color: red;
		font: 30px;
	}
</style>