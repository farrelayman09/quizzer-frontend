<template>
  <v-app id="inspire">
    <NavigationDrawer />

    <AppBar/>

    <v-main>
      <!-- <router-view></router-view> -->
      <v-container class="pa-8">
        <v-row class="text-h4 font-weight-bold mb-4 ml-2">
          {{ tryout.title }}
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-dialog v-model="isCreateTFDialogOpen" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="d-flex justify-center text-none font-weight-regular" text="TRUE OR FALSE"
                  color="green-darken-3" v-bind="activatorProps" @click="openCreateTFDialog"></v-btn>
              </template>


              <v-card>
                <v-card-title>Create True/False Question</v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="newTFQuestion.question_text" label="Question*" required></v-text-field>
                    <v-radio-group v-model="newTFQuestion.correct_answer" label="Correct Answer" required>
                      <v-radio label="true" value="true"></v-radio>
                      <v-radio label="false" value="false"></v-radio>
                    </v-radio-group>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="isCreateTFDialogOpen = false">Cancel</v-btn>
                  <v-btn text @click="createTFQuestion">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="auto">
            <v-dialog v-model="isCreateSADialogOpen" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="d-flex justify-center text-none font-weight-regular" text="SHORT ANSWER"
                  color="green-darken-3" v-bind="activatorProps" @click="openCreateSADialog"></v-btn>
              </template>


              <v-card>
                <v-card-title>Create Short Answer Question</v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="newSAQuestion.question_text" label="Question*" required></v-text-field>
                    <v-text-field v-model="newSAQuestion.correct_answer" label="Correct Answer*"
                      required></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="isCreateSADialogOpen = false">Cancel</v-btn>
                  <v-btn text @click="createSAQuestion">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="auto">
            <v-dialog v-model="isCreateMCDialogOpen" max-width="800">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="d-flex justify-center text-none font-weight-regular" text="MULTIPLE CHOICE"
                  color="green-darken-3" v-bind="activatorProps" @click="openCreateMCDialog">
                </v-btn>
              </template>

              <v-card>
                <v-card-title>Create Multiple Choice Question</v-card-title>
                <v-card-text>
                  <v-form>
                    <!-- Question Input -->
                    <v-text-field v-model="newMCQuestion.question_text" label="Question*" required>
                    </v-text-field>
                    <v-radio-group v-model="newMCQuestion.correct_answer">


                      <!-- Choices List -->
                      <v-row v-for="(choice, index) in newMCQuestion.choices" :key="index" >
                        <v-col cols="8">
                          <v-text-field v-model="newMCQuestion.choices[index]" :label="'Choice ' + (index + 1)"
                            required>
                          </v-text-field>
                        </v-col>

                        <!-- Set as Correct Answer -->
                        <v-col cols="2" class="mb-4">
                          <v-radio :label="'Correct'" :value="index"></v-radio>
                        </v-col>

                        <!-- Remove Choice Button -->
                        <v-col cols="2" class="mb-4">
                          <v-btn color="red" @click="removeChoice(index)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-radio-group>

                    <!-- Add New Choice -->
                    <v-btn class="mt-2" text="Add Choice" @click="addChoice"></v-btn>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="isCreateMCDialogOpen = false">Cancel</v-btn>
                  <v-btn text @click="createMCQuestion">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>

        <v-row>


          <v-col cols="12" v-for="question in questions" :key="question.id">
            <v-card color="#385F73">
              <v-card-title class="text-h5">{{ question.question_text }}</v-card-title>
              <v-card-subtitle v-if="question.question_type === 'multiple_choice'">
                <v-radio-group v-model="selectedAnswers[question.id]">
                  <v-radio v-for="choice in question.choices" :key="choice" :label="choice" :value="choice"></v-radio>
                </v-radio-group>
              </v-card-subtitle>

              <v-card-subtitle v-if="question.question_type === 'true_false'">
                <v-radio-group v-model="selectedAnswers[question.id]">
                  <v-radio label="true" value="true"></v-radio>
                  <v-radio label="false" value="false"></v-radio>
                </v-radio-group>
              </v-card-subtitle>
              <v-card-subtitle class="text-h6">Answer: {{ question.correct_answer }}</v-card-subtitle>
              <!-- <v-card-subtitle>created at: {{ new Date(question.createdAt).toLocaleDateString() }}</v-card-subtitle> -->
              <!-- <v-card-subtitle>status: {{ tryout.status }}</v-card-subtitle> -->
              <v-row class="d-flex justify-start mt-2 mb-2 ml-2">

                <v-col cols="auto">
                  <v-dialog v-model="isEditDialogOpen" max-width="600">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn text="EDIT" variant="tonal" v-bind="activatorProps"
                        @click="openEditDialog(question)"></v-btn>
                    </template>

                    <v-card>
                      <v-card-title>Edit Question</v-card-title>
                      <v-card-text>
                        <v-form>
                          <v-text-field v-model="editedQuestion.question_text" label="Question*"
                            required></v-text-field>

                          <!-- Jika pertanyaan True/False -->
                          <v-radio-group v-if="editedQuestion.question_type === 'true_false'"
                            v-model="editedQuestion.correct_answer" label="Correct Answer" required>
                            <v-radio label="true" value="true"></v-radio>
                            <v-radio label="false" value="false"></v-radio>
                          </v-radio-group>

                          <!-- Jika pertanyaan Short Answer -->
                          <v-text-field v-if="editedQuestion.question_type === 'short_answer'"
                            v-model="editedQuestion.correct_answer" label="Correct Answer*" required></v-text-field>

                          <!-- Jika pertanyaan Multiple Choice -->
                          <v-radio-group v-if="editedQuestion.question_type === 'multiple_choice'"
                            v-model="editedQuestion.correct_answer" label="Correct Answer" required>
                            <v-radio v-for="choice in editedQuestion.choices" :key="choice" :label="choice"
                              :value="choice"></v-radio>
                          </v-radio-group>
                        </v-form>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="isEditDialogOpen = false">Cancel</v-btn>
                        <v-btn text @click="saveEditedQuestion">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
                <v-card-actions>
                  <v-btn text="DELETE" @click="deleteQuestion(question._id, question.tryout_id)" variant="elevated"
                    color='red-darken-3'></v-btn>
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
import NavigationDrawer from "../components/NavigationDrawer.vue"
import { useDrawerStore } from "../stores/useDrawerStore";
import AppBar from '../components/AppBar.vue'; // Adjust path as needed


