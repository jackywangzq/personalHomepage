// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import http from './http';  //此处问http文件的路径


Vue.prototype.$http = http;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Vuex);

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (!localStorage.token) {  // 获取当前的token是否存在
      console.log("token存在");
      next();
    } else {
        console.log("token不存在");
        next({
        path:　'/HelloWorld'
        // query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
    }
  }
  else { // 如果不需要权限校验，直接进入路由界面
      next();
  }
});


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
  components: { App},
  template: '<App/>',
  store,
})

