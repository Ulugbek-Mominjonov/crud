<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
html {
  box-sizing: border-box;
}
*,
*::after,
*::before {
  box-sizing: inherit;
}
body {
  padding: 0;
  margin: 0;
  font-family: "Open Sans", "Arial", sans-serif;
  font-weight: 500;
  font-size: 19px;
  line-height: 23px;
  color: #515151;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
}
.alert-message {
  font-size: 20px;
  span {
    margin-left: 5px;
    color: red;
  }
}
</style>
