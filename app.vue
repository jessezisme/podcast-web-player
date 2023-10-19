<template>
  <div id="app-cont">
    <TheHeader />
    <main id="app-main">
      <NuxtPage />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
#app-cont {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
#app-main {
  flex-grow: 1;
}
</style>
