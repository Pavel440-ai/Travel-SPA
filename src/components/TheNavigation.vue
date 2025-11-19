<template>
  <nav id="nav">
    <div class="container">
      <RouterLink to="/" id="logo">Travel</RouterLink>
      <RouterLink to="/" :class="{ active: $route.name === 'home' }">Home</RouterLink>
      <RouterLink
        v-for="destination in destinations"
        :key="destination.id"
        :to="{ name: 'destination', params: { slug: destination.slug } }"
        :class="{ active: isActive(destination.slug) }"
      >
        {{ destination.name }}
      </RouterLink>
    </div>
  </nav>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'
import dataDestinations from '../data.json'

export default {
  name: 'TheNavigation',
  components: {
    RouterLink
  },
  data() {
    return {
      destinations: dataDestinations.destinations
    }
  },
  computed: {
    currentSlug() {
      return this.$route.params.slug
    }
  },
  methods: {
    isActive(slug) {
      return this.currentSlug === slug
    }
  }
}
</script>


