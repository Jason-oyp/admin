import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import axios from 'axios';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/components/home/Home.vue')
      },
      {
        path: '/articlelist',
        component: () => import('@/components/articles/ArticleList.vue')
      },
      {
        path: '/addarticle',
        component: () => import('@/components/articles/AddArticle.vue')
      },
      {
        path: '/examine',
        component: () => import('@/components/examine/Examine.vue')
      }, {
        path: '/userlist',
        component: () => import('@/components/users/UserList.vue')
      }
    ]
  },
  {
    path: '/login',
    name: "login",
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach(async (to, from, next) => {//添加导航守卫
  if (to.path == '/login') {
    next();
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      const result = await axios.get('api/verify', {
        headers: {
          authorization: token
        },
        params: {
          isAdmin: true
        }
      }).then(res => res.data);
      if (result.message === "ok") {
        next();
        return;
      } else {
        Vue.prototype.$showMessage(result.message, 'error');
        setTimeout(() => {
          location.href = '/login'
        }, 1000);
      }
    }
    else {
      Vue.prototype.$showMessage('您还没有权限，请先登录', 'error');
      setTimeout(() => {
        location.href = '/login'
      }, 1000);
    }


  }

});

export default router
