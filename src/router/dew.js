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
/*
  常量路由：任意的用户都将会拥有的路由对象，并且这些用户都可以操作这些路由对象
*/
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
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }

  // 404 page must be placed at the end !!!
]

/*
异步路由：就是用户可能拥有它其中的一部分路由对象，它是异步生成的，是动态的。所以它将会与后台返回的routes进行对比，以确定哪些路由到底显示与不显示

已经开采的矿

想要进行资源的分配，前提是有资源，并且根据现有的资源进行的是合理分配，所谓的allAsyncRoutes其实是一个静态资源路由，它是“死”的
“死”的资源想要灵活用，指的是产品我想分配给“张三”，权限分配给“李四”，订单分配给“王五”...
对资源的分配是无法超出现在已经固有的资源，如果想要更多的资源分配，那么就需要探索开采新的资源
*/
export const allAsyncRoutes = [
  /* 商品管理 */
  {
    name: 'Product',
    path: '/product',
    component: Layout,
    redirect: '/product/girlfriend/Liuwenjing',
    meta: {
      title: '商品管理',
      icon: 'el-icon-s-shop'
    },
    children: [
      {
        name: "Liuwenjing",
        path: "girlfriend/Liuwenjing",
        component: () => import('@/views/product/girlfriend/Liuwenjing'),
        meta: { title: 'My Girlfriend' }
      },
      {
        name: 'Category',
        path: 'category/Category',
        component: () => import('@/views/product/category/Category'),
        meta: {
          title: '商品分类'
        }
      },
      {
        name: 'Trademark',
        path: 'trademark/Trademark',
        component: () => import('@/views/product/trademark/Trademark'),
        meta: {
          title: '品牌管理'
        }
      },
      {
        name: 'Attr',
        path: 'attr/Attr',
        component: () => import('@/views/product/attr/Attr'),
        meta: {
          title: '属性管理'
        }
      },
      {
        name: 'Spu',
        path: 'spu/Spu',
        component: () => import('@/views/product/spu/Spu'),
        meta: {
          title: 'SPU管理'
        }
      },
      {
        name: 'Sku',
        path: 'sku/Sku',
        component: () => import('@/views/product/sku/Sku'),
        meta: {
          title: 'SKU管理'
        }
      }
    ]
  },
  // 权限管理
  // access control list
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

/*
任意路由：任意路由也应该是每个用户都拥有的，并且它应该是放在所有路由的最后面，目前的类型是对象
*/
export const anyRoute = { path: '*', redirect: '/404', hidden: true }

// 创建路由器
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes // 只用了常量路由
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
