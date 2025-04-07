import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import MainLayout from "@/components/sidenav/MainLayout.vue"; // 导入主布局组件

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  // 使用MainLayout作为需要侧边栏的页面的父布局
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true }, // 整个布局需要认证
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/index/index.vue"),
        meta: { title: "首页" }, // 添加页面标题，会显示在顶部栏
      },
      {
        path: "/shop/store_category/list",
        name: "store_type",
        component: () => import("@/views/shop/store/store_category_manage.vue"),
        meta: { title: "门店分类" },
      },
      {
        path: "/shop/store/list",
        name: "store_list",
        component: () => import("@/views/shop/store/store_manage.vue"),
        meta: { title: "门店列表" },
      },
      {
        path: "/shop/store/add",
        name: "store_add",
        component: () => import("@/views/shop/store/store_add.vue"),
        meta: { title: "门店新增" },
      },

      {
        path: "/shop/products/categories",
        name: "shop_type",
        component: () =>
          import("@/views/shop/merchandise/shop_product_type.vue"),
        meta: { title: "商品分类" },
      },
      {
        path: "/shop/products/categories/add",
        name: "shop_type_add",
        component: () =>
          import("@/views/shop/merchandise/shop_product_type_add.vue"),
        meta: { title: "商品分类添加" },
      },
      {
        path: "/shop/products/list",
        name: "shop_product_list",
        component: () => import("@/views/shop/merchandise/product_list.vue"),
        meta: { title: "商品列表" },
      },
      {
        path: "/shop/products/add",
        name: "shop_product_add",
        component: () => import("@/views/shop/merchandise/product_add.vue"),
        meta: { title: "商品列表新增" },
      },
      {
        path: "/shop/products/specification_size",
        name: "specification_size",
        component: () =>
          import("@/views/shop/merchandise/specification_size.vue"),
        meta: { title: "规格尺寸" },
      },
      {
        path: "/orders/list",
        name: "order_list",
        component: () => import("@/views/order/image_orders.vue"),
        meta: { title: "订单列表" },
      },
      {
        path: "/orders/detail",
        name: "order_detail",
        component: () => import("@/views/order/order_detail.vue"),
        meta: { title: "订单详情" },
      },
      // 在这里添加其他需要使用侧边栏布局的路由 /orders/return-reasons
      {
        path: "/orders/settings",
        name: "order_settings",
        component: () => import("@/views/order/order_setting.vue"),
        meta: { title: "订单配置" },
      },
      {
        path: "/orders/return-reasons",
        name: "return-reasons",
        component: () => import("@/views/order/return_reason.vue"),
        meta: { title: "订单退货原因" },
      },
      {
        path: "/distribution/user_list",
        name: "distribution_user_list",
        component: () =>
          import("@/views/distribution/distribution_user_liist.vue"),
        meta: { title: "分销用户列表" },
      },
      {
        path: "/distribution/user/detail/:id",
        name: "distribution_user_detail",
        component: () =>
          import("@/views/distribution/distribution_user_detail.vue"),
        meta: { title: "分销用户详情" },
        props: true, // 将路由参数作为组件属性传递
      },
      // 在MainLayout的children数组中添加
      {
        path: "/distribution/levels",
        name: "distribution_levels",
        component: () =>
          import("@/views/distribution/distribution_level_setting.vue"),
        meta: { title: "分销等级设置" },
      },
      // 在MainLayout的children数组中添加
      {
        path: '/distribution/config',
        name: 'distribution_config',
        component: () => import('@/views/distribution/distribution_config.vue'),
        meta: { title: '分销配置' }
      },
      {
        path: '/distribution/income',
        name: 'distribution_income',
        component: () => import('@/views/distribution/distribution_income.vue'),
        meta: { title: '分销收入记录' }
      },
      {
        path: '/permissions/staff',
        name: 'user_staff',
        component: () => import('@/views/permissions/staff.vue'),
        meta: { title: '员工管理' }
      },
      {
        path: '/permissions/users',
        name: 'shop_user_management',
        component: () => import('@/views/permissions/shop_user_management.vue'),
        meta: { title: '商城用户管理' }
      },
      {
        path: '/permissions/users_address',
        name: 'shop_user_address',
        component: () => import('@/views/permissions/shop_user_address.vue'),
        meta: { title: '商城用户地址管理' }
      },
      {
        path: '/employee/namecards',
        name: 'employee_namecards',
        component: () => import('@/views/employee/employee_namecard_manage.vue'),
        meta: { title: '员工名片管理' }
      }
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录 - 检查token和登录状态
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLogin") === "true" && token;

  // 如果路由需要认证且用户未登录
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    // 重定向到登录页面，并保存原本要访问的路由
    next({
      name: "Login",
      query: { redirect: to.fullPath }, // 可选：保存原本要去的页面路径
    });
  } else {
    // 如果用户已登录且尝试访问登录页面，则重定向到首页
    if (to.name === "Login" && isLoggedIn) {
      next({ name: "Home" });
    } else {
      // 继续导航
      next();
    }
  }
});

export default router;
