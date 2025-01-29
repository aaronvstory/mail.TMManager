<template>
  <div class="notifications">
    <div v-for="notification in notifications" :key="notification.id" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['notifications']
}
</script>

<style scoped>
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 0.9em;
}

.notification.success {
  background-color: #2ecc71;
}

.notification.error {
  background-color: #e74c3c;
}

.notification.info {
  background-color: #3498db;
}
</style>
