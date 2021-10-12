import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/rights/Rights'
import Roles from '../components/rights/Roles'
import Category from '../components/goods/Category'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Category
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: List,
        },
        {
          path: '/goods/add',
          component: Add,
        },
        {
          path: '/orders',
          component: Order,
        }

      ]
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const tokenSrt = localStorage.getItem('token')
  if (!tokenSrt) return next('/login')
  next()
})

export default router
