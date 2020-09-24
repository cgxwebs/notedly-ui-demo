<template>
  <BasePage @toggle-nav-drawer="$emit('toggle-nav-drawer')">
    <template v-slot:content>
      <v-container>
        <v-row>
          <v-col class="col-lg-6 offset-lg-3 text-center">
            <h1 class="text-h2 red--text">Four Oh Four...</h1>

            <p class="py-6">Oopsie, page does not exist.</p>
            <v-btn @click="$router.back()">Go back</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </BasePage>
</template>

<script>
import BasePage from "@/pages/BasePage";
export default {
  name: "NotFound",
  components: {
    BasePage
  }
};
</script>
