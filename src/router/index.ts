import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/homePage/HomePage.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/News.vue')
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetail.vue')
  },
  {
    path: '/job',
    name: 'Job',
    component: () => import('@/views/Job.vue')
  },
  {
    path: '/business_district_alliance',
    name: 'business_district_alliance',
    component: () => import('@/views/classic_case/BusinessDistrictAlliance.vue')
  },
  {
    path: '/classic_case',
    name: 'classic_case',
    component: () => import('@/views/classic_case/ClassocCase.vue')
  },
  {
    path: '/productCase',
    name: 'productCase',
    component: () => import('@/views/ProductDisplay/components/productCase.vue')
  },
  {
    path: '/productCaseTwo',
    name: 'productCaseTwo',
    component: () => import('@/views/ProductDisplay/components/productCaseTwo.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/views/Product.vue')
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: () => import('@/views/JobDetail.vue')
  },
  {
    path: '/system_dev',
    name: 'system_dev',
    component: () => import('@/views/mange_system/SystemDev.vue')

  },
  {
    path: '/warehouse_system',
    name: 'warehouse_system',
    component: () => import('@/views/mange_system/MangeSys.vue')
  },
  {
    path: '/mini_program_dev',
    name: 'mini_program_dev',
    component: () => import('@/views/mini_program_development/min_pro.vue')
  },
  {
    path: '/classic_case',
    name: 'classic_case',
    component: () => import('@/views/classic_case/ClassocCase.vue')
  },
  {
    path: '/mini_mange',
    name: 'mini_mange',
    component: () => import('@/views/mini_program_development/mini_mang.vue')
  },
  {
    path: '/web_render',
    name: 'web_render',
    component: () => import('@/views/classic_case/web_render.vue')
  },
  {
    path: '/app_shop',
    name: 'app_shop',
    component: () => import('@/views/mini_program_development/mini_shop.vue')
  },
  {
    path: '/app_bee',
    name: 'app_bee',
    component: () => import('@/views/mini_program_development/mini_bee.vue')
  },
  {
    path: '/app_noodle_shop',
    name: 'app_noodle_shop',
    component: () => import('@/views/mini_program_development/mini_noodle_shop.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
