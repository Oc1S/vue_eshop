import Vue from 'vue'
import VueRouter from 'vue-router'
//路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/Roles')

const Category = () => import(/* webpackChunkName: "Category_Params" */ '../components/goods/Category')
const Params = () => import(/* webpackChunkName: "Category_Params" */ '../components/goods/Params')

const List = () => import(/* webpackChunkName: "List_Add" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "List_Add" */ '../components/goods/Add')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report')

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
        },
        {
          path: '/reports',
          component: Report,
        }

      ]
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenSrt = localStorage.getItem('token')
  if (!tokenSrt) return next('/login')
  next()
})

export default router
