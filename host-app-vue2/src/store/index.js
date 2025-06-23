import Vue from 'vue';
import Vuex from 'vuex';
import dummyData from '../utility/dummy-users.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: [],
    isLoading: false,
    error: '',
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    ADD_USER(state, newUser) {
      state.users.push(newUser);
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(user => user.id === updatedUser.id);

      if (index !== -1) {
        const existingUser = state.users[index];

        const mergedUser = {
          ...existingUser,
          ...updatedUser,
        };

        state.users.splice(index, 1, mergedUser);
      }
    },
    DELETE_USER(state, id) {
      const index = state.users.findIndex(u => u.id === id);
      if (index !== -1) {
        state.users.splice(index, 1);
      }
      console.log('[Vuex Action] deleteUser: User deleted successfully', state.users);
      this._vm.$eventBus.$emit('storeUpdated');
    },
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchUsers({ state, commit }) {
      if (state.users && state.users.length > 0) {
        console.log('[Vuex Action] fetchUsers: Skipped — users already in store', state.users);
        return;
      }

      commit('SET_LOADING', true);
      commit('SET_ERROR', '');

      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
        console.log('[Vuex Action] fetchUsers: Loaded dummy data');
        commit('SET_USERS', dummyData);
        commit('SET_LOADING', false);
      } catch (error) {
        console.error('[Vuex Action] fetchUsers: Error loading data', error);
        commit('SET_ERROR', error.message);
        commit('SET_LOADING', false);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchUserById({ commit, state }, id) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = state.users.find(user => user.id === id);
        if (!user) {
          throw new Error(`User with ID ${id} not found`);
        }

        console.log('[Vuex Action] fetchUserById: Found user', user);
        return user;
      } catch (error) {
        console.error('[Vuex Action] fetchUserById: Error', error);
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addUser({ commit }, userData) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newUser = {
          ...userData,
          id: Math.floor(Math.random() * 1000000) + 100 // fake unique ID
        };
        console.log('[Vuex Action] addUser: Added user', newUser);
        commit('ADD_USER', newUser);
      } catch (error) {
        console.error('Error adding user:', error);
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateUser({ commit }, { id, userData }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedUser = { id, ...userData };
        console.log('[Vuex Action] updateUser: Updated user', updatedUser);
        commit('UPDATE_USER', updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteUser({ commit }, userId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('[Vuex Action] deleteUser: Deleted user', userId);
        commit('DELETE_USER', userId);
      } catch (error) {
        console.error('Error deleting user:', error);
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    allUsers: state => state.users,
    userCount: state => state.users.length,
    isLoading: state => state.isLoading,
    error: state => state.error,
  }
});
