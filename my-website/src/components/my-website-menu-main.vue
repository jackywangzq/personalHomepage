<template>
<!--	<div class="row">
		<h4 class="col-lg-10 col-md-10 col-sm-10 col-xs-10  text-center" @click="js_click($event,index)"  v-for="(item, index) in data_content"><router-link  v-bind:to= "data_url[index]" tag="li">{{data_content[index]}}</router-link></h4>
	</div>
	-->
	
	<img src="../../build/logo.png"/>
</template>

<script>
	export default {
  		name: 'MyWebsiteaMenumain',
  		data: function () {
		  return {
		    	data_ : this.$store.state.data_,
		    	menu_state : this.$store.state.menu_state,
		  	}
		},
		methods:{
					},
	}
	
</script>

<style>

</style>