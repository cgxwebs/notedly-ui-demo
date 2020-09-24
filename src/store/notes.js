import NotesApi from "@/services/NotesApi";

export default {
  namespaced: true,
  state: {
    lastId: 0,
    bucket: [],
    prev_key: "",
    next_key: ""
  },
  actions: {
    clearState({ commit }) {
      commit("CLEAR_STATE");
    },
    async addNewNote({ commit, dispatch }, payload) {
      return NotesApi.createNote(payload).then(async response => {
        await dispatch("listNotes");
        commit("UPDATE_LAST_ID", response.data.data.id);
      });
    },
    async updateNote({ dispatch }, payload) {
      return NotesApi.updateNote(payload).then(async () => {
        await dispatch("listNotes");
      });
    },
    listNotes({ commit, state }, direction = "") {
      let pager_key = "";
      if (direction === "NEXT" && state.next_key) {
        pager_key = state.next_key;
      } else if (direction === "PREV" && state.prev_key) {
        pager_key = state.prev_key;
      }
      return NotesApi.listNotes(pager_key).then(response => {
        commit("REFRESH_BUCKET", response.data.data);
      });
    }
  },
  mutations: {
    CLEAR_STATE(state) {
      state.bucket = [];
      state.lastId = 0;
    },
    REFRESH_BUCKET(state, response) {
      state.bucket = response.items;
      state.prev_key = response.prev_key;
      state.next_key = response.next_key;
    },
    UPDATE_LAST_ID(state, id) {
      state.lastId = id;
    }
  },
  getters: {
    getById: state => id => {
      return NotesApi.findIndexInBucket(state.bucket, id);
    }
  }
};
