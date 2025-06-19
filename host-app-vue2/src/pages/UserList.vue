<template>
  <div class="user-list-container p-6 border-4 border-double border-green-400 rounded-xl bg-green-50 shadow-lg">
    <!-- This is where the remote Vue 3 app will be mounted -->
    <div ref="remoteAppContainer" class="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50">
    </div>

    <p v-if="loading" class="text-center text-blue-700 text-xl animate-pulse">Loading remote Vue 3 component...</p>
    <p v-if="error" class="text-center text-red-600 text-xl">Error loading remote: {{ error.message }}</p>
  </div>
</template>

<script>
import { loadRemote } from '@module-federation/runtime';
import { getCachedApp, setCachedApp } from '../utility/cached-app';

export default {
  name: 'UserList',
  data() {
    return {
      loading: true,
      error: null,
      vue3AppInstance: null, // To store the Vue 3 app instance for unmounting
    };
  },
  async mounted() {
    try {
      // Ensure the container exists
      const container = this.$refs.remoteAppContainer;
      if (!container) {
        throw new Error('Remote app container not found from remote user list app.');
      }

      // Dynamically load the remote module (the Vue 3 App.vue component definition).
      const remoteModule = await loadRemote('userAppVue3/UserList');
      const RemoteAppVue3Component = remoteModule.default || remoteModule;

      // Load the `createApp` function from the Vue 3 remote's shared 'vue' instance.
      // This is crucial for correctly instantiating the Vue 3 component.
      const { createApp: createVue3App } = await loadRemote('userAppVue3/vue');
      if (!createVue3App) {
        throw new Error("Could not load Vue 3's user list createApp.");
      }

      // Create and mount the Vue 3 application instance.
      const app = createVue3App(RemoteAppVue3Component);
      this.vue3AppInstance = app; // Store the instance for later unmounting
      await app.mount(container);
      console.log('Vue 3 user list app mounted directly in UserList.vue:', app);

      this.loading = false;
    } catch (e) {
      console.error('Failed to load or mount remote Vue 3 user list app:', e);
      this.error = e;
      this.loading = false;
    }
  },
  beforeDestroy() {
    // Unmount the Vue 3 app instance when this Vue 2 page component is destroyed
    if (this.vue3AppInstance && typeof this.vue3AppInstance.unmount === 'function') {
      this.vue3AppInstance.unmount();
      console.log('Vue 3 remote user list app unmounted from UserList.vue.');
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