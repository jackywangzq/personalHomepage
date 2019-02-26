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
      component: MyWebsitemaincase
    },
    {
    	path: '/MyWebsitemainintroduction',
      name: 'MyWebsitemainintroduction',
      component: MyWebsitemainintroduction
    },
    {
    	path: '/MyWebsitemainproexpe',
      name: 'MyWebsitemainproexpe',
      component: MyWebsitemainproexpe
    },
  ]
})
