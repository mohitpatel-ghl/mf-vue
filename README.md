# 🧩 Micro Frontend Architecture with Vue 2 Host and Vue 3 Remotes

This project demonstrates a **microfrontend setup** using **Webpack Module Federation**, where:

- A **Vue 2 host app** (legacy) dynamically loads remote **Vue 3 apps (with TypeScript)**.
- Shared global **Vuex store** and **i18n** are provided from the host.
- The remotes use a custom `useHostStore` composable to access the host's store.

---

## 🗂️ Project Structure

├── host-app-vue2/ # Vue 2 application (acts as shell)
│ ├── src/
│ │ ├── pages/ # Contains route-based dynamic containers
│ │ └── main.js # Exposes global store via window
├── user-app-vue3/ # Vue 3 + TS remote app 1 (User List and Delete)
├── edit-user-app-vue3/ # Vue 3 + TS remote app 2 (User Edit and Add)
└── README.md

---

## 🚀 Architecture Overview

- All apps are carefully configured, considering future scalability, and proper modularity.

### 🧭 Host App (Vue 2)

- Acts as the entry point of the application.
- Built independently using Vue 2 + Webpack + Vuex.
- Provides shared global **Vuex store** by exposing store-adapter using module federation and **i18n** via the `window` object.
- Uses **`@module-federation/runtime`** to dynamically load remote apps at route level using lazy loading.
- Mounts remote apps into container components (`UserList.vue`, `EditUser.vue`, `AddUser.vue`).
- provides functionality of **event-bus** which will be listening events from remote app, all events are in App.vue.

### 🧩 Remote Apps (Vue 3 + TypeScript)

- Built independently using Vue 3 + Webpack + TypeScript.
- Expose the same-named components (e.g., `UserList`, `EditUser`) using Module Federation.
- Consume the host’s shared store using module federation by **remote state-adapter**
- Can emit events to update state, which will be listened on host app.

---

## 🔌 Host: Global Store Exposure

In `host-app-vue2/src/store/store-adapter.js`:

## Remore: Global Store Consumeing

In `user-app-vue3`:
In `edit-user-app-vue3`:

using `remote host/state-adapter` composable.

---

### Install Dependencies 

- cd host-app-vue2 && npm install
- cd ../user-app-vue3 && npm install
- cd ../edit-user-app-vue3 && npm install

---

### Run all apps

# In separate terminals
- cd host-app-vue2 && npm run start
- cd user-app-vue3 && npm run start
- cd edit-user-app-vue3 && npm run start

--- 

### Module Federation Exposes

## Host app

// webpack.config.js
exposes: {
  './store-adapter': './src/store/store-adapter.js',
}

## userAppVue3

// webpack.config.js
exposes: {
  './UserList': './src/components/UserList.vue',
  './vue': 'vue',
}

## editUserAppVue3

exposes: {
  './EditUser': './src/components/EditUser.vue',
  './AddUser': './src/components/AddUser.vue',
  './vue': 'vue',
}

---

### Host: Dynamic Loading via @module-federation/runtime

- **await loadRemote('userAppVue3/UserList');**
