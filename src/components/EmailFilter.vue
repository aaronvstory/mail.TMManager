<template>
  <div class="email-filter">
    <input v-model="searchTerm" placeholder="Search emails..." @input="applyFilters" />
    <select v-model="filterCriteria" @change="applyFilters">
      <option value="all">All</option>
      <option value="sender">Sender</option>
      <option value="subject">Subject</option>
      <option value="content">Content</option>
    </select>
    <select v-model="dateFilter" @change="applyFilters">
      <option value="all">All Time</option>
      <option value="today">Today</option>
      <option value="week">This Week</option>
      <option value="month">This Month</option>
      <option value="custom">Custom Range</option>
    </select>
    <div v-if="dateFilter === 'custom'">
      <input type="date" v-model="startDate" @change="applyFilters" />
      <input type="date" v-model="endDate" @change="applyFilters" />
    </div>
    <button @click="sortEmails('date')">Sort by Date</button>
    <button @click="sortEmails('sender')">Sort by Sender</button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ['emails'],
  emits: ['filter'],
  setup(props, { emit }) {
    const searchTerm = ref('');
    const filterCriteria = ref('all');
    const dateFilter = ref('all');
    const startDate = ref('');
    const endDate = ref('');

    const applyFilters = () => {
      let filteredEmails = props.emails;

      if (searchTerm.value) {
        filteredEmails = filteredEmails.filter(email => {
          if (filterCriteria.value === 'all' || filterCriteria.value === 'sender') {
            if (email.from.address.toLowerCase().includes(searchTerm.value.toLowerCase())) return true;
          }
          if (filterCriteria.value === 'all' || filterCriteria.value === 'subject') {
            if (email.subject.toLowerCase().includes(searchTerm.value.toLowerCase())) return true;
          }
          if (filterCriteria.value === 'all' || filterCriteria.value === 'content') {
            if (email.text.toLowerCase().includes(searchTerm.value.toLowerCase())) return true;
          }
          return false;
        });
      }

      if (dateFilter.value !== 'all') {
        const now = new Date();
        let filterStartDate;
        let filterEndDate = now;

        switch (dateFilter.value) {
          case 'today':
            filterStartDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            filterStartDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            filterStartDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case 'custom':
            filterStartDate = startDate.value ? new Date(startDate.value) : null;
            filterEndDate = endDate.value ? new Date(endDate.value) : null;
            break;
        }

        filteredEmails = filteredEmails.filter(email => {
          const emailDate = new Date(email.createdAt);
          if (filterStartDate && emailDate < filterStartDate) return false;
          if (filterEndDate && emailDate > filterEndDate) return false;
          return true;
        });
      }

      emit('filter', filteredEmails);
    };

    const sortEmails = (criteria) => {
      let sortedEmails = [...props.emails];
      if (criteria === 'date') {
        sortedEmails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (criteria === 'sender') {
        sortedEmails.sort((a, b) => a.from.address.localeCompare(b.from.address));
      }
      emit('filter', sortedEmails);
    };

    watch(() => props.emails, applyFilters);

    return { 
      searchTerm, 
      filterCriteria, 
      dateFilter, 
      startDate, 
      endDate, 
      applyFilters, 
      sortEmails 
    };
  }
}
</script>

<style scoped>
.email-filter {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

input, select, button {
  padding: 5px 10px;
}
</style>
</boltArtifact>

Now, let's implement the notification system in our `App.vue`:

<boltArtifact id="update-app-notifications" title="Update App.vue with Notifications">
<boltAction type="file" filePath="src/App.vue">
<script>
import { ref, onMounted, watch } from 'vue';
import { storeAccount, getAccounts, storeEmail, getEmails, deleteEmail } from './utils/storage';
import { mailTmApi } from './services/mailTmApi';

export default {
  // ... other component code ...
  setup() {
    // ... other setup code ...
    const notificationSound = ref(null);
    const notificationEnabled = ref(true);
    const soundEnabled = ref(true);

    onMounted(() => {
      notificationSound.value = new Audio('/path/to/notification-sound.mp3');
    });

    const checkNewEmails = async (account) => {
      const lastCheckedTime = account.lastCheckedTime || 0;
      const messages = await mailTmApi.getMessages(account.token);
      const newMessages = messages.filter(msg => new Date(msg.createdAt) > lastCheckedTime);

      for (const message of newMessages) {
        await storeEmail(account.id, message);
        if (notificationEnabled.value) {
          showNotification(account.address, message.subject);
        }
        if (soundEnabled.value) {
          notificationSound.value.play();
        }
      }

      account.lastCheckedTime = Date.now();
      await storeAccount(account);
    };

    const showNotification = (accountAddress, subject) => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('New Email', {
              body: `New message in ${accountAddress}: ${subject}`
            });
          }
        });
      }
    };

    // ... other methods ...

    return {
      // ... other return values ...
      notificationEnabled,
      soundEnabled,
      checkNewEmails
    };
  }
}
</script>

<template>
  <!-- ... other template code ... -->
  <div v-if="currentView === 'settings'">
    <h2>Settings</h2>
    <!-- ... other settings ... -->
    <div>
      <label>
        <input type="checkbox" v-model="notificationEnabled" />
        Enable Desktop Notifications
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="soundEnabled" />
        Enable Sound Alerts
      </label>
    </div>
  </div>
  <!-- ... other template code ... -->
</template>
