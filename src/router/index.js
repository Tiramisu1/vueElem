import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import notFound from '../view/404.vue'
import Goods from '../view/goods.vue'
import Seller from '../view/seller.vue'
import Ratings from '../view/ratings.vue'

Vue.use(Router)

const router = new Router ({
  mode: 'history',  //history模式,去掉路由后面的‘#’号
  linkActiveClass: 'is-active',  //跳转动画
  routes: [
    {
      path: '/',   //根路径 
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/404',
      name: '404',
      component: notFound
    },
    {
      path: '/goods',
      name: '商品',
      component: Goods
    },
    {
      path: '/seller',
      name: '评价',
      component: Seller
    },
    {
      path: '/ratings',
      name: '商家',
      component: Ratings
    },
    {
      path: '*',
      component: notFound
      // 重定向
      // redirect: '/home' 或 redirect: {path: '/home'} 或 redirect: {name: '/home'}
      // 动态重定向
      // redirect: (to) => {
      //   // console.log(to)    //访问路由的路由信息
      //   if (to.path === '/123'){
      //     return {path: '/'}
      //   }else{
      //     return {path: '/404'}
      //   }
      // }
    }
  ]
})
// router.beforeEach((to, from, next) => {  
//   console.log(to)
//   next()
// })

// router.afterEach((to, from) => {

// })

export default router;