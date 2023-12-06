<template>
  <div id="boo-cool-cf7-app">
    <CF7Table></CF7Table>
  </div>
</template>

<script>
import CF7Table from "./components/cf7Table.vue";
export default {
  name: 'App',
  components: {CF7Table},
}
</script>
<style lang="scss">
@import './assets/main.scss';
</style>