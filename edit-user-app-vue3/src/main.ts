import { createApp } from 'vue'
import App from './App.vue'

//this is done so that while dynamically mounting this app's components in host app, this mount should not get called.
if (document.getElementById('app')) {
    createApp(App).mount('#app');
}

export default App;
