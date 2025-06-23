<template>
  <div class="edit-user-container p-6 border-4 border-double border-green-400 rounded-xl bg-green-50 shadow-lg">
    <!-- This is where the remote Vue 3 app will be mounted -->
    <div ref="remoteAppContainer" class="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50">
      <p v-if="loading" class="text-center text-blue-700 text-xl animate-pulse">Loading remote Vue 3 Edit User
        component...</p>
      <p v-if="error" class="text-center text-red-600 text-xl">Error loading edit user vue 3 remote: {{ error.message }}
      </p>
    </div>
  </div>
</template>

<script>
import { loadRemote } from '@module-federation/runtime';

export default {
  name: 'EditUser',
  data() {
    return {
      loading: true,
      error: null,
      vue3AppInstance: null, // To store the Vue 3 app instance for unmounting
    };
  },
  props: {
    id: {
      type: [Number, String],
      default: null,
    },
  },
  async mounted() {
    try {

      // Dynamically load the remote module Vue 3 remote app component definition.
      const remoteModule = await loadRemote('editUserAppVue3/EditUser');
      const RemoteAppVue3Component = remoteModule.default || remoteModule;

      // Load the `createApp` function from the Vue 3 remote's shared 'vue' instance.
      const { createApp: createVue3App } = await loadRemote('editUserAppVue3/vue');
      if (!createVue3App) {
        throw new Error("Could not load Vue 3's edit user createApp.");
      }

      // Ensure the container exists
      const container = this.$refs.remoteAppContainer;
      if (!container) {
        throw new Error('Remote app container not found from remote edit user app.');
      }

      // Create and mount the Vue 3 application instance.
      const app = createVue3App(RemoteAppVue3Component,  { id: this.id });

      if (this._provided) {
        Object.assign(app.config.globalProperties, this); // Expose Vue 2 instance to global properties in Vue 3 for fallbacks
        Object.assign(app._context.provides, this._provided);
        console.log('Successfully transferred provided context from Vue 2 host to Vue 3 app.');
      } else {
        console.warn('Vue 2 host instance does not have a _provided property. Context injection may fail.');
      }

      this.vue3AppInstance = app.mount(container); // Store the instance for later unmounting

      console.log('Vue 3 edit user app mounted directly in EditUser.vue:', app);

      this.loading = false;
    } catch (e) {
      console.error('Failed to load or mount remote Vue 3 edit user app:', e);
      this.error = e;
      this.loading = false;
    }
  },
  beforeDestroy() {
    // Unmount the Vue 3 app instance when this Vue 2 page component is destroyed
    if (this.vue3AppInstance && typeof this.vue3AppInstance.unmount === 'function') {
      this.vue3AppInstance.unmount();
      console.log('Vue 3 remote edit user app unmounted from EditUser.vue.');
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