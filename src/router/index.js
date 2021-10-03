import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {},
    {}
  ]
})
=======
import Login from '../components/Login'
import Home from '../components/Home'

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
      component: Home
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
>>>>>>> login
