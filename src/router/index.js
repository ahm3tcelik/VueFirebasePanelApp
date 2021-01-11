import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';
import Login from '../views/Login';

import Dashboard from '../views/admin/Dashboard';
import Categories from '../views/admin/Categories';
import Sounds from '../views/admin/Sounds';

Vue.use(VueRouter)

const routes = [
  {
    // Login Page
    path: '/',
    component: Login
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminHome.vue'),
    children: [
      { path: '', component: Dashboard },
      { path: 'sounds', component: Sounds },
      { path: 'categories', component: Categories },
    ],
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!(firebase.auth().currentUser)) {
      next({name: '/'});
    } 
    else {
      next();
    }
  }
  else if(to.path == '/') {
    if(firebase.auth().currentUser) {
      next({path: '/admin'});
    }
    else {
      next();
    }
  }
  else {
    next();
  }
});

export default router
