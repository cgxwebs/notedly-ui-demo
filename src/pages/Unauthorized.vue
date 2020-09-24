<template>
  <BasePage @toggle-nav-drawer="$emit('toggle-nav-drawer')">
    <template v-slot:content>
      <v-container>
        <v-row>
          <v-col class="col-lg-6 offset-lg-3 text-center">
            <h1 class="text-h2 red--text">Not Authorized</h1>

            <p class="py-6">Sorry, you're note allowed to access this page</p>
            <v-btn @click="redirectTo()">Go home</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </BasePage>
</template>

<script>
import BasePage from "@/pages/BasePage";
import RouterHelper from "@/mixins/RouterHelper";
export default {
  name: "Unauthorized",
  mixins: [RouterHelper],
  components: {
    BasePage
  }
};
</script>
