const routes = [
  {
    path: "/",
    name: "root",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("pages/Index.vue"),
        meta: { authRequired: true },
      },

      {
        path: "login",
        name: "Login",
        component: () => import("pages/user/UserAuth.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("pages/user/UserAuth.vue"),
      },
      {
        path: "forgot-password",
        name: "ForgotPassword",
        component: () => import("src/pages/user/ForgotPassword.vue"),
      },
      {
        path: "change-password",
        name: "ChangePassword",
        component: () => import("src/pages/user/ChangePassword.vue"),
        meta: { authRequired: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
