import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import UserList from '../pages/UserList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/About.vue')
  }, 
  {
    path: '/user',
    name: 'user',
    // This route will load the UserApp remote module
    component: UserList
  },
  {
    path: '/edit-user/:id',
    name: 'edit-user',
    // This route will load the EditUserApp remote module
    component: () => import(/* webpackChunkName: "edit-user" */ '../pages/EditUser.vue')
  },
  {
    path: '/add-user',
    name: 'add-user',
    // This route will load the EditUserApp remote module
    component: () => import(/* webpackChunkName: "add-user" */ '../pages/AddUser.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
