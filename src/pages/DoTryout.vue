<template>
  <v-app id="inspire">

    <AppBar/>

    <v-main>
      <!-- <router-view></router-view> -->
      <v-container class="pa-8">
        <!-- <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
              single-line class="mb-8"></v-text-field> -->
        <v-row class="text-h4 font-weight-bold mb-4 ml-2">
          {{ tryout.title }}
        </v-row>
        <v-row>
        </v-row>

        <v-row dense>


          <v-col cols="12" v-for="question in questions" :key="question._id">
            <v-card color="#385F73">
              <v-card-title class="text-h5">{{ question.question_text }}</v-card-title>

              <!-- True/False -->
              <v-card-subtitle v-if="question.question_type === 'true_false'">
                <v-radio-group v-model="selectedAnswers[question._id]"
                  @update:modelValue="updateAnswer(question._id, question.question_type, $event)">
                  <v-radio label="True" :value="'true'"></v-radio>
                  <v-radio label="False" :value="'false'"></v-radio>
                </v-radio-group>
              </v-card-subtitle>

              <!-- Short Answer -->
              <v-card-subtitle v-if="question.question_type === 'short_answer'">
                <v-text-field v-model="selectedAnswers[question._id]" label="Answer" outlined
                  @update:modelValue="updateAnswer(question._id, question.question_type, $event)">
                </v-text-field>
              </v-card-subtitle>

              <!-- Multiple Choice -->
              <v-card-subtitle v-if="question.question_type === 'multiple_choice'">
                <v-radio-group v-model="selectedAnswers[question._id]"
                  @update:modelValue="updateAnswer(question._id, question.question_type, $event)">
                  <v-radio v-for="choice in question.choices" :key="choice" :label="choice" :value="choice"></v-radio>
                </v-radio-group>
              </v-card-subtitle>

            </v-card>
          </v-col>



        </v-row>
        <v-row class="mt-8 mb-8">
          <v-col cols="12" class="d-flex justify-center pt-2 pb-2">
            <v-btn block class="text-none font-weight-bold text-h6 " min-height="50" text="SUBMIT"
              color="green-darken-3" @click="submit"></v-btn>
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

const drawer = ref(null);
const search = ref(""); // Variabel pencarian
const questions = ref([]);
const router = useRouter();
const route = useRoute();
const loggedInUser = ref("Guest");
const loggedInId = ref(null);
const { proxy } = getCurrentInstance();
const selectedAnswers = ref({});
const isCreateTFDialogOpen = ref(false);
const token = localStorage.getItem("accessToken");
const tryout = ref({});

onMounted(async () => {
  try {
    loggedInUser.value = localStorage.getItem("username") || "Guest";
    loggedInId.value = localStorage.getItem("id")
    const response = await api.get(`tryout/${route.params.id}/auth-questions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    questions.value = response.data;
    // Initialize selectedAnswers with reactive properties for each question
    questions.value.forEach(question => {
      if (!(question._id in selectedAnswers.value)) {
        selectedAnswers.value[question._id] = null;
      }
    });

    console.log("questions", questions.value);


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

const submit = async () => {
  try {
    // Transform selectedAnswers into the desired array format
    const formattedAnswers = Object.entries(selectedAnswers.value).map(
      ([question_id, answer]) => ({
        question_id,
        answer,
      })
    );

    const submissionData = {
      tryout_id: route.params.id,
      answers: formattedAnswers,
    };

    console.log("Submission data:", submissionData);

    const response = await api.post("submission/", submissionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Submission successful:", response.data);
    router.push("/my-submissions"); // Redirect to submissions page
  } catch (error) {
    console.error("Failed to submit:", error);
  }
};

const updateAnswer = (id, type, value) => {
  if (type === "true_false") {
    selectedAnswers.value[id] = value.toString(); // Pastikan tersimpan sebagai string
  } else {
    selectedAnswers.value[id] = value; // Biarkan untuk multiple choice
  }
};



</script>