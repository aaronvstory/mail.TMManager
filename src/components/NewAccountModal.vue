<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h2>Create New Account</h2>
      <input v-model="email" placeholder="Email address" />
      <input v-model="password" type="password" placeholder="Password" />
      <div class="button-group">
        <button @click="createAccount" :disabled="!isValid">Create</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  props: ['show'],
  emits: ['close', 'create'],
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');

    const isValid = computed(() => {
      return email.value.includes('@') && password.value.length >= 8;
    });

    const createAccount = () => {
      if (isValid.value) {
        emit('create', { email: email.value, password: password.value });
        email.value = '';
        password.value = '';
      }
    };

    return { email, password, isValid, createAccount };
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  background-color: #34495e;
  color: white;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button:first-child {
  background-color: #61dafb;
  color: #1e2329;
}

button:last-child {
  background-color: #e74c3c;
  color: white;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
