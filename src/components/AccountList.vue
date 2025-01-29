<template>
  <div class="account-list">
    <h1>Email Accounts</h1>
    <table>
      <thead>
        <tr>
          <th>Email Address</th>
          <th>Status</th>
          <th>Last Email</th>
          <th>Monitoring</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.id">
          <td>{{ account.address }}</td>
          <td>
            <span :class="['status', account.status.toLowerCase()]">{{ account.status }}</span>
          </td>
          <td>{{ account.lastEmail || 'N/A' }}</td>
          <td>
            <label class="switch">
              <input type="checkbox" v-model="account.monitoring" @change="$emit('toggle-monitoring', account)">
              <span class="slider round"></span>
            </label>
          </td>
          <td>
            <button @click="$emit('check-emails', account)" class="action-btn">Check Emails</button>
            <button @click="$emit('delete-account', account)" class="action-btn delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['accounts']
}
</script>

<style scoped>
.account-list {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #34495e;
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8em;
}

.status.active {
  background-color: #2ecc71;
  color: #fff;
}

.status.inactive {
  background-color: #e74c3c;
  color: #fff;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #61dafb;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.action-btn {
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #3498db;
  border: none;
  color: white;
  cursor: pointer;
}

.action-btn.delete {
  background-color: #e74c3c;
}
</style>
