<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Compose Email</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="sendEmail">
          <v-text-field v-model="to" label="To" required></v-text-field>
          <v-text-field v-model="subject" label="Subject" required></v-text-field>
          <v-textarea v-model="body" label="Message" required></v-textarea>
          <v-btn type="submit" color="primary" block>Send</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dialog = ref(false)
    const to = ref('')
    const subject = ref('')
    const body = ref('')

    watch(() => props.modelValue, (newValue) => {
      dialog.value = newValue
    })

    watch(dialog, (newValue) => {
      emit('update:modelValue', newValue)
    })

    const sendEmail = () => {
      // Implement email sending logic here
      console.log('Sending email:', { to: to.value, subject: subject.value, body: body.value })
      dialog.value = false
    }

    return { dialog, to, subject, body, sendEmail }
  }
}
</script>
