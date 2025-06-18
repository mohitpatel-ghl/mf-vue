<template>
    <div>
      <h2>Users ({{ userCount }})</h2>
      <div v-if="isLoading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <ul v-else>
        <li class="user-row" v-for="user in users" :key="user.id">
          <div @click="goToEditUser(user.id)" data-tooltip="Edit User" class="user-detail">
            {{ user.firstName }} {{ user.lastName }} ({{ user.email }}) {{ user.age }}
          </div>
          <div data-tooltip="Delete User" class="delete-icon" @click="handleDeleteUser(user.id)">❌</div>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useHostStore } from '../composables/useHostStore';

export default defineComponent({
  setup() {
    const {
      users,
      isLoading,
      error,
      userCount,
      deleteUser
    } = useHostStore();


    const handleDeleteUser = async (id: number) => {
      try {
        await deleteUser(id);
        alert(`User with user id ${id} deleted successfully.`)
      } catch (err) {
        console.error('[UserList] Failed to delete user:', err);
      }
    };

    const goToEditUser = (id: number) => {
      const router = (window as any).hostAppInstance?.$router;
      if (router) router.push(`/edit-user/${id}`);
    };

    return {
      users,
      isLoading,
      error,
      userCount,
      handleDeleteUser,
      goToEditUser
    };
  }
});
</script>

  
  <style scoped>
  .user-row {
    cursor: pointer;
    padding: 10px;
    margin-bottom: 2px;
    border: 1px solid #ccc;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  