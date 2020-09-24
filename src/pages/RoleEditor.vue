<template>
  <BasePage @toggle-nav-drawer="$emit('toggle-nav-drawer')">
    <template v-slot:content>
      <v-container>
        <v-row>
          <v-col cols="5">
            <v-card>
              <v-card-title>{{ formTitle }}</v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Username"
                    v-model="roleModel.username"
                    placeholder="Lowercase, alphanumeric and underscores only"
                    :error-messages="getError('username')"
                  ></v-text-field>

                  <v-switch
                    v-if="isExistingRole"
                    v-model="roleModel.changePassword"
                    label="Change Password"
                  ></v-switch>

                  <v-text-field
                    v-if="roleModel.changePassword"
                    label="Password"
                    v-model="roleModel.password"
                    :type="formShowPass ? 'text' : 'password'"
                    placeholder=""
                    :append-icon="formShowPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="formShowPass = !formShowPass"
                    counter
                    :error-messages="getError('password')"
                  ></v-text-field>

                  <v-text-field
                    v-if="roleModel.changePassword"
                    label="Confirm Password"
                    v-model="roleModel.confirmPassword"
                    type="password"
                    placeholder=""
                    :error-messages="getError('confirm_password')"
                  ></v-text-field>

                  <v-switch
                    v-model="roleModel.isSuper"
                    label="Super User"
                  ></v-switch>

                  <v-chip-group
                    v-if="roleModel.isSuper === false"
                    v-model="roleModel.tagsRead_ids"
                    active-class="blue--text"
                    multiple
                    column
                  >
                    <v-subheader class="text-uppercase">Read</v-subheader>
                    <v-chip v-for="v in tagsBucket" :key="v.id" :value="v.id">
                      {{ v.name }}
                    </v-chip>
                  </v-chip-group>

                  <v-chip-group
                    v-if="roleModel.isSuper === false"
                    v-model="roleModel.tagsWrite_ids"
                    active-class="blue--text"
                    multiple
                    column
                  >
                    <v-subheader class="text-uppercase">Write</v-subheader>
                    <v-chip v-for="v in tagsBucket" :key="v.id" :value="v.id">
                      {{ v.name }}
                    </v-chip>
                  </v-chip-group>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-btn @click.stop="saveRole" color="primary">Submit</v-btn>
                <v-btn v-if="isEditing" @click="resetForm">Cancel</v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  v-if="isEditing"
                  @click="isDeleting = true"
                  color="warning"
                  >Delete</v-btn
                >
              </v-card-actions>
            </v-card>

            <DeleteDialog
              :model="isDeleting"
              label="role"
              @delete-canceled="isDeleting = false"
              @delete-confirmed="deleteRole"
            >
            </DeleteDialog>
          </v-col>

          <v-col cols="7">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="rolesBucket"
              item-key="id"
              :search="search"
              :items-per-page="30"
              @click:row="roleRowClicked"
            >
              <template v-slot:item.isSuper="props">
                <span v-if="props.value">Yes</span>
              </template>

              <template v-slot:item.tagsRead="props">
                <span v-if="props.item.isSuper">All</span>

                <v-chip-group v-if="props.item.isSuper === false" column>
                  <v-chip v-for="v in props.value" :key="v.name" small label>
                    {{ v.name }}
                  </v-chip>
                </v-chip-group>
              </template>

              <template v-slot:item.tagsWrite="props">
                <span v-if="props.item.isSuper">All</span>

                <v-chip-group v-if="props.item.isSuper === false" column>
                  <v-chip v-for="v in props.value" :key="v.name" small label>
                    {{ v.name }}
                  </v-chip>
                </v-chip-group>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </BasePage>
</template>

<script>
import BasePage from "@/pages/BasePage";
import FormHelper from "@/mixins/FormHelper";
import NotesApi from "@/services/NotesApi";
import DeleteDialog from "@/components/DeleteDialog";

export default {
  name: "RoleEditor",
  mixins: [FormHelper],
  components: {
    BasePage,
    DeleteDialog
  },
  data: () => ({
    roleModel: {},
    formShowPass: false,
    formEditUser: true,
    isEditing: false,
    isDeleting: false,
    search: "",
    headers: [
      { text: "Username", align: "start", value: "username" },
      { text: "Super User", value: "isSuper", filterable: false, width: 120 },
      { text: "Read", value: "tagsRead", sortable: false, width: 300 },
      { text: "Write", value: "tagsWrite", sortable: false, width: 300 }
    ]
  }),
  methods: {
    roleRowClicked(item) {
      this.roleModel = {
        id: item.id,
        username: item.username,
        changePassword: false,
        password: "",
        confirmPassword: "",
        isSuper: item.isSuper,
        tagsRead_ids: item.tagsRead.map(value => value.id),
        tagsWrite_ids: item.tagsWrite.map(value => value.id)
      };
      this.isEditing = true;
      this.formEditUser = false;
    },
    resetForm() {
      this.roleModel = {
        id: 0,
        username: "",
        changePassword: true,
        password: "",
        confirmPassword: "",
        isSuper: false,
        tagsRead_ids: [],
        tagsRead: [],
        tagsWrite_ids: [],
        tagsWrite: []
      };
      this.clearErrors();
      this.formEditUser = true;
      this.isEditing = false;
      this.isDeleting = false;
    },
    saveRole() {
      let roleForm = { role: { ...this.roleModel } };
      delete roleForm.role.tagsRead_ids;
      delete roleForm.role.tagsWrite_ids;
      roleForm.role.tagsRead = this.roleModel.tagsRead_ids;
      roleForm.role.tagsWrite = this.roleModel.tagsWrite_ids;

      if (!this.isExistingRole) {
        this.$store
          .dispatch("Roles/addNewRole", roleForm)
          .then(() => {
            this.resetForm();
            this.showSnackbar("Role created successfully!");
          })
          .catch(error => this.errorCallback(error));
      } else {
        const roleUsername = this.roleModel.username;
        this.$store
          .dispatch("Roles/updateRole", roleForm)
          .then(() => {
            this.resetForm();
            this.showSnackbar(roleUsername + " updated successfully!");
          })
          .catch(error => this.errorCallback(error));
      }
    },
    deleteRole() {
      const roleUsername = this.roleModel.username;
      NotesApi.removeRole(this.roleModel.id)
        .then(() => {
          this.showSnackbar(roleUsername + " was deleted");
          this.$store.dispatch("Roles/listRoles");
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.showSnackbar(error.response.data.error);
          } else {
            this.showSnackbar("Unspecified error encountered.");
          }
        });
      this.isDeleting = false;
      this.resetForm();
    }
  },
  computed: {
    isExistingRole() {
      return this.roleModel.id > 0;
    },
    rolesBucket() {
      return this.$store.state.Roles.bucket;
    },
    tagsBucket() {
      return this.$store.state.Tags.bucket;
    },
    formTitle() {
      return this.isEditing ? "Edit Role" : "Create New Role";
    }
  },
  created() {
    this.$store.dispatch("Roles/listRoles");
    this.resetForm();
  }
};
</script>
