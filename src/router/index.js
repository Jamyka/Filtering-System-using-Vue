import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PurchasesView from "../views/PurchasesView.vue";
import SalesView from "../views/SalesView.vue";
import NotFound from "../views/NotFound.vue";
import SuppliersView from "../views/SuppliersView.vue";
import ClientsView from "../views/ClientsView.vue";
import StockView from "../views/StockView.vue";

const router = createRouter({
  linkActiveClass: "active",
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/sales",
      name: "sales",
      component: SalesView,
    },
    {
      path: "/purchases",
      name: "purchases",
      // component: () => import("../views/SalesView.vue"),
      component: PurchasesView,
    },
    {
      path: "/stock",
      name: "stock",
      // component: () => import("../views/SalesView.vue"),
      component: StockView,
    },
    {
      path: "/suppliers",
      name: "suppliers",
      // component: () => import("../views/SalesView.vue"),
      component: SuppliersView,
    },
    {
      path: "/clients",
      name: "clients",
      // component: () => import("../views/SalesView.vue"),
      component: ClientsView,
    },
    {
      path: "/:catchAll(.*)",
      name: "404 Not Found",
      // component: () => import("../views/SalesView.vue"),
      component: NotFound,
    },
  ],
});

export default router;
