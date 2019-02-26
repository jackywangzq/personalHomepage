<template>
	<div class="col-lg-3 col-md-3">
	<!--	<span class="glyphicon" v-bind:class="{ 'glyphicon-remove' : this.$store.state.data_, 'glyphicon-menu-hamburger': !this.$store.state.data_}" aria-hidden="true" @click="js_click()"><em>it’s me</em></span>-->
		<span class="glyphicon" aria-hidden="true" @click="js_click()"><em>it’s me</em></span>
	</div>
</template>

<script>
	export default {
  		name: 'MyWebsitemenu',
		data: function () {
		  return {
		    	status : true,
		    	data_ : this.$store.state.data_,
		    	
		  	}
		},
		methods:{
			js_click(){
				this.$store.state.data_ = !this.$store.state.data_;
				
			}
		},
	}
</script>
	
<style>
	span{
		cursor: pointer;
	}
</style>