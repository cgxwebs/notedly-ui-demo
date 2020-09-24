<template>
  <BasePage
    :showCreateButton="false"
    @toggle-nav-drawer="$emit('toggle-nav-drawer')"
  >
    <template v-slot:secondary-nav>
      <v-btn
        @click.stop="pushRouteView(true)"
        v-if="isViewing && !isRevision"
        class="amber accent-1 grey--text text--darken-4 ma-2"
        >Create Note</v-btn
      >

      <v-menu offset-y v-if="!isViewing">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            class="amber accent-2 grey--text text--darken-4 ma-2"
            :disabled="isSaving"
            >Save</v-btn
          >
        </template>
        <v-list>
          <v-list-item
            @click="
              continueEditing = true;
              triggerSave();
            "
          >
            <v-list-item-title>Save then continue editing</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="
              continueEditing = false;
              triggerSave();
            "
          >
            <v-list-item-title>Save then view</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isExistingNote" @click="triggerAutosave">
            <v-list-item-title>
              <span v-if="autosaveID === 0">Enable Autosave</span>
              <span v-if="autosaveID > 0">Disable Autosave</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        class="ma-2"
        v-if="!isViewing && !isRevision && isExistingNote"
        @click="isDeleting = true"
        :disabled="isSaving"
        >Delete</v-btn
      >

      <DeleteDialog
        :model="isDeleting"
        label="note"
        @delete-canceled="isDeleting = false"
        @delete-confirmed="deleteNote"
      >
      </DeleteDialog>

      <v-btn
        class="ma-2"
        @click="setModeToEditing"
        v-if="isViewing && !isRevision"
        >Edit Note</v-btn
      >

      <v-btn
        class="amber accent-2 grey--text text--darken-4 ma-2"
        v-if="isRevision"
        @click="triggerRestore"
        >Restore</v-btn
      >

      <v-btn
        class="ma-2"
        v-if="isViewing || isRevision"
        @click="toggleRevisions = !toggleRevisions"
        >Revisions</v-btn
      >

      <v-btn
        class="white--text ma-2"
        v-if="(!isViewing && isExistingNote) || isRevision"
        @click="cancelMode"
        :disabled="isSaving"
        text
        >Cancel</v-btn
      >

      <v-dialog v-model="toggleRevisions" scrollable width="500px">
        <v-card>
          <v-card-title>Recent Revisions</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="max-height: 300px">
            <p v-if="revisionList.length === 0" class="pt-8 text-h6">
              No revisions yet.
            </p>

            <v-radio-group
              v-if="revisionList.length"
              v-model="revisionChoice"
              column
            >
              <v-radio
                v-for="item in revisionList"
                :key="item.id"
                :label="
                  `${item.createdAt_human} - ${item.createdAt_pretty} ${item.label}`
                "
                :value="item.id"
              >
              </v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-3" text @click="toggleRevisions = false"
              >Close</v-btn
            >
            <v-btn
              color="orange darken-3"
              text
              v-if="revisionList.length"
              @click="pushRouteView(false, 0, revisionChoice)"
              >Preview</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template v-slot:content>
      <NoteEditMode
        :currentNoteId="currentNoteId"
        :currentNote="currentNote"
        :editorStatus="editorStatus"
        :continueEditing="continueEditing"
        @saved-success="triggerSave('success')"
        @saved-error="triggerSave('error')"
      ></NoteEditMode>
      <NoteViewMode
        :editorStatus="editorStatus"
        :currentNoteId="currentNoteId"
        :currentNote="currentNote"
        :revisionList="revisionList"
        :currentRevisionId="currentRevisionId"
      ></NoteViewMode>
    </template>
  </BasePage>
</template>

<script>
import NoteEditMode from "../components/NoteEditMode";
import BasePage from "./BasePage";
import NoteViewMode from "../components/NoteViewMode";
import NoteEditorMixin from "@/mixins/NoteEditorMixin";
import NotesApi from "@/services/NotesApi";
import FormHelper from "@/mixins/FormHelper";
import DeleteDialog from "@/components/DeleteDialog";
import RouterHelper from "@/mixins/RouterHelper";

export default {
  name: "NoteEditor",
  components: {
    DeleteDialog,
    NoteViewMode,
    BasePage,
    NoteEditMode
  },
  mixins: [NoteEditorMixin, FormHelper, RouterHelper],
  data() {
    return {
      currentNoteId: 0,
      currentNote: {
        id: 0,
        title: "",
        content: "",
        parsedContent: "",
        format: "markdown",
        createdAt: "",
        updatedAt: "",
        tags: [],
        author: {
          username: ""
        }
      },
      currentRevisionId: 0,
      revisionList: [],
      editorStatus: "VIEWING",
      toggleRevisions: false,
      revisionChoice: 0,
      isDeleting: false,
      continueEditing: false,
      autosaveID: 0
    };
  },
  methods: {
    refreshNote() {
      if (this.isExistingNote) {
        return NotesApi.getSingleNote(this.currentNoteId)
          .then(response => {
            const res = response.data.data;
            this.currentNote = res.document;
            this.currentNote.parsedContent = res.parsedContent;
            this.revisionList = res.revisions;
          })
          .catch(error => {
            if (error.response.status === 403) {
              this.redirectTo("Denied");
            } else {
              this.redirectTo("NotFound");
            }
          });
      }
    },
    triggerSave(save_status) {
      if (save_status === "success") {
        this.setModeToSavedSuccess();
        this.refreshNote().then(() => {
          if (this.continueEditing) {
            this.setModeToEditing();
          } else {
            this.setModeToViewing();
          }
        });
      } else if (save_status === "error") {
        this.setModeToSavedError();
      } else {
        this.setModeToSaving();
      }
    },
    triggerRestore() {
      NotesApi.restoreNote(this.currentRevisionId)
        .then(() => {
          this.cancelMode();
          this.showSnackbar("Note restored successfully!");
        })
        .catch(() => {
          this.cancelMode();
          this.showSnackbar("Note restored failed or permission not granted!");
        });
    },
    triggerAutosave() {
      if (this.autosaveID === 0) {
        this.executeAutosave();
        this.showSnackbar("Autosave is enabled.");
      } else {
        this.terminateAutosave();
        this.showSnackbar("Autosave is terminated.");
      }
    },
    executeAutosave() {
      this.autosaveID = setInterval(() => {
        this.continueEditing = true;
        this.triggerSave();
      }, 30 * 1000);
    },
    terminateAutosave() {
      clearInterval(this.autosaveID);
    },
    deleteNote() {
      NotesApi.removeNote(this.currentNoteId)
        .then(() => {
          this.$store.dispatch("Notes/listNotes");
          this.showSnackbar("Note removed successfully!");
          this.pushRouteView(true);
        })
        .catch(() => {
          this.showSnackbar("Note was not removed, permission not granted!");
        });
      this.isDeleting = false;
    },
    cancelMode() {
      if (this.isRevision) {
        this.pushRouteView();
      } else {
        this.setModeToViewing();
      }
    }
  },
  computed: {
    isExistingNote() {
      return this.currentNoteId > 0;
    },
    isRevision() {
      return this.currentNoteId > 0 && this.currentRevisionId > 0;
    }
  },
  created() {
    this.currentNoteId = parseInt(this.$route.params.id) || 0;
    this.currentRevisionId = parseInt(this.$route.params.revision_id) || 0;
    const queryEdit = this.$route.query.edit !== undefined;

    if (this.currentNoteId) {
      this.refreshNote();
    }

    if (this.currentNoteId === 0 || queryEdit) {
      this.setModeToEditing();
    }
  }
};
</script>
