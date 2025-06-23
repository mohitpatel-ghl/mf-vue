
# 🧩 Vue 2 Host with Vue 3 Micro-Frontends (Module Federation)

This project demonstrates a **micro-frontend architecture** using **Vue 2 as the host application** and **Vue 3 applications as dynamically loaded remotes**, powered by **Webpack Module Federation**.  
It showcases seamless cross-version communication, shared state management, and routing.

---

## ✅ Features

### 🔷 Vue 2 Host Application (`hostApp`)

- **Global Reactive Store**  
  Manages the central user data using **Vuex (Vue 2)**.

- **Global Store Exposure**  
  Exposes a reactive global store (`users`, `isLoading`, `error`) to Vue 3 remotes via a **store-adapter** and `Vue.observable`.

- **Shared Services**  
  Provides:
  - A global **EventBus** for pub-sub communication
  - **Vue Router** and **Vue I18n** instances  
  These are shared with remotes via `provide`/`inject`.

- **Routing**  
  - `/users`: Loads Vue 3 **User List** via `UserList.vue`
  - `/edit-user/:id`: Loads Vue 3 **Edit User** via `EditUser.vue`
  - `/add-user`: Loads Vue 3 **Add User** via `AddUser.vue`

- **API Simulation**  
  Handles events from remotes to trigger **mock API** actions (e.g. update, add, delete users).

- **Error Handling**  
  Implements basic error handling and loading indicators.

---

### 🟢 Vue 3 Remote Applications (`userAppVue3`, `editUserAppVue3`)

- **Dynamic Loading**  
  Loaded into the host at runtime using **Webpack Module Federation**.

- **Reactive Store Consumption**  
  Inject the `store-adapter` from host to listen to reactive state.

- **No Direct API Calls / State Mutations**  
  - Emit events like `remote:updateUser`, `remote:addUser`, `remote:deleteUser`  
  - Host listens, dispatches Vuex actions, updates state  
  - Remotes react to updated store

- **Shared Service Consumption**  
  Inject shared services: `EventBus`, `hostRouter`, `i18n`.

---

### 🧩 `userAppVue3` (User List)

- Displays user list from host store
- Reacts to store updates
- "Edit" → navigates to `/edit-user/:id`
- "Delete" → emits `remote:deleteUser` event
- Custom modal used for confirmation

---

### 🧩 `editUserAppVue3` (Edit/Add User Form)

- Receives `userId` via `inject` (null for add mode)
- Fetches user from host's store
- Renders editable form
- On submit:
  - Emits `remote:updateUser` or `remote:addUser` event
  - Host updates store + simulates API
  - Remote reflects update and navigates to `/users`

---

## 🗂 Project Structure

```plaintext
├── host-app-vue2/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.vue
│   │   │   ├── About.vue
│   │   │   ├── UserList.vue
│   │   │   ├── EditUser.vue
│   │   │   └── AddUser.vue
│   │   ├── plugins/
│   │   │   └── i18n.js
│   │   │   └── eventBus.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── store-adapter.js
│   │   ├── utility/
│   │   │   ├── dummy-users.json
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── webpack.config.js
├── user-app-Vue3/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── composables/
│   │   │   └── useHostStore.ts
│   │   ├── pages/
│   │   │   └── UserList.vue
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── webpack.config.js
├── edit-user-app-vue3/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── composables/
│   │   │   └── useHostStore.ts
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── webpack.config.js
```

---

## 🚀 Setup and Running the Applications

### Step 1: Install Dependencies

```bash
# Host App
cd host-app-vue2
npm install 

# Remote App 1
cd ../user-app-vue3
npm install 

# Remote App 2
cd ../edit-user-app-vue3
npm install 
```

### Step 2: Start Dev Servers (3 terminals)

**Terminal 1: Host App (Vue 2)**  
```bash
cd host-app-vue2
npm run serve
# → http://localhost:8080
```

**Terminal 2: User List App (Vue 3)**  
```bash
cd user-app-vue3
npm run serve
# → http://localhost:8081
```

**Terminal 3: Edit/Add User App (Vue 3)**  
```bash
cd edit-user-app-vue3
npm run serve
# → http://localhost:8082
```

### Step 3: Access the App

Open [http://localhost:8080](http://localhost:8080) in your browser. Use the navigation to:

- View **User List** (`userAppVue3`)
- Add a user (`editUserAppVue3` in add mode)
- Edit a user (`editUserAppVue3` in edit mode)

---

## ⚙️ Interoperability Highlights

- **`provide` / `inject` Sharing**  
  - Vue 2 provides: `store-adapter`, `EventBus`, `i18n`, `router`
  - Vue 3 remotes inject these in `setup()`

- **`store-adapter.js`**  
  - Wraps Vuex store using `Vue.observable`
  - Reactively bridges Vue 2 store to Vue 3

- **Event Communication**  
  - Remotes emit events (`remote:updateUser`, etc.)
  - Host listens and dispatches Vuex actions

- **Routing**  
  - All navigation handled by host router
  - Remotes use injected `hostRouter.push(...)`

- **Passing IDs**  
  - Host extracts `:id` from route
  - Provides it via `provide`
  - Remote uses `inject` to get `userId`

---

## 🧪 Troubleshooting

- Check **browser console** for errors
- Ensure **remoteEntry.js** files load correctly
- Restart servers after changes to:
  - `webpack.config.js`
  - `main.js`
