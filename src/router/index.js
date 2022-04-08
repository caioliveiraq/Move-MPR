import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Users from '../views/modules/users/Users.vue'
import FormStructure from '../views/modules/structure/FormStructure.vue'
import GridStructure from '../views/modules/structure/GridStructure.vue'
import FormOrder from '../views/modules/order/FormOrder.vue'
import GridOrder from '../views/modules/order/GridOrder.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    auth: true
  },
  {
    path: '/gridstructure',
    name: 'GridStructure',
    component: GridStructure,
    auth: true
  },
  {
    path: '/formstructure/:id?',
    name: 'FormStructure',
    component: FormStructure,
    auth: true
  },
  {
    path: '/formorder/:id?/:subid?',
    name: 'FormOrder',
    component: FormOrder,
    auth: true
  },
  {
    path: '/gridorder',
    name: 'GridOrder',
    component: GridOrder,
    auth: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
