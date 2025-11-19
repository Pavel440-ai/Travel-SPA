<template>
  <TheNavigation />
  <div class="container">
    <RouterView />
  </div>
</template>

<script lang="ts">

import TheNavigation from './components/TheNavigation.vue'
import { RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    TheNavigation,
    RouterView,
  },
}
</script>
