// import { ref, watchEffect } from 'vue'
// import type { User, ShellStore } from '@/types'

// let hostStore: ShellStore | null = null

// export function setHostStore(store: ShellStore) {
//   hostStore = store
// }

// export function useHostStore() {
//   if (!hostStore && window.hostStore) {
//     setHostStore(window.hostStore as ShellStore)
//   }

//   if (!hostStore) {
//     throw new Error('hostStore not set')
//   }

//   const users = ref<User[]>([])
//   const isLoading = ref(false)
//   const error = ref('')
//   const userCount = ref(0)

//   // Watch reactive host store
//   watchEffect(() => {
//     users.value = hostStore!.users
//     isLoading.value = hostStore!.isLoading
//     error.value = hostStore!.error
//     userCount.value = hostStore!.userCount
//   })

//   return {
//     users,
//     isLoading,
//     error,
//     userCount,
//     fetchUsers: hostStore.fetchUsers,
//     fetchUserById: hostStore.fetchUserById,
//     deleteUser: hostStore.deleteUser,
//     addUser: hostStore.addUser,
//     updateUser: hostStore.updateUser,
//   }
// }