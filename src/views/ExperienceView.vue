<template>
  <div v-if="experience" class="experience-details">
    <h3>{{ experience.name }}</h3>
    <img :src="`/images/${experience.image}`" :alt="experience.name" />
    <p>{{ experience.description }}</p>
  </div>
  <div v-else>
    <p>Experience not found</p>
  </div>
</template>

<script lang="ts">
import dataDestinations from '../data.json'

export default {
  name: 'ExperienceView',
  props: {
    slug: {
      type: String,
      required: true
    },
    experienceSlug: {
      type: String,
      required: true
    }
  },
  computed: {
    destination() {
      return dataDestinations.destinations.find(d => d.slug === this.slug)
    },
    experience() {
      return this.destination?.experiences?.find(e => e.slug === this.experienceSlug)
    }
  }
}
</script>








