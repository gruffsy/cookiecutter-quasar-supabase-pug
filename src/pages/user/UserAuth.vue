
<script setup>
import { computed, ref } from "vue";
import { supabase } from "src/boot/supabase";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";


let magicLinkSent = false;
const store = useStore();
const route = useRoute()
const email = ref("");
const isPwd = ref(true);
const password = ref(null);
const passwordMatch = ref(null);
const emailAuthenticationForm = ref(null);
const $q = useQuasar();
defineExpose({ emailAuthenticationForm });

const isLoginDisabled = computed(() => {
  if (!email.value) {
    return true;
  }
  return !validateEmail();
});
const getAuthTitle = computed(() => {
   return isRegistration.value ? "Register" : "Login";
});
const getMagicLinkCheckEmailLabel = computed(() => {
  return "Check your email for the login link";
});
const getMagicLinkButtonLabel = computed(() => {
  return isRegistration.value
    ? "Register without password"
    : "Log in with Magic link";
});
const getAuthButtonLabel = computed(() => {
  // return this.isRegistration ? 'Зарегистрироваться' : 'Войти'
  return isRegistration.value ? "Register" : "Log in";
});
const isRegistration = computed(() => {
  return route.name === "Register";
});
const routeAuthentication = computed(() => {
  return isRegistration.value ? "/login" : "/register";
});
const validateEmail = () => {
  // eslint-disable-next-line
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value);
};
const onSubmit = () => {
  magicLinkSent = false;
  emailAuthenticationForm.value.validate().then(async (success) => {
    if (!success) return;
    store.dispatch("loading/setLoading", true);
    try {
      if (isRegistration.value) {
        const { error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value,
        });
        console.log("success signup" + email.value);
        if (error) throw new Error(error);
      } else {
        const { error } = await supabase.auth.signIn({
          email: email.value,
          password: password.value,
        });
        console.log("success sign inn" + email.value);
        if (error) throw new Error(error);
      }
    } catch (err) {
      store.dispatch("logs/showError", err);
      if (!password.value) {
        magicLinkSent = true;
        $q.notify(
          "A magic (login) link was not sent. Please check your email address or register"
        );
      }
    } finally {
      store.dispatch("loading/setLoading", false);
      if (!password.value) {
        magicLinkSent = true;
        $q.notify("Please check your email for the login link");
      }
    }
  });
};

// This is for 0Auth login
const hidden = true;
const handleLoginProvider = async (provider) => {
  store.dispatch("loading/setLoading", false);
  try {
    const { error } = await this.$supabase.auth.signIn({
      provider,
    });
    if (error) throw new Error(error);
  } catch (err) {
    this.showError(err);
  } finally {
    store.dispatch("loading/setLoading", false);
  }
};
</script>
<template lang="pug">
q-page(padding)
  h5.text-center.text-primary.q-mt-lg {{ getAuthTitle }}
  q-form.authentication.q-px-md.q-gutter-y-sm(ref='emailAuthenticationForm' @submit='onSubmit')
    q-input(
      v-model='email'
      outlined
      color='primary'
      lazy-rules
      label='Email'
      type='email'
      :rules='[val => !!val || "Please enter your email address"]'
      )
        template(v-slot:prepend)
          q-icon(name='email')
        q-tooltip Enter your email address as a login to the service
    q-input(
      v-if='!isLoginDisabled'
      v-model='password'
      :rules='isRegistration ? [ val => !!val || "Please enter a password"] : none'
      lazy-rules
      outlined
      color='primary'
      label='Password'
      :type='isPwd ? "password" : "text"'
      @keyup.enter='onSubmit'
      
    )
      template(v-slot:prepend)
        q-icon(name='lock')
      template(v-slot:append)
        q-icon.cursor-pointer(
          :name='isPwd ? "visibility_off" : "visibility"'
          @click='isPwd = !isPwd'
        )
      q-tooltip {{ isRegistration ? 'Enter a password to register for the service' : 'Enter a password to connect to the service'}}
    q-input(
      v-if='isRegistration && !isLoginDisabled'
      lazy-rules
      outlined
      color="primary"
      label="Reenter Password"
      v-model="passwordMatch"
      :rules='[val => val === password || "Password mismatch" ]'
      :type="isPwd ? 'password' : 'text'"
      @keyup.enter='onSubmit'
    )
      template(v-slot:prepend)
        q-icon(name='lock')
      template(v-slot:append)
        q-icon.cursor-pointer(
          :name='isPwd ? "visibility_off" : "visibility"'
          @click='isPwd = !isPwd'
        )
      q-tooltip Re-enter your password to register
    q-btn.full-width.q-mt-sm(
      color='green'
      padding='md xs'
      type='submit'
      v-if='!isLoginDisabled && !isRegistration'
      icon='login'
      :label='getMagicLinkButtonLabel'
    )
    q-btn.full-width.q-mt-sm(
      v-if='magicLinkSent'
      color='white'
      padding='md xs'
      disable
      :label='getMagicLinkCheckEmailLabel'
    )
    q-btn.full-width.q-mt-sm(
      color='primary'
      padding='md xs'
      type='submit'
      v-if='!isLoginDisabled'
      :icon='isRegistration ? "how_to_reg" : "login"'
      :label='getAuthButtonLabel'
    )
    q-btn.full-width.q-mt-sm(
      color='secondary'
      padding='md xs'
      v-if='!hidden'
      label='Login with Google'
      icon='google'
      @click='handleLoginProvider("google")'
      )
    q-btn.full-width.q-mt-sm(
      color='dark'
      padding='md xs'
      v-if='!hidden'
      label='Login with Github'
      icon='github'
      @click='handleLoginProvider("github")'
      )
    .q-ml-md.q-mt-xs.text-weight-medium
      router-link.text-blue.text-decoration-none(:to='routeAuthentication')
        span(v-if='isRegistration') I already have an account
        span(v-else) Create a new account
      p
        router-link.text-blue(to='forgot-password') I forgot my password
</template>


<style lang="scss" scoped>
.authentication {
  margin: auto;
  max-width: 25rem;
  width: 100%;
}
</style>
