import { StoreAdapter, User } from '@/types';
import { inject, computed, type Ref } from 'vue';

/**
 * A composable to interact with the host's store adapter.
 * It injects the store adapter and exposes reactive properties and action methods.
 */
export function useHostStore() {
  // Inject the storeAdapter provided by the Vue 2 host.
  const storeAdapter = inject<StoreAdapter>('storeAdapter');

  if (!storeAdapter) {
    console.warn('Store adapter not provided. Host store functionality will be limited.');
    return {
      users: computed(() => []),
      isLoading: computed(() => false),
      error: computed(() => 'Store adapter not available.'),
      userCount: computed(() => 0),
      fetchUsers: async () => {},
      fetchUserById: async (id: number) => undefined,
      addUser: async (userData: Omit<User, 'id'>) => { console.error('addUser called without adapter'); },
      updateUser: async (id: number, userData: Partial<Omit<User, 'id'>>) => { console.error('updateUser called without adapter'); },
      deleteUser: async (userId: number) => {},
      eventBus: { // Provide a dummy eventBus if the adapter isn't available
        on: () => {}, off: () => {}, emit: () => {}
      }
    };
  }

  // Expose reactive state properties using computed properties.
  // This ensures that any changes to storeAdapter.state (which is a Vue 2 observable)
  // are reflected reactively in Vue 3 components.
  const users: Ref<User[]> = computed(() => storeAdapter.state.users);
  const isLoading: Ref<boolean> = computed(() => storeAdapter.state.isLoading);
  const error: Ref<string> = computed(() => storeAdapter.state.error);

  // Expose getters (if you need them directly, otherwise you can derive from state)
  const userCount: Ref<number> = computed(() => storeAdapter.state.users.length);

  // Expose methods to dispatch actions via the adapter
  const fetchUsers = () => storeAdapter.fetchUsers();
  const fetchUserById = (id: number) => storeAdapter.fetchUserById(id);
  const addUser = (userData: Omit<User, 'id'>): Promise<void> => {
    return new Promise((resolve, reject) => {
      storeAdapter.eventBus.emit('remote:addUser', {
        userData,
        callback: (response: { success: boolean; error?: string }) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.error || 'Failed to add user.'));
          }
        }
      });
    });
  };
  const updateUser = (id: number, userData: Partial<Omit<User, 'id'>>): Promise<void> => {
    return new Promise((resolve, reject) => {
      storeAdapter.eventBus.emit('remote:updateUser', {
        id,
        userData,
        callback: (response: { success: boolean; error?: string }) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.error || 'Failed to update user.'));
          }
        }
      });
    });
  };
  const deleteUser = (userId: number) => storeAdapter.deleteUser(userId);

  return {
    users,
    isLoading,
    error,
    userCount,
    fetchUsers,
    fetchUserById,
    addUser,
    updateUser,
    deleteUser,
    eventBus: storeAdapter.eventBus,
  };
}

export {
  StoreAdapter // Expose methods to dispatch actions via the adapter
};