const drawerStore = useDrawerStore();

const drawer = ref(null);
const search = ref(""); // Variabel pencarian
const questions = ref([]);
const router = useRouter();
const route = useRoute();
const loggedInUser = ref("Guest");
const loggedInId = ref(null);
const { proxy } = getCurrentInstance();
const selectedAnswers = ref({});
const token = localStorage.getItem("accessToken");
const tryout = ref({});

import { reactive } from "vue";


const isCreateTFDialogOpen = ref(false);
const newTFQuestion = ref({});
const isCreateSADialogOpen = ref(false);
const newSAQuestion = ref({});
const isEditDialogOpen = ref(false);
const editedQuestion = ref({});
const isCreateMCDialogOpen = ref(false);
const newMCQuestion = ref({});

// =======CreateMultipleChoiceQuestion======
const openCreateMCDialog = () => {
  newMCQuestion.value = {
    question_text: "",
    question_type: "multiple_choice",
    choices: ["", ""], // Minimal 2 pilihan
    correct_answer: "",
  };
  isCreateMCDialogOpen.value = true;
};

const addChoice = () => {
  newMCQuestion.value.choices.push("");
};

const removeChoice = (index) => {
  if (index < 0 || index >= newMCQuestion.value.choices.length) return;
  if (newMCQuestion.value.choices[index] === newMCQuestion.value.correct_answer) {
    newMCQuestion.value.correct_answer = null;
  }

  newMCQuestion.value.choices.splice(index, 1);
};

