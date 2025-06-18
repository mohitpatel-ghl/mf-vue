// useHostStore.ts
import { computed } from 'vue';

let hostStore: any = null;

export function setHostStore(store: any) {
    console.log(store, '🚀 Setting host store');
    hostStore = store;
}

export function useHostStore() {
    console.log(window.hostStore, '🚀 Host store from window object');
    if (window.hostStore) {
        setHostStore(window.hostStore);
    } else {
        throw new Error('Host store is not set');
    }

    const users = computed(() => hostStore.state.users);
    const isLoading = computed(() => hostStore.state.isLoading);
    const error = computed(() => hostStore.state.error);
    const userCount = computed(() => hostStore.getters.userCount);

    const fetchUserById = async (id: number) => {
        return await hostStore.dispatch('fetchUserById', id);
    };

    const updateUser = async (payload: { id: number; userData: any }) => {
        await hostStore.dispatch('updateUser', payload);
    };

    const addUser = async (payload: { userData: any }) => {
        await hostStore.dispatch('addUser', payload);
    };

    return {
        users,
        isLoading,
        error,
        userCount,
        fetchUserById,
        updateUser,
        addUser
    };
}
