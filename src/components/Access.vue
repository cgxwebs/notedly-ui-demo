<template>
  <v-dialog :value="!isAuth" width="400" persistent>
    <v-card class="elevation-24">
      <v-card-title>Authorization Required</v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            v-model="credentials.username"
            label="Username"
            prepend-icon="mdi-account"
          ></v-text-field>

          <v-text-field
            v-model="credentials.password"
            @keydown.enter="login"
            type="password"
            label="Password"
            prepend-icon="mdi-lock"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="login" text>Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import FormHelper from "@/mixins/FormHelper";
import RouterHelper from "@/mixins/RouterHelper";

export default {
  name: "Access",
  mixins: [FormHelper, RouterHelper],
  data: () => ({
    credentials: {}
  }),
  methods: {
    resetForm() {
      this.credentials = {
        username: "",
        password: ""
      };
    },
    login() {
      const errorFn = () => {
        this.showSnackbar("Authentication failed!");
        this.credentials.password = "";
      };

      if (
        this.credentials.username.length < 4 ||
        this.credentials.password < 6
      ) {
        return;
      }

      this.$store
        .dispatch("Access/login", this.credentials)
        .then(() => {
          this.resetForm();
          this.showSnackbar("Login successful!");
          this.redirectTo();
        })
        .catch(() => errorFn());
    }
  },
  computed: {
    ...mapGetters("Access", ["isAuth"])
  },
  created() {
    this.resetForm();
  }
};
</script>
