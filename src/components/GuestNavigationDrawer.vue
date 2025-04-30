<script setup>
import { useDrawerStore } from "../stores/useDrawerStore";
import { ref } from "vue";
import api from "../router/api";
import { useRoute } from "vue-router";

const drawerStore = useDrawerStore();
const loggedInUser = localStorage.getItem("username") 
const router = useRouter();



const logout = async () => {
  try {
    console.log("Logout initial status");
    const response = await api.delete("auth/logout",
      {},
      { withCredentials: true }
    );
    console.log("Logout response:", response.data);
    localStorage.removeItem('accessToken');
    router.push("/guest");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

</script>

<template>
    <v-navigation-drawer :width="270" v-model="drawerStore.drawer" app>
        <v-list-item class="my-2" title="Guest" subtitle="Login to submit and create tryouts!"></v-list-item>
        <v-list-item router-link to="/login" prepend-icon="mdi-login" title="Login"></v-list-item>
    </v-navigation-drawer>
</template>
