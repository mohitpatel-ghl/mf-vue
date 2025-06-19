import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// Define the messages for different languages
const messages = {
    en: {
        welcomeMsg: 'Welcome to the Vue.js Module Federation Example using Vue 2 host and Vue 3 remote apps',
        hostAppAbout: "This page component in the Vue 2 host is responsible for displaying the Vue 3 remote application, which handles user details and its CRUD.",
        userApp: {
            welcomeMsg: 'User List Page (Vue 3 Remote Component)',
            about: 'This page component in the Vue 3 remote is responsible for displaying user list',
        },
        editUserApp: {
            welcomeMsg: 'Edit User Page (Vue 3 Remote Component)',
            about: 'This page component in the Vue 3 remote is responsible for editing user details.',  
            addUser: 'Add User',
            editUser: 'Edit User'
        }
    }
};

const i18n = new VueI18n({
    locale: 'en',
    messages,
});

export default i18n;
