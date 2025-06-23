import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './plugins/i18n'; 
import { init } from '@module-federation/runtime'; 
import { EventBus } from './plugins/eventBus';
import { createStoreAdapter } from './store/store-adapter';

Vue.prototype.$eventBus = EventBus;

// This step configures the environment to understand and load remote modules.
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
});

Vue.config.productionTip = false;

// Create the store adapter instance.
// This instance will bridge the Vuex store to Vue 3 remote applications,
// making it reactive for them and providing action dispatchers.
const storeAdapter = createStoreAdapter(store, EventBus);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
   // Provide the store adapter, EventBus, router, and i18n to all child components,
  provide() {
    return {
      storeAdapter: storeAdapter,
      eventBus: EventBus,
      i18n: {
        t: i18n.t.bind(i18n), 
        locale: i18n.locale,
      },
      hostRouter: {
        push: router.push.bind(router),
        replace: router.replace.bind(router),
        currentRoute: router.currentRoute
      },
    };
  },
  mounted() {
    this.$store.dispatch('fetchUsers');

    EventBus.$on('storeUpdated', () => {
        console.log('Host App: Store updated event received!');
    });

    EventBus.$on('remote:updateUser', async ({ id, userData, callback }) => {
      console.log('Host App: Received remote:updateUser event', { id, userData });
      try {
        await this.$store.dispatch('updateUser', { id, userData });
        if (callback) callback({ success: true });
        console.log('Host App: User updated successfully after remote request.');
      } catch (error) {
        console.error('Host App: Error updating user from remote request:', error);
        if (callback) callback({ success: false, error: error.message });
      }
    });

    EventBus.$on('remote:addUser', async ({ userData, callback }) => {
      console.log('Host App: Received remote:addUser event', { userData });
      try {
        await this.$store.dispatch('addUser', userData);
        if (callback) callback({ success: true });
        console.log('Host App: User added successfully after remote request.');
      } catch (error) {
        console.error('Host App: Error adding user from remote request:', error);
        if (callback) callback({ success: false, error: error.message });
      }
    });

    EventBus.$on('remote:deleteUser', async ({ userId, callback }) => {
      console.log('Host App: Received remote:deleteUser event for ID:', userId);
      try {
        await this.$store.dispatch('deleteUser', userId);
        if (callback) callback({ success: true });
        console.log('Host App: User deleted successfully after remote request.');
      } catch (error) {
        console.error('Host App: Error deleting user from remote request:', error);
        if (callback) callback({ success: false, error: error.message });
      }
    });
  },
}).$mount('#app');
