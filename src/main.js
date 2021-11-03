import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 注册全局接口
import * as API from "@/api/index";

// 注册全局组件
import CategorySelector from "@/components/CategorySelector"
Vue.component("CategorySelector", CategorySelector)
import HintButton from "@/components/HintButton"
Vue.component("HintButton", HintButton)
import SpuForm from "@/components/SpuForm"
Vue.component("SpuForm", SpuForm)
import SkuForm from "@/components/SkuForm"
Vue.component("SkuForm", SkuForm)

// 引入全局按钮权限函数
import { hasBtnPermmission } from '@/utils/permission'


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)


Vue.config.productionTip = false
// 注册全局统一接口
Vue.prototype.$API = API;
// 注册全局按钮权限函数
Vue.prototype.$hasBtn = hasBtnPermmission;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
