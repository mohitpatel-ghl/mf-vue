<template>
    <div class="add-user-form p-6 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto mt-10">
        <h2 class="text-2xl font-semibold mb-4">Add User</h2>

        <div v-if="isLoading && !error">Saving user data...</div>
        <div v-else-if="error">Error: {{ error }}</div>

        <form v-else @submit.prevent="onSubmit">
            <div class="mb-4">
                <label class="block mb-1 font-medium">First Name</label>
                <input v-model="firstName" class="w-full px-3 py-2 border border-gray-300 rounded" required />
            </div>

            <div class="mb-4">
                <label class="block mb-1 font-medium">Last Name</label>
                <input v-model="lastName" class="w-full px-3 py-2 border border-gray-300 rounded" required />
            </div>

            <div class="mb-4">
                <label class="block mb-1 font-medium">Email</label>
                <input v-model="email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded" required />
            </div>

            <div class="mb-4">
                <label class="block mb-1 font-medium">Age</label>
                <input v-model.number="age" type="number" min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded" required />
            </div>

            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Save Changes
            </button>
        </form>
        <div v-if="successfulAdded" class="mt-4 text-green-600">
            User Added successfully!
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useHostStore } from '../composables/useHostStore';

export default defineComponent({
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            age: null as number | null,
            isLoading: false,
            error: null as any,
            addUser: null as any,
            successfulAdded: false
        };
    },
    async mounted() {
        const {
            addUser
        } = useHostStore();
        this.addUser = addUser;

    },
    methods: {
        async onSubmit() {
            this.isLoading = true;
            const router = (window as any).hostAppInstance?.$router;

            try {
                await this.addUser({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    age: this.age,

                });
                this.isLoading = false;
                this.successfulAdded = true;
            } catch (err) {
                this.error = err || 'Failed to Add user';
                this.isLoading = false;
                console.error('[AddUser] Failed to Add user:', err);
            }


        },
    },
});
</script>


<style scoped>
.add-user-form {
    transition: all 0.3s ease;
}
</style>