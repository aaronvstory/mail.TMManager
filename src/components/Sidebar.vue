<template>
  <div class="sidebar">
    <h2 class="logo">Mail Manager</h2>
    <button class="new-account-btn" @click="$emit('new-account')">+ New Account</button>
    <nav>
      <ul>
        <li><a href="#" @click="$emit('change-view', 'accounts')" :class="{ active: currentView === 'accounts' }">Accounts</a></li>
        <li><a href="#" @click="$emit('change-view', 'settings')" :class="{ active: currentView === 'settings' }">Settings</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: ['currentView']
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #1e2329;
  padding: 20px;
  height: 100vh;
}

.logo {
  color: #61dafb;
  margin-bottom: 20px;
}

.new-account-btn {
  width: 100%;
  padding: 10px;
  background-color: #61dafb;
  border: none;
  color: #1e2329;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  margin-bottom: 10px;
}

nav ul li a {
  color: #fff;
  text-decoration: none;
}

nav ul li a.active {
  color: #61dafb;
}
</style>
