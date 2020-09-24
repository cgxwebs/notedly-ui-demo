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
                    label="Name"
                    v-model="tagModel.name"
                    placeholder="Lowercase, alphanumeric and underscores only, use dot for hierarchy"
                    :error-messages="getError('name')"
                  ></v-text-field>

                  <v-text-field
                    label="Title"
                    v-model="tagModel.title"
                    :error-messages="getError('title')"
                    placeholder=""
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="saveTag" color="primary">Save</v-btn>
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
              label="tag"
              @delete-canceled="isDeleting = false"
              @delete-confirmed="deleteTag"
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
              :items="tagsBucket"
              item-key="id"
              :search="search"
              :items-per-page="30"
              @click:row="tagRowClicked"
            ></v-data-table>
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
  name: "TagEditor",
  mixins: [FormHelper],
  components: {
    BasePage,
    DeleteDialog
  },
  data: () => ({
    tagModel: {},
    isEditing: false,
    isDeleting: false,
    search: "",
    headers: [
      { text: "Name", align: "start", value: "name" },
      { text: "Title", value: "title" }
    ]
  }),
  methods: {
    tagRowClicked(item) {
      this.tagModel = {
        name: item.name,
        title: item.title,
        id: item.id
      };
      this.isEditing = true;
    },
    resetForm() {
      this.tagModel = {
        name: "",
        title: "",
        id: 0
      };
      this.clearErrors();
      this.isEditing = false;
      this.isDeleting = false;
    },
    saveTag() {
      const tagForm = { tag: this.tagModel };
      if (!this.isExistingTag) {
        this.$store
          .dispatch("Tags/addNewTag", tagForm)
          .then(() => {
            this.resetForm();
            this.showSnackbar("Tag created successfully!");
          })
          .catch(error => this.errorCallback(error));
      } else {
        const tagName = this.tagModel.name;
        this.$store
          .dispatch("Tags/updateTag", tagForm)
          .then(() => {
            this.resetForm();
            this.showSnackbar(tagName + " updated successfully!");
          })
          .catch(error => this.errorCallback(error));
      }
    },
    deleteTag() {
      const tagName = this.tagModel.name;
      NotesApi.removeTag(this.tagModel.id)
        .then(() => {
          this.showSnackbar(tagName + " was deleted");
          this.$store.dispatch("Tags/listTags");
        })
        .catch(() => {
          this.showSnackbar("Unspecified error encountered.");
        });
      this.isDeleting = false;
      this.resetForm();
    }
  },
  computed: {
    isExistingTag() {
      return this.tagModel.id > 0;
    },
    tagsBucket() {
      return this.$store.state.Tags.bucket;
    },
    formTitle() {
      return this.isEditing ? "Edit Tag" : "Create New Tag";
    }
  },
  created() {
    this.resetForm();
  }
};
</script>
