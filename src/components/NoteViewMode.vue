<template>
  <v-container
    v-if="isViewing"
    class="mx-auto fill-height"
    style="max-width: 1400px"
  >
    <v-row>
      <v-col :cols="isRevision ? 6 : 9">
        <header class="pt-6 pb-8">
          <div class="text-h4">{{ currentNote.title }}</div>
          <div class="text-subtitle-1 deep-orange--text" v-if="isRevision">
            Current version
          </div>
        </header>

        <v-divider></v-divider>

        <section
          class="note--content py-8"
          v-html="currentNote.parsedContent"
        ></section>
      </v-col>

      <v-col v-if="isRevision" cols="6">
        <header class="pt-6 pb-8">
          <div class="text-h4">{{ currentRevision.title }}</div>
          <div v-if="isRevision" class="text-subtitle-1 deep-orange--text">
            Revision from
            <span v-if="currentNote.formattedDates">{{
              currentNote.formattedDates.updatedAt_pretty
            }}</span>
          </div>
        </header>

        <v-divider></v-divider>

        <section
          class="note--content py-8"
          v-html="currentRevision.parsedContent"
        ></section>
      </v-col>

      <v-col cols="3" v-if="!isRevision">
        <v-subheader class="text-uppercase pl-0">Author</v-subheader>
        <div>{{ currentNote.author.username }}</div>

        <v-subheader class="text-uppercase pl-0">Created</v-subheader>
        <div v-if="currentNote.formattedDates">
          {{ currentNote.formattedDates.createdAt_pretty }}
        </div>

        <v-subheader class="text-uppercase pl-0">Updated</v-subheader>
        <div v-if="currentNote.formattedDates">
          {{ currentNote.formattedDates.updatedAt_pretty }}
        </div>

        <template v-if="currentNote.tags.length">
          <v-subheader class="text-uppercase pl-0">Tags</v-subheader>

          <v-chip-group column>
            <v-chip v-for="tag in currentNote.tags" :key="tag.id" link outlined>
              {{ tag.name }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NoteEditorMixin from "@/mixins/NoteEditorMixin";
import NotesApi from "@/services/NotesApi";
import RouterHelper from "@/mixins/RouterHelper";

export default {
  name: "NoteViewMode",
  mixins: [NoteEditorMixin, RouterHelper],
  props: {
    currentNoteId: Number,
    currentNote: Object,
    editorStatus: String,
    currentRevisionId: Number
  },
  data: () => ({
    currentRevision: {}
  }),
  computed: {
    isExistingNote() {
      return this.currentNoteId > 0;
    },
    isRevision() {
      return this.currentRevisionId > 0;
    }
  },
  created() {
    const errorFn = () => {
      this.redirectTo("NotFound");
    };

    if (this.currentRevisionId) {
      NotesApi.getSingleRevision(this.currentRevisionId)
        .then(response => {
          this.currentRevision = response.data.data;
          if (this.currentRevision.documentId !== this.currentNoteId) {
            errorFn();
          }
        })
        .catch(errorFn);
    }
  }
};
</script>

<style>
.note--content {
  line-height: 2em;
}
.note--content p {
  margin-bottom: 20px;
}
.note--content h1,
.note--content h2,
.note--content h3,
.note--content h4,
.note--content h5,
.note--content h6 {
  margin: 40px 0;
}
.note--content blockquote {
  padding: 20px;
  background-color: #e0f7fa;
  border-left: 4px solid #00acc1;
}
.note--content pre {
  margin: 40px 0px;
  padding: 20px;
  background-color: #fff3e0;
  border-left: 4px solid #fb8c00;
  line-height: 1.2em;
  color: #fb8c00;
}
</style>
