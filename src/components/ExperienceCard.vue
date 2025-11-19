<template>
  <RouterLink
    :to="{ name: 'experience', params: { slug: destinationSlug, experienceSlug: experience.slug } }"
    class="card"
  >
    <img :src="`/images/${experience.image}`" :alt="experience.name" />
    <span class="card__text">{{ experience.name }}</span>
  </RouterLink>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'

export default {
  name: 'ExperienceCard',
  components: {
    RouterLink
  },
  props: {
    experience: {
      type: Object,
      required: true
    },
    destinationSlug: {
      type: String,
      required: true
    }
  }
}
</script>






