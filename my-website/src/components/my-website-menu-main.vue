<template>
	<div class="col-lg-6 col-md-6 col-sm-6 col-lg-offset-3  col-md-offset-3  col-sm-offset-3 " >
		<img src="../../build/logo.png"/>
	</div>
	
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