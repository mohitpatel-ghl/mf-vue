import { createApp } from 'vue'
import App from './App.vue'
import { setHostStore } from './composables/useHostStore';

declare global {
  interface Window {
    hostStore?: any;
  }
}

console.log(window.hostStore, '🚀 Host store from window object');

if (window.hostStore) {
  setHostStore(window.hostStore);
} else {
  console.warn(' Host store not found on window');
}

createApp(App).mount('#app')
