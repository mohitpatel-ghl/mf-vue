<template>
    <div class="add-user-container p-6 border-4 border-double border-green-400 rounded-xl bg-green-50 shadow-lg">
      <!-- This is where the remote Vue 3 app will be mounted -->
      <div ref="remoteAppContainer" class="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50">
        <p v-if="loading" class="text-center text-blue-700 text-xl animate-pulse">Loading remote Vue 3 Add User component...</p>
        <p v-if="error" class="text-center text-red-600 text-xl">Error loading Add user vue 3 remote: {{ error.message }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { loadRemote } from '@module-federation/runtime';
  
  export default {
    name: 'AddUser',
    data() {
      return {
        loading: true,
        error: null,
        vue3AppInstance: null, // To store the Vue 3 app instance for unmounting
      };
    },
    async mounted() {
        console.log(this.$route.params, 'AddUser.vue mounted with route params:');
      try {
  
        // Dynamically load the remote module Vue 3 remote app component definition.
        const remoteModule = await loadRemote('editUserAppVue3/AddUser');
        const RemoteAppVue3Component = remoteModule.default || remoteModule;
  
        // Ensure the container exists
        const container = this.$refs.remoteAppContainer;
        if (!container) {
          throw new Error('Remote app container not found from remote Add user app.');
        }
  
        // Load the `createApp` function from the Vue 3 remote's shared 'vue' instance.
        const { createApp: createVue3App } = await loadRemote('editUserAppVue3/vue');
        if (!createVue3App) {
          throw new Error("Could not load Vue 3's add user createApp.");
        }
  
        // Create and mount the Vue 3 application instance.
        const app = createVue3App(RemoteAppVue3Component);
        this.vue3AppInstance = app; // Store the instance for later unmounting
        app.mount(container);
        console.log('Vue 3 add user app mounted directly in AddUser.vue:', app);
  
        this.loading = false;
      } catch (e) {
        console.error('Failed to load or mount remote Vue 3 Add user app:', e);
        this.error = e;
        this.loading = false;
      }
    },
    beforeDestroy() {
      // Unmount the Vue 3 app instance when this Vue 2 page component is destroyed
      if (this.vue3AppInstance && typeof this.vue3AppInstance.unmount === 'function') {
        this.vue3AppInstance.unmount();
        console.log('Vue 3 remote add user app unmounted from AddUser.vue.');
      }
    },
  };
  </script>
  
  <style scoped>
  .user-list-container {
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  </style>