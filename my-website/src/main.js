// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import http from './http';  //此处问http文件的路径

Vue.prototype.$http = http;
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
    	data_ : false,
    	data_1 : false,
    	data_2 : true,
    	data_3 : true,
    	menu_state : 0,
    	list_item : '',
    	activeColor : 'lightyellow',
    }
    
});



new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,

})

