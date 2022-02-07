import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Login from '@/pages/login'
import Demo from '@/pages/demo'
import Index2 from '@/pages/index2'
import Role from '@/pages/role'
import NoPermission from '@/pages/nopermission'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/login"
    },
    {
      path: "/index",
      name: "index",
      component: Index,
      // meta: {
      //   title: "作业平台"
      // }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/demo",
      name: "demo",
      component: Demo
    },
    {
      path: "/index2",
      name: "index2",
      component: Index2
    },
    {
      path: "/role",
      name: "role",
      component: Role
    },
    {
      path: "/nopermission",
      name: "/nopermission",
      component: NoPermission
    },
  ]
})
