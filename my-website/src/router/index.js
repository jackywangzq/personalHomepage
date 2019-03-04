import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Hello from '@/components/Hello'
import MyWebsitemaincase from '@/components/my-website-main-case'
import MyWebsitemainintroduction from '@/components/my-website-main-introduction'
import MyWebsitemainproexpe from '@/components/my-website-main-ProExpe'

Vue.use(Router)

export default new Router({
	mode:'history',
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
    	path: '/Hello',
      name: 'Hello',
      component: Hello
    },
    {
    	path: '/MyWebsitemaincase',
      name: 'MyWebsitemaincase',
      meta: {
        requireAuth: true,  // 该路由项需要权限校验
      },
      component: MyWebsitemaincase
    },
    {
    	path: '/MyWebsitemainintroduction',
      name: 'MyWebsitemainintroduction',
      meta: {
        requireAuth: true,  // 该路由项需要权限校验
      },
      component: MyWebsitemainintroduction
    },
    {
    	path: '/MyWebsitemainproexpe',
      name: 'MyWebsitemainproexpe',
      component: MyWebsitemainproexpe
    },
  ]
})
