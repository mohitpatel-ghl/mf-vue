<template>
    <div class="add-user-form p-6 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto mt-10">
        <h2 class="text-2xl font-semibold mb-4">{{ t('editUserApp.addUser') || 'Add User' }}</h2>

        <div v-if="isLoading" class="mb-4 p-2 bg-blue-100 text-blue-800 rounded loading-message">
            Saving user data...
        </div>
        <div v-else-if="error" class="mb-4 p-2 bg-red-100 text-red-800 rounded error-message-box">
            Error: {{ error }}
        </div>

        <form v-else @submit.prevent="onSubmit">
            <div class="mb-4">
                <label for="firstName" class="block mb-1 font-medium text-gray-700">First Name</label>
                <input id="firstName" v-model="firstName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>

            <div class="mb-4">
                <label for="lastName" class="block mb-1 font-medium text-gray-700">Last Name</label>
                <input id="lastName" v-model="lastName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>

            <div class="mb-4">
                <label for="email" class="block mb-1 font-medium text-gray-700">Email</label>
                <input id="email" v-model="email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>

            <div class="mb-4">
                <label for="age" class="block mb-1 font-medium text-gray-700">Age</label>
                <input id="age" v-model.number="age" type="number" min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>

            <button type="submit" :disabled="isLoading"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
                Save Changes
            </button>
        </form>

        <div v-if="successfulAdded" class="mt-4 p-2 bg-green-100 text-green-800 rounded success-message-box">
            User added successfully!
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useHostStore } from '../composables/useHostStore'; 
import { HostRouterService, I18nService, User } from '@/types';



const firstName = ref('');
const lastName = ref('');
const email = ref('');
const age = ref<number | null>(null);

const isLoading = ref(false);
const error = ref<string | null>(null);
const successfulAdded = ref(false);

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


const { addUser } = useHostStore();

const onSubmit = async () => {
    isLoading.value = true;
    error.value = null;
    successfulAdded.value = false; 

    try {
        if (age.value === null) {
            throw new Error("Age cannot be empty.");
        }

        const newUser: Omit<User, 'id'> = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            age: age.value,
        };

        await addUser(newUser);
        
        successfulAdded.value = true;
        firstName.value = '';
        lastName.value = '';
        email.value = '';
        age.value = null;

        setTimeout(() => {
            if (hostRouter && typeof hostRouter.push === 'function') {
                hostRouter.push('/users');
            } else {
                console.warn('Host router not available for redirection.');
            }
        }, 1000);
    } catch (err: any) {
        error.value = err?.message || 'Failed to add user';
        console.error('[AddUser] Error:', err);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Basic styling based on provided Tailwind-like classes */
.add-user-form {
    transition: all 0.3s ease;
    padding: 1.5rem; /* p-6 */
    background-color: #ffffff; /* bg-white */
    border-radius: 0.5rem; /* rounded-lg */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
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
