<script setup>
import { ref } from "vue";
import { supabase } from "src/boot/supabase";
import { useStore } from "vuex";

const store = useStore();
const email = ref("");
const forgotPasswordForm = ref(null);
defineExpose({ forgotPasswordForm });
const onSubmit = () => {
  forgotPasswordForm.value.validate().then(async (success) => {
    if (success) {
      store.dispatch("loading/setLoading", true);
      try {
        const { error } = await supabase.auth.api.resetPasswordForEmail(
          email.value
        );
        if (error) throw error;
        store.dispatch(
          "logs/showInfo",
          "An email with a link to reset your password was sent to the specified address"
        );
        // this.$router.push({ path: '/auth/login' })
      } catch (err) {
        store.dispatch(
          "logs/showError",
          "An error occurred while trying to send a password reset email"
        );
      } finally {
        store.dispatch("loading/setLoading", false);
      }
    }
  });
};
</script>

<template lang="pug">
q-page(padding)
  h5.text-center.text-primary.q-mt-lg Password recovery
  q-form.authentication.q-px-md.q-gutter-y-sm(ref='forgotPasswordForm' @submit="onSubmit")
    p.q-mb-lg Please enter your email address. A link to reset your password will be sent to it.
    //- email input
    q-input(
      v-model='email'
      outlined
      color='primary'
      label='Email'
      lazy-rules
      :rules='[val => !!val || "Please enter your e-mail address"]'
      )
      template(v-slot:prepend)
        q-icon(name='far fa-envelope')
      q-tooltip Enter the email address that was used to log in
    //- reset button
    q-btn.full-width.q-mt-sm(
      color='primary'
      data-cy='submit'
      padding='md xs'
      label='Reset the password'
      type='submit'
    )
</template>

<style lang="scss">
.authentication {
  margin: auto;
  max-width: 25rem;
  width: 100%;
}
</style>
