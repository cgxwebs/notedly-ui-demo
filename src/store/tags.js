import NotesApi from "@/services/NotesApi";

export default {
  namespaced: true,
  state: () => ({
    bucket: []
  }),
  actions: {
    clearState({ commit }) {
      commit("CLEAR_STATE");
    },
    async addNewTag({ dispatch }, payload) {
      return NotesApi.createTag(payload).then(async () => {
        await dispatch("listTags");
      });
    },
    listTags({ commit }) {
      return NotesApi.listTags().then(response => {
        commit("REFRESH_BUCKET", response.data.data);
      });
    },
    async updateTag({ dispatch }, payload) {
      return NotesApi.updateTag(payload).then(async () => {
        await dispatch("listTags");
      });
    }
  },
  mutations: {
    CLEAR_STATE(state) {
      state.bucket = [];
    },
    REFRESH_BUCKET(state, response) {
      state.bucket = response;
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
