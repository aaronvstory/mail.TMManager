<template>
  <div class="email-composer">
    <h3>Compose Email</h3>
    <input v-model="to" placeholder="To" />
    <input v-model="subject" placeholder="Subject" />
    <textarea v-model="body" placeholder="Email body"></textarea>
    <button @click="sendEmail">Send</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const to = ref('');
    const subject = ref('');
    const body = ref('');

    const sendEmail = () => {
      alert('Sending emails is not supported by mail.tm. This is just a mockup.');
      // In a real app, you would send the email here
      to.value = '';
      subject.value = '';
      body.value = '';
    };

    return { to, subject, body, sendEmail };
  }
}
</script>

<style scoped>
.email-composer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

input, textarea {
  padding: 5px;
}

textarea {
  height: 150px;
}

button {
  align-self: flex-start;
  padding: 5px 10px;
}
</style>
