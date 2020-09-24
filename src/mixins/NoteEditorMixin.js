const editorStates = {
  VIEWING: "VIEWING",
  EDITING: "EDITING",
  SAVING: "SAVING",
  SAVED_SUCCESS: "SAVED_SUCCESSFUL",
  SAVED_ERROR: "SAVED_ERROR"
};

export default {
  methods: {
    pushRouteView(createView = false, noteId = 0, revisionId = 0, extras = {}) {
      let params = {};
      let name = "NoteEditor";

      if (!createView) {
        params.id = noteId > 0 ? noteId : this.currentNoteId;
      }

      if (!createView && revisionId > 0) {
        params.revision_id = revisionId;
        name = "RevisionPreview";
      }

      this.$router.push({ name, params, ...extras });
    },
    setModeToEditing() {
      this.editorStatus = editorStates.EDITING;
    },
    setModeToViewing() {
      this.editorStatus = editorStates.VIEWING;
    },
    setModeToSaving() {
      this.editorStatus = editorStates.SAVING;
    },
    setModeToSavedSuccess() {
      this.editorStatus = editorStates.SAVED_SUCCESS;
    },
    setModeToSavedError() {
      this.editorStatus = editorStates.SAVED_ERROR;
    }
  },
  computed: {
    isEditing() {
      return this.editorStatus === editorStates.EDITING;
    },
    isViewing() {
      return this.editorStatus === editorStates.VIEWING;
    },
    isSaving() {
      return this.editorStatus === editorStates.SAVING;
    },
    isSavedSuccess() {
      return this.editorStatus === editorStates.SAVED_SUCCESS;
    },
    isSavedError() {
      return this.editorStatus === editorStates.SAVED_ERROR;
    }
  }
};
