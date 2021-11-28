import { boot } from "quasar/wrappers";
import { createClient } from "@supabase/supabase-js";

// Check if Supabase API info is present
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
console.log("Loaded supabase: " + supabaseUrl);
console.log("Loaded supabase: " + supabaseAnonKey);

// Exporting Supabase for use in app

const supabaseClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log("Loaded supabase.");
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, store, router, redirect }) => {
  // Checking user status and redirect accordingly
  supabaseClient.auth.onAuthStateChange(async (event, session, error) => {
    console.log(event);
    store.dispatch("auth/setSession", session);
    if (event === "SIGNED_IN") {
      redirect({ path: "/" });
      return;
    }
    if (event === "SIGNED_OUT") {
      redirect({ path: "/login" });
      return;
    }
    if (event === "PASSWORD_RECOVERY") {
      redirect({ path: "/change-password" });
      return;
    }
    if (event === "USER_UPDATED") {
      store.dispatch("auth/showInfo", "User password changed successfully");
      redirect({ path: "/" });
    }
  });
  router.beforeEach(async (to, from, next) => {
    console.log(from);
    console.log(to);
    const authRequired = to.matched.some((route) => route.meta.authRequired);
       if (authRequired && !supabaseClient.auth.user() && to.path !== '/login') return next({
        path: '/login',
      });
    return next();
  });
  app.config.globalProperties.$supabase = supabaseClient;
  const currentSession = supabaseClient.auth.session();
  store.dispatch("auth/setSession", currentSession);
  return supabaseClient;
});
export const supabase = supabaseClient