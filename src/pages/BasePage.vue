<template>
  <div>
    <v-app-bar app clipped-left class="blue darken-4">
      <v-app-bar-nav-icon
        @click.stop="$emit('toggle-nav-drawer')"
        class="blue--text text--lighten-4"
      ></v-app-bar-nav-icon>

      <v-btn
        v-if="showCreateButton"
        @click.stop="redirectTo('NoteEditor')"
        class="amber accent-1 grey--text text--darken-4 ma-2"
        >Create Note</v-btn
      >

      <slot name="secondary-nav"></slot>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <slot name="content"></slot>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import RouterHelper from "@/mixins/RouterHelper";

export default {
  name: "BasePage",
  mixins: [RouterHelper],
  props: {
    showCreateButton: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style>
body {
  background-color: #fafafa;
}
</style>
