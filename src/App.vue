<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const savedTheme = localStorage.getItem('sigedin_theme')
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', isDark)
})
</script>
