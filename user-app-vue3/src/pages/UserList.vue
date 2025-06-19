<template>
  <div class="user-list-wrapper">
    <h2>Users ({{ userCount }})</h2>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>

    <ul v-else class="user-table">
      <h1>{{ t('welcomeMsg') }}</h1>
      <li class="user-row" v-for="user in users" :key="user.id">
        <div @click="goToEditUser(user.id)" data-tooltip="Edit User" class="user-detail">
          {{ user.firstName }} {{ user.lastName }} ({{ user.email }}) — {{ user.age }}
        </div>
        <div data-tooltip="Delete User" class="delete-icon" @click="handleDeleteUser(user.id)">❌</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import storeAdapter, { initStoreBridge } from 'hostApp/store-adapter';

const hostStore = (window as any).hostStore;
if (hostStore) {
  initStoreBridge(hostStore);
} else {
  console.warn('❗ hostStore not found on window');
}

const t = (window as any).shellI18n?.t?.bind((window as any).shellI18n) || ((key: string) => key);

const users = computed(() => storeAdapter.users);
const isLoading = computed(() => storeAdapter.isLoading);
const error = computed(() => storeAdapter.error);
const userCount = computed(() => storeAdapter.userCount);

const handleDeleteUser = async (id: number) => {
  const eventBus = (window as any).shellEventBus;
  if (eventBus?.$emit) {
    if (confirm(`Are you sure you want to delete user ID ${id}?`)) {
      eventBus.$emit('delete-user', id);
      console.log('[Remote] Emitted delete-user event for ID:', id);
    }
  } else {
    console.warn('EventBus not available on window.shellEventBus.');
  }
};

const goToEditUser = (id: number) => {
  const router = (window as any).hostAppInstance?.$router;
  if (router) router.push(`/edit-user/${id}`);
};

</script>

<style scoped>
.user-table {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.user-row {
  cursor: pointer;
  padding: 10px;
  margin-bottom: 2px;
  border: 1px solid #ccc;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
}

.delete-icon {
  cursor: pointer;
  margin-left: 12px;
  padding: 6px 12px;
  border-radius: 100%;
  text-align: center;
}

[data-tooltip]:hover::after {
  display: block;
  position: absolute;
  content: attr(data-tooltip);
  border: 1px solid black;
  background: #eee;
  font-size: 12px;
  border-radius: 12px;
  padding: 6px;
}
</style>
