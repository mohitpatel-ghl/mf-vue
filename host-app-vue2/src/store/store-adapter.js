import Vue from 'vue';
import store from './index'; // Vuex store

const reactiveState = Vue.observable({
  users: [],
  isLoading: false,
  error: null,
  userCount: 0
});

store.watch(state => state.users, val => {
  reactiveState.users = val;
  reactiveState.userCount = val.length;
});
store.watch(state => state.isLoading, val => (reactiveState.isLoading = val));
store.watch(state => state.error, val => (reactiveState.error = val));

export default {
  ...reactiveState,
  fetchUsers: () => store.dispatch('fetchUsers'),
  addUser: (user) => store.dispatch('addUser', user),
  updateUser: (payload) => store.dispatch('updateUser', payload),
  deleteUser: (id) => store.dispatch('deleteUser', id),
};
