<template>
  <div class="user-list-wrapper mt-10 p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">

    <div v-if="isLoading" class="mb-4 text-blue-700 loading-indicator">Loading...</div>
    <div v-else-if="error" class="mb-4 text-red-700 error-message-box">Error: {{ error }}</div>

    <ul v-else class="user-table">
      <h1 class="text-xl mb-4">{{ t('userApp.welcomeMsg') || 'User list page' }}</h1>
      <li class="user-row" v-for="user in users" :key="user.id">
        <div @click="goToEditUser(user.id)" data-tooltip="Edit User" class="user-detail">
          {{ `${user.firstName} ${user.lastName}` }} ({{ user.email }})
          <span v-if="user.age"> — {{ user.age }}</span>
        </div>
        <div data-tooltip="Delete User" class="delete-icon" @click="confirmDeleteUser(user.id, `${user.firstName} ${user.lastName}`)">❌</div>
      </li>
      <li v-if="users.length === 0" class="text-center py-4 text-gray-500">No users found.</li>
    </ul>

    <!-- Custom Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Confirm Deletion</h3>
        <p class="modal-message">Are you sure you want to delete user "<strong>{{ userToDeleteName }}</strong>" (ID: {{ userToDeleteId }})?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn cancel-btn">Cancel</button>
          <button @click="handleDeleteUser" class="btn delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { useHostStore } from '../composables/useHostStore';
import { HostRouterService, I18nService, StoreAdapter } from '@/types';


const storeAdapter = inject<StoreAdapter>('storeAdapter');
if (!storeAdapter) {
  console.error('Store adapter not injected!');
}


const hostRouter = inject<HostRouterService>('hostRouter');
if (!hostRouter) {
  console.warn('Host router not injected on userList app! Navigation functions may not work.');
}

const i18n = inject<I18nService>('i18n'); // Inject the i18n service provided by the host

// Fallback `t` function if i18n isn't available
const t = (key: string): string => {
  if (i18n && typeof i18n.t === 'function') {
    return i18n.t(key);
  }
  return key;
};

const { users, isLoading, error, userCount, fetchUsers, eventBus } = useHostStore();

const showConfirmDialog = ref(false);
const userToDeleteId = ref<number | null>(null);
const userToDeleteName = ref<string>('');

onMounted(async () => {
  console.log('UserList.vue (Vue 3 Remote) mounted.');

  if (!users.value || users.value.length === 0) {
    console.log('🌐 UserList.vue: Initiating fetch users via host store.');
    await fetchUsers();
  }
});

const goToEditUser = (id: number) => {
  if (hostRouter && typeof hostRouter.push === 'function') {
    hostRouter.push(`/edit-user/${id}`);
  } else {
    console.warn('Host router not available, cannot navigate.');
  }
};

const confirmDeleteUser = (id: number, name: string) => {
  userToDeleteId.value = id;
  userToDeleteName.value = name;
  showConfirmDialog.value = true;
};

const cancelDelete = () => {
  showConfirmDialog.value = false;
  userToDeleteId.value = null;
  userToDeleteName.value = '';
};

const handleDeleteUser = async () => {
  if (userToDeleteId.value !== null) {
    console.log(`UserList.vue: Emitting 'remote:deleteUser' for ID: ${userToDeleteId.value}`);
    eventBus?.emit('remote:deleteUser', {
      userId: userToDeleteId.value,
      callback: (response: { success: boolean; error?: string }) => {
        if (response.success) {
          console.log(`User ID ${userToDeleteId.value} deleted successfully by host.`);
        } else {
          console.error(`Failed to delete user ID ${userToDeleteId.value}: ${response.error}`);
        }
        cancelDelete();
      },
    });
  }
};
</script>

<style scoped>
.user-list-wrapper {
  margin-top: 2.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 48rem; 
  margin-left: auto;
  margin-right: auto;
}

h2 {
  font-size: 1.5rem; 
  font-weight: 600; 
  margin-bottom: 1rem;
}

.loading-indicator {
  color: #1d4ed8; 
}

.error-message-box {
  color: #b91c1c;
}

.user-table {
  list-style: none; 
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; 
}

.user-row {
  cursor: pointer;
  padding: 0.75rem;
  border: 1px solid #e5e7eb; 
  border-radius: 0.5rem; 
  display: flex;
  justify-content: space-between;
  align-items: center; 
  background: #f9fafb;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.user-row:hover {
  background-color: #f3f4f6;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.user-detail {
  flex-grow: 1;
  padding-right: 1rem;
}

.delete-icon {
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px; 
  background: #fee2e2; 
  color: #991b1b; 
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.delete-icon:hover {
  background-color: #fecaca; 
}


[data-tooltip] {
  position: relative;
}

[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 0.75rem; 
  border-radius: 0.375rem;
  padding: 0.3rem 0.6rem; 
  bottom: 100%; 
  left: 50%;
  transform: translateX(-50%) translateY(-0.5rem);
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateX(-50%) translateY(-0.75rem); 
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; 
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  text-align: center;
  animation: fadeInScale 0.3s ease-out;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.modal-message {
  color: #555;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background-color: #cbd5e1; 
  color: #333;
}

.cancel-btn:hover {
  background-color: #a0aec0;
  transform: translateY(-1px);
}

.delete-btn {
  background-color: #ef4444; 
  color: white;
}

.delete-btn:hover {
  background-color: #dc2626; 
  transform: translateY(-1px);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
