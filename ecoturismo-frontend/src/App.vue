<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

// Rehidratar perfil si hay token guardado
onMounted(async () => {
  if (auth.isLoggedIn) {
    try {
      await auth.fetchMe()
    } catch {
      // Token expirado → el interceptor de Axios ya limpió la sesión
    }
  }
})
</script>
