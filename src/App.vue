<template>
  <v-app id="notedly">
    <Access v-if="!isAuth"></Access>

    <template v-if="isAuth">
      <Navigation
        :toggledNavDrawer="toggledNavDrawer"
        @trigger-logout="logout"
      ></Navigation>

      <router-view
        :key="$route.fullPath"
        @toggle-nav-drawer="toggleNavDrawer"
      ></router-view>
    </template>

    <v-snackbar
      v-model="snackbar"
      top
      multi-line
      color="blue darken-3"
      elevation="24"
      class="mt-12"
      vertical
    >
      <span class="text-h6">{{ snackbarMessage }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="yellow"
          text
          v-bind="attrs"
          @click="toggleSnackbar(false)"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
import Access from "@/components/Access";
import AccessManager from "@/services/AccessManager";
import { mapGetters, mapActions } from "vuex";
import RouterHelper from "@/mixins/RouterHelper";

export default {
  name: "App",
  mixins: [RouterHelper],
  components: {
    Access,
    Navigation
  },
  data: () => ({
    toggledNavDrawer: false,
    toggleLogout: false
  }),
  methods: {
    toggleNavDrawer() {
      this.toggledNavDrawer = !this.toggledNavDrawer;
    },
    logout() {
      this.$store.dispatch("Access/logout").then(() => {
        this.redirectTo();
      });
    },
    ...mapActions("Ui", ["toggleSnackbar"])
  },
  computed: {
    snackbar: {
      get() {
        return this.$store.state.Ui.snackbar.status;
      },
      set() {
        this.$store.dispatch("Ui/toggleSnackbar");
      }
    },
    ...mapGetters("Access", ["isAuth"]),
    ...mapGetters("Ui", ["snackbarMessage"])
  },
  created() {
    AccessManager.initInterceptor();
  }
};
</script>

<style>
#notedly .v-navigation-drawer__border {
  display: none;
}
</style>
