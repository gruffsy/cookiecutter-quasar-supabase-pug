<script setup>
import { supabase } from "../boot/supabase";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const title = "Cooki Cutter App";
const router = useRouter();
const auth = useStore().getters['auth/currentUser']
const home = () => {
  router.push({ name: "Home" });
};
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error )throw(error)
  } catch (error) {
    console.log(error);
  }
};
</script>
<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-header(elevated)
    q-toolbar
      q-space
      q-toolbar-title(@click="home") {{title}}
      div Quasar v{{ $q.version }}
      q-btn(v-if='auth' color='white' fab-mini fab flat icon='logout' @click='signOut')
  q-page-container
    router-view
</template>
