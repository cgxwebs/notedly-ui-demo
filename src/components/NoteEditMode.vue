<template>
  <v-form v-if="!isViewing">
    <v-container>
      <h1>
        <template v-if="!isExistingNote">Create New Note</template>
        <template v-else>Edit Note</template>
      </h1>

      <v-alert v-if="getError('denied')" prominent type="error" dismissible>{{
        getError("denied")
      }}</v-alert>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="noteModel.title"
            :error-messages="getError('title')"
            label="Title"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="noteModel.format"
            :error-messages="getError('format')"
            :items="formatChoices"
            label="Format"
            single-line
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="noteTagsModel"
            :items="tagChoices"
            label="Tags"
            multiple
            chips
            single-line
            dense
            class="pt-1"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-textarea
            v-model="noteModel.content"
            :error-messages="getError('content')"
            label="Content"
            outlined
            rows="20"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import FormHelper from "@/mixins/FormHelper";
import NoteEditorMixin from "@/mixins/NoteEditorMixin";
import { mapGetters } from "vuex";

export default {
  name: "NoteEditMode",
  mixins: [FormHelper, NoteEditorMixin],
  props: {
    currentNoteId: Number,
    currentNote: Object,
    editorStatus: String,
    continueEditing: Boolean
  },
  data: () => ({
    noteModel: {},
    noteTagsModel: [],
    formatChoices: [
      { text: "Plaintext", value: "plaintext", disabled: false },
      { text: "HTML", value: "html", disabled: false },
      { text: "Markdown", value: "markdown", disabled: false }
    ]
  }),
  methods: {
    saveNote() {
      this.clearErrors();

      const noteForm = {
        document: this.noteModel,
        tags: this.noteTagsModel
      };

      const errorFn = error => {
        this.$emit("saved-error");
        let violations = [];
        if (error.response.status === 403) {
          violations.push({
            propertyPath: "denied",
            title: "Permission not granted! Use only tags you have access to."
          });
        }
        this.errorCallback(error, violations);
      };

      if (!this.isSuper && noteForm.tags.length === 0) {
        this.$emit("saved-error");
        this.showSnackbar("Tags are required.");
        return;
      }

      if (this.currentNoteId === 0) {
        const extras = this.continueEditing ? { query: { edit: 1 } } : {};

        this.$store
          .dispatch("Notes/addNewNote", noteForm)
          .then(() => {
            this.pushRouteView(
              false,
              this.$store.state.Notes.lastId,
              0,
              extras
            );
            this.showSnackbar("Note created successfully!");
          })
          .catch(error => errorFn(error));
      } else {
        this.$store
          .dispatch("Notes/updateNote", noteForm)
          .then(() => {
            this.showSnackbar("Note updated successfully!");
            this.$emit("saved-success");
          })
          .catch(error => errorFn(error));
      }
    }
  },
  computed: {
    isExistingNote() {
      return this.currentNoteId > 0;
    },
    tagChoices() {
      let choices = [];
      const readAccess = this.$store.state.Access.currentRole.tagsReadAsArray;
      const isSuper = this.$store.getters["Access/isSuper"];

      for (let item of this.$store.state.Tags.bucket) {
        if (isSuper || readAccess[item.id] !== undefined) {
          choices.push({
            text: item.name,
            value: item.id
          });
        }
      }
      return choices;
    },
    ...mapGetters("Access", ["isSuper"])
  },
  watch: {
    editorStatus() {
      if (this.isSaving) {
        this.saveNote();
      }
      if (this.isViewing || this.isEditing) {
        this.clearErrors();
        this.noteModel = { ...this.currentNote };
      }
    },
    currentNote(syncNote) {
      this.noteModel = { ...syncNote };
      if (this.noteModel.tags !== undefined) {
        this.noteTagsModel = [];
        let tags = this.noteModel.tags;
        for (let i = 0; i < tags.length; i++) {
          this.noteTagsModel.push(tags[i].id);
        }
      }
    }
  },
  created() {
    this.noteModel = { ...this.currentNote };
  }
};
</script>
