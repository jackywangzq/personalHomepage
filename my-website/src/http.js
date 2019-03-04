import axios from 'axios';
import router from './router';

// axios 配置
axios.defaults.timeout = 3000;
axios.defaults.baseURL = 'http://127.0.0.1:5000/';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    localStorage.setItem("token","234");
    if (localStorage.token) { //判断token是否存在
      config.headers.Authorization = localStorage.token;  //将token设置成请求头
      console.log(1234);
      return config;
    }
    else{
      console.log("error")
    }
    
  },
  // err => {
  //   return Promise.reject(err);
  // }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    console.log(response.data);
    if (response.data === 999) {
      router.replace('/');
      console.log("token过期");
    }
    return response;
  },
  error => {
    console.log("error")
    return Promise.reject(error);
  }
);
export default axios;
