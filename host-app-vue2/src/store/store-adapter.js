import Vue from 'vue'; 
import store from './index'; 
import { EventBus } from '../plugins/eventBus'; 

export function createStoreAdapter(vuexStore, eventBus) {
  
  const reactiveStore = Vue.observable({
    users: [], 
    isLoading: false, 
    error: '', 
  });


  vuexStore.subscribe((mutation, state) => {
    // Update the reactiveStore's properties based on Vuex state changes
    reactiveStore.users = state.users;
    reactiveStore.isLoading = state.isLoading;
    reactiveStore.error = state.error;
    // Notify consumers that the store has been updated.
    eventBus.$emit('storeUpdated');
  });

  // Initialize reactiveStore with current Vuex state
  reactiveStore.users = vuexStore.state.users;
  reactiveStore.isLoading = vuexStore.state.isLoading;
  reactiveStore.error = vuexStore.state.error;

  return {
    // Expose reactive state and getters directly
    state: reactiveStore,
    getters: {
      allUsers: () => vuexStore.getters.allUsers,
      userCount: () => vuexStore.getters.userCount,
      isLoading: () => vuexStore.getters.isLoading,
      error: () => vuexStore.getters.error,
    },

    // Expose methods to dispatch actions to the Vuex store.
    async fetchUsers() {
      await vuexStore.dispatch('fetchUsers');
    },
    async fetchUserById(id) {
      return await vuexStore.dispatch('fetchUserById', id);
    },
    async addUser(userData) {
      await vuexStore.dispatch('addUser', userData);
    },
    async updateUser(id, userData) {
      await vuexStore.dispatch('updateUser', { id, userData });
    },
    async deleteUser(userId) {
      await vuexStore.dispatch('deleteUser', userId);
    },

    // Expose the EventBus for generic pub-sub communication.
    eventBus: {
      on: (eventName, callback) => eventBus.$on(eventName, callback),
      off: (eventName, callback) => eventBus.$off(eventName, callback),
      emit: (eventName, payload) => eventBus.$emit(eventName, payload),
    }
  };
}

// Export the initialized adapter instance directly.
export default createStoreAdapter(store, EventBus);