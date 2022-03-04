import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App'
import router from './router'
import store from './store'
import i18n from '@/module/i18n'
import { sync } from 'vuex-router-sync'
import Chart from '@/module/ana-charts'
import formCreate from '@form-create/element-ui'

import '@/module/filter/formatDate'
import '@/module/filter/filterNull'

import themeData from '@/module/echarts/themeData.json'
import 'canvg/dist/browser/canvg.min.js'

import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import './sass/index.scss'
import 'remixicon/fonts/remixicon.css'

// Component internationalization
const useOpt = i18n.globalScope.LOCALE === 'en_US' ? { locale: locale } : {}

i18n.globalScope.LOCALE === 'en_US' ? Vue.use(ElementUI, { locale }) : Vue.use(ElementUI)

Vue.use(useOpt)
Vue.use(formCreate)

sync(store, router)

Vue.config.devtools = true
Vue.config.productionTip = true
Vue.config.silent = true

Chart.config({
  theme: {
    name: 'themeName',
    data: themeData,
    default: true,
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
  methods: {
    initApp() {
      i18n.init()
    },
  },
  created() {
    this.initApp()
  },
})
