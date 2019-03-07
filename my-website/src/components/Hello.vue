<template>
	<div style="width:500px;height:500px;left:50%;top:50%;position:absolute;transform: translate(-50%, -50%);" v-bind:class="{ 'aside_main_display' : this.$store.state.login }">
			<el-input id="username" v-model:value="username"></el-input>
			<el-button @click="getData()" style="font-size:0.1rem">登陆</el-button>
	</div>
</template>

<script>
	export default {
		name: 'Hello',
		methods:{
			getData(){
				console.log(this.username);
				var that = this;
				// 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
				const path = 'http://127.0.0.1:5000/';
				let param = new URLSearchParams()
				param.append('username', this.username)
				// param.append('pwd', this.username)
				this.$http({
                url: path,
                method:'post',
				data:param,
               }).then(function (response) {
						console.log(response.data.status);
						console.log(response.data.token);
						if(response.data.status == 1){
							that.$store.state.login = true;
						}
						else{
							that.$store.state.login = false;
						}
						window.localStorage.token = response.data.token;
						console.log(window.localStorage.token);}).catch(function (error) {console.log(error);})
			},
		}
	}
</script>


<style>
</style>