<template>
  <div class="app-container">
    <Timer></Timer>
  </div>
</template>

<script>
import Timer from './components/Timer.vue';

export default {
  name: 'App',
  components: {
    Timer
  }
}
</script>

<style>
.app-container {
  height: 100vh;
  background-image: url('https://hips.hearstapps.com/hmg-prod/images/rocky-4-fotogramas-4-1605714387.jpg?crop=1.00xw:0.876xh;0,0.0481xh&resize=2048:*');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif; /* Cambia la fuente según prefieras */
  color: white; /* Color de texto por defecto */
}
</style>
