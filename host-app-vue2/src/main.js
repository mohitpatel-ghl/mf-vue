import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './plugins/i18n'
import { init } from '@module-federation/runtime'

window.hostStore = store;

//for providing a global event bus for communication between components
Vue.prototype.$eventBus = new Vue();
window.shellEventBus = Vue.prototype.$eventBus;
// Expose the i18n instance globally for remote components to access translations
window.shellI18n = i18n;

// Initialize Module Federation runtime
init({
  name: 'hostApp',
  remotes: [
    {
      name: 'userAppVue3',
      entry: 'http://localhost:8081/remoteEntry.js',
    },
    {
      name: 'editUserAppVue3',
      entry: 'http://localhost:8082/remoteEntry.js',
    },
  ],
})

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// Expose the Vue instance globally for remote components to access route
window.hostAppInstance = app;