import { reactive } from 'vue';

let store;

const reactiveState = reactive({
  users: [],
  isLoading: false,
  error: null,
  userCount: 0,
});

export function initStoreBridge(hostStore) {
  store = hostStore;

  store.watch(
    (state) => state.users,
    (users) => {
      reactiveState.users.length = 0;
      reactiveState.users.push(...users);
      reactiveState.userCount = users.length;
    },
    { immediate: true }
  );

  store.watch(
    (state) => state.isLoading,
    (loading) => {
      reactiveState.isLoading = loading;
    },
    { immediate: true }
  );

  store.watch(
    (state) => state.error,
    (error) => {
      reactiveState.error = error;
    },
    { immediate: true }
  );
}

const storeAdapter = {
  get users() {
    return reactiveState.users;
  },
  get isLoading() {
    return reactiveState.isLoading;
  },
  get error() {
    return reactiveState.error;
  },
  get userCount() {
    return reactiveState.userCount;
  },

  async fetchUsers() {
    return await store?.dispatch('fetchUsers');
  },
  async fetchUserById(id) {
    return await store?.dispatch('fetchUserById', id);
  },
  async addUser(user) {
    return await store?.dispatch('addUser', user);
  },
  async updateUser(payload) {
    return await store?.dispatch('updateUser', payload);
  },
  async deleteUser(id) {
    return await store?.dispatch('deleteUser', id);
  },
};

export default storeAdapter;
