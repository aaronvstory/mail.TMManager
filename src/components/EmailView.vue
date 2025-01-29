<template>
  <div class="email-view">
    <EmailFilter :emails="allEmails" @filter="filteredEmails = $event" />
    <div v-if="filteredEmails.length === 0" class="no-emails">No emails found</div>
    <div v-else class="email-list">
      <div v-for="email in filteredEmails" :key="email.id" class="email-item">
        <div class="email-header">
          <span class="from">{{ email.from.address }}</span>
          <span class="subject">{{ email.subject }}</span>
          <span class="date">{{ formatDate(email.createdAt) }}</span>
        </div>
        <div class="email-content" v-html="email.html"></div>
        <button @click="deleteEmail(email.id)" class="delete-button">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import EmailFilter from './EmailFilter.vue';
import { getEmails, deleteEmail as deleteEmailFromStorage } from '../utils/storage';

export default {
  components: { EmailFilter },
  props: ['currentAccount'],
  setup(props) {
    const allEmails = ref([]);
    const filteredEmails = ref([]);

    const loadEmails = async () => {
      allEmails.value = await getEmails(props.currentAccount.id);
      filteredEmails.value = allEmails.value;
    };

    const deleteEmail = async (emailId) => {
      await deleteEmailFromStorage(emailId);
      await loadEmails();
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    onMounted(loadEmails);
    watch(() => props.currentAccount, loadEmails);

    return { allEmails, filteredEmails, deleteEmail, formatDate };
  }
}
</script>

<!-- ... styles ... -->
