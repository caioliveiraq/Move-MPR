import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

import auth            from '@websanova/vue-auth'
import httpVueResource from '@websanova/vue-auth/dist/drivers/http/vue-resource.1.x.esm.js'
import routerVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js'

Vue.config.productionTip = false

import Notifications from 'vue-notification'
Vue.use(Notifications)

import Loading from 'vue-loading-overlay'
Vue.use(Loading)
import 'vue-loading-overlay/dist/vue-loading.css'

import mvHeader from './components/mvHeader.vue'
Vue.component('mv-header', mvHeader)

import VueResource from 'vue-resource'
import './registerServiceWorker'
Vue.use(VueResource)

Vue.http.options.root = process.env.VUE_APP_API
Vue.router = router

Vue.use(auth, {
  auth: {
    request: function (req, token) {
        this.http.setHeaders.call(this, req, {
            Authorization: 'Bearer ' + token
        });
    },

    response: function (res) {
        let token = res.body.access_token;

        if (token) {
            token = token.split(/Bearer:?\s?/i)

            return token[token.length > 1 ? 1 : 0].trim()
        }
    }
  },
  http: httpVueResource,
  router: routerVueRouter,
  rolesKey: 'role',
  tokenDefaultName: 'access_token',
  loginData: { url: 'auth/login', method: 'POST', fetchUser: true },
  fetchData: { url: 'auth/me', method: 'GET',
    success: function (response) {
      if (Vue.auth.check() && response.status == 200 ) {
        Vue.auth.watch.data = Vue.auth.user(response.body)
      }
    }
  },
  refreshData: { url: 'auth/refresh', method: 'POST', atInit: false, interval: 55 }
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
