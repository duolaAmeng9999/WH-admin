import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 常量路由, 拥护都可以访问的资源
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },


]

/* 
    异步路由：
        - 就是用户可能拥有他其中的一部分路由对象, 他是异步生成的, 是动态的
        - 将异步路由与后台返回的 routes 进行对比, 已确定显示那些路由
     
    资源分配：
        - 想要进行资源分配的前提为有静态资源; 并且需要现有资源进行合理分配, 他是静态的资源
        - 静态资源想要灵活运用; 指的是将产品分给 张三, 权限分配给 李四, 订单人给 王五......
        - 对资源分配是无法超出现已有的固有资源, 如果想要分配更多的资源, 那么就需要探索开发新的资源
*/
export const allAsyncRoutes = [

  // 商品管理模块
  {
    name: "Product",
    path: "/product",
    component: Layout,
    redirect: '/product/girlfriend/Liuwenjing',
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    children: [
      {
        name: "Liuwenjing",
        path: "girlfriend/Liuwenjing",
        component: () => import('@/views/product/girlfriend/Liuwenjing'),
        meta: { title: 'My Girlfriend' }
      },
      {
        name: "Category",
        path: "category/Category",
        component: () => import('@/views/product/category/Category'),
        meta: { title: '商品分类' }

      },

      {
        name: "Trademark",
        path: "trademark/Trademark",
        component: () => import('@/views/product/trademark/Trademark'),
        meta: { title: '品牌管理' }
      },
      {
        name: "Attr",
        path: "attr/Attr",
        component: () => import('@/views/product/attr/Attr'),
        meta: { title: '属性管理' }
      },
      {
        name: "Sku",
        path: "sku/Sku",
        component: () => import('@/views/product/sku/Sku'),
        meta: { title: 'SKU' }
      },
      {
        name: "Spu",
        path: "spu/Spu",
        component: () => import('@/views/product/spu/Spu'),
        meta: { title: 'SPU' }
      }
    ]


  },

  // access control list
  //权限管理路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理'
        }
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理'
        }
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权'
        },
        hidden: true
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理'
        }
      }
    ]
  }

]

// 创建任意路由
// 404 page must be placed at the end !!!

export const anyRoute = { path: '*', redirect: '/404', hidden: true }


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
