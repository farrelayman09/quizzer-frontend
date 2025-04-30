<template>
  <v-app id="inspire">
    <NavigationDrawer />

    <AppBar/>

    <v-main>
      <!-- <router-view></router-view> -->
      <v-container class="pa-8">
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line class="mb-8"></v-text-field>
        <v-row class="d-flex justify-center mb-8 mt-8">

          <v-dialog v-model="isCreateDialogOpen" max-width="600" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="d-flex justify-center text-none font-weight-regular" text="CREATE TRYOUT"
                color="green-darken-3" v-bind="activatorProps" @click="openCreateDialog"></v-btn>
            </template>


            <v-card>
              <v-card-title>Create Tryout</v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="newTryout.title" label="Title*" required></v-text-field>
                  <v-text-field v-model="newTryout.category" label="Category*" required></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isCreateDialogOpen = false">Cancel</v-btn>
                <v-btn text @click="createTryout">Create</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>


        <v-row dense>


          <v-col cols="12" v-for="tryout in filteredTryouts" :key="tryout.id">
            <v-card color="#385F73">
              <v-card-title class="text-h5">{{ tryout.title }}</v-card-title>
              <v-card-subtitle>{{ tryout.category }}</v-card-subtitle>
              <v-card-subtitle>created at: {{ new Date(tryout.createdAt).toLocaleDateString() }}</v-card-subtitle>
              <v-card-subtitle>status: {{ tryout.status }}</v-card-subtitle>
              <v-row class="d-flex justify-start mt-1 mb-1 ml-1">
                <v-row v-if="tryout.status !== 'locked'" class="mt-1 ml-1 mb-1">
                  <v-card-actions>


                    <v-dialog v-model="isEditDialogOpen" max-width="600" persistent>
                      <template v-slot:activator="{ props: activatorProps }">
                        <v-btn class="text-none font-weight-regular" text="EDIT" variant="tonal"
                          @click="openEditDialog(tryout)" v-bind="activatorProps"></v-btn>
                      </template>

                      <v-card>
                        <v-card-title>Edit Tryout</v-card-title>
                        <v-card-text>
                          <v-form>
                            <v-text-field v-model="editedTryout.title" label="Title*" required></v-text-field>
                            <v-text-field v-model="editedTryout.category" label="Category*" required></v-text-field>
                          </v-form>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text @click="isEditDialogOpen = false">Cancel</v-btn>
                          <v-btn text @click="saveChanges">Save</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-card-actions>
                  <v-card-actions>
                    <v-btn text="GO TO QUESTIONS" @click="goToQuestions(tryout._id)" variant="elevated"
                      color='secondary'></v-btn>
                  </v-card-actions>
                  <v-card-actions>
                    <v-btn text="DELETE" @click="deleteTryout(tryout._id)" variant="elevated"
                      color='red-darken-3'></v-btn>
                  </v-card-actions>
                </v-row>
              </v-row>

            </v-card>
          </v-col>


        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>



<script setup>
import { ref, onMounted } from "vue";
// import axios from "axios";
import { useRouter } from "vue-router";
import api from "../router/api";
import { getCurrentInstance } from "vue";
import { shallowRef } from 'vue'
import NavigationDrawer from "../components/NavigationDrawer.vue";
import { useDrawerStore } from "../stores/useDrawerStore";
import AppBar from '../components/AppBar.vue'; // Adjust path as needed


const drawerStore = useDrawerStore();


const search = ref(""); // Variabel pencarian
const tryouts = ref([]);
const router = useRouter();
const loggedInUser = ref("Guest");
const loggedInId = ref(null);
const originalTryout = ref({});
const { proxy } = getCurrentInstance();
const dialog = shallowRef(false)
const token = localStorage.getItem("accessToken");


const drawer = ref(null);


// Reactive variable to control the dialog's visibility
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

// Reactive variable to hold the selected tryout's data
const editedTryout = ref({
  _id: '',
  title: '',
  category: '',
  // Add other necessary fields
});




onMounted(async () => {
  try {
    loggedInUser.value = localStorage.getItem("username") || "Guest";
    loggedInId.value = localStorage.getItem("id")
    const response = await api.get(`tryout/by-user/${loggedInId.value}`);
    tryouts.value = response.data;
    console.log("tryouts", tryouts.value);
  } catch (error) {
    console.error("Failed to fetch tryouts:", error);
  }
});

const newTryout = ref({ title: "", category: "" });

const openCreateDialog = () => {
  newTryout.value = { title: "", category: "" }; // Reset form
  isCreateDialogOpen.value = true;
};

const createTryout = async () => {
  try {
    const response = await api.post("tryout", newTryout.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      tryouts.value.push(response.data); // Tambah tryout baru ke daftar
    }
    isCreateDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to create tryout:", error);
  }
};

const openEditDialog = (tryout) => {
  originalTryout.value = JSON.parse(JSON.stringify(tryout)); // Deep copy
  editedTryout.value = { ...tryout };
  isEditDialogOpen.value = true;

};

const saveChanges = async () => {
  const changes = {};

  if (editedTryout.value.title !== originalTryout.value.title) {
    changes.title = editedTryout.value.title;
  }
  if (editedTryout.value.category !== originalTryout.value.category) {
    changes.category = editedTryout.value.category;
  }
  // Add similar checks for other fields as needed

  if (Object.keys(changes).length > 0) {
    try {
      await api.put(`tryout/${editedTryout.value._id}`, changes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const index = tryouts.value.findIndex(t => t._id === editedTryout.value._id);
      if (index !== -1) {
        tryouts.value[index] = { ...tryouts.value[index], ...changes };
      }
      isEditDialogOpen.value = false;
    } catch (error) {
      console.error('Failed to update tryout:', error);
    }
  } else {
    isEditDialogOpen.value = false;
  }
};

const deleteTryout = async (id) => {
  try {
    await api.delete(`tryout/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Instantly remove the deleted tryout from the UI
    tryouts.value = tryouts.value.filter(tryout => tryout._id !== id);
  } catch (error) {
    console.error("Failed to delete tryout:", error);
  }
};

const goToQuestions = (id) => {
  router.push(`/my-tryouts/${id}/questions`);
};


const logout = async () => {
  try {
    console.log("Logout initial status");
    const response = await api.delete("auth/logout",
      {},
      { withCredentials: true }
    );
    console.log("Logout response:", response.data);
    localStorage.removeItem('accessToken');
    // proxy.updateAuthState(); 
    router.push("/guest");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Computed Property untuk filter daftar tryouts berdasarkan search
const filteredTryouts = computed(() => {
  return tryouts.value.filter((tryout) =>
    tryout.title.toLowerCase().includes(search.value.toLowerCase()) ||
    tryout.category.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>