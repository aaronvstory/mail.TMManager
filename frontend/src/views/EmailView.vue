<template>
  <v-container v-if="email">
    <v-btn @click="goBack">Back</v-btn>
    <h2>{{ email.subject }}</h2>
    <p>From: {{ email.from }}</p>
    <p>Date: {{ formatDate(email.date) }}</p>
    <v-divider></v-divider>
    <div v-html="email.body"></div>
    <v-btn @click="replyEmail">Reply</v-btn>
    <v-btn @click="forwardEmail">Forward</v-btn>
    <v-btn @click="deleteEmail">Delete</v-btn>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmailStore } from '../stores/email'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const emailStore = useEmailStore()
    const email = ref(null)

    onMounted(async () => {
      const id = route.params.id
      email.value = await emailStore.getEmail(id)
    })

    const goBack = () => {
      router.back()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    const replyEmail = () => {
      // Implement reply functionality
    }

    const forwardEmail = () => {
      // Implement forward functionality
    }

    const deleteEmail = async () => {
      await emailStore.deleteEmail(email.value.id)
      router.push('/')
    }

    return {
      email,
      goBack,
      formatDate,
      replyEmail,
      forwardEmail,
      deleteEmail
    }
  }
}
</script>
