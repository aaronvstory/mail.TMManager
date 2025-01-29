<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <!-- Sidebar content -->
      <v-list>
        <v-list-item v-for="folder in folders" :key="folder.id" :to="folder.path">
          {{ folder.name }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mail.tm Client</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-btn
      fab
      bottom
      right
      fixed
      color="primary"
      @click="composeEmail"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <email-composer v-model="showComposer" />
  </v-app>
</template>

<script>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import EmailComposer from './components/EmailComposer.vue'

export default {
  components: { EmailComposer },
  setup() {
    const drawer = ref(false)
    const showComposer = ref(false)
    const theme = useTheme()

    const folders = [
      { id: 1, name: 'Inbox', path: '/' },
      { id: 2, name: 'Sent', path: '/sent' },
      { id: 3, name: 'Drafts', path: '/drafts' },
      { id: 4, name: 'Trash', path: '/trash' },
    ]

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }

    const composeEmail = () => {
      showComposer.value = true
    }

    return { drawer, folders, showComposer, toggleTheme, composeEmail }
  }
}
</script>
