// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import VueI18n from 'vue-i18n'
import MavonEditor from 'mavon-editor'
import VueFlatPickr from 'vue-flatpickr-component'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import axios from 'axios'
import store from 'store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'shards-ui/dist/css/shards.css'
import './assets/styles.css'

import 'animate.css'

import 'mavon-editor/dist/css/index.css'

import locales from './locales'

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(MavonEditor)
Vue.use(VueFlatPickr)

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: process.env.LOCALE,
  messages: locales
})

Vue.mixin({
  methods: {
    $checkValidity (fieldName, e) {
      if (e instanceof InputEvent) {
        this.$nextTick(() => {
          this.$set(this.$validity, fieldName, e.srcElement.checkValidity())
        })
      }
    },
    $clearValidity () {
      this.$validity = {}
    }
  },
  created () {
    const axiosInstance = axios.create({
      baseURL: process.env.BASE_URL
    })
    axiosInstance.interceptors.request.use(cfg => {
      cfg.headers.Authorization = `Bearer ${store.get('elf:token')}`
      return cfg
    }, err => Promise.reject(err))
    axiosInstance.interceptors.response.use(res => res, err => {
      let msg = err.response.data && err.response.data.message
        ? err.response.data.message : 'Unknown error'
      this.$bvToast.toast(msg, {
        variant: 'danger',
        autoHideDelay: 3000,
        solid: true
      })
      return Promise.reject(err)
    })
    this.$axios = axiosInstance
    this.$env = process.env
    this.$validity = {}
  },
  mounted () {
    // Patch for MavonEditor
    document.querySelectorAll('div[type="button"]').forEach(
      x => x.removeAttribute('type')
    )
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
