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
    async addNewRole({ dispatch }, payload) {
      return NotesApi.createRole(payload).then(async () => {
        await dispatch("listRoles");
      });
    },
    listRoles({ commit }) {
      return NotesApi.listRoles().then(response => {
        commit("REFRESH_BUCKET", response.data.data);
      });
    },
    async updateRole({ dispatch }, payload) {
      return NotesApi.updateRole(payload).then(async () => {
        await dispatch("listRoles");
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
