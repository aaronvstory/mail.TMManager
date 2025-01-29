<template>
  <v-container>
    <h2>{{ capitalizedFolder }}</h2>
    <v-list>
      <v-list-item v-for="email in emails" :key="email.id" @click="viewEmail(email.id)">
        <v-list-item-content>
          <v-list-item-title>{{ email.subject }}</v-list-item-title>
          <v-list-item-subtitle>{{ email.from }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          {{ formatDate(email.date) }}
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmailStore } from '../stores/email'

export default {
  props: ['folder'],
  setup(props) {
    const router = useRouter()
    const emailStore = useEmailStore()
    const emails = ref([])

    const capitalizedFolder = computed(() => {
      return props.folder.charAt(0).toUpperCase() + props.folder.slice(1)
    })

    onMounted(async () => {
      await emailStore.fetchEmails(props.folder)
      emails.value = emailStore.getEmails(props.folder)
    })

    const viewEmail = (id) => {
      router.push({ name: 'EmailView', params: { id } })
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    return {
      emails,
      capitalizedFolder,
      viewEmail,
      formatDate
    }
  }
}
</script>
