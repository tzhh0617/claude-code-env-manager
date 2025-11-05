<template>
  <div class="home">
    <div class="environment-manager">
      <EnvironmentList />
    </div>
  </div>
</template>

<script setup lang="ts">
import EnvironmentList from '../components/EnvironmentList.vue'
</script>

<style scoped>
.home {
  width: 100%;
  max-width: 800px;
}

.environment-manager {
  width: 100%;
}
</style>