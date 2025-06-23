import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'

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
    path: '/users',
    name: 'users',
    // This route will load the UserApp remote module
    component: () => import(/* webpackChunkName: "users" */ '../pages/UserList.vue').catch(err => {
      console.error("Failed to load userAppVue3/UserList:", err);
      return { render: h => h('div', 'Error loading User List App.') };
    }),

  },
  {
    path: '/edit-user/:id',
    name: 'edit-user',
    // This route will load the EditUserApp remote module
    component: () => import(/* webpackChunkName: "edit-user" */ '../pages/EditUser.vue'),
    props: (route) => ({ id: Number(route.params.id) || null })
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
