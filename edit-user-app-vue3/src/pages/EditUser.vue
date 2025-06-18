<template>
    <div class="edit-user-form p-6 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto mt-10">
        <h2 class="text-2xl font-semibold mb-4">Edit User</h2>

        <div v-if="isLoading && !error && !notFound">Loading user data...</div>
        <div v-else-if="error">Error: {{ error }}</div>
        <div v-else-if="notFound" class="text-red-600">User not found</div>

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
        <div v-if="successfulUpdate" class="mt-4 text-green-600">
            User updated successfully!
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
            notFound: false,
            isLoading: false,
            error: null as any,
            fetchUserById: null as any,
            updateUser: null as any,
            successfulUpdate: false
        };
    },
    async mounted() {
        const {
            fetchUserById,
            updateUser
        } = useHostStore();
        this.isLoading = true;
        this.fetchUserById = fetchUserById;
        this.updateUser = updateUser;

        const route = (window as any).hostAppInstance?.$route;
        const userId = Number(route?.params?.id);

        try {
            const user = await this.fetchUserById(userId);
            if (user) {
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.email = user.email;
                this.age = user.age;
                this.isLoading = false;
                console.log('[EditUser] User data fetched successfully:', user);
            } else {
                this.notFound = true;
                this.isLoading = false;
            }
        } catch (err) {
            this.notFound = true;
            this.isLoading = false;
            this.error = err || 'Failed to fetch user data';
            console.warn('[EditUser] Failed to fetch user by ID:', userId, err);
        }
    },
    methods: {
        async onSubmit() {
            this.isLoading = true;
            const route = (window as any).hostAppInstance?.$route;
            const router = (window as any).hostAppInstance?.$router;
            const userId = Number(route?.params?.id);

            try {
                await this.updateUser({
                    id: userId,
                    userData: {
                        firstName: this.firstName,
                        lastName: this.lastName,
                        email: this.email,
                        age: this.age,
                    },
                });
                this.isLoading = false;
                this.successfulUpdate = true;
            } catch (err) {
                this.error = err || 'Failed to update user';
                this.isLoading = false;
                console.error('[EditUser] Failed to update user:', err);
            }


        },
    },
});
</script>


<style scoped>
.edit-user-form {
    transition: all 0.3s ease;
}
</style>