<template>
  <div class="home">
    <h1>All Destinations</h1>
    <div class="destinations">
      <div v-for="destination in destinations" :key="destination.id">
        <RouterLink :to="{ name: 'destination', params: { slug: destination.slug } }">
          <h2>{{ destination.name }}</h2>
          <img :src="`/images/${destination.image}`" :alt="destination.name" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { RouterLink } from 'vue-router'
import dataDestinations from '../data.json'

export default {
  name: 'HomeView',
  components: {
    RouterLink
  },
  data() {
    return {
      destinations: dataDestinations.destinations
    }
  }
}
</script>