const createMCQuestion = async () => {
  // Validasi sebelum mengirim request
  if (!newMCQuestion.value.question_text.trim()) {
    alert("Question cannot be empty!");
    return;
  }
  if (newMCQuestion.value.choices.length < 2) {
    alert("At least 2 choices are required!");
    return;
  }
  
  if (newMCQuestion.value.correct_answer === null || newMCQuestion.value.correct_answer === undefined 
    || newMCQuestion.value.correct_answer === "") {
    console.log(newMCQuestion.value.correct_answer);
    alert("Select a correct answer!");
    return;
  }

  try {
    newMCQuestion.value.correct_answer = newMCQuestion.value.choices[newMCQuestion.value.correct_answer];
    const response = await api.post(
      `tryout/${route.params.id}/questions`,
      newMCQuestion.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Created MCQ response:", response.data);

    if (response.data) {
      questions.value.push(response.data);
      await fetchQuestions(); // 
      isCreateMCDialogOpen.value = false;
      newMCQuestion.value = { // Reset form
        question_text: "",
        question_type: "multiple_choice",
        choices: ["", ""],
        correct_answer: null,
      };
    }
  } catch (error) {
    console.error("Failed to create multiple choice question:", error);
    alert("Failed to create question. Please try again.");
  }
};




const fetchQuestions = async () => {
  try {
    const response = await api.get(`tryout/${route.params.id}/questions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    questions.value = response.data; // Perbarui state dengan data terbaru
    console.log("Fetched questions:", questions.value);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
  }
};

onMounted(async () => {
  try {
    loggedInUser.value = localStorage.getItem("username") || "Guest";
    loggedInId.value = localStorage.getItem("id")
    fetchQuestions();

    const tryoutResponse = await api.get(`tryout/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    tryout.value = tryoutResponse.data;
    console.log("tryout", tryout.value);
  } catch (error) {
    console.error("Failed to fetch tryouts:", error);
  }
});


//  ======EditQuestion======
const openEditDialog = (question) => {
  editedQuestion.value = { ...question }; // Clone data supaya aman
  isEditDialogOpen.value = true;
};

const saveEditedQuestion = async () => {
  try {
    const response = await api.put(
      `tryout/${route.params.id}/questions/${editedQuestion.value._id}`,
      editedQuestion.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Updated question response:", response.data);

    // Update daftar pertanyaan secara langsung
    const index = questions.value.findIndex(q => q._id === editedQuestion.value._id);
    if (index !== -1) {
      questions.value[index] = response.data;
    }
    await fetchQuestions(); // Ambil data baru setelah tambah/edit


    isEditDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to update question:", error);
  }
};


// ======CreateTruefalseQuestion======
const createTFQuestion = async () => {
  try {
    const response = await api.post(`tryout/${route.params.id}/questions`, newTFQuestion.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Create true_false question response:", response.data);
    if (response.data) {
      questions.value.push(response.data);
      proxy.$forceUpdate();
      await fetchQuestions(); // Ambil data baru setelah tambah/edit

    }
    isCreateTFDialogOpen.value = false;
  } catch (error) {
    console.error("Failed to create true_false question:", error);
  }
};


//  =======CreateShortAnswerQuestion========
const createSAQuestion = async () => {
  try {
    const response = await api.post(`tryout/${route.params.id}/questions`, newSAQuestion.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Create short_answer question response:", response.data);
    if (response.data) {
      questions.value.push(reactive(response.data));
      proxy.$forceUpdate();
      await fetchQuestions(); // Ambil data baru setelah tambah/edit

    }
    isCreateSADialogOpen.value = false;
  } catch (error) {
    console.error("Failed to create short_answer question:", error);
  }
};

const openCreateTFDialog = () => {
  newTFQuestion.value = { question_text: "", question_type: "true_false", correct_answer: "" }; // Reset form
  isCreateTFDialogOpen.value = true;
};

const openCreateSADialog = () => {
  newSAQuestion.value = { question_text: "", question_type: "short_answer", correct_answer: "" }; // Reset form
  isCreateSADialogOpen.value = true;
};


const deleteQuestion = async (id, tryoutId) => {
  try {
    await api.delete(`tryout/${tryoutId}/questions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Instantly remove the deleted tryout from the UI
    questions.value = questions.value.filter(questions => questions._id !== id);
  } catch (error) {
    console.error("Failed to delete tryout:", error);
  }
};


</script>