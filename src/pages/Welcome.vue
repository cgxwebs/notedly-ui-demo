<template>
  <BasePage @toggle-nav-drawer="$emit('toggle-nav-drawer')">
    <template v-slot:content>
      <v-container>
        <v-row>
          <v-col class="col-lg-6 offset-lg-3">
            <h1>Welcome to Noted.ly!</h1>

            <p class="py-6">
              This app allows you to create and share notes in HTML, Markdown
              and plain text formats! Use tags to organize your notes, and
              restrict access to role accounts. Password-protected roles provide
              further access protection for reading and writing notes.
            </p>

            <h2>Get started!</h2>

            <div class="py-6">
              <v-btn
                @click="redirectTo('NoteEditor')"
                color="primary"
                class="mr-3"
                >Create a new note</v-btn
              >
              <v-btn @click="$emit('toggle-nav-drawer')">View all notes</v-btn>
            </div>
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
  name: "Welcome",
  mixins: [RouterHelper],
  components: {
    BasePage
  }
};
</script>
