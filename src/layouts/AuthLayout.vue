<template>
  <div class="auth-layout">
    <main class="auth-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: #f5f7fb;
}

.auth-content {
  min-height: 100vh;
}
</style>
