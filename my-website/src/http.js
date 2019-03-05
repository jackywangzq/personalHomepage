import axios from 'axios';
import router from './router';

// axios 配置
axios.defaults.timeout = 3000;
axios.defaults.baseURL = 'http://127.0.0.1:5000/';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.token) { //判断token是否存在
      config.headers.Authorization = localStorage.token;  //将token设置成请求头
      console.log("token存在");
    }
    console.log("token不存在");
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data === 999) {
      router.replace({ //跳转到登录页面
        path: '/HelloWorld',
        query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
      console.log("token过期");
    }
    else{
      console.log("token正常");
      return response;
    }
  },
error => {
  return Promise.reject(error);
}
);
export default axios;
