import { defineStore } from 'pinia'
import axios from 'axios'

export const useEmailStore = defineStore('email', {
  state: () => ({
    emails: {
      inbox: [],
      sent: [],
      drafts: [],
      trash: []
    },
    currentEmail: null
  }),
  actions: {
    async fetchEmails(folder) {
      try {
        const response = await axios.get(`/api/emails/${folder}`)
        this.emails[folder] = response.data
      } catch (error) {
        console.error('Error fetching emails:', error)
      }
    },
    async getEmail(id) {
      try {
        const response = await axios.get(`/api/emails/${id}`)
        this.currentEmail = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching email:', error)
      }
    },
    async sendEmail(email) {
      try {
        await axios.post('/api/emails', email)
        this.emails.sent.unshift(email)
      } catch (error) {
        console.error('Error sending email:', error)
      }
    },
    async deleteEmail(id) {
      try {
        await axios.delete(`/api/emails/${id}`)
        for (const folder in this.emails) {
          this.emails[folder] = this.emails[folder].filter(email => email.id !== id)
        }
      } catch (error) {
        console.error('Error deleting email:', error)
      }
    }
  },
  getters: {
    getEmails: (state) => (folder) => state.emails[folder]
  }
})
