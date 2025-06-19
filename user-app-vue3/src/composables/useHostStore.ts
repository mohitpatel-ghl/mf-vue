// import { ref, readonly, onUnmounted } from 'vue';

// export interface User {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     age: number;
// }

// let hostStore: any = null;

// export function setHostStore(store: any) {
//     console.log('✅ Host store set:', store);
//     hostStore = store;
// }

// export function useHostStore() {
//     if (!hostStore && window.hostStore) {
//         setHostStore(window.hostStore);
//     }

//     if (!hostStore) {
//         throw new Error('hostStore is not set');
//     }

//     // Create local refs
//     const users = ref<User[]>(hostStore.state.users);
//     const isLoading = ref(hostStore.state.isLoading);
//     const error = ref(hostStore.state.error);
//     const userCount = ref(hostStore.getters.userCount);

//     // Update function
//     const updateFromStore = () => {
//         users.value = hostStore.state.users;
//         isLoading.value = hostStore.state.isLoading;
//         error.value = hostStore.state.error;
//         userCount.value = hostStore.getters.userCount;
//     };

//     // Initial update
//     updateFromStore();

//     // Subscribe to updates
//     const unsubscribe = hostStore.subscribe((mutation: any, state: any) => {
//         console.log('Mutation:', mutation, 'State:', state);
//         updateFromStore();
//     });

//     // Cleanup subscription when component unmounts
//     onUnmounted(() => {
//         unsubscribe?.();
//     });

//     const fetchUsers = async () => await hostStore.dispatch('fetchUsers');
//     const deleteUser = async (id: number) => {
//         await hostStore.dispatch('deleteUser', id);
//     }

//     return {
//         users: readonly(users),
//         isLoading: readonly(isLoading),
//         error: readonly(error),
//         userCount: readonly(userCount),
//         fetchUsers,
//         deleteUser
//     };
// }