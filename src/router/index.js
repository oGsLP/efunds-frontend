import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "raw",
    },
  },
  {
    path: "/data",
    component: () => import("@/views/Index.vue"),
    children: [
      {
        path: "/",
        name: "index",
        redirect: {
          name: "raw",
        },
      },
      {
        path: "/data/raw",
        component: () => import("@/views/Raw.vue"),
        name: "raw",
      },
      {
        path: "/data/returns",
        component: () => import("@/views/Returns.vue"),
        name: "returns",
      },
      {
        path: "/data/risk",
        component: () => import("@/views/Risk.vue"),
        name: "risk",
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  linkActiveClass: "active",
  routes,
});

export default router;
