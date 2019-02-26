<template>
	<div class="col-lg-1 col-md-1 text-right" style="padding: 0px;" @click="js_click()">
		<!--<svg width="100%" height="100%" version="1.1" xmlns="../assets/logo.png">-->
		<!--<a href="#" ><img src="../assets/logo.png" style="width: 30px; height: 30px; overflow: hidden;"  /></a>-->
		<router-link class="nav" v-bind:to="url" tag="li" style="Helvetica Neue"><img src="../assets/logo.png" style="width: 30px; height: 30px; overflow: hidden;"  /></router-link>
	</div>
</template>

<script>
	export default {
  		name: 'MyWebsitelogo',
		data: function () {
		  return {
		    url :  "/MyWebsitemainintroduction"
		  	}
		},
		methods:{
		js_click(){
				this.$store.state.data_ = false;
				this.$store.state.menu_state = 0;
				console.log(123);
			}
		},
	}
</script>

<style>
</style>