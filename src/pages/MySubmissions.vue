<template>
  <v-app id="inspire">
    <NavigationDrawer />

    <AppBar/>

    <v-main>
      <!-- <router-view></router-view> -->
      <v-container class="pa-8">
        <v-row dense>
          <v-col cols="12" v-if="submissions.length === 0">
            <v-card class="text-center pa-8" color="#385F73">
              <v-card-subtitle class="text-h6 white--text"> No completed tryouts yet. Ready to take your first one?

              </v-card-subtitle>
              <v-card-actions class="justify-center">
                <v-btn variant="tonal" router-link to="/home" text="Take Tryout"></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" v-for="submission in submissions" :key="submission.id">
            <v-card color="#385F73">
              <v-card-title class="text-h5">{{ submission.tryout_title }}</v-card-title>
              <v-card-subtitle class="font-weight-bold">score: {{ submission.score.toFixed(2) }}</v-card-subtitle>
              <v-card-subtitle>submitted at: {{ new Date(submission.submitted_at).toLocaleDateString()
                }}</v-card-subtitle>
              <v-row class="d-flex justify-start mt-2 mb-2 ml-2">
                <v-card-actions>

                  <!-- view you answers -->
                  <v-dialog v-model="isViewDialogOpen" max-width="600" persistent>
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn class="text-none font-weight-regular" text="VIEW YOUR ANSWERS" variant="tonal"
                        @click="openViewDialog(submission)" v-bind="activatorProps"></v-btn>
                    </template>

                    <v-card>
                      <v-card-title>Submission Answers</v-card-title>
                      <v-card-text>
                        <v-list>
                          <v-list-item v-for="(answer, index) in selectedSubmission.answers" :key="answer._id">
                            <v-list-item-title class="font-weight-bold">
                              {{ index + 1 }}. {{ answer.answer }}
                              <v-icon :color="answer.is_correct ? 'green' : 'red'">
                                {{ answer.is_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                              </v-icon>
                            </v-list-item-title>

                          </v-list-item>
                        </v-list>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="CLOSE" variant="text" @click="isViewDialogOpen = false"></v-btn>

                        <!-- <v-btn color="surface-variant" text="Agree" variant="flat" -->
                        <!-- @click="isActive.value = false"></v-btn> -->
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-actions>

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
const submissions = ref([]);
const router = useRouter();
const loggedInUser = ref("Guest");
const loggedInId = ref(null);
const originalTryout = ref({});
const { proxy } = getCurrentInstance();
const dialog = shallowRef(false)
const token = localStorage.getItem("accessToken");




// Reactive variable to control the dialog's visibility
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isViewDialogOpen = ref(false);

// Reactive variable to hold the selected tryout's data
const editedTryout = ref({
  _id: '',
  title: '',
  category: '',
  // Add other necessary fields
});

const selectedSubmission = ref({ answers: [] });


onMounted(async () => {
  try {
    loggedInUser.value = localStorage.getItem("username") || "Guest";
    loggedInId.value = localStorage.getItem("id")
    const response = await api.get(`submission/by-me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    submissions.value = response.data;
    console.log("submissions", submissions.value);
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
  }
});

const newTryout = ref({ title: "", category: "" });

const openViewDialog = (submission) => {
  selectedSubmission.value = submission;
  isViewDialogOpen.value = true;
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

</script>