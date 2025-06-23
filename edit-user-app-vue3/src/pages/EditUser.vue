<template>
  <div class="edit-user-form p-6 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto mt-10">
    <h2 class="text-2xl font-semibold mb-4">{{ i18n.t('editUserApp.editUser') || 'Edit User' }}</h2>

    <div v-if="loadingUser" class="mb-4 p-2 bg-blue-100 text-blue-800 rounded loading-message">
      Loading user data...
    </div>
    <div v-else-if="error || userLoadError" class="mb-4 p-2 bg-red-100 text-red-800 rounded error-message-box">
      Error: {{ error || userLoadError }}
    </div>
    <div v-else-if="notFound" class="mb-4 p-2 bg-red-100 text-red-800 rounded error-message-box">
      User not found
    </div>

    <form v-else @submit.prevent="onSubmit">
      <div class="mb-4">
        <label for="firstName" class="block mb-1 font-medium text-gray-700">First Name</label>
        <input id="firstName" v-model="formData.firstName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
      </div>

      <div class="mb-4">
        <label for="lastName" class="block mb-1 font-medium text-gray-700">Last Name</label>
        <input id="lastName" v-model="formData.lastName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
      </div>

      <div class="mb-4">
        <label for="email" class="block mb-1 font-medium text-gray-700">Email</label>
        <input id="email" v-model="formData.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
      </div>

      <div class="mb-4">
        <label for="age" class="block mb-1 font-medium text-gray-700">Age</label>
        <input id="age" v-model.number="formData.age" type="number" min="1"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
      </div>

      <button type="submit" :disabled="isSubmitting"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
        {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>

    <div v-if="successfulUpdate" class="mt-4 p-2 bg-green-100 text-green-800 rounded success-message-box">
      User updated successfully! Redirecting...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, inject } from 'vue';
import { useHostStore } from '../composables/useHostStore';
import  { HostRouterService, I18nService, User } from '@/types'; 

const props = defineProps<{
  id: number | string | null;
}>();

console.log(props.id, '^^^^^^^')

// --- INJECT HOST UTILITIES ---
const hostRouter = inject<HostRouterService>('hostRouter');
if (!hostRouter) {
  console.warn('Host router not injected on edit user app! Navigation functions may not work.');
}

const i18n = inject<I18nService>('i18n'); // Inject the i18n service provided by the host

// Fallback `t` function if i18n isn't available
const t = (key: string): string => {
  if (i18n && typeof i18n.t === 'function') {
    return i18n.t(key);
  }
  return key;
};


const {
  users, 
  isLoading,
  error: hostStoreError,
  fetchUsers,
  fetchUserById,
  updateUser,
} = useHostStore();


const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  age: null as number | null,
});

const loadingUser = ref(false);
const userLoadError = ref<string | null>(null);
const notFound = ref(false);
const isSubmitting = ref(false); 
const successfulUpdate = ref(false); 
const error = ref<string | null>(null); 


const loadUserData = async (id: number) => {
  loadingUser.value = true;
  userLoadError.value = null;
  notFound.value = false;
  try {
    
    if (users.value.length === 0) {
      await fetchUsers();
    }

    const user = await fetchUserById(id); 
    
    if (user) {
      formData.firstName = user.firstName || '';
      formData.lastName = user.lastName || '';
      formData.email = user.email;
      formData.age = user.age || null;
    } else {
      notFound.value = true;
    }
  } catch (err: any) {
    userLoadError.value = err?.message || 'Failed to load user data.';
    console.error('Error loading user:', err);
  } finally {
    loadingUser.value = false;
  }
};

const onSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;
  successfulUpdate.value = false;

  try {
    if (props.id === null) {
      throw new Error("User ID is missing for update operation.");
    }
    if (formData.age === null) {
      throw new Error("Age cannot be empty.");
    }
    if (!formData.firstName || !formData.lastName || !formData.email) {
      throw new Error("First Name, Last Name, and Email are required.");
    }

    const payload: Partial<Omit<User, 'id'>> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
    };

    await updateUser(Number(props.id), payload);
    
    successfulUpdate.value = true;

    
    setTimeout(() => {
        if (hostRouter && typeof hostRouter.push === 'function') {
            hostRouter.push('/users');
        } else {
            console.warn('Host router not available for redirection.');
        }
    }, 1000); 

  } catch (err: any) {
    error.value = err?.message || 'Failed to update user';
    console.error('Submission error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

watch(() => props.id, (newId) => {
  if (newId !== null && newId !== undefined) {
    loadUserData(Number(newId));
  } else {
    notFound.value = true;
    userLoadError.value = "No user ID provided for editing.";
    loadingUser.value = false;
  }
}, { immediate: true }); 

</script>

<style scoped>

.edit-user-form {
    transition: all 0.3s ease;
    padding: 1.5rem; 
    background-color: #ffffff; 
    border-radius: 0.5rem; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); 
    width: 100%; /* w-full */
    max-width: 40rem; /* max-w-xl */
    margin-left: auto; /* mx-auto */
    margin-right: auto; /* mx-auto */
    margin-top: 2.5rem; /* mt-10 */
}

h2 {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 600; /* font-semibold */
    margin-bottom: 1rem; /* mb-4 */
}

.loading-message, .error-message-box, .success-message-box {
    padding: 0.5rem; /* p-2 */
    border-radius: 0.25rem; /* rounded */
    margin-bottom: 1rem; /* mb-4 */
    text-align: center; /* Added for better message display */
}

.loading-message {
    background-color: #dbeafe; /* bg-blue-100 */
    color: #1e40af; /* text-blue-800 */
}

.error-message-box {
    background-color: #fee2e2; /* bg-red-100 */
    color: #991b1b; /* text-red-800 */
}

.success-message-box {
    background-color: #d1fae5; /* bg-green-100 */
    color: #065f46; /* text-green-800 */
}

.mb-4 {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.25rem; /* mb-1 */
    font-weight: 500; /* font-medium */
    color: #374151; /* text-gray-700 */
}

input[type="text"],
input[type="email"],
input[type="number"] {
    width: 100%;
    padding: 0.5rem 0.75rem; /* px-3 py-2 */
    border: 1px solid #d1d5db; /* border border-gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    /* focus:ring-blue-500 focus:border-blue-500 */
    outline: none;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="number"]:focus {
    border-color: #3b82f6; /* blue-500 */
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); /* ring-blue-500 (simulated) */
}


button[type="submit"] {
    background-color: #2563eb; /* bg-blue-600 */
    color: white; /* text-white */
    font-weight: 700; /* font-bold */
    padding: 0.5rem 1rem; /* py-2 px-4 */
    border-radius: 0.375rem; /* rounded-md */
    transition: background-color 0.15s ease-in-out, opacity 0.15s ease-in-out; /* transition duration-150 ease-in-out */
    cursor: pointer;
}

button[type="submit"]:hover:not(:disabled) {
    background-color: #1d4ed8; /* hover:bg-blue-700 */
}

button[type="submit"]:disabled {
    opacity: 0.5; /* disabled:opacity-50 */
    cursor: not-allowed; /* disabled:cursor-not-allowed */
}
</style>
