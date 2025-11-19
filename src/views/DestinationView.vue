<template>
  <div v-if="destination">
    <div class="go-back">
      <button @click="$router.back()">GO BACK</button>
    </div>

    <div class="destination-details">
      <img :src="`/images/${destination.image}`" :alt="destination.name" />
      <div>
        <h1>{{ destination.name }}</h1>
        <p>{{ destination.description }}</p>
      </div>
    </div>

    <div class="experiences">
      <h2>Top Experiences in {{ destination.name }}</h2>
      <div class="cards">
        <ExperienceCard
          v-for="experience in destination.experiences"
          :key="experience.slug"
          :experience="experience"
          :destination-slug="slug"
        />
      </div>
    </div>

    <RouterView :key="$route.fullPath" />
  </div>
  <div v-else>
    <p>Destination not found</p>
  </div>
</template>

<script lang="ts">

import { RouterView } from 'vue-router'
import ExperienceCard from '../components/ExperienceCard.vue'
import dataDestinations from '../data.json'

export default {
  name: 'DestinationView',
  components: {
    RouterView,
    ExperienceCard
  },
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  computed: {
    destination() {
      return dataDestinations.destinations.find(d => d.slug === this.slug)
    }
  }
}
</script>

<style scoped>
.go-back button {
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
}

.go-back button:hover {
  background-color: #4e6c71;
}
</style>






