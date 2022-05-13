<template>
  <body>
    <img src="../assets/error.png" alt="page not found" />
    <p>404 Page Not Found</p>
    <router-link to="/" class="btn btn-success">Back to Home</router-link>
  </body>
</template>

<style scoped>
body {
  width: 100vw;
  height: 100vh;
  background-color: chocolate;
  color: lightgray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
p {
  font-size: 30px;
  margin: 25px;
}
</style>
