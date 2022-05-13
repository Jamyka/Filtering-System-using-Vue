<template>
  <nav
    class="navbar navbar-expand-lg navbar-expand-sm navbar-light bg-light p-3"
    style="direction: rtl"
  >
    <div class="container-fluid">
      <p @click="home" class="navbar-brand">PlazaSoft</p>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/sales" class="nav-link" aria-current="page"
              >تقرير المبيعات</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/purchases" class="nav-link"
              >تقرير المشتريات</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/stock" class="nav-link"
              >تقرير المخازن</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    home() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
  display: inline;
}
a {
  text-decoration: none;
}
a.active {
  font-weight: 500;
  color: orange !important;
  background-color: gray;
  border: 1px solid orange !important;
  border-radius: 20px;
}
p {
  cursor: pointer;
}
</style>
