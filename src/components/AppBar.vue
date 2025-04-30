
<template>
    <v-app-bar>
      <v-app-bar-nav-icon @click="toggleDrawer"/>
      <v-app-bar-title>
        <router-link to="/" style="text-decoration: none; color: inherit;">
          Quizzer
        </router-link>
      </v-app-bar-title>
      <slot></slot> 
    </v-app-bar>
</template>
  
<script setup>
    import { useDrawerStore } from "../stores/useDrawerStore";

    const drawerStore = useDrawerStore();  

    const toggleDrawer = () => {
        drawerStore.drawer = !drawerStore.drawer;
    };
</script>