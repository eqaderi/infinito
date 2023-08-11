<template>
  <div class="home-page">
    <header>
      <h1>{{ state.message }}</h1>
    </header>
    <main>
      <p>{{ state.description }}</p>
    </main>
    <footer>
      <p>{{ state.footerContent }}</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>

type HomePageState  = {
  message: string;
  description: string;
  footerContent: string;
}

const state: HomePageState = reactive({
  message: "Welcome to the Vue 3 + TypeScript + Composition API Homepage",
  description: "This is the main content of the homepage.",
  footerContent: "Footer Content",
});

</script>

<style scoped>
.home-page {
  text-align: center;
}
header,
footer {
  background-color: #f0f0f0;
  padding: 10px;
}
main {
  padding: 20px;
}
</style>
