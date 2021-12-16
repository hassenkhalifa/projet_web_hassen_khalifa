<template>
  <div>
    <HelloWorld />
    <router-view :isAdmin="isAdmin"></router-view>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#buttond {
  position: absolute;
  right: 0%;
}
.ajout {
  position: absolute;
  right: 15%;
}

.buttonC {
  position: absolute;
  right: 50%;
}
#centerdiv {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
