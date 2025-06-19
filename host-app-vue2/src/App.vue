<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/user">
        Go to User List
      </router-link>
      <router-link to="/add-user"> |
        Add New User
      </router-link>
    </nav>
    <router-view />
  </div>
</template>


<script>
export default {
  name: 'App',
  async created() {
    await this.$store.dispatch('fetchUsers');
    console.log('app called again *****************')
  },
  mounted() {
    if (window.shellEventBus) {
      window.shellEventBus.$on('delete-user', this.handleDeleteUserFromRemote)
    }
  },

  beforeDestroy() {
    if (window.shellEventBus) {
      window.shellEventBus.$off('delete-user', this.handleDeleteUserFromRemote)
    }
  },

  methods: {
    async handleDeleteUserFromRemote(id) {
      try {
        await this.$store.dispatch('deleteUser', id)
        alert(`[Host] User deleted via event bus, ID: ${id}`)
        console.log('[Host] User deleted via event bus, ID:', id)
        // this.$router.push('/')
      } catch (err) {
        console.error('[Host] Failed to delete user via event bus:', err)
      }
    }
  }

};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
